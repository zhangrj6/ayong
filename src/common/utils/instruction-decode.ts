import { parse2Byte } from './code-handle';
import Taro from "@tarojs/taro";
import { parseLed, cfgControlModel } from './code-handle';
import { InstructionMap,  } from '../const/command-code';
import { genCheckCode } from './instruction-encode';

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
    const result = {
        ...commonInfo,
        data: {
            ratedCurrent: parse2Byte(code[4], code[3], 10),
            delayStartup: parseInt(code[5], 16) * 0.5, // 延时开机，后续单位都转化为秒（s）
            delayShutdown: parseInt(code[6], 16), // （s）
            monitorPeriod: parseInt(code[7], 16), // （min）
            standbyShutdown: parseInt(code[8], 16) / 60, // 待机关机时间（h）
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
            cntLeakage: parseInt(code[32], 16), // 漏电次数
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
            standby: [6, 11, 11][parseInt(code[52], 16)], // 三相备用
        }
    }
    console.log({
        isOverload:result.data.isOverload,
        isLeakage:result.data.isLeakage,
    })
    Taro.setStorageSync('systemInfo', result.data);
    return result;
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
function parseDelayStartup(code) {
    const commonInfo = parseCommonInfo(code);
    return {
        ...commonInfo,
        data: {
            delayStartup: parse2Byte(code[4], code[3], 1).toString(),
        }
    }
}

// 关枪停机延时
function parseDelayShutdown(code) {
    const commonInfo = parseCommonInfo(code);
    return {
        ...commonInfo,
        data: {
            delayShutdown: parse2Byte(code[4], code[3], 1).toString(),
        }
    }
}

// 实时监测周期
function parseMonitorPeriod(code) {
    const commonInfo = parseCommonInfo(code);
    return {
        ...commonInfo,
        data: {
            monitorPeriod: parse2Byte(code[4], code[3], 1).toString(),
        }
    }
}

// 待机自动关机时间
function parseStandbyShutdown(code) {
    const commonInfo = parseCommonInfo(code);
    return {
        ...commonInfo,
        data: {
            standbyShutdown: parse2Byte(code[4], code[3], 1).toString(),
        }
    }
}

// 开关
function parseSwitch(code) {
    const commonInfo = parseCommonInfo(code);
    return {
        ...commonInfo,
        data: {
            switchStatus: parse2Byte(code[4], code[3], 1).toString(),
        }
    }
}
// 读取实时数据信息
function parseRealTimeInfo(code) {
    const commonInfo = parseCommonInfo(code);
    const start_flag = parseInt(code[10], 16);
    let offsetValueBoard = 220 // 设备主板 偏差值

    // 获取全局存储的配置数据
    const systemInfo = Taro.getStorageSync('systemInfo');
    const KEY = ''
    /**
     * 设备实时数据
     */
    const runtime = {
        hour: systemInfo?systemInfo.runTime.hour:0,
        minute: parseInt(code[11], 16),
        second: parseInt(code[12], 16)
    }
    var softwareVersion  = systemInfo.softwareVersion 
    const VOLTAGEADC_KEY = 'voltageAdc_softwareVersion'
    /**
     * 电器实时数据
     */
    const currentRate = systemInfo.currentRate || 74; // 电流倍率
    const leakageCurrent = systemInfo.leakageCurrent || 1023; // 漏电参考值
    const resistanceRate = systemInfo.standby || 11; // 电阻比率
    
    // 是否显示漏电电流
    const isShowLeakage = parse2Byte(code[6], code[5], 1) > 10;
    // 主板电压
    const boardVoltage = parse2Byte(code[8], code[7], 1023 / (3.3 * resistanceRate));
    // 获取软件版本号，来判断是变压器，还是开关电源(5,6变压器，其余为开关电源)
    const vchanger = [5];
    const flag = softwareVersion.toString()[1];
    // 判断
    let isThreeVersion = (softwareVersion.toString()[0] * 1) % 2 == 0// 基数 单项 220v 偶数三项  380v
    if(isThreeVersion) { // 三项判断
        if(start_flag * 1) { 
            offsetValueBoard = 380 / 352 // 开机
        } else {
            offsetValueBoard = 380 / 524 // 关机
        }
    } else {
        if(start_flag * 1) { 
            offsetValueBoard = 220 / 342 // 开机
        } else {
            offsetValueBoard = 220 / 530 // 关机
        }
    }
    // 电流信息
    const current = parse2Byte(code[4], code[3], currentRate / 10)

    const voltageAdc = parse2Byte(code[8], code[7], 1)

    if(voltageAdc > 400 && start_flag == 0) {
        Taro.setStorageSync(VOLTAGEADC_KEY, true)
        console.log("voltageAdc", voltageAdc)
    }

    const voltageAdc_status = Taro.getStorageSync(VOLTAGEADC_KEY);
    console.log(voltageAdc_status, "voltageAdc_status")
    return {
        ...commonInfo,
        data: {
            runtime,
            current: current,
            currentL2: commonInfo.prefix === 'FA' ? parse2Byte(code[18], code[17], currentRate / 10).toFixed(1) : '',
            currentL3: commonInfo.prefix === 'FA' ? parse2Byte(code[20], code[19], currentRate / 10).toFixed(1) : '',
            leakage: isShowLeakage ? parse2Byte(code[6], code[5], leakageCurrent / 30).toFixed(1) : '0',
            voltage: boardVoltage,
            deviceVoltage: (vchanger.findIndex(e => e == flag) > -1) || voltageAdc_status ? (voltageAdc * offsetValueBoard).toFixed(1) : '不支持',
            led: code[9],
        }
    }
}

