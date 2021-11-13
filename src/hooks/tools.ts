import { useEffect, useRef } from "@tarojs/taro"
import { CODE_MSG } from '@common/const/command-code'

export function useRoundRobin(callback, period = 400) {
    const timer = useRef<NodeJS.Timeout | undefined>()
    const latestCallback = useRef(() => {})
    useEffect(() => {
        latestCallback.current = callback;
    })
    const proceed = () => {
        if (!timer.current) {
            timer.current = setInterval(() => latestCallback.current(), period);
        }
    };
    const suspend = () => {
        timer.current && clearInterval(timer.current);
        timer.current = undefined;
    };
    return {
        suspend,
        proceed,
    }
}

export function getCodeKey(code) {
    if(code.split(" ").length > 2) return code.split(" ")[2].toLocaleUpperCase();
    return null
}
export function getCodeTitle(code) {
    const key = getCodeKey(code);
    if(CODE_MSG[key]) {
        return CODE_MSG[key]
    } else {
        return '未知操作'
    }
}