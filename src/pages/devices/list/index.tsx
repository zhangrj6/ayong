import Taro, {Component, Config} from '@tarojs/taro'
import {Button, View} from '@tarojs/components'
import {
    AtButton, AtNoticebar, AtList,
    AtListItem, AtModalHeader, AtRadio,
    AtModalContent, AtModalAction, AtModal,
    AtInput, AtMessage,
} from 'taro-ui'
import { isUUID, strToUUID } from '../../../utils/helper';
import './index.scss';

interface Device {
    name: string,
    localName: string,
    RSSI: number,
    deviceId: string,
}
interface IState {
    devices: Array<Device>,
    loadingScan: boolean,
    showSetting: boolean,
    uuidType: number,
    serviceuuid: string,
    rxduuid: string,
    txduuid: string,
    editable: boolean,
}
export default class Index extends Component<{}, IState> {
    config: Config = {
        navigationBarTitleText: '设备控制'
    };

    _discoveryStarted: boolean = false;
    _muuidSel: number = 0;

    constructor(props) {
        super(props);
        this.state = {
            devices: [],
            loadingScan: false,
            showSetting: false,
            editable: false,
            uuidType: 0,
            serviceuuid: '',
            rxduuid: '',
            txduuid: '',
        }
    }

    componentWillMount () {
        const { name } = this.$router.params;
        Taro.setNavigationBarTitle({ title: name });
    }


