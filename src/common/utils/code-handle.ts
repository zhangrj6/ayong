// 组合高8位和低8位，转十进制除以除数
export function parse2Byte(high, low, division = 10) {
    const dec = parseInt(`${high}${low}`, 16);
    return dec / division;
}
