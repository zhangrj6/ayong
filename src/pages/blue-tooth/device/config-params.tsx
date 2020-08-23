import Taro, {useState, useEffect, useCallback} from "@tarojs/taro";
import {
    AtAccordion, AtList, AtListItem, AtInputNumber, AtRadio,
    AtModal, AtModalHeader, AtModalContent, AtModalAction,
} from 'taro-ui'
import { View, Button } from '@tarojs/components'
import { commandCodeMap, InstructionMap } from '@common/const/command-code';
import {
    genSetRatedCurrentCode,
    genSetDelayShutdown,
    genSetDelayStartup,
    genSetMonitorPeriod,
    genSetStandbyShutdown,
} from '@common/utils/instruction-encode';

interface IModalContent {
    component: string,
    command: Function,
    param: any,
}

function ConfigParams({ connected, sendCommand, receiveData }) {
    const [open, setOpen] = useState(false);
    const [ratedCurrent, setRatedCurrent] = useState(15);
    const [delayShutdown, setDelayShutdown] = useState('4');
    const [delayStartup, setDelayStartup] = useState('0.5');
    const [monitorPeriod, setMonitorPeriod] = useState('8');
    const [standbyShutdown, setStandbyShutdown] = useState('2');
    const [showModal, setShowModal] = useState(false);
    const [modalHeader, setModalHeader] = useState('');
    const [modalContent, setModalContent] = useState<IModalContent>({
        param: {},
        command: () => {},
        component: ''
    });

    // 读取参数信息
    useEffect(() => {
        if (connected) {
            sendCommand(commandCodeMap.readParamInfo);
        }
    }, [connected]);

    useEffect(() => {
        if (receiveData.data) {
            switch (receiveData.id) {
                case InstructionMap.SET_RATED_CURRENT:
                    setRatedCurrent(receiveData.data.ratedCurrent);
                    break;
                case InstructionMap.SET_DELAY_STARTUP:
                    setDelayStartup(receiveData.data.delayStartup);
                    break;
                case InstructionMap.SET_DELAY_SHUTDOWN:
                    setDelayShutdown(receiveData.data.delayShutdown);
                    break;
                case InstructionMap.SET_MONITOR_PERIOD:
                    setMonitorPeriod(receiveData.data.monitorPeriod);
                    break;
                case InstructionMap.SET_STANDBY_SHUTDOWN:
                    setStandbyShutdown(receiveData.data.standbyShutdown);
                    break;
                default:
                    setDelayShutdown(receiveData.data.delayShutdown);
                    setRatedCurrent(receiveData.data.ratedCurrent);
                    setDelayStartup(receiveData.data.delayStartup);
                    setStandbyShutdown(receiveData.data.standbyShutdown);
                    setMonitorPeriod(receiveData.data.monitorPeriod);
            }
            Taro.atMessage({ message: `${modalHeader}设置成功`, type: 'success' });
        }
    }, [receiveData]);

    // 数字输入框修改事件
    const changeNumberInput = useCallback(value => {
        setModalContent({
            ...modalContent,
            param: {
                ...modalContent.param,
                value,
            }
        })
    }, [modalContent]);
    // 修改额定电流
    const changeRatedCurrent = useCallback(() => {
        setModalHeader('额定工作电流(A)');
        setModalContent({
            component: 'numberInput',
            command: genSetRatedCurrentCode,
            param: {
                min: 1,
                max: 50,
                step: 0.1,
                value: ratedCurrent,
            }
        })
        setShowModal(true);
    }, [ratedCurrent]);
    // 修改关枪延时关机
    const changeDelayShutdown = useCallback(() => {
        setModalHeader('关枪延时关机(秒)');
        setModalContent({
            component: 'radio',
            command: genSetDelayShutdown,
            param: {
                options: [
                    { label: '不 延 时', value: '0' },
                    { label: '延时 3 秒', value: '3', desc: '推荐设置' },
                    { label: '延时 5 秒', value: '5' },
                    { label: '延时 8 秒', value: '8' },
                    { label: '延时 10秒', value: '10' },
                ],
                value: delayShutdown,
            }
        })
        setShowModal(true);
    }, [delayShutdown]);
    // 修改开枪延时开机
    const changeDelayStartup = useCallback(() => {
        setModalHeader('开枪延时开机(秒)');
        setModalContent({
            component: 'radio',
            command: genSetDelayStartup,
            param: {
                options: [
                    { label: '不 延 时', value: '0' },
                    { label: '延时0.5秒', value: '0.5', desc: '推荐设置' },
                    { label: '延时 1 秒', value: '1' },
                    { label: '延时1.5秒', value: '1.5' },
                    { label: '延时 2 秒', value: '2' },
                ],
                value: delayStartup,
            }
        })
        setShowModal(true);
    }, [delayStartup]);

    // 修改实时监测周期
    const changeMonitorPeriod = useCallback(() => {
        setModalHeader('实时监测周期(分钟)');
        setModalContent({
            component: 'radio',
            command: genSetMonitorPeriod,
            param: {
                options: [
                    { label: '2 分钟', value: '2' },
                    { label: '5 分钟', value: '5' },
                    { label: '8 分钟', value: '8', desc: '推荐设置' },
                    { label: '15分钟', value: '15' },
                    { label: '25分钟', value: '25' },
                ],
                value: monitorPeriod,
            }
        })
        setShowModal(true);
    }, [monitorPeriod]);
    // 修改自动关机时间
    const changeStandbyShutdown = useCallback(() => {
        setModalHeader('待机自动关机(小时)');
        setModalContent({
            component: 'radio',
            command: genSetStandbyShutdown,
            param: {
                options: [
                    { label: '不 启 用', value: '0' },
                    { label: '0.5 小时', value: '0.5' },
                    { label: ' 1 小 时', value: '1' },
                    { label: ' 2 小 时', value: '2', desc: '推荐设置' },
                    { label: ' 4 小 时', value: '4' },
                ],
                value: standbyShutdown,
            }
        })
        setShowModal(true);
    }, [standbyShutdown]);


    return (
        <View>
            <AtAccordion
                open={open}
                onClick={value => setOpen(value)}
                isAnimation={false}
                title='参数设置' icon={{ prefixClass: 'lw', value: 'setting', size: 25, color: '#6190e8' }}
                note={connected ? '' : '请先连接设备，再进行配置'}
            >
                <AtList hasBorder={false}>
                    <AtListItem
                        title='额定工作电流'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'rated-current' }}
                        extraText={`${ratedCurrent}A`}
                        onClick={changeRatedCurrent}
                    />
                    <AtListItem
                        title='关枪延时关机'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'delay-shutdown' }}
                        extraText={`${delayShutdown}秒`}
                        onClick={changeDelayShutdown}
                    />
                    <AtListItem
                        title='开枪延时开机'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'delay-startup' }}
                        extraText={`${delayStartup}秒`}
                        onClick={changeDelayStartup}
                    />
                    <AtListItem
                        title='实时监测周期'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'monitor-period' }}
                        extraText={`${monitorPeriod}分钟`}
                        onClick={changeMonitorPeriod}
                    />
                    <AtListItem
                        title='待机自动关机'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'standby-shutdown' }}
                        extraText={`${standbyShutdown}小时`}
                        onClick={changeStandbyShutdown}
                    />
                </AtList>
            </AtAccordion>
            <AtModal isOpened={showModal}>
                <AtModalHeader>{modalHeader}</AtModalHeader>
                <AtModalContent>
                    { modalContent.component === 'numberInput' &&
                        <AtInputNumber
                            type="number"
                            size="large"
                            className="number-input"
                            min={modalContent.param.min}
                            max={modalContent.param.max}
                            step={modalContent.param.step}
                            value={modalContent.param.value}
                            onChange={changeNumberInput}
                        />
                    }
                    { modalContent.component === 'radio' &&
                        <AtRadio
                            options={modalContent.param.options}
                            value={modalContent.param.value}
                            onClick={changeNumberInput}
                        />
                    }
                </AtModalContent>
                <AtModalAction>
                    <Button onClick={() => setShowModal(false)}>取消</Button>
                    <Button onClick={() => {
                        const value = modalContent.param.value;
                        sendCommand(modalContent.command(value));
                        Taro.atMessage({ message: `设置${modalHeader}` })
                        setShowModal(false)
                    }}>
                        确定
                    </Button>
                </AtModalAction>
            </AtModal>
        </View>
    )
}

export default ConfigParams;
