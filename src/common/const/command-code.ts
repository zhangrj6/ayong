export const commandCodeMap = {
    openDevice: 'F8 06 b6 01 00 49',
    closeDevice: 'F8 06 b7 01 00 48',
    readParamInfo: 'F8 06 E1 00 00 1F',
    setRatedCurrent: 'F8 06 A1 7D 00 22',
    setDelayShutdown: 'F8 06 A3 03 00 5E',
    realTimeCommunication: 'F8 06 E2 00 00 1C',
    wirelessMatch: 'F8 06 E8 00 00 16'
}

export const InstructionMap = {
    SET_RATED_CURRENT: 'A1',
    SET_DELAY_SHUTDOWN: 'A3',
    SET_DELAY_STARTUP: 'A2',
    SET_MONITOR_PERIOD: 'A4',
    SET_STANDBY_SHUTDOWN: 'A5',
    SET_OVERLOAD: 'AA',
    SET_LEAKAGE: 'AB',
    SET_AUTO: 'AC',
    SET_EXTERNAL_SWITCH: 'B5',
    SET_MUTI_MACHINE: 'A8',
    GET_PARAM_INFO: 'E1',
    GET_REALTIME_INFO: 'E2',
}

export const Prefix = {
    SINGLE_PHASE: 'F9',
    THREE_PHASE: 'FA',
}

export const CODE_MSG = {
        "B6": '开启控制器',
        "B7": '关闭控制器',
        "E1": '读取参数信息',
        "A1": '设置额定电流大小',
        "A2": '设置开枪启动延时时间',
        "A3": '设置关枪停机延时时间',
        "A4": '设置实时监测周期',
        "A5": '设置待机自动关机时间',
        "A6": '制造日期版本和年份',
        "A7": '制造日期月和日',
        "A8": '一机多枪设置',
        "A9": '对漏电值进行设定',
        "AA": '过载开关命令',
        "AB": '漏电开关命令',
        "AC": '手动自动运行选择',
        "AD": '设备持有选择',
        "AF": '控制配置选择',
        "AE": '允许无线开机命令',
        "B1": '换油功能选择',
        "B2": '第一次换油时间选择',
        "B3": '第二次换油时间选择',
        "B4": '按键启动不检测无线',
        "B5": '外接端口控制信号类型',
        "B8": '配置电源和分压电阻',
        "E3": '进入无线测试模式',
        "E4": '读取RSSI值',
        "E5": '停止无线测试模式',
        "E6": '对漏电进行校准',
        "E7": '实时读取从机信息',
        "E8": '进入无线配对模式',
}