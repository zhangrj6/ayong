export const commandCodeMap = {
    openDevice: 'F8 06 b6 01 00 49',
    closeDevice: 'F8 06 b7 01 00 48',
    readParamInfo: 'F8 06 E1 00 00 1F',
    setRatedCurrent: 'F8 06 A1 7D 00 22',
    setDelayShutdown: 'F8 06 A3 03 00 5E',
}

function setRatedCurrent(value) {
    const current = value * 10;
    const hexStr = current.toString(16).toUpperCase();
    `000${hexStr}`.slice(-4)
}

function setDelayShutdown(value) {

}

export function parse2Byte(high, low, division = 10) {
    const dec = parseInt(`${high}${low}`, 16);
    return dec / division;
}
