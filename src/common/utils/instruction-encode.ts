export function genCheckCode(list) {
    return list.reduce((ret, num) => ret ^ parseInt(num, 16), 0).toString(16).toUpperCase();
}
/**
 * 校验码生成函数
 * @param list 数据码数组
 */
function EOR(list) {
    const checkCode = genCheckCode(list);
    return [...list, `0${checkCode}`.slice(-2)].join(' ');
}

function int2hex(value) {
    const hexStr = value.toString(16).toUpperCase();
    return `0${hexStr}`.slice(-2);
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
// 外接开关配置
export function genExternalSwitch(value) {
    const codeList = ['F8', '06', 'B5'];
    codeList.push(int2hex(value));
    codeList.push('00');
    return EOR(codeList);
}
// 一机多枪配置
export function genMutiMachineOneGun(value) {
    const codeList = ['F8', '06', 'A8'];
    codeList.push(int2hex(value));
    codeList.push('00');
    return EOR(codeList);
}
// 过载开启/关闭
export function genSwitchOverload(value) {
    const codeList = ['F8', '06', 'AA'];
    const hexCode = int2hex(value ? 0 : 1);
    codeList.push(hexCode);
    // 填充预留位
    codeList.push('00');
    return EOR(codeList);
}

// 漏电开启/关闭
export function genSwitchLeakage(value) {
    const codeList = ['F8', '06', 'AB'];
    const hexCode = int2hex(value ? 0 : 1);
    codeList.push(hexCode);
    // 填充预留位
    codeList.push('00');
    return EOR(codeList);
}

// 自动开启/关闭
export function genSwitchAuto(value) {
    const codeList = ['F8', '06', 'AC'];
    const hexCode = int2hex(value ? 0 : 1);
    codeList.push(hexCode);
    // 填充预留位
    codeList.push('00');
    return EOR(codeList);
}
