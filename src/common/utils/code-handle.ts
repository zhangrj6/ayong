import { Prefix } from '../const/command-code';

// 组合高8位和低8位，转十进制除以除数
export function parse2Byte(high, low, division = 10) {
    const dec = parseInt(`${high}${low}`, 16);
    return dec / division;
}

// 信号灯颜色
export const color = {
    grep: '#bdbdbd',
    green: '#7fff00',
    yellow: '#ffd700',
    red: '#dc143c',
    blue: '#4169e1',
    purple: '#9400d3',
}
// 解析信号灯颜色
export function parseLed(led, prefix = Prefix.SINGLE_PHASE) {
    const ledObj = {
        run: color.grep, // 运行
        standby: color.grep, // 待机
        fault: color.grep, // 故障
        loss: color.grep, // 缺相
    }
    if (prefix === Prefix.SINGLE_PHASE) {
        ledObj.run = led & 0x01 ? color.green : color.grep;
        ledObj.standby = led & 0x02 ? color.yellow : color.grep;
        ledObj.fault = [color.grep, color.red, color.blue, color.purple][(led & 0x0c) >> 2];
    } else {
        ledObj.run = led & 0x02 ? color.green : color.grep;
        ledObj.standby = led & 0x04 ? color.yellow : color.grep;
        ledObj.fault = [color.grep, color.red, color.blue, color.purple][(led & 0x18) >> 2];
        ledObj.loss = led & 0x20 ? color.red : color.grep;
    }
    return ledObj;
}
