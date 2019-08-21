import Taro, { Component, Config } from '@tarojs/taro'
import {View} from '@tarojs/components'
import {
    AtButton, AtNavBar, AtMessage,
} from "taro-ui";
import { ab2hex, ab2Str, regSendData } from '../../../utils/helper';
import { orderMap } from '../config';
import './index.scss'

interface IState {
    deviceId: string,
    name: string,
    checkedList: Array<string>,
    connectState: string,
    reconnect: string,
    receiveData: string,
    sendText: string,
    connected: boolean,
}
export interface ICheckbox {
    value: string
    label: string
    desc?: string
    disabled?: boolean
}
export default class Index extends Component<{}, IState> {

    config: Config = {
        navigationBarTitleText: '蓝牙串口助手'
    };

    checkboxOption: Array<ICheckbox> = [{
        value: 'send',
        label: '十六进制发送',
    },{
        value: 'rec',
        label: '十六进制接收'
    }];

    _readyRec: boolean = false;
    _hexRec: boolean = false;
    _hexSend: boolean = false;
    serviceu: string = '';
    txdu: string = '';
    rxdu: string = '';
    _deviceId: string = '';
    _characteristicId: string = '';
    _serviceId: string = '';

    constructor () {
        super(...arguments);
        this.state = {
            deviceId: '',
            name: '',
            checkedList: [],
            connectState: '正在连接',
            reconnect: '连接中...',
            receiveData: '',
            sendText: '',
            connected: false,
        };
    }

    componentWillMount () {
        const { deviceId, name } = this.$router.params;
        this.setState({ deviceId, name });
        this.connectDevice(deviceId);
    }

    componentDidMount () {
        this.serviceu = Taro.getStorageSync('mserviceuuid').toUpperCase();
        this.txdu = Taro.getStorageSync('mtxduuid').toUpperCase();
        this.rxdu = Taro.getStorageSync('mrxduuid').toUpperCase();
    }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    openDevice = () => {
        this.sendOrder(orderMap.openDevice);
    };

    closeDevice = () => {
        this.sendOrder(orderMap.closeDevice);
    };

    godisconnect = () => {
        const { connected, deviceId } = this.state;
        if (connected){
            Taro.closeBLEConnection({ deviceId})
            this.setState({
                connected: false,
                reconnect:"重新连接",
                connectState: "已断开",
            })
        }else{
            this.setState({
                connectState: "正在连接",
                reconnect: "连接中...",
            });
            Taro.createBLEConnection({ deviceId })
                .then(() => {
                    this.setState({
                        connected: true,
                        connectState: "读取服务",
                        reconnect: "断开连接",
                        receiveData: "",
                    });
                    this.getBLEDeviceServices(deviceId)
                });
        }
    };

    sendOrder = (sendText) => {
        const { connected } = this.state;
        if (!connected){
            Taro.atMessage({ message: "请先连接BLE设备...", type: "warning" });
            return;
        }
        var hex = sendText || ''; //要发送的数据
        let buffer1;
        const typedArray = new Uint8Array(regSendData(hex).map(function (h) {
            return parseInt(h, 16)
        }));
        buffer1 = typedArray.buffer;

        if (buffer1==null) return;
        Taro.writeBLECharacteristicValue({
            deviceId: this._deviceId,
            serviceId: this._serviceId,
            characteristicId: this._characteristicId,
            value: buffer1,
        }).then(() => {
        }).catch(err => console.log(err));
    };

    // 连接设备
    connectDevice = (deviceId) => {
        Taro.createBLEConnection({ deviceId })
            .then(() => {
                this.setState({
                    connected: true,
                    connectState: "读取服务",
                    reconnect: "断开连接",
                });
                this.getBLEDeviceServices(deviceId);
            });
    };

    getBLEDeviceServices = (deviceId) => {
        Taro.getBLEDeviceServices({deviceId})
            .then((res) => {
                let isService = false
                for (let i = 0; i < res.services.length; i++) {
                    if (this.serviceu == res.services[i].uuid) {
                        isService = true;
                        this.getBLEDeviceCharacteristics(deviceId, res.services[i].uuid);
                        this.setState({ connectState: "获取特征值" });
                    }
                }
                if (!isService) {
                    this.setState({ connectState: "UUID错误" });
                    Taro.atMessage({ message: "找不到目标服务UUID  请确认UUID是否设置正确或重新连接", type: "error" });
                }
            })
    };

    getBLEDeviceCharacteristics = (deviceId, serviceId) => {
        Taro.getBLEDeviceCharacteristics({ deviceId, serviceId })
            .then((res) => {
                let ismy_service = false;
                if (serviceId == this.serviceu) {
                    ismy_service = true;
                }
                for (let i = 0; i < res.characteristics.length; i++) {
                    let item = res.characteristics[i];
                    if (item.properties.read) {
                        Taro.readBLECharacteristicValue({
                            deviceId,
                            serviceId,
                            characteristicId: item.uuid,
                        });
                    }
                    if (item.properties.write) {
                        this._deviceId = deviceId;
                        if (ismy_service && (this.txdu == item.uuid)){
                            this._characteristicId = item.uuid;
                            this._serviceId = serviceId
                        }
                    }
                    if (item.properties.notify || item.properties.indicate) {
                        if (ismy_service && (this.rxdu == item.uuid)){
                            Taro.notifyBLECharacteristicValueChange({
                                deviceId,
                                serviceId,
                                characteristicId: item.uuid,
                                state: true,
                            }).then(() => {
                                this.setState({ connectState: "连接成功" });
                                this._readyRec=true
                            })
                        }
                    }
                }
            })
            .catch(err => console.log('getBLEDeviceCharacteristics', err));
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
    };

    render () {
        const {
            connectState, reconnect,
        } = this.state;
        return (
            <View className='index'>
                <AtMessage />
                <View className='layout'>
                    <AtNavBar
                        title={connectState}
                    />
                    <View className='at-row at-row__justify--around'>
                        <AtButton
                            className='btn'
                            type='primary'
                            onClick={this.openDevice}
                        >
                            开
                        </AtButton>
                        <AtButton
                            className='btn'
                            type='secondary'
                            onClick={this.closeDevice}
                        >
                            关
                        </AtButton>
                        <AtButton
                            className='btn'
                            type='primary'
                            onClick={this.godisconnect}
                        >
                            {reconnect}
                        </AtButton>
                    </View>

                </View>
            </View>
        )
    }
}
