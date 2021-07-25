import { useState, useEffect } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import {
    AtNoticebar,
    AtList,
    AtListItem,
    AtMessage,
    AtIcon,
    AtActionSheet,
    AtActionSheetItem
} from 'taro-ui'
import SetUuid from "@components/set-uuid"
import { bt4502Uuid } from '@common/const/uuid'
import { useBlueToothAdapter } from '@hooks/bluetooth-adapter';
import './index.scss'


function BlueScan({ display }) {
    const [firstRender, setFirstRender] = useState(true); // 首次渲染控制
    const [showSetting, setShowSetting] = useState(false); // 是否显示模组设置
    const [uuid, setUuid] = useState(bt4502Uuid);
    const [isIphonex, setIsIphonex] = useState(false);
    const [showAction, setShowAction] = useState(false); // 隐藏操作按钮
    const {
        available,
        discovering,
        startDevicesDiscovery,
        stopDevicesDiscovery,
        resetBluetoothModule,
        devices
    } = useBlueToothAdapter();

    // 蓝牙适配器状态开关改变时的提示
    useEffect(() => {
        if (firstRender) return
        if (available) {
            Taro.atMessage({ message: '蓝牙适配器开启', type: 'success' })
        } else {
            Taro.atMessage({ message: '蓝牙适配器关闭', type: 'error' })
        }
    }, [available])

    // 蓝牙适配器是否处于搜索设备状态
    useEffect(() => {
        if (firstRender) return
        if (discovering) {
            Taro.atMessage({ message: '正在搜索蓝牙设备...' })
        } else {
            Taro.atMessage({ message: '停止搜索蓝牙设备', type: 'warning' })
        }
    }, [discovering])

    // 修改首次渲染控制
    useEffect(() => setFirstRender(false), []);

    // 判断是否为iPhone
    useEffect(() => {
        resetBluetoothModule();
        const res = Taro.getSystemInfoSync();
        setIsIphonex(res.model.search('iPhone X') != -1);
    }, [])

    // 持久化service uuid
    useEffect(() => Taro.setStorageSync('uuid', uuid), [uuid]);

    return (
        <View className={`index-${display}`}>
            <AtMessage />
            <SetUuid
                showSetting={showSetting}
                onChangeUuid={value => {
                    setShowSetting(false);
                    setUuid(value)
                }}
            />
            <AtNoticebar className="notice-bar">
                {available ? `已发现 ${devices.length} 个BLE设备` : '蓝牙适配器未开启或不可用'}
            </AtNoticebar>
            <View
                className={`scroll-view ${isIphonex ? 'iphonex' : ''}`}
            >
                <AtList>
                    { devices.map((item, index) => (
                        <AtListItem
                            key={String(index)}
                            title={item.name}
                            extraText={`${item.RSSI}dBm`}
                            note={item.deviceId}
                            iconInfo={{ value: 'lanya', prefixClass: 'lw', size: 40, color: '#346fc2' }}
                            onClick={() => {
                                stopDevicesDiscovery()
                                Taro.navigateTo({
                                    url: `/pages/blue-tooth/device/index?deviceId=${item.deviceId}&name=${item.name}`
                                });
                            }}
                        />
                    ))}
                </AtList>
            </View>
            <View className={`btn-group ${isIphonex ? 'iphonex' : ''}`}>
                <Button
                    className="scan-btn setting"
                    onClick={() => setShowSetting(true)}
                    onLongPress={() => setShowAction(true)}
                >
                    <AtIcon prefixClass='lw' value='setting' size='16' color='#fff' />
                </Button>
                { discovering &&
                    <Button
                        className='scan-btn'
                        onClick={stopDevicesDiscovery}
                    >
                        停止扫描
                    </Button>
                }
                <Button
                    className={`scan-btn ${available ? 'main' : 'disable'}`}
                    loading={discovering}
                    disabled={!available}
                    onClick={() => startDevicesDiscovery(uuid.serviceuuid)}
                >
                    {available ? '扫描设备' : '蓝牙未打开，请先打开蓝牙'}
                </Button>
            </View>
            <AtActionSheet
                title="调试操作"
                isOpened={showAction}
                onClose={() => setShowAction(false)}
            >
                <AtActionSheetItem onClick={() => {
                    resetBluetoothModule(Taro.atMessage)
                    setShowAction(false)
                }}>
                    重置蓝牙模块
                </AtActionSheetItem>
            </AtActionSheet>
        </View>
    )
}

export default BlueScan;
