//修正输入
export function strToUUID(str){
    const templ="0123456789-abcdefABCDEF";
    const len = str.length;
    if (len <= 0)return "";
    var mstr = "";
    for(let i=0; i<len; i++){
        if (templ.indexOf(str.charAt(i))<0){  //没有这个字符
            console.log("error = " + str.charAt(i))
        } else mstr += str.charAt(i)
    }
    return mstr
}

// ArrayBuffer转16进度字符串示例
export function ab2hex(buffer) {
    const hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2)+" "
        }
    )
    return (hexArr.join('')).toUpperCase();
}

export function ab2Str(arrayBuffer){
    let unit8Arr = new Uint8Array(arrayBuffer);
    return String.fromCharCode.apply(null, unit8Arr)
}

export function regSendData(hex) {
    return hex.match(/[\da-f]{2}/gi);
}