// 返回码-指令解析
const instructionParseMap = {
    [InstructionMap.GET_PARAM_INFO]: parseParamInfo, // 读取参数信息
    [InstructionMap.GET_REALTIME_INFO]: parseRealTimeInfo, // 读取实时数据
    [InstructionMap.SET_RATED_CURRENT]: parseRatedCurrent, // 设置额定电流
    [InstructionMap.SET_DELAY_STARTUP]: parseDelayStartup, // 设置开枪启动延时
    [InstructionMap.SET_DELAY_SHUTDOWN]: parseDelayShutdown, // 设置关枪停机延时
    [InstructionMap.SET_MONITOR_PERIOD]: parseMonitorPeriod, // 设置实时监测周期
    [InstructionMap.SET_STANDBY_SHUTDOWN]: parseStandbyShutdown, // 设置待机自动关机时间
    [InstructionMap.SET_AUTO]: parseSwitch,
    [InstructionMap.SET_LEAKAGE]: parseSwitch,
    [InstructionMap.SET_OVERLOAD]: parseSwitch,
    [InstructionMap.SET_EXTERNAL_SWITCH]: parseSwitch,
    [InstructionMap.SET_MUTI_MACHINE]: parseSwitch,
}

// 解析指令返回码策略
export function instructionParseStrategy(code) {
    const codeArray = code.split(' ');
    // 去掉最后一位空字符
    codeArray.pop()
    // 提取指令ID
    const id = codeArray[2];
    // 根据校验位校验接收到的数据
    const checkResult = genCheckCode(codeArray);
    if (!checkResult) return null;
    // 校验通过，是否有对应的指令解析方法
    if (!instructionParseMap[id]) return {};
    return instructionParseMap[id](codeArray);
}



// 解析所有的socket 参数

