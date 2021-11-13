import io from './socket';
import request from '../../request';


class proxySocket {
        io: any

        roomId: any

        constructor() {
                // 
        }

        listener(msg) {
                // console.log('收到了消息', msg);
        }

        // roomid 蓝牙id
        createRoom(roomId, fun) {
                // 存在先关闭之前的
                this.roomId = roomId
                return new Promise((resolve, reject) => {
                        // if(this.io) {
                        //         this.close()
                        // }
                        this.io = io(request.openUrl +"/io?machine=" + roomId, {transports: ['websocket']});
                        this.io.on('connect', () => {
                                // 通知服务器 即时通信开始
                                this.io.emit('exchange', {
                                        target: 'open',
                                        payload: {
                                                status : 1,
                                        },
                                });
                                // 主服务器创建房间
                                this.io.emit('exchange', {
                                        target: 'create',
                                        payload: {
                                        room : roomId,
                                        },
                                });

                                this.io.on('change', msg => {
                                        this.listener(msg);
                                        fun && fun(msg)
                                });
                                this.io.on('send', msg => {
                                        this.listener(msg);
                                        fun && fun(msg)
                                });
                                this.io.on('get', msg => {
                                        this.listener(msg);
                                        fun && fun(msg)
                                });
                                resolve()
                        })
                })
             
        }

        // 给所有在当前房间的朋友发送消息
        massMessage(object) {
                this.io.emit('exchange', {
                        target: 'change',
                        payload: {
                                room : this.roomId,
                                msg: object
                        },
                })
        }
        // 关闭房间
        close() {
            this.io.close()
        }
        
}


export default new proxySocket();