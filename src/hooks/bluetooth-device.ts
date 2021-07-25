import Taro, { useState, useEffect, useCallback, useMemo } from "@tarojs/taro"
import { ab2hex, regSendData } from '@common/utils/data-handle';
import { useBluetoothDataProcess } from '@hooks/bluetooth-data-process';

export function useBlueToothDevice() {
    const [connected, setConnected] = useState(false); // 连接成功状态
    const [connectLoading, setConnectLoading] = useState(false); // 是否正在连接
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
    // 断开蓝牙设备
    const disconnectDevice = useCallback((deviceId, isActive = true) => {
        Taro.closeBLEConnection({
            deviceId,
            success: () => {
                setConnected(false);
                setConnectLoading(false);
                // 取消监听低功耗蓝牙连接状态的改变事件
                if(wx.offBLEConnectionStateChange && isActive) {
                    wx.offBLEConnectionStateChange()
                }
            }
        });
    }, [])

    // 连接蓝牙设备
    const connectDevice = useCallback((deviceId, isActive = true) => {
        setConnectLoading(true);
        Taro.createBLEConnection({
            deviceId,
            success: () => {
                handleConnect(deviceId, isActive);
            },
            fail: error => {
                console.log('连接低功耗蓝牙设备失败：', error)
                // 若失败原因为已连接，则直接进入下一步
                if (error.errCode === -1) {
                    handleConnect(deviceId, isActive);
                } else {
                    connectDevice(deviceId, false);
                }
            }
        })
    }, []);

    // 处理蓝牙服务及特征值
    const handleConnect = useCallback((deviceId, isActive) => {
        setDeviceId(deviceId);
        // 读取蓝牙设备下的服务列表
        Taro.getBLEDeviceServices({
            deviceId,
            success: (resServices) => {
                // 查询该设备的服务列表中是否存在所设置的服务
                const service = resServices.services.find(item => item.uuid === uuid.serviceuuid);
                if (service) {
                    setServiceId(service.uuid);
                    // 存在则继续查询特征值是否匹配
                    Taro.getBLEDeviceCharacteristics({
                        deviceId,
                        serviceId: service.uuid,
                        success: (resCharacteristics) => {
                            resCharacteristics.characteristics.forEach(item => {
                                // 设置写操作特征值
                                if (item.properties.write && item.uuid === uuid.txduuid) {
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
                                            success: () => {
                                                setConnected(true);
                                                setConnectLoading(false);
                                            },
                                            fail: (error) => {
                                                console.error('开启特征值notify功能失败：', error);
                                                disconnectDevice(deviceId, false);
                                            }
                                        })
                                    }
                                }
                            })
                        },
                        fail: (error) => {
                            console.error('获取蓝牙设备服务下特征值失败：', error);
                            disconnectDevice(deviceId, false);
                        }
                    })
                    // 获取设备推送数据
                    Taro.onBLECharacteristicValueChange(res => {
                        const nowRecHex = ab2hex(res.value);
                        if (uuid.rxduuid !== res.characteristicId) return;
                        // 数据处理
                        processReceiveData(nowRecHex)
                    })
                } else {
                    console.error('蓝牙设备下不存在指定服务');
                    disconnectDevice(deviceId, false);
                }
            },
            fail: error => {
                console.error('获取设备服务列表：', error);
                disconnectDevice(deviceId, false);
            }
        })
        // 监听连接状态的改变
        if(wx.onBLEConnectionStateChange && isActive) {
            wx.onBLEConnectionStateChange((res) => {
                console.log('蓝牙连接状态改变：', res);
                // 自动重连，但不重复监听
                if(!res.connected) {
                    connectDevice(deviceId, false);
                }
            })
        }
    }, [])

    // 向设备发送指令
    const sendCommander = useCallback((command) => {
        console.log('connected', connected)
        if (!connected){
            return;
        }
        console.log('command', command)
        let hex = command || ''; //要发送的数据
        let buffer1;
        const typedArray = new Uint8Array(regSendData(hex).map(function (h) {
            return parseInt(h, 16)
        }));
        buffer1 = typedArray.buffer;
        if (buffer1 === null) return;
        const sendTime = new Date().getTime();
        Taro.writeBLECharacteristicValue({
            deviceId,
            serviceId,
            characteristicId: characterId,
            value: buffer1,
            success: () => {
                // 测试指令发送延时
                const sentTime = new Date().getTime();
                console.log('指令发送成功', sentTime - sendTime)
            },
            fail: () => err => console.error('写入特征值', err)
        })
    }, [deviceId, serviceId, characterId, connected]);

    return {
        connected,
        connectLoading,
        connectDevice,
        disconnectDevice,
        sendCommander,
        receiveData,
    }
}
