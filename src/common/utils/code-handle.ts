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
    if (prefix === Prefix.SINGLE_PHASE) {
        ledObj.run = led & 0x01 ? color.green : color.grep;
        ledObj.standby = led & 0x02 ? color.yellow : color.grep;
        ledObj.fault = [color.grep, color.red, color.blue, color.purple][(led & 0x0c) >> 2];
    } else {
        if (isDigital) {
            ledObj.run = led & 0x08 ? color.green : color.grep;
            ledObj.standby = led & 0x10 ? color.yellow : color.grep;
            ledObj.fault = [color.white, color.grep, color.grep, color.green, color.purple, color.blue, color.red, color.grep][(led & 0x07)];
        } else {
            ledObj.run = led & 0x02 ? color.green : color.grep;
            ledObj.standby = led & 0x04 ? color.yellow : color.grep;
            ledObj.fault = [color.grep, color.red, color.blue, color.purple][(led & 0x18) >> 2];
            ledObj.loss = led & 0x20 ? color.red : color.grep;
        }
    }
    return ledObj;
}
