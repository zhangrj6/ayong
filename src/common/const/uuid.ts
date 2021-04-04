// 模组类型
export const MODE_TYPE = {
    default: 'default',
    bt4502: 'bt4502',
    custom: 'custom',
};
// UUID 默认值
/**
 * 备选
 * 0000180a 设备信息
 * 0000ffc0 防劫持秘钥
 * 0000ff90 模块参数设置
 * 0000ffe0 透传数据通道
 * 00001800
 * 00001801
 */
export const defaultUuid = {
    serviceuuid: "0000FFE0-0000-1000-8000-00805F9B34FB",
    txduuid: "0000FFE1-0000-1000-8000-00805F9B34FB",
    rxduuid: "0000FFE1-0000-1000-8000-00805F9B34FB",
};

// UUID BT4502模组值
export const bt4502Uuid = {
    serviceuuid: "0000FFE0-0000-1000-8000-00805F9B34FB",
    txduuid: "0000FFE9-0000-1000-8000-00805F9B34FB",
    rxduuid: "0000FFE4-0000-1000-8000-00805F9B34FB",
};
