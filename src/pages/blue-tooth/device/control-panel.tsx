import Taro, { useState, useEffect } from '@tarojs/taro'
import { Text, View } from "@tarojs/components";
import { AtIcon, AtSwitch } from "taro-ui";
import { commandCodeMap, InstructionMap } from '@common/const/command-code';
import { parseLed, color } from '@common/utils/code-handle';
import './index.scss';

function ControlPanel({ sendCommand, connected, receiveData }) {
    const [current, setCurrent] = useState('0.0');
    const [voltage, setVoltage] = useState('0.0');
    const [leakage, setLeakage] = useState('0.0');
    const [led, setLed] = useState({
        run: color.grep,
        standby: color.grep,
        fault: color.grep,
        loss: '',
    })

    // 实时通信副作用逻辑
    useEffect(() => {
        let timer;
        if (connected) {
            // 每2s获取一次实时数据
            timer = setInterval(() => {
                sendCommand(commandCodeMap.realTimeCommunication);
            }, 400);
        }
        return () => clearInterval(timer);
    }, [connected]);



    useEffect(() => {
        if (connected && receiveData.id === InstructionMap.GET_REALTIME_INFO) {
            const { current, voltage, leakage, led } = receiveData.data;
            setCurrent(current.toFixed(1));
            setVoltage(voltage.toFixed(1));
            setLeakage(leakage.toFixed(1));
            const ledObj = parseLed(parseInt(led, 16), receiveData.prefix)
            setLed(ledObj);
        }
    }, [receiveData, connected])

    return (
        <View className="control-panel">
            <View className="indicator-lights">
                <View className="light-item">
                    <AtIcon prefixClass='lw' value='indicator-light' size='32' color={led.run} />
                    <Text>运行</Text>
                </View>
                <View className="light-item">
                    <AtIcon prefixClass='lw' value='indicator-light' size='32' color={led.standby} />
                    <Text>待机</Text>
                </View>
                <View className="light-item">
                    <AtIcon prefixClass='lw' value='indicator-light' size='32' color={led.fault} />
                    <Text>故障</Text>
                </View>
                {
                    led.loss && (
                        <View className="light-item">
                            <AtIcon prefixClass='lw' value='indicator-light' size='32' color={led.loss} />
                            <Text>缺相</Text>
                        </View>
                    )
                }
            </View>
            <View className="indicator-info">
                <View>
                    电流：<span>{current}</span>A
                </View>
                <View>
                    电压：<span>{voltage}</span>V
                </View>
                <View>
                    漏电：<span>{leakage}</span>mA
                </View>
            </View>
            <View className="switch-group">
                {/*<View>*/}
                {/*    <AtSwitch*/}
                {/*        disabled={!connected}*/}
                {/*        title="开关机"*/}
                {/*        onChange={(value) => sendCommand(value ? commandCodeMap.openDevice : commandCodeMap.closeDevice)}*/}
                {/*    />*/}
                {/*</View>*/}
                <View className="switch-item on" onClick={() => sendCommand(commandCodeMap.openDevice)}>开</View>
                <View className="switch-item off" onClick={() => sendCommand(commandCodeMap.closeDevice)}>关</View>
            </View>
        </View>
    )
}

export default ControlPanel;
