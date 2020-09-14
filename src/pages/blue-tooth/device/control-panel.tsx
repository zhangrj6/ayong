import Taro, { useState } from '@tarojs/taro'
import { Text, View } from "@tarojs/components";
import { AtIcon, AtSwitch, AtButton } from "taro-ui";
import { commandCodeMap } from '@common/const/command-code';
import './index.scss';

function ControlPanel({ sendCommand, connected, receiveData }) {

    return (
        <View className="control-panel">
            <View className="indicator-lights">
                <View className="light-item">
                    <AtIcon prefixClass='lw' value='indicator-light' size='32' color='#bdbdbd' />
                    <Text>运行</Text>
                </View>
                <View className="light-item">
                    <AtIcon prefixClass='lw' value='indicator-light' size='32' color='#bdbdbd' />
                    <Text>待机</Text>
                </View>
                <View className="light-item">
                    <AtIcon prefixClass='lw' value='indicator-light' size='32' color='#bdbdbd' />
                    <Text>故障</Text>
                </View>
            </View>
            <View>
                <View>
                    电流：<span>0.0</span>A
                </View>
                <View>
                    电压：<span>11.5</span>V
                </View>
                <View>
                    漏电：<span>3.5</span>mA
                </View>
            </View>
            <View className="switch-group">
                <View>
                    <AtSwitch
                        disabled={!connected}
                        title="开关机"
                        onChange={(value) => sendCommand(value ? commandCodeMap.openDevice : commandCodeMap.closeDevice)}
                    />
                    <AtButton onClick={() => sendCommand(commandCodeMap.realTimeCommunication)}>测试实时数据</AtButton>
                </View>
            </View>
        </View>
    )
}

export default ControlPanel;
