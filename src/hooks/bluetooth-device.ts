import Taro, { useState, useEffect, useCallback, useMemo } from "@tarojs/taro"
import { ab2hex, regSendData } from '@common/utils/data-handle';

export function useBlueToothDevice() {
    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState({});
    const [deviceId, setDeviceId] = useState('');
    const [serviceId, setServiceId] = useState('');
    const [characterId, setCharacterId] = useState('');

    const uuid = useMemo(() => {
        const uuid = Taro.getStorageSync('uuid');
        return {
            serviceuuid: uuid.serviceuuid.toUpperCase(),
            txduuid: uuid.txduuid.toUpperCase(),
            rxduuid: uuid.rxduuid.toUpperCase(),
        }
    }, []);

    const disconnectDevice = useCallback((deviceId) => {
        Taro.closeBLEConnection({ deviceId })
    }, [])

    const connectDevice = useCallback((deviceId) => {
        Taro.createBLEConnection({ deviceId })
            .then(() => {
                setDeviceId(deviceId);
                // 监听蓝牙连接状态的改变
                Taro.onBLEConnectionStateChange((state) => {
                    // 仅当特征匹配开启特征值变化监听时才认为连接建立成功，而断开连接则直接断开
                    !state.connected && setConnected(state.connected);
                })
                // 读取蓝牙设备下的服务列表
                Taro.getBLEDeviceServices({ deviceId })
                    .then((resServices) => {
                        // 查询该设备的服务列表中是否存在所设置的服务
                        const service = resServices.services.find(item => item.uuid === uuid.serviceuuid);
                        if (service) {
                            setServiceId(service.uuid);
                            // 存在则继续查询特征值是否匹配
                            Taro.getBLEDeviceCharacteristics({ deviceId, serviceId: service.uuid })
                                .then(resCharacteristics => {
                                    console.log('resCharacteristics', resCharacteristics)
                                    resCharacteristics.characteristics.forEach(item => {
                                        // 设置写操作特征值
                                        if (item.properties.write && item.uuid === uuid.txduuid) {
                                            setCharacterId(item.uuid);
                                        }
                                        // 是否启用低功耗蓝牙设备特征值变化时的 notify 功能
                                        if (item.properties.notify && item.uuid === uuid.rxduuid) {
                                            Taro.notifyBLECharacteristicValueChange({
                                                deviceId,
                                                serviceId: service.uuid,
                                                characteristicId: item.uuid,
                                                state: true,
                                            }).then(() => {
                                                setConnected(true);
                                                setMessage({ message: '连接成功', type: 'success' })
                                            })
                                        }
                                    })
                                })
                                .catch(err => console.log('getBLEDeviceCharacteristics', err));
                        } else {
                            // 不存在则关闭连接
                            Taro.closeBLEConnection({ deviceId })
                            setMessage({ message: '请确认Service UUID是否设置正确或重新连接', type: 'error' })
                        }
                    })
            })
    }, []);

    const sendCommander = useCallback((command) => {
        if (!connected){
            setMessage({ message: "请先连接BLE设备...", type: "warning" });
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
            .then(res => console.log(res))
            .catch(err => console.log(err));
    }, [deviceId, serviceId, characterId]);

    const getCharacteristics = useCallback((deviceId, serviceId) => {
        // 操作之前先监听，保证第一时间获取数据
        Taro.onBLECharacteristicValueChange((characteristic) => {
            const nowrecHEX = ab2hex(characteristic.value);
            const recStr = ab2Str(characteristic.value);
            if (this.rxdu != characteristic.characteristicId) return;
            if (!this._readyRec) return;
            let mrecstr
            if (this._hexRec){
                mrecstr = nowrecHEX
            }else{
                mrecstr = recStr
            }
            let receiveData = this.state.receiveData;
            if (this.state.receiveData.length>3000){
                receiveData = receiveData.substring(mrecstr.length, receiveData.length)
            }
            this.setState({
                receiveData: receiveData + mrecstr,
            })
        })
    }, []);

    return [
        connected,
        message,
        connectDevice,
        disconnectDevice,
        sendCommander,
    ]
}
