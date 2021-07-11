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
    genSwitchOverload,
    genSwitchLeakage,
    genSwitchAuto,
    genMutiMachineOneGun,
    genExternalSwitch,
} from '@common/utils/instruction-encode'
import { cfgMutlMachine, cfgExternalSwitch } from '@common/utils/code-handle'

interface IModalContent {
    component: string,
    command: Function,
    param: any,
}

function ConfigParams({ connected, sendCommand, receiveData }) {
    const [open, setOpen] = useState(false);
    const [isLeakage, setIsLeakage] = useState(false);
    const [isOverload, setIsOverload] = useState(false);
    const [isAuto, setIsAuto] = useState(false);
    const [ratedCurrent, setRatedCurrent] = useState(15);
    const [delayShutdown, setDelayShutdown] = useState(4);
    const [delayStartup, setDelayStartup] = useState(0.5);
    const [monitorPeriod, setMonitorPeriod] = useState(8);
    const [standbyShutdown, setStandbyShutdown] = useState(2);
    const [externalSwitch, setExternalSwitch] = useState(0);
    const [mutlMachineOneGun, setMutlMachineOneGun] = useState(0);
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

    // 处理参数设置返回值
    useEffect(() => {
        if (receiveData && receiveData.data) {
            console.log('receiveData.data', receiveData.data)
            switch (receiveData.id) {
                case InstructionMap.SET_RATED_CURRENT:
                    setRatedCurrent(receiveData.data.ratedCurrent);
                    Taro.atMessage({ message: '额定电流设置成功', type: 'success' });
                    break;
                case InstructionMap.SET_DELAY_STARTUP:
                    setDelayStartup(Number(receiveData.data.delayStartup)/2);
                    Taro.atMessage({ message: '开枪延时开机设置成功', type: 'success' });
                    break;
                case InstructionMap.SET_DELAY_SHUTDOWN:
                    setDelayShutdown(Number(receiveData.data.delayShutdown));
                    Taro.atMessage({ message: '关枪延时关机设置成功', type: 'success' });
                    break;
                case InstructionMap.SET_MONITOR_PERIOD:
                    setMonitorPeriod(Number(receiveData.data.monitorPeriod));
                    Taro.atMessage({ message: '实时监测周期设置成功', type: 'success' });
                    break;
                case InstructionMap.SET_STANDBY_SHUTDOWN:
                    setStandbyShutdown(Number(receiveData.data.standbyShutdown)/60);
                    Taro.atMessage({ message: '待机自动关机设置成功', type: 'success' });
                    break;
                case InstructionMap.SET_MUTI_MACHINE:
                    setMutlMachineOneGun(receiveData.data.switchStatus);
                    Taro.atMessage({ message: '一机多枪设置成功', type: 'success' });
                    break;
                case InstructionMap.SET_EXTERNAL_SWITCH:
                    setExternalSwitch(receiveData.data.switchStatus);
                    Taro.atMessage({ message: '外部开关设置成功', type: 'success' });
                    break;
                case InstructionMap.SET_LEAKAGE:
                    setIsLeakage(receiveData.data.switchStatus !== 1);
                    Taro.atMessage({ message: '漏电开关设置成功', type: 'success' });
                    break;
                case InstructionMap.SET_OVERLOAD:
                    setIsOverload(receiveData.data.switchStatus !== 1);
                    Taro.atMessage({ message: '过载开关设置成功', type: 'success' });
                    break;
                case InstructionMap.SET_AUTO:
                    setIsAuto([1,2].findIndex(e => e === receiveData.data.switchStatus) < 0);
                    Taro.atMessage({ message: '自动开关设置成功', type: 'success' });
                    break;
                case InstructionMap.GET_PARAM_INFO:
                    setDelayShutdown(receiveData.data.delayShutdown);
                    setRatedCurrent(receiveData.data.ratedCurrent);
                    setDelayStartup(receiveData.data.delayStartup);
                    setStandbyShutdown(receiveData.data.standbyShutdown);
                    setMonitorPeriod(receiveData.data.monitorPeriod);
            }
            // Taro.atMessage({ message: `${modalHeader}设置成功`, type: 'success' });
        }
    }, [receiveData]);

    // 数字输入框修改事件
    const changeNumberInput = useCallback(value => {
        const newValue = Number(value.toFixed(1));
        setModalContent({
            ...modalContent,
            param: {
                ...modalContent.param,
                value: newValue
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
                    { label: '不 延 时', value: 0 },
                    { label: '延时 3 秒', value: 3, desc: '推荐设置' },
                    { label: '延时 5 秒', value: 5 },
                    { label: '延时 8 秒', value: 8 },
                    { label: '延时 10秒', value: 10 },
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
                    { label: '不 延 时', value: 0 },
                    { label: '延时0.5秒', value: 0.5, desc: '推荐设置' },
                    { label: '延时 1 秒', value: 1 },
                    { label: '延时1.5秒', value: 1.5 },
                    { label: '延时 2 秒', value: 2 },
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
                    { label: '2 分钟', value: 2 },
                    { label: '5 分钟', value: 5 },
                    { label: '8 分钟', value: 8, desc: '推荐设置' },
                    { label: '15分钟', value: 15 },
                    { label: '25分钟', value: 25 },
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
                    { label: '不 启 用', value: 0 },
                    { label: '0.5 小时', value: 0.5 },
                    { label: ' 1 小 时', value: 1 },
                    { label: ' 2 小 时', value: 2, desc: '推荐设置' },
                    { label: ' 4 小 时', value: 4 },
                ],
                value: standbyShutdown,
            }
        })
        setShowModal(true);
    }, [standbyShutdown]);
    // 修改一机多枪配置
    const changeMutiMachineOneGun = useCallback(() => {
        setModalHeader('一机多枪配置');
        setModalContent({
            component: 'radio',
            command: genMutiMachineOneGun,
            param: {
                options: cfgMutlMachine,
                value: mutlMachineOneGun,
            }
        })
        setShowModal(true);
    }, [mutlMachineOneGun]);
    // 修改一机多枪配置
    const changeExternalSwitch = useCallback(() => {
        setModalHeader('外接开关配置');
        setModalContent({
            component: 'radio',
            command: genExternalSwitch,
            param: {
                options: cfgExternalSwitch,
                value: externalSwitch,
            }
        })
        setShowModal(true);
    }, [externalSwitch]);

    // 修改数据确定操作
    const sendUpdate = useCallback(() => {
        let value = modalContent.param.value;
        if (modalContent.component === 'numberInput' && value < modalContent.param.min) {
            value = modalContent.param.min;
        }
        sendCommand(modalContent.command(value));
        Taro.atMessage({ message: `设置${modalHeader}` })
        setShowModal(false)
    }, [modalContent])

    const setOverload = useCallback((event) => {
        const code = genSwitchOverload(event.target.value);
        sendCommand(code)
    }, [connected])

    const setLeakage = useCallback((event) => {
        const code = genSwitchLeakage(event.target.value);
        sendCommand(code)
    }, [connected])

    const setAuto = useCallback((event) => {
        const code = genSwitchAuto(event.target.value);
        sendCommand(code)
    }, [connected])

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
                        extraText={delayShutdown > 0 ? `${delayShutdown}秒` : '不延时'}
                        onClick={changeDelayShutdown}
                    />
                    <AtListItem
                        title='开枪延时开机'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'delay-startup' }}
                        extraText={delayStartup > 0 ? `${delayStartup}秒` : '不延时'}
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
                        extraText={standbyShutdown > 0 ? `${standbyShutdown}小时` : '不启用'}
                        onClick={changeStandbyShutdown}
                    />
                    <AtListItem
                        title='一机多枪配置'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'standby-shutdown' }}
                        extraText={cfgMutlMachine.find(e => e.value == mutlMachineOneGun).label}
                        onClick={changeMutiMachineOneGun}
                    />
                    <AtListItem
                        title='外接开关配置'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'standby-shutdown' }}
                        extraText={cfgExternalSwitch.find(e => e.value == externalSwitch).label}
                        onClick={changeExternalSwitch}
                    />
                    <AtListItem
                        title='过载开关'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'overload' }}
                        isSwitch
                        switchIsCheck={isOverload}
                        onSwitchChange={setOverload}
                    />
                    <AtListItem
                        title='漏电开关'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'leakage' }}
                        isSwitch
                        switchIsCheck={isLeakage}
                        onSwitchChange={setLeakage}
                    />
                    <AtListItem
                        title='自动开关'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'auto' }}
                        isSwitch
                        switchIsCheck={isAuto}
                        onSwitchChange={setAuto}
                    />
                </AtList>
            </AtAccordion>
            <AtModal isOpened={showModal}>
                <AtModalHeader>{modalHeader}</AtModalHeader>
                <AtModalContent>
                    { modalContent.component === 'numberInput' &&
                        <AtInputNumber
                            type="digit"
                            size="large"
                            className="number-input"
                            max={modalContent.param.max}
                            step={modalContent.param.step}
                            value={modalContent.param.value}
                            onChange={changeNumberInput}
                            disabled={!connected}
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
                    <Button disabled={!connected} onClick={sendUpdate}>确定</Button>
                </AtModalAction>
            </AtModal>
        </View>
    )
}

export default ConfigParams;
