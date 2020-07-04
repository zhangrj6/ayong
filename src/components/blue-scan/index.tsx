import { useState } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import { AtNoticebar, AtList, AtListItem, AtMessage, AtIcon } from 'taro-ui'
import SetUuid from "@components/set-uuid"
import { defaultUuid } from '@common/const/uuid'
import { BlueToothErrorMsg } from '@common/const/error-msg'
import './index.scss'


function BlueScan({ display }) {
    const [loadingScan, setLoadingScan] = useState(false); // 是否正在扫描设备中
    const [showSetting, setShowSetting] = useState(false); // 是否显示模组设置
    const [uuid, setUuid] = useState(defaultUuid);

    const scanBlueToothDevices = () => {
        setLoadingScan(true);
        Taro.openBluetoothAdapter()
            .then((res) => {
                console.log('openBluetoothAdapter success', res)
                // this.startBluetoothDevicesDiscovery()
            })
            .catch((err) => {
                if (err.errCode === BlueToothErrorMsg.not_available) {
                    Taro.onBluetoothAdapterStateChange((res) => {
                        console.log('onBluetoothAdapterStateChange', res)
                        if (res.available) {
                            // this.startBluetoothDevicesDiscovery()
                        }
                    })
                }
            })
    }

    return (
        <View className={`index-${display}`}>
            <AtMessage />
            <SetUuid
                showSetting={showSetting}
                onChangeUuid={value => {
                    setShowSetting(false);
                    setUuid(value)
                }}/>
            <AtNoticebar className="notice-bar">已发现 {1} 个BLE设备</AtNoticebar>
            <View
                className='scroll-view'
            >
                <AtList>
                    { [1].map((item,index) => (
                        <AtListItem
                            // key={String(index)}
                            title={'item.name'}
                            extraText={'${item.RSSI}dBm'}
                            note={'item.deviceId'}
                            iconInfo={{ value: 'lanya', prefixClass: 'lw', size: 40, color: '#346fc2' }}
                            onClick={() => {
                                Taro.navigateTo({url: `/pages/blue-tooth/device/index?deviceId=${111}&name=${222}`});
                            }}
                        />
                    ))}
                </AtList>
            </View>
            <View className='btn-group'>
                <Button className="scan-btn setting" onClick={() => setShowSetting(true)}>
                    <AtIcon prefixClass='lw' value='setting' size='16' color='#fff' />
                </Button>
                { loadingScan &&
                    <Button
                        className='scan-btn'
                        onClick={() => {}}
                    >
                        停止扫描
                    </Button>
                }
                <Button
                    className='scan-btn main'
                    loading={loadingScan}
                    onClick={scanBlueToothDevices}
                >
                    扫描设备
                </Button>
            </View>
        </View>
    )
}

BlueScan.options = {
    addGlobalClass: true
}

export default BlueScan;
