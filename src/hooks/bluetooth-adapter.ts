import Taro, { useState, useEffect, useCallback } from "@tarojs/taro";
// @ts-ignore
import { BlueToothErrorMsg } from '@common/const/error-msg'

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
    // 蓝牙设备列表
    let [devices, setDevices] = useState<Device[]>([]);

    // 开启初始化蓝牙适配器
    useEffect(() => {
        Taro.openBluetoothAdapter({
            complete: () => {
                Taro.onBluetoothAdapterStateChange(res => {
                    setAvailable(res.available);
                    setDiscovering(res.discovering)
                })
            },
            fail: err => {
                if (err.errCode === BlueToothErrorMsg.not_available) {
                    setAvailable(false);
                }
            }
        })
    }, [])

    // 停止搜索蓝牙设备
    const stopDevicesDiscovery = useCallback(() => {
        Taro.stopBluetoothDevicesDiscovery();
        if (wx.offBluetoothDeviceFound) {
            wx.offBluetoothDeviceFound()
        }
    }, []);

    // 搜索蓝牙设备
    const startDevicesDiscovery = useCallback((serviceuuid) => {
        devices = [];
        Taro.startBluetoothDevicesDiscovery({ allowDuplicatesKey: true }) // services: [serviceuuid]
            .then(() => {
                setTimeout(() => {
                    stopDevicesDiscovery()
                }, duration);
                // 开启蓝牙设备监听
                Taro.onBluetoothDeviceFound((res) => {
                    res.devices.forEach(device => {
                        if (!device.name && !device.localName) {
                            return
                        }
                        const idx = devices.findIndex(item => item.deviceId === device.deviceId);
                        if (idx === -1) {
                            devices.push(device);
                            setDevices([ ...devices, device ])
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
        devices,
    }
}
