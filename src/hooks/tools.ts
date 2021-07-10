import { useEffect, useRef } from "@tarojs/taro"

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
