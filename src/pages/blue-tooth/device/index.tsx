import Taro, {useState, useEffect, useRouter, useCallback} from "@tarojs/taro";
import {Button, View} from "@tarojs/components";
import { useBlueToothDevice } from "@hooks/bluetooth-device";
import ControlPanel from "./control-panel";
import ConfigParams from "./config-params";
import './index.scss'

function Device() {
    const router = useRouter();
    const { deviceId, name } = router.params;
    const [connectLoading, setConnectLoading] = useState(false);
    const {connected, message, connectDevice, disconnectDevice, sendCommander, receiveData} = useBlueToothDevice();

    console.log('connected', connected)
    useEffect(() => {
        Taro.setNavigationBarTitle({ title: name })
    }, [])

    useEffect(() => {
        setConnectLoading(false);
    }, [connected])

    // 点击连接/断开连接，loading
    const handleConnect = useCallback(() => {
        setConnectLoading(true);
        if (connected) {
            disconnectDevice(deviceId);
        } else {
            connectDevice(deviceId);
        }
    }, [connected])

    return (
        <View className="device">
            <ControlPanel connected={connected} sendCommand={sendCommander} />
            <ConfigParams connected={connected} sendCommand={sendCommander} receiveData={receiveData} />
            <Button
                loading={connectLoading}
                className={`connect-btn ${connected ? 'on' : ''}`}
                onClick={handleConnect}
            >
                { connected
                    ? (
                        <View>
                            <View className="btn-handle">断开设备</View>
                            <View className="btn-status">(当前状态：已连接)</View>
                        </View>
                    ) : (
                        <View>
                            <View className="btn-handle">连接设备</View>
                            <View className="btn-status">(当前状态：未连接)</View>
                        </View>
                    )}
            </Button>
        </View>
    )
}

export default Device;
