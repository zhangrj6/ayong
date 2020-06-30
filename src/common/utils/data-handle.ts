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