export function analyticalParameters(receiveData, code) {
    let data = receiveData
    if(data.id) {
        switch(data.id) {
            case InstructionMap.GET_REALTIME_INFO: // 机器信息
                const { current, currentL2, currentL3, voltage, leakage, deviceVoltage, led, runtime } = receiveData.data;
                const ledObj = parseLed(parseInt(led, 16), receiveData.prefix)
                data = {
                    status: {
                        //run: '', //运行颜色
                        //standby: '', // 待机颜色
                        //fault: '', // 故障颜色
                        //loss: '', // 缺项颜色
                        ...ledObj
                    },
                    info: {
                        currentL:[current, currentL2, currentL3], // 设备电流
                        voltage: voltage, // 主板电压
                        deviceVoltage: deviceVoltage, // 设备电压
                        leakage: leakage, // 设备漏电
                    },
                    runtime: `${runtime.hour}小时${runtime.minute}分钟${runtime.second}秒` // 电机运转时间
                }
            break;

            case InstructionMap.SET_RATED_CURRENT: // 额定电流设置成功
                    return {
                        ratedCurrent: receiveData.data.ratedCurrent
                    }
                case InstructionMap.SET_DELAY_STARTUP: // 开枪延时开机设置成功
                    return {
                        delayStartup: Number(receiveData.data.delayStartup)/2)
                    }
                case InstructionMap.SET_DELAY_SHUTDOWN: // 关枪延时关机设置成功
                    return {
                        delayShutdown: Number(receiveData.data.delayShutdown)
                    }
                case InstructionMap.SET_MONITOR_PERIOD: // 实时监测周期设置成功
                    return {
                        monitorPeriod: Number(receiveData.data.monitorPeriod)
                    }
                case InstructionMap.SET_STANDBY_SHUTDOWN:// 待机自动关机设置成功
                    return {
                        standbyShutdown: Number(receiveData.data.standbyShutdown)/60
                    }
                case InstructionMap.SET_MUTI_MACHINE: // 一机多枪设置成功
                    return {
                        mutlMachineOneGun: Number(String(receiveData.data.switchStatus)[0])
                    }
                case InstructionMap.SET_EXTERNAL_SWITCH: // 外部开关设置成功
                    return {
                        externalSwitchType: Number(receiveData.data.switchStatus)
                    }
                case InstructionMap.SET_LEAKAGE: // 漏电开关打开设置成功
                    return {
                        isLeakage: receiveData.data.switchStatus * 1 !== 1,
                    }
                case InstructionMap.SET_OVERLOAD: // 过载开关打开设置成功
                    return {
                        isOverload: receiveData.data.switchStatus * 1 !== 1,
                    }
                case InstructionMap.SET_AUTO: // 自动开关打开
                    const statusAuto = [1,2].findIndex(e => e === receiveData.data.switchStatus * 1) < 0;
                    return {
                        isAutoFlag: statusAuto,
                    }
                case InstructionMap.GET_PARAM_INFO:
                    const { delayShutdown, 
                        ratedCurrent, delayStartup, 
                        standbyShutdown, monitorPeriod, externalSwitchType, isOverload,  
                        cntOverload, cntLeakage, softwareVersion, controlConfig 
                    } = receiveData.data
                        const itemControlModel = cfgControlModel.find(e => e.value == controlConfig);
                    return {
                        delayShutdown, // 关枪延时关机
                        ratedCurrent, // 额定工作电流
                        delayStartup, // 开枪延时开机
                        standbyShutdown, // 待机自动关机
                        monitorPeriod, // 实时监测周期
                        externalSwitchType, // 外接开关配置
                        mutlMachineOneGun: Number(String(parseInt(receiveData.data.wireless.config, 16))[0]), // 一机多枪配置 
                        isOverload: isOverload !== 1, // 过载保护开关
                        isLeakage: receiveData.data.isLeakage !== 1, //漏电保护开关
                        isAutoFlag : [1,2].findIndex(e => e === receiveData.data.isAutoFlag * 1) < 0), //自动运行开关
                        cntOverload, // 漏电次数
                        cntLeakage, // 过载次数
                        softwareVersion, // 软件版本号
                        itemControlModel: itemControlModel ? itemControlModel.label : '--', // 控制模式
                        controlConfig, // 匹配模式
                    }
        }
        return {code, ...data}
    }

    return null
}