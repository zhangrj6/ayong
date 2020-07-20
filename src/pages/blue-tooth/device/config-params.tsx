import Taro, {useState, useEffect, useCallback} from "@tarojs/taro";
import {
    AtAccordion, AtList, AtListItem, AtInputNumber,
    AtModal, AtModalHeader, AtModalContent, AtModalAction,
} from 'taro-ui'
import { View, Button } from '@tarojs/components'
import { commandCodeMap } from '@common/const/command-code';

interface IModalContent {
    component: string,
    command: Function,
    param: any,
}

function ConfigParams({ connected, sendCommand, receiveData }) {
    const [open, setOpen] = useState(false);
    const [ratedCurrent, setRatedCurrent] = useState(15);
    const [delayShutdown, setDelayShutdown] = useState(4);
    const [showModal, setShowModal] = useState(false);
    const [modalHeader, setModalHeader] = useState('');
    const [modalContent, setModalContent] = useState<IModalContent>({});

    // 读取参数信息
    useEffect(() => {
        if (connected) {
            sendCommand(commandCodeMap.readParamInfo);
        }
    }, [connected]);

    useEffect(() => {
        // TODO 判断返回指令
        if (receiveData.data) {
            setDelayShutdown(receiveData.data.delayShutdown);
            setRatedCurrent(receiveData.data.ratedCurrent);
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
            command: () => {},
            param: {
                min: 1,
                max: 100,
                step: 0.1,
                value: ratedCurrent,
            }
        })
        setShowModal(true);
    }, [ratedCurrent]);
    // 修改关机延时
    const changeDelayShutdown = useCallback(() => {
        setModalHeader('关枪延时关机(s)');
        setModalContent({
            component: 'numberInput',
            command: () => {},
            param: {
                min: 0,
                max: 240,
                step: 1,
                value: delayShutdown,
            }
        })
        setShowModal(true);
    }, [delayShutdown]);


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
                        extraText={`${delayShutdown}s`}
                        onClick={changeDelayShutdown}
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
                </AtModalContent>
                <AtModalAction>
                    <Button onClick={() => setShowModal(false)}>取消</Button>
                    <Button onClick={() => {}}>确定</Button>
                </AtModalAction>
            </AtModal>
        </View>
    )
}

export default ConfigParams;
