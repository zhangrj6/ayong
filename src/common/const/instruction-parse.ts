import { parse2Byte } from './command-code';
// 解析指令中的通用信息
function parseCommonInfo(code) {
    const dataLength = parseInt(code[1], 16);
    return {
        prefix: code[0],
        dataLength,
        id: code[2],
        checkBit: code[dataLength - 1],
        sourceCode: code,
    }
}
// 解析参数信息
function parseParamInfo(code) {
    const commonInfo = parseCommonInfo(code);
    return {
        ...commonInfo,
        data: {
            ratedCurrent: parse2Byte(code[4], code[3], 10),
            delayShutdown: parseInt(code[6], 16),
        }
    }
}

const instructionParseMap = {
    'E1': parseParamInfo,
}

export function instructionParse(code) {
    const codeArray = code.split(' ');
    // 去掉最后一位空字符
    codeArray.pop()
    // 根据指令ID做进一步解析
    const id = codeArray[2];
    return instructionParseMap[id](codeArray);
}
