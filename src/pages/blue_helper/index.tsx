import Taro, { Component, Config } from '@tarojs/taro'
import {View, Button, ScrollView} from '@tarojs/components'
import {
    AtButton, AtCheckbox, AtNavBar, AtNoticebar, AtModal,
    AtModalHeader, AtModalContent, AtModalAction, AtInputNumber,
    AtInput, AtIcon,
} from "taro-ui";
import './index.scss'

interface IState {
    checkedList: Array<string>,
    connectState: string,
    receiveData: string,
    sendText: string,
    rxCount: number,
    txCount: number,
    rxRate: number,
    txRate: number,
    autoSendInv: number,
    showSetting: boolean,
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

    constructor () {
        super(...arguments);
        this.state = {
            checkedList: ['list1'],
            connectState: '正在连接',
            receiveData: '',
            sendText: '',
            rxCount: 0,
            txCount: 0,
            rxRate: 0,
            txRate: 0,
            autoSendInv: 100,
            showSetting: false,
        };
    }

    componentWillMount () { }

    componentDidMount () { }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    goclear = () => {

    };

    gotoback = () => {

    };

    changeCheckbox = () => {};

    changeAutoSendInv = () => {};

    showSetting = () => {
        this.setState({ showSetting: true });
    };

    changeSendText = () => {};

    render () {
        const {
            checkedList, connectState, autoSendInv, showSetting,
            rxRate, txRate, rxCount, txCount, receiveData, sendText,
        } = this.state;
        return (
            <View className='index'>
                <View className='layout'>
                    <AtNavBar
                        onClickRgIconSt={this.showSetting}
                        onClickLeftIcon={this.gotoback}
                        leftIconType='chevron-left'
                        title={connectState}
                        leftText='返回'
                        rightFirstIconType='settings'
                    />
                    <AtNoticebar
                        single
                        icon='volume-plus'
                    >
                        RX:{rxRate}B/s, TX:{txRate}B/S
                    </AtNoticebar>
                    <AtNoticebar
                        single
                        icon='volume-plus'
                    >
                        RX:{rxCount}, TX:{txCount}
                    </AtNoticebar>
                    <View className='at-row at-row__justify--around'>
                        <AtButton
                            className='btn'
                            type='secondary'
                            onClick={this.goclear}
                        >
                            清屏
                        </AtButton>
                        <AtButton
                            className='btn'
                            type='primary'
                            onClick={this.gotoback}
                        >
                            断开连接
                        </AtButton>
                    </View>
                    <ScrollView
                        className='receive'
                    >
                        <View>{receiveData}</View>
                    </ScrollView>
                    <View className='send'>
                        <AtInput
                            name='send'
                            clear
                            type='text'
                            placeholder='发送数据'
                            value={sendText}
                            onChange={this.changeSendText}
                        >
                            <AtIcon value='repeat-play' size='30' color='#6190E8'/>
                            <AtIcon value='play' size='30' color='#6190E8'/>
                        </AtInput>
                    </View>
                </View>

                <AtModal isOpened={showSetting}>
                    <AtModalHeader>设置</AtModalHeader>
                    <AtModalContent>
                        <View className='at-article__h3'>收发方式</View>
                        <AtCheckbox
                            options={this.checkboxOption}
                            selectedList={checkedList}
                            onChange={this.changeCheckbox}
                        />
                        <View className='at-article__h3'>自动发送周期(ms)</View>
                        <AtInputNumber
                            type='number'
                            min={1}
                            max={1000000}
                            step={100}
                            width={380}
                            value={autoSendInv}
                            onChange={this.changeAutoSendInv}
                         />
                    </AtModalContent>
                    <AtModalAction>
                        <Button>取消</Button>
                        <Button>确定</Button>
                    </AtModalAction>
                </AtModal>
            </View>
        )
    }
}
