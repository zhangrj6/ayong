import Taro, {useState, useEffect, useCallback} from "@tarojs/taro";
import {
    AtAccordion, AtList, AtListItem, AtInputNumber, AtRadio,
} from 'taro-ui'
import { View } from '@tarojs/components'
import { InstructionMap } from '@common/const/command-code';

export default function StatusInfo({ connected, receiveData }) {
    const [open, setOpen] = useState(false);
    const [runtimeStr, setRuntimeStr] = useState('');
    const [cntOverload, setCntOverload] = useState('--');
    const [cntLeakage, setCntLeakage] = useState('--');

    useEffect(() => {
        if (connected && receiveData.id === InstructionMap.GET_REALTIME_INFO) {
            const { runtime } = receiveData.data;
            setRuntimeStr(`${runtime.hour}小时${runtime.minute}分钟${runtime.second}秒`);
        } else if (connected && receiveData.id === InstructionMap.GET_PARAM_INFO) {
            const { cntOverload, cntLeakage } = receiveData.data;
            setCntOverload(cntOverload);
            setCntLeakage(cntLeakage);
        }
    }, [receiveData, connected])

    return (
        <View>
            <AtAccordion
                open={open}
                onClick={value => setOpen(value)}
                isAnimation={false}
                title='状态信息'
                icon={{ prefixClass: 'lw', value: 'desktop', size: 25, color: '#6190e8' }}
                note={connected ? '' : '请先连接设备，再进行配置'}
            >
                <AtList hasBorder={false}>
                    <AtListItem
                        title='电机运转时间'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'duration' }}
                        extraText={runtimeStr}
                    />
                    <AtListItem
                        title='漏电次数'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'leakage' }}
                        extraText={cntLeakage + ''}
                    />
                    <AtListItem
                        title='过载次数'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'overload' }}
                        extraText={cntOverload + ''}
                    />
                </AtList>
            </AtAccordion>
        </View>
    )
}
