import Taro, { useState, useEffect, useRouter, useCallback, useDidHide } from "@tarojs/taro";
import { Button, View } from "@tarojs/components";
import { AtMessage } from 'taro-ui';
import io from '@common/utils/transferDevice'
import { commandCodeMap } from '@common/const/command-code'
import { getCodeTitle, getCodeKey } from '@hooks/tools'
import { useBlueToothDevice } from "@hooks/bluetooth-device";
import { analyticalParameters } from '@common/utils/instruction-decode';
import ControlPanel from "./control-panel";
import ConfigParams from "./config-params";
import StatusInfo from "./status-info";
import './index.scss'

function Device() {
    const router = useRouter();
    const { name, deviceId } = router.params;
    const {
        connected,
        connectLoading,
        connectDevice,
        disconnectDevice,
        sendCommander,
        receiveData,
        cacheData,
        errorMsg
    } = useBlueToothDevice();
    useEffect(() => {
        io.createRoom(deviceId)
        Taro.setNavigationBarTitle({ title: name })
        // 进入设备自动连接设备
        connectDevice(deviceId);
        Taro.removeStorageSync('voltageAdc_softwareVersion')
        return () => {
            // 退出当前页面时，若连接未断开则断开连接
            console.log('退出设备页面')
            disconnectDevice(deviceId);
            Taro.removeStorageSync('voltageAdc_softwareVersion')
            io.close() // 断开
        }
    }, [])

    io.listener = (socketData) => {
        const type = socketData.meta.target
        const data = socketData.data.payload
        // console.log('[socket]', type, data)
        // 命令处理
        if(type === 'send') {
            sendCommander(data.data, false)
        }
        if(type === 'get') {
            if(data.type === 'getRealTime') {
                let returnData = analyticalParameters(receiveData, cacheData);
                if(returnData.runtime) {
                    io.massMessage(returnData);
                }
                return;
            }
            sendCommander(commandCodeMap.readParamInfo, false);
            let returnData = analyticalParameters(receiveData, cacheData);
            if(returnData) {
                io.massMessage(returnData);
            }
        }
    }

    // 点击连接/断开连接，loading
    const handleConnect = useCallback(() => {
        if (connected) {
            disconnectDevice(deviceId);
        } else {
            connectDevice(deviceId,);
        }
    }, [connected])

    // receiveData 发生变化 通知出去消息

    useEffect(() => {
        if(errorMsg) {
            let code = getCodeKey(errorMsg.code)
            const msg = getCodeTitle(errorMsg.code) + errorMsg.msg
            Taro.atMessage({ message: msg, type: 'success' });
            // 发送到远程消息
            io.massMessage({
                code: '500',
                msg: msg
            });
          
        }
    }, [errorMsg]);

    useEffect(() => {
        let returnData = analyticalParameters(receiveData);
        if(returnData) {
            console.log(returnData);
            io.massMessage(returnData);
        }
    }, [receiveData])

    return (
        <View className="device">
            <AtMessage />
            <ControlPanel connected={connected} sendCommand={sendCommander} receiveData={receiveData} />
            <View className="device-status">
                <ConfigParams connected={connected} sendCommand={sendCommander} receiveData={receiveData} />
                <StatusInfo connected={connected} receiveData={receiveData} sendCommand={sendCommander} />
            </View>
            <Button
                loading={connectLoading}
                disabled={connectLoading}
                className={`connect-btn ${connected ? 'on' : ''}`}
                onClick={handleConnect}
            >
                <View>
                    <View className="btn-handle">{ connected ? '断开设备' : '连接设备'}</View>
                </View>
            </Button>
        </View>
    )
}

export default Device;
