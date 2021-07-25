import { Prefix } from '../const/command-code';
import Taro from "@tarojs/taro";

// 组合高8位和低8位，转十进制除以除数
export function parse2Byte(high, low, division = 10) {
    const dec = parseInt(`${high}${low}`, 16);
    return dec / division;
}

// 信号灯颜色
export const color = {
    grep: '#bdbdbd', // 灰
    green: '#7fff00', // 绿
    yellow: '#ffd700', // 黄
    red: '#dc143c', // 红
    blue: '#4169e1', // 蓝
    purple: '#9400d3', // 紫
    white: '#ffffff', // 白
}
// 解析信号灯颜色
export function parseLed(led, prefix = Prefix.SINGLE_PHASE) {
    const ledObj = {
        run: '', // 运行
        standby: '', // 待机
        fault: '', // 故障
        loss: '', // 缺相
    }
    // 获取软件版本号，以判断是否为数显模式
    const systemInfo = Taro.getStorageSync('systemInfo');
    const isDigital = systemInfo.softwareVersion.toString()[1] === '5';
    // 处理灯色逻辑
    if (isDigital) {
        ledObj.run = led & 0x08 ? color.green : color.grep;
        ledObj.standby = led & 0x10 ? color.yellow : color.grep;
        ledObj.fault = [color.white, color.grep, color.grep, color.green, color.purple, color.blue, color.red, color.grep][(led & 0x07)];
    } else {
        if(prefix === Prefix.SINGLE_PHASE) {
            ledObj.run = led & 0x01 ? color.green : color.grep;
            ledObj.standby = led & 0x02 ? color.yellow : color.grep;
            ledObj.fault = [color.grep, color.red, color.blue, color.purple][(led & 0x0c) >> 2];
        } else {
            ledObj.run = led & 0x02 ? color.green : color.grep;
            ledObj.standby = led & 0x04 ? color.yellow : color.grep;
            ledObj.fault = [color.grep, color.red, color.blue, color.purple][(led & 0x18) >> 2];
            ledObj.loss = led & 0x20 ? color.red : color.grep;
        }
    }
    return ledObj;
}


// 一机多枪
export const cfgMutlMachine = [
    { label: '一机一枪', value: 0 },
    { label: '一机多枪', value: 128 },
    // { label: '互连一机多枪带跳频', value: 144 },
    // { label: '独立一机多枪不跳频', value: 160 },
    // { label: '独立一机多枪带跳频', value: 176 },
]

// 外部开关
export const cfgExternalSwitch = [
    { label: '手自转换开关', value: 0 },
    { label: '启动停止开关', value: 1 },
    { label: '缺水保护开关', value: 2 },
]

export const cfgControlModel = [
    { label: '自动无线控制', value: 0 },
    { label: '自动常开控制', value: 1 },
    { label: '自动常闭控制', value: 2 },
    { label: '手动控制', value: 3 },
    { label: '无线故障', value: 4 },
]
