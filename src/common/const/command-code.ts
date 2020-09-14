export const commandCodeMap = {
    openDevice: 'F8 06 b6 01 00 49',
    closeDevice: 'F8 06 b7 01 00 48',
    readParamInfo: 'F8 06 E1 00 00 1F',
    setRatedCurrent: 'F8 06 A1 7D 00 22',
    setDelayShutdown: 'F8 06 A3 03 00 5E',
    realTimeCommunication: 'F8 06 E2 00 00 1C',
}

export const InstructionMap = {
    SET_RATED_CURRENT: 'A1',
    SET_DELAY_SHUTDOWN: 'A3',
    SET_DELAY_STARTUP: 'A2',
    SET_MONITOR_PERIOD: 'A4',
    SET_STANDBY_SHUTDOWN: 'A5',
    GET_PARAM_INFO: 'E1',
    GET_REALTIME_INFO: 'E2',
}

export const Prefix = {
    SINGLE_PHASE: 'F9',
    THREE_PHASE: 'FA',
}
