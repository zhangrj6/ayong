import { parse2Byte } from './code-handle';
// 解析指令中的通用信息
function parseCommonInfo(code) {
    const dataLength = parseInt(code[1], 16);
    return {
        prefix: code[0], // 码头
        dataLength, // 数据长度
        id: code[2], // 指令id
        checkBit: code[dataLength - 1], // 校验位
        sourceCode: code, // 源码
    }
}
// 解析读取参数信息
function parseParamInfo(code) {
    const commonInfo = parseCommonInfo(code);
    return {
        ...commonInfo,
        data: {
            ratedCurrent: parse2Byte(code[4], code[3], 10),
            delayStartup: parseInt(code[5], 16) * 0.5, // 延时开机，后续单位都转化为秒（s）
            delayShutdown: parseInt(code[6], 16), // （s）
            monitorPeriod: parseInt(code[7], 16) * 60, // （s）
            standbyShutdown: parseInt(code[8], 16) * 60, // 待机关机时间（s）
            currentRate: parseInt(code[9], 16), // 电流倍率
            hardwareVersion: parseInt(code[10], 16) / 10, // 硬件版本号
            manufactureDate: {
                year: parseInt(code[11], 16) + 2000,
                month: parseInt(code[12], 16),
                day: parseInt(code[13], 16)
            },
            softwareVersion: parse2Byte(code[15], code[14], 1), // 软件版本号
            judgment: parseInt(code[16], 16), // 真伪判定
            wireless: {
                config: code[17], // 无线配置
                status: code[18], // 无线状态
                channel: parseInt(code[19], 16), // 无线频道
                cntOperator: parse2Byte(code[38], code[37], 1), // 无线操作次数
                cntOperatorFlag: parseInt(code[39], 16), // 无线操作次数标志位，数值乘以65536再加上16位的停机次数，才是总的停机次数
                canStartup: parseInt(code[43], 16), // 是否允许无线开机
            },
            retransmission: parseInt(code[20], 16) + 3, // 重传次数
            runTime: { // 运行时长
                hour: parse2Byte(code[22], code[21], 1),
                min: parseInt(code[23], 16),
                sec: parseInt(code[25], 16),
            },
            leakageCurrent: parse2Byte(code[28], code[27], 1), // 漏电值
            isOverload: parseInt(code[29], 16), // 过载保护开关
            isLeakage: parseInt(code[30], 16), // 漏电保护开关
            cntOverload: parseInt(code[31], 16), // 过载次数
            cntLeakage: parseInt(code[32], 16), // 漏电保护开关
            peakCurrent: parse2Byte(code[34], code[33], 1), // 峰值电流，除以电流倍率再乘以10，所得结果保留1位小数即峰值电流，值为0的时候显示无；
            isAutoFlag: parseInt(code[35], 16), // 1和2表示手动运行，0和其他值表示自动运行；
            controlConfig: parseInt(code[36], 16), // 控制配置
            cntShutdown: parse2Byte(code[41], code[40], 1), // 停机次数
            cntShutdownFlag: parseInt(code[42], 16), // 数值乘以65536再加上16位的停机次数，才是总的停机次数；
            changeOil: {
                func: parseInt(code[44], 16), // 换油功能选择
                cnt: parseInt(code[45], 16), // 换油次数统计
                first: parseInt(code[46], 16), // 第一次换油时间（h）
                second: parseInt(code[47], 16) * 10, // 第二次换油时间（h）
                last: parse2Byte(code[49], code[48], 1),
            },
            isCheckSwitch: parseInt(code[50], 16), // 是否检测按键开关
            externalSwitchType: parseInt(code[51], 16), // 外接控制开关类型
            standby: parseInt(code[52], 16), // 三相备用
        }
    }
}

// 解析额定电流
function parseRatedCurrent(code) {
    const commonInfo = parseCommonInfo(code);
    return {
        ...commonInfo,
        data: {
            ratedCurrent: parse2Byte(code[4], code[3], 10),
        }
    }
}

// 开枪启动延时
function parseDelayStartup() {
    return {}
}

// 关枪停机延时
function parseDelayShutdown() {
    return {}
}

// 实时监测周期
function parseMonitorPeriod() {
    return {}
}

// 待机自动关机时间
function parseStandbyShutdown() {

}

// 返回码-指令解析
const instructionParseMap = {
    'E1': parseParamInfo, // 读取参数信息
    'A1': parseRatedCurrent, // 设置额定电流
    'A2': parseDelayStartup, // 设置开枪启动延时
    'A3': parseDelayShutdown, // 设置关枪停机延时
    'A4': parseMonitorPeriod, // 设置实时监测周期
    'A5': parseStandbyShutdown, // 设置待机自动关机时间
}

// 解析指令返回码策略
export function instructionParseStrategy(code) {
    const codeArray = code.split(' ');
    // 去掉最后一位空字符
    codeArray.pop()
    // 提取指令ID
    const id = codeArray[2];
    return instructionParseMap[id](codeArray);
}
