import Taro, { useState, useEffect, useCallback, useMemo } from "@tarojs/taro"
import { ab2hex, regSendData } from '@common/utils/data-handle';
import { useBluetoothDataProcess } from '@hooks/bluetooth-data-process';

export function useBlueToothDevice() {
    const [connected, setConnected] = useState(false); // 连接成功状态
    const [message, setMessage] = useState('未连接');
    const [deviceId, setDeviceId] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [characterId, setCharacterId] = useState('');
    const [receiveData, setReceiveData] = useState('');

    const { resultData, processReceiveData } = useBluetoothDataProcess();

    const uuid = useMemo(() => {
        const uuid = Taro.getStorageSync('uuid');
        return {
            serviceuuid: uuid.serviceuuid.toUpperCase(),
            txduuid: uuid.txduuid.toUpperCase(),
            rxduuid: uuid.rxduuid.toUpperCase(),
        }
    }, []);

    //
    useEffect(() => {
        setReceiveData(resultData);
    }, [resultData]);

    const disconnectDevice = useCallback((deviceId) => {
        Taro.closeBLEConnection({ deviceId });
        setConnected(false);
    }, [])

    // TODO 函数过长，按阶段拆分
    const connectDevice = useCallback((deviceId, setConnectLoading) => {
        setConnectLoading(true);
        Taro.createBLEConnection({ deviceId })
            .then(() => {
                setDeviceId(deviceId);
                setMessage('读取服务');
                // 读取蓝牙设备下的服务列表
                Taro.getBLEDeviceServices({ deviceId })
                    .then((resServices) => {
                        // 查询该设备的服务列表中是否存在所设置的服务
                        const service = resServices.services.find(item => item.uuid === uuid.serviceuuid);
                        if (service) {
                            setServiceId(service.uuid);
                            setMessage('读取特征值');
                            // 存在则继续查询特征值是否匹配
                            Taro.getBLEDeviceCharacteristics({ deviceId, serviceId: service.uuid })
                                .then(resCharacteristics => {
                                    console.log('resCharacteristics.characteristics', resCharacteristics.characteristics);
                                    resCharacteristics.characteristics.forEach(item => {
                                        // 设置写操作特征值
                                        if (item.properties.write && item.uuid === uuid.txduuid) {
                                            console.log('write-uuid', item.uuid);
                                            setCharacterId(item.uuid);
                                        }
                                        // 是否启用低功耗蓝牙设备特征值变化时的 notify 功能
                                        if (item.properties.notify || item.properties.indicate) {
                                            if (item.uuid === uuid.rxduuid) {
                                                Taro.notifyBLECharacteristicValueChange({
                                                    deviceId,
                                                    serviceId: service.uuid,
                                                    characteristicId: item.uuid,
                                                    state: true,
                                                }).then(() => {
                                                    console.log('连接成功')
                                                    setConnected(true);
                                                    setConnectLoading(false);
                                                    setMessage('连接成功')
                                                }).catch(err => console.error('开启特征值notify功能', err))
                                            }
                                        }
                                    })
                                })
                                .catch(err => {
                                    setConnectLoading(false);
                                    console.error('getBLEDeviceCharacteristics', err);
                                });
                            // 获取设备推送数据
                            Taro.onBLECharacteristicValueChange(res => {
                                const nowRecHex = ab2hex(res.value);
                                if (uuid.rxduuid !== res.characteristicId) return;
                                if (!connected) return;
                                // 数据处理
                                processReceiveData(nowRecHex)
                            })
                        } else {
                            // 不存在则关闭连接
                            Taro.closeBLEConnection({ deviceId })
                        }
                    })
                    .catch(err => console.error('获取设备服务列表', err))
            })
            .catch(err => console.error('连接蓝牙设备', err))
    }, []);

    // 向设备发送指令
    const sendCommander = useCallback((command) => {
        console.log('发送指令')
        if (!connected){
            return;
        }
        let hex = command || ''; //要发送的数据
        let buffer1;
        const typedArray = new Uint8Array(regSendData(hex).map(function (h) {
            return parseInt(h, 16)
        }));
        buffer1 = typedArray.buffer;
        if (buffer1 === null) return;
        Taro.writeBLECharacteristicValue({
            deviceId,
            serviceId,
            characteristicId: characterId,
            value: buffer1,
        })
            .then(res => console.log('写入特征值', res))
            .catch(err => console.error('写入特征值', err));
    }, [deviceId, serviceId, characterId]);

    return {
        connected,
        message,
        connectDevice,
        disconnectDevice,
        sendCommander,
        receiveData,
    }
}
