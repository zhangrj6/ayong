import Taro, {Component, Config} from '@tarojs/taro'
import {View} from '@tarojs/components'
import { AtButton, AtNoticebar, AtList, AtListItem } from 'taro-ui'
import './index.scss'

interface Device {
    name: string,
    localName: string,
    RSSI: number,
    deviceId: string,
}
interface IState {
    devices: Array<Device>,
    loadingScan: boolean,
}
export default class Index extends Component<{}, IState> {
    config: Config = {
        navigationBarTitleText: '首页'
    };

    _discoveryStarted: boolean = false;

    constructor(props) {
        super(props);
        this.state = {
            devices: [],
            loadingScan: false,
        }
    }

    componentWillMount () {
        const { name } = this.$router.params;
        Taro.setNavigationBarTitle({ title: name });
    }


    componentDidMount () {
    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    openBluetoothAdapter = () => {
        this.setState({ loadingScan: true });
        Taro.openBluetoothAdapter()
            .then((res) => {
                console.log('openBluetoothAdapter success', res)
                this.startBluetoothDevicesDiscovery()
            })
            .catch((err) => {
                if (err.errCode === 10001) {
                    Taro.onBluetoothAdapterStateChange((res) => {
                        console.log('onBluetoothAdapterStateChange', res)
                        if (res.available) {
                            this.startBluetoothDevicesDiscovery()
                        }
                    })
                }
            })
    };

    startBluetoothDevicesDiscovery = () => {
        if (this._discoveryStarted) {
            this.stopBluetoothDevicesDiscovery();
            return
        }
        this.setState({
            loadingScan: true,
            devices: [],
            // chs: [],
        });
        this._discoveryStarted = true;
        Taro.startBluetoothDevicesDiscovery({ allowDuplicatesKey: true})
            .then((res) => {
                setTimeout(() => {
                    console.log("----BluetoothDevicesDiscovery finish---- ");
                    if (this._discoveryStarted){
                        this.stopBluetoothDevicesDiscovery()
                    }
                }, 20000);
                console.log('startBluetoothDevicesDiscovery success', res)
                this.onBluetoothDeviceFound()
            });
    };

    stopBluetoothDevicesDiscovery = () => {
        this._discoveryStarted = false;
        Taro.stopBluetoothDevicesDiscovery();
        this.setState({ loadingScan: false })
    };

    onBluetoothDeviceFound = () => {
        Taro.onBluetoothDeviceFound((res) => {
            res.devices.forEach(device => {
                if (!device.name && !device.localName) {
                    return
                }
                const foundDevices = this.state.devices;
                const idx = foundDevices.findIndex(item => item.deviceId === device.deviceId);
                if (idx === -1) {
                    // @ts-ignore
                    foundDevices.push(device);
                } else {
                    // @ts-ignore
                    foundDevices[idx] = device;
                }
                this.setState({ devices: foundDevices })
            })
        })
    };

    deviceDetail = () => {
        this.stopBluetoothDevicesDiscovery()
        Taro.navigateTo({url: '/pages/blue_helper/index'})
    };

    render () {
        const { devices, loadingScan } = this.state;
        return (
            <View className='index'>
                <AtNoticebar>已发现 {devices.length} 个BLE设备</AtNoticebar>
                <AtButton
                    type='primary'
                    loading={loadingScan}
                    onClick={this.openBluetoothAdapter}
                >
                    扫描设备
                </AtButton>
                <AtButton
                    type='secondary'
                    onClick={this.stopBluetoothDevicesDiscovery}
                >
                    停止扫描
                </AtButton>
                <AtList>
                    { devices.map((item,index) => (
                        <AtListItem
                            key={String(index)}
                            title={item.name}
                            extraText={`${item.RSSI}dBm`}
                            note={item.deviceId}
                            iconInfo={{ value: 'lanya', prefixClass: 'lw', size: 40, color: '#f00' }}
                            onClick={this.deviceDetail}
                        />
                    ))
                    }
                </AtList>
            </View>
        )
    }
}
