import Taro, { useState, useEffect } from '@tarojs/taro'
import { Text, View } from "@tarojs/components";
import { AtIcon, AtSwitch } from "taro-ui";
import { commandCodeMap, InstructionMap } from '@common/const/command-code';
import { parseLed, color } from '@common/utils/code-handle';
import { useRoundRobin } from '@hooks/tools';
import './index.scss';

function ControlPanel({ sendCommand, connected, receiveData }) {
    const [current, setCurrent] = useState('0.0');
    const [currentL2, setCurrentL2] = useState('');
    const [currentL3, setCurrentL3] = useState('');
    const [voltage, setVoltage] = useState('0.0');
    const [leakage, setLeakage] = useState('0.0');
    const [realtime, setRealtime] = useState(true);
    const [deviceVoltage, setDeviceVoltage] = useState('不支持');
    const [led, setLed] = useState({
        run: color.grep,
        standby: color.grep,
        fault: color.grep,
        loss: '',
    })
    const { proceed, suspend } = useRoundRobin(() => {
        if (connected) sendCommand(commandCodeMap.realTimeCommunication);
    })

    // 实时通信副作用逻辑
    useEffect(() => {
        proceed();
        return () => suspend();
    }, []);

    useEffect(() => {
        if (connected && receiveData.id === InstructionMap.GET_REALTIME_INFO) {
            const { current, currentL2, currentL3, voltage, leakage, deviceVoltage, led } = receiveData.data;
            setCurrent(current.toFixed(1));
            setCurrentL2(currentL2);
            setCurrentL3(currentL3);
            setVoltage(voltage.toFixed(1));
            setLeakage(leakage);
            setDeviceVoltage(deviceVoltage);
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
                <View className="data-item">
                    设备电流：
                    { (currentL2 && currentL3) ? (
                        <span>
                            <span>L1</span>{current}A
                            <span>L2</span>{currentL2}A
                            <span>L3</span>{currentL3}A
                        </span>
                    ) : <span>{current}A</span>}
                </View>
                <View>
                    主板电压：<span>{voltage}</span>V
                </View>
                <View>
                    设备电压：<span>{deviceVoltage}</span>V
                </View>
                <View>
                    设备漏电：<span>{leakage}</span>mA
                </View>
            </View>
            <View className="switch-group">
                <AtSwitch
                    disabled={!connected}
                    title="实时通信"
                    checked={realtime}
                    onChange={value => {
                        if (value) proceed();
                        else suspend();
                        setRealtime(value)
                    }}
                />
                <View className="switch-item on" onClick={() => {
                    if (wx.vibrateShort) wx.vibrateShort({ type: 'medium'});
                    sendCommand(commandCodeMap.openDevice)
                    Taro.atMessage({ message: '开机' })
                }}>开</View>
                <View className="switch-item off" onClick={() => {
                    sendCommand(commandCodeMap.closeDevice)
                    Taro.atMessage({ message: '关机' })
                }}>关</View>
            </View>
        </View>
    )
}

export default ControlPanel;
