import { useState, useEffect, useCallback } from "@tarojs/taro";
import { instructionParseStrategy } from "@common/utils/instruction-decode";

export function useBluetoothDataProcess() {
    const [loading, setLoading] = useState(false);
    // notify所要接收的数据
    const [receiveTmp, setReceiveTmp] = useState({
        dataLength: 0,
        receivedDataLength: 0,
        receiveData: '',
    })
    const [resultData, setResultData] = useState({});

    // 解析指令
    const parseInstruction = useCallback(() => {
        // 当数据处理完毕，且所要处理的数据有效不为空时，再进行指令解析
        if (receiveTmp.receiveData.length > 0) {
            const result = instructionParseStrategy(receiveTmp.receiveData);
            console.log('result', result);
            setResultData(result);
        }
    }, [receiveTmp]);

    const processReceiveData = useCallback(res => {
        const curRecLength = res.length / 3; // 3 表示2位十六进制数和1位空格
        // 首次数据接收，读取数据长度
        if (receiveTmp.dataLength === 0) {
            const dataLength = parseInt(res.substring(3,5), 16);
            receiveTmp.receiveData = res;
            // 判断当次数据是否获取完毕
            if (dataLength > curRecLength) {
                receiveTmp.dataLength = dataLength;
                receiveTmp.receivedDataLength = curRecLength;
            } else {
                receiveTmp.dataLength = 0;
                // TODO 数据校验
                parseInstruction()
            }
        } else {
            // 接收未获取完成的数据
            receiveTmp.receiveData = receiveTmp.receiveData + res;
            // 还有未接收的数据
            if (receiveTmp.dataLength > curRecLength + receiveTmp.receivedDataLength) {
                receiveTmp.receivedDataLength = curRecLength + receiveTmp.receivedDataLength;
            } else {
                receiveTmp.dataLength = 0;
                receiveTmp.receivedDataLength = 0;
                // TODO 数据校验
                parseInstruction()
            }
        }
    }, [receiveTmp]);

    return {
        loading,
        resultData,
        processReceiveData,
    }
}
