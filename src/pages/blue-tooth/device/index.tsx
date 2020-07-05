import Taro, {useState, useEffect, useRouter, useCallback} from "@tarojs/taro";
import {Button, View} from "@tarojs/components";
import { useBlueToothDevice } from "@hooks/bluetooth-device";
import ControlPanel from "./control-panel";
import './index.scss'

function Device() {
    const router = useRouter();
    const { deviceId, name } = router.params;
    const [connectLoading, setConnectLoading] = useState(false);
    const [connected, message, connectDevice, disconnectDevice, sendCommander] = useBlueToothDevice();

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
            <ControlPanel sendCommand={command => sendCommander(command)} />
            <Button
                loading={connectLoading}
                className={`connect-btn ${connected ? 'on' : ''}`}
                onClick={handleConnect}
            >
                { connected ? '已连接/断开设备' : '未连接/连接设备'}
            </Button>
        </View>
    )
}

export default Device;
