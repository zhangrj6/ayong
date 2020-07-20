import { useState, useEffect } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { AtNoticebar, AtList, AtListItem, AtMessage, AtIcon } from 'taro-ui'
import SetUuid from "@components/set-uuid"
import { defaultUuid } from '@common/const/uuid'
import { useBlueToothAdapter } from '@hooks/bluetooth-adapter';
import './index.scss'


function BlueScan({ display }) {
    const [firstRender, setFirstRender] = useState(true); // 首次渲染控制
    const [showSetting, setShowSetting] = useState(false); // 是否显示模组设置
    const [uuid, setUuid] = useState(defaultUuid);
    const {available, discovering, startDevicesDiscovery, stopDevicesDiscovery, devices} = useBlueToothAdapter();

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
                }}/>
            <AtNoticebar className="notice-bar">
                {available ? `已发现 ${devices.length} 个BLE设备` : '蓝牙适配器未开启或不可用'}
            </AtNoticebar>
            <View
                className='scroll-view'
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
                                Taro.navigateTo({
                                    url: `/pages/blue-tooth/device/index?deviceId=${item.deviceId}&name=${item.name}`
                                });
                            }}
                        />
                    ))}
                </AtList>
            </View>
            <View className='btn-group'>
                <Button className="scan-btn setting" onClick={() => setShowSetting(true)}>
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
                    扫描设备
                </Button>
            </View>
        </View>
    )
}

export default BlueScan;
