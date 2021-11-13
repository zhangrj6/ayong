import Taro, {useState, useEffect, useCallback} from "@tarojs/taro";
import {
    AtAccordion, AtList, AtListItem, AtInputNumber, AtRadio, AtButton
} from 'taro-ui'
import { Button, View } from '@tarojs/components'
import { InstructionMap, commandCodeMap } from '@common/const/command-code';
import { cfgControlModel } from '@common/utils/code-handle'

export default function StatusInfo({ connected, receiveData, sendCommand }) {
    const [open, setOpen] = useState(false);
    const [runtimeStr, setRuntimeStr] = useState('');
    const [cntOverload, setCntOverload] = useState('--');
    const [cntLeakage, setCntLeakage] = useState('--');
    const [version, setVersion] = useState('--')
    const [controlModel, setControlModel] = useState('--')
    const [controlConfig, setControlConfig] = useState(1);

    useEffect(() => {
        if (connected && receiveData.id === InstructionMap.GET_REALTIME_INFO) {
            const { runtime } = receiveData.data;
            setRuntimeStr(`${runtime.hour}小时${runtime.minute}分钟${runtime.second}秒`);
        } else if (connected && receiveData.id === InstructionMap.GET_PARAM_INFO) {
            const { cntOverload, cntLeakage, softwareVersion, controlConfig } = receiveData.data;
            setCntOverload(cntOverload);
            setCntLeakage(cntLeakage);
            setVersion(softwareVersion);
            const itemControlModel = cfgControlModel.find(e => e.value == controlConfig);
            setControlConfig(controlConfig)
            setControlModel(itemControlModel ? itemControlModel.label : '--')
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
                    <AtListItem
                        title='软件版本号'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'banben' }}
                        extraText={version}
                    />
                    <AtListItem
                        title='控制模式'
                        iconInfo={{ size: 20, color: '#346fc2', prefixClass: 'lw', value: 'kongzhizhongxin' }}
                        extraText={controlModel}
                    />
{/*                     
                    {controlConfig === 0 && <Button
                       onClick={(e) => {
                           sendCommand(commandCodeMap.wirelessMatch)
                           Taro.atMessage({ message: '匹配成功' })
                       }}
                    >
                        无线配对
                    </Button>} */}
                    {controlConfig === 0 && <AtButton  
                    customStyle={{
                        width: '100px',
                        float: 'right',
                        margin: '5px 15px 20px 0'
                    }}
                    onClick={(e) => {
                           sendCommand(commandCodeMap.wirelessMatch)
                           Taro.atMessage({ message: '匹配成功' })
                       }} type='primary' size='small'>无线配对</AtButton>}
                </AtList>
            </AtAccordion>
        </View>
    )
}
