export function isUUID(str) {
    var div = str.split("-",-1);
    if (div.length != 5) return false;
    if ((div[0].length != 8) || (div[1].length != 4) || (div[2].length != 4) || (div[3].length != 4) || (div[4].length != 12)) return false;
    return true
}
//修正输入
export function strToUUID(str){
    var templ="0123456789-abcdefABCDEF";
    var len = str.length;
    if(len<=0)return "";
    var i;
    var mstr="";
    for(i=0;i<len;i++){
        if (templ.indexOf(str.charAt(i))<0){  //没有这个字符
            console.log("error = " + str.charAt(i))
        } else mstr += str.charAt(i)
    }
    return mstr
}
// ArrayBuffer转16进度字符串示例
export function ab2hex(buffer) {
    var hexArr = Array.prototype.map.call(
        new Uint8Array(buffer),
        function (bit) {
            return ('00' + bit.toString(16)).slice(-2)+" "
        }
    )
    return (hexArr.join('')).toUpperCase();
}
export function ab2Str(arrayBuffer){
    let unit8Arr = new Uint8Array(arrayBuffer);
    let encodedString = String.fromCharCode.apply(null, unit8Arr);
    return encodedString
}
export function stringToBytes(str) {
    var ch, st, re = [];
    for (var i = 0; i < str.length; i++) {
        ch = str.charCodeAt(i);  // get char
        st = [];                 // set up "stack"
        do {
            st.push(ch & 0xFF);  // push byte to stack
            ch = ch >> 8;          // shift value down by 1 byte
        }
        while (ch);
        // add stack contents to result
        // done because chars have "wrong" endianness
        re = re.concat(st.reverse());
    }
    // return an array of bytes
    return re;
}

export function regSendData(hex) {
    return hex.match(/[\da-f]{2}/gi);
}
