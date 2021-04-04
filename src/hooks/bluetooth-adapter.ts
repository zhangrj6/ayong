import Taro, { useState, useEffect, useCallback } from "@tarojs/taro";

interface Device {
    name: string,
    localName: string,
    RSSI: number,
    deviceId: string,
    advertisData: ArrayBuffer,
    advertisServiceUUIDs: Array<string>,
    serviceData: Object,
}

/**
 * 蓝牙适配器hook
 * @param duration 默认搜索蓝牙设备时长
 */
export function useBlueToothAdapter({ duration = 20000 } = {}) {
    // 默认蓝牙适配器状态打开，在检测适配器状态后更新，便于应用侧页面提示
    const [available, setAvailable] = useState(true);
    const [discovering, setDiscovering] = useState(false);
    // 搜索持续定时器
    const [timerDiscovery, setTimerDiscovery] = useState<null|Timeout>(null);
    // 蓝牙设备列表
    let [devices, setDevices] = useState<Device[]>([]);

    // 开启初始化蓝牙适配器
    useEffect(() => {
        resetBluetoothModule()
    }, [])
    // 重置蓝牙模块
    const resetBluetoothModule = useCallback((Message?: Function) => {
        // 关闭蓝牙模块，断开所有已建立的连接并释放系统资源
        Taro.closeBluetoothAdapter({
            complete: () => {
                // 初始化蓝牙模块
                Taro.openBluetoothAdapter({
                    success: () => {
                        if (typeof Message === "function") {
                            Message({ message: '蓝牙设备重置完成' })
                        }
                    },
                    complete: () => {
                        // 监听蓝牙设备状态变化
                        Taro.onBluetoothAdapterStateChange(res => {
                            setAvailable(res.available);
                            setDiscovering(res.discovering)
                        })
                    }
                })
            }
        })
    }, [])
    // 停止搜索蓝牙设备
    const stopDevicesDiscovery = useCallback(() => {
        Taro.stopBluetoothDevicesDiscovery();
        // 关闭扫描设备的同时关闭延时停止定时器
        if (timerDiscovery) clearTimeout(timerDiscovery);
        if (wx.offBluetoothDeviceFound) {
            wx.offBluetoothDeviceFound()
        }
    }, []);
    // 搜索蓝牙设备
    const startDevicesDiscovery = useCallback((serviceuuid) => {
        devices = [];
        // 搜索附近的蓝牙外围设备
        Taro.startBluetoothDevicesDiscovery({
            allowDuplicatesKey: true, // 是否允许上报同一设备
            // services: [serviceuuid], // 要搜索的蓝牙设备主 service 的 uuid 列表
        })
            .then(() => {
                // 设置蓝牙设备搜索持续定时器
                const timer = setTimeout(() => {
                    stopDevicesDiscovery()
                }, duration);
                setTimerDiscovery(timer);
                // 开启蓝牙设备监听
                Taro.onBluetoothDeviceFound((res) => {
                    res.devices.forEach(device => {
                        if (!device.name && !device.localName) {
                            return
                        }
                        const idx = devices.findIndex(item => item.deviceId === device.deviceId);
                        if (idx === -1) {
                            setDevices([ ...devices, device ]);
                            devices.push(device);
                        } else {
                            devices[idx] = device;
                            setDevices(devices);
                        }
                    })
                })
            });
    }, [devices]);

    return {
        available,
        discovering,
        startDevicesDiscovery,
        stopDevicesDiscovery,
        resetBluetoothModule,
        devices,
    }
}
