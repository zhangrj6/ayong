import Taro, {useState, useEffect, useCallback} from "@tarojs/taro";
import {
    AtAccordion, AtList, AtListItem, AtInputNumber, AtRadio,
    AtModal, AtModalHeader, AtModalContent, AtModalAction,
} from 'taro-ui'
import { View, Button } from '@tarojs/components'
import { InstructionMap } from '@common/const/command-code';

export default function StatusInfo({ connected, receiveData }) {
    const [open, setOpen] = useState(false);
    const [runtimeStr, setRuntimeStr] = useState('');

    useEffect(() => {
        if (connected && receiveData.id === InstructionMap.GET_REALTIME_INFO) {
            const { runtime } = receiveData.data;
            setRuntimeStr(`${runtime.hour}小时${runtime.minute}分钟${runtime.second}秒`);
        }
    }, [receiveData, connected])

    return (
        <View>
            <AtAccordion
                open={open}
                onClick={value => setOpen(value)}
                isAnimation={false}
                title='状态信息' icon={{ prefixClass: 'lw', value: 'desktop', size: 25, color: '#6190e8' }}
                note={connected ? '' : '请先连接设备，再进行配置'}
            >
                <AtList hasBorder={false}>
                    <AtListItem
                        title='电机运转时间'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'duration' }}
                        extraText={runtimeStr}
                    />
                </AtList>
            </AtAccordion>
        </View>
    )
}
