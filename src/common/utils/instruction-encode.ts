/**
 * 校验码生成函数
 * @param list 数据码数组
 */
function EOR(list) {
    const checkCode = list.reduce((ret, num) => ret ^ parseInt(num, 16), 0).toString(16).toUpperCase();
    return [...list, checkCode].join(' ');
}

/**
 * 生成额定电流设置码
 * @param value 额定电流值
 */
export function genSetRatedCurrentCode(value) {
    const codeList = ['F8', '06', 'A1'];
    const current = value * 10;
    const hexStr = current.toString(16).toUpperCase();
    const hexValue = `000${hexStr}`.slice(-4);
    // 额定电流低八位
    codeList.push(hexValue.substr(2, 2));
    // 额定电流高八位
    codeList.push(hexValue.substr(0, 2));
    return EOR(codeList);
}

/**
 * 生成延迟关机设置码
 * @param value
 */
export function genSetDelayShutdown(value) {
    const codeList = ['F8', '06', 'A3'];
    const hexStr = Number(value).toString(16).toUpperCase();
    const hexValue = `0${hexStr}`.slice(-2);
    codeList.push(hexValue);
    // 填充预留位
    codeList.push('00');
    return EOR(codeList);
}

export function genSetDelayStartup(value) {
    const codeList = ['F8', '06', 'A2'];
    const delay = Number(value) / 0.5;
    const hexStr = delay.toString(16).toUpperCase();
    const hexValue = `0${hexStr}`.slice(-2);
    codeList.push(hexValue);
    // 填充预留位
    codeList.push('00');
    return EOR(codeList);
}

export function genSetMonitorPeriod(value) {
    const codeList = ['F8', '06', 'A4'];
    const hexStr = Number(value).toString(16).toUpperCase();
    const hexValue = `0${hexStr}`.slice(-2);
    codeList.push(hexValue);
    // 填充预留位
    codeList.push('00');
    return EOR(codeList);
}

export function genSetStandbyShutdown(value) {
    const codeList = ['F8', '06', 'A5'];
    const delay = Number(value) * 60;
    const hexStr = delay.toString(16).toUpperCase();
    const hexValue = `0${hexStr}`.slice(-2);
    codeList.push(hexValue);
    // 填充预留位
    codeList.push('00');
    return EOR(codeList);
}