    componentDidMount () {
        this._muuidSel = Taro.getStorageSync('lastsel') || 0;
        this.setState({
            serviceuuid: Taro.getStorageSync('usrserviceuuid') || "0000FFE0-0000-1000-8000-00805F9B34FB",
            txduuid: Taro.getStorageSync('usrtxduuid') || "0000FFE1-0000-1000-8000-00805F9B34FB",
            rxduuid: Taro.getStorageSync('usrrxduuid') || "0000FFE1-0000-1000-8000-00805F9B34FB",
            uuidType: this._muuidSel,
            editable: this._muuidSel === 2,
        });
        Taro.setStorageSync('mserviceuuid', "0000FFE0-0000-1000-8000-00805F9B34FB");
        Taro.setStorageSync('mtxduuid', "0000FFE1-0000-1000-8000-00805F9B34FB");
        Taro.setStorageSync('mrxduuid', "0000FFE1-0000-1000-8000-00805F9B34FB");
        Taro.setStorageSync('lastsel', 0);
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

    deviceDetail = (deviceId, name) => {
        this.stopBluetoothDevicesDiscovery()
        Taro.navigateTo({url: `/pages/devices/item/index?deviceId=${deviceId}&name=${name}`});
    };

    openUUIDSettingDialog = () => {
        this.setState({ showSetting: true });
    };

    switchUUIDType = (uuidType) => {
        switch (uuidType) {
            case 0:
                this.setState({
                    serviceuuid: "0000FFE0-0000-1000-8000-00805F9B34FB",
                    txduuid: "0000FFE1-0000-1000-8000-00805F9B34FB",
                    rxduuid: "0000FFE1-0000-1000-8000-00805F9B34FB",
                    editable: false,
                    uuidType,
                });
                break;
            case 1:
                this.setState({
                    serviceuuid: "0000FFE0-0000-1000-8000-00805F9B34FB",
                    txduuid: "0000FFE2-0000-1000-8000-00805F9B34FB",
                    rxduuid: "0000FFE1-0000-1000-8000-00805F9B34FB",
                    editable: false,
                    uuidType,
                });
                break;
            case 2:
                this.setState({
                    serviceuuid: Taro.getStorageSync('usrserviceuuid') || "0000FFE0-0000-1000-8000-00805F9B34FB",
                    txduuid: Taro.getStorageSync('usrtxduuid') || "0000FFE1-0000-1000-8000-00805F9B34FB",
                    rxduuid: Taro.getStorageSync('usrrxduuid') || "0000FFE1-0000-1000-8000-00805F9B34FB",
                    editable: true,
                    uuidType,
                });
                break;
        }
    };

    bindReplaceInput = (value) => {
        return strToUUID(value);
    };

    clickInput = (uuid) => {
        Taro.atMessage({ message: uuid });
    };

    closeModal = () => {
        this.setState({
            showSetting: false,
            uuidType: this._muuidSel,
        })
    };

    confirmModal = () => {
        const { serviceuuid, txduuid, rxduuid, uuidType } = this.state;
        if (!isUUID(serviceuuid)) {
            Taro.atMessage({ message: "错误的ServiceUUID 格式", type: "error" });
            return
        }
        if (!isUUID(txduuid)) {
            Taro.atMessage({ message: "错误的Notify UUID 格式", type: "error" });
            return
        }
        if (!isUUID(rxduuid)) {
            Taro.atMessage({ message: "错误的Write UUID 格式", type: "error" });
            return
        }
        Taro.setStorageSync('mserviceuuid', serviceuuid);
        Taro.setStorageSync('mtxduuid', txduuid);
        Taro.setStorageSync('mrxduuid', rxduuid);
        Taro.setStorageSync('lastsel', uuidType);
        this.setState({ showSetting: false });
    };

    render () {
        const {
            devices, loadingScan, showSetting, editable,
            uuidType, serviceuuid, rxduuid, txduuid,
        } = this.state;
        return (
            <View className='index'>
                <AtMessage />
                <AtNoticebar>已发现 {devices.length} 个BLE设备</AtNoticebar>
                <View className='at-row at-row__justify--around'>
                    <AtButton
                        className='btn'
                        type='primary'
                        loading={loadingScan}
                        onClick={this.openBluetoothAdapter}
                    >
                        扫描设备
                    </AtButton>
                    <AtButton
                        className='btn'
                        type='secondary'
                        onClick={this.stopBluetoothDevicesDiscovery}
                    >
                        停止扫描
                    </AtButton>
                    <AtButton
                        className='btn'
                        type='secondary'
                        onClick={this.openUUIDSettingDialog}
                    >
                        设置UUID
                    </AtButton>
                </View>

                <AtList>
                    { devices.map((item,index) => (
                        <AtListItem
                            key={String(index)}
                            title={item.name}
                            extraText={`${item.RSSI}dBm`}
                            note={item.deviceId}
                            iconInfo={{ value: 'lanya', prefixClass: 'lw', size: 40, color: '#f00' }}
                            onClick={() => this.deviceDetail(item.deviceId, item.name)}
                        />
                    ))
                    }
                </AtList>

                <AtModal
                    isOpened={showSetting}
                    onClose={this.closeModal}
                >
                    <AtModalHeader>设置</AtModalHeader>
                    <AtModalContent>
                        <AtRadio
                            options={[
                                { label: '常规模组', value: 0 },
                                { label: 'BT16模组', value: 1 },
                                { label: '制定UUID', value: 2 },
                            ]}
                            value={uuidType}
                            onClick={this.switchUUIDType}
                        />
                        <AtInput
                            name='service'
                            editable={editable}
                            title='ServiceUUID'
                            type='text'
                            maxLength='37'
                            value={serviceuuid}
                            onChange={this.bindReplaceInput}
                            onClick={() => this.clickInput(serviceuuid)}
                        />
                        <AtInput
                            name='notify'
                            editable={editable}
                            title='Notify UUID'
                            type='text'
                            maxLength='37'
                            value={rxduuid}
                            onChange={this.bindReplaceInput}
                            onClick={() => this.clickInput(rxduuid)}
                        />
                        <AtInput
                            name='write'
                            editable={editable}
                            title='Write UUID'
                            type='text'
                            maxLength='37'
                            value={txduuid}
                            onChange={this.bindReplaceInput}
                            onClick={() => this.clickInput(txduuid)}
                        />
                    </AtModalContent>
                    <AtModalAction>
                        <Button onClick={this.confirmModal}>确定</Button>
                    </AtModalAction>
                </AtModal>
            </View>
        )
    }
}
