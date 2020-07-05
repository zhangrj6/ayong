import Taro, { useState } from '@tarojs/taro'
import { Text, View } from "@tarojs/components";
import { AtIcon, AtSwitch } from "taro-ui";
import { commandCodeMap } from '@common/const/command-code';
import './index.scss';

function ControlPanel({ sendCommand }) {
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
            <View className="switch-group">
                <View>
                    <AtSwitch title="开关机" onChange={(value) => sendCommand(value ? commandCodeMap.openDevice : commandCodeMap.closeDevice)} />
                </View>
                <View>
                    <AtSwitch title="开关枪" border={false} onChange={() => {}} />
                </View>
            </View>
        </View>
    )
}

export default ControlPanel;
