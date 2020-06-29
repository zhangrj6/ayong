import { View } from "@tarojs/components";
import {
    AtButton, AtNoticebar, AtList,
    AtListItem, AtModalHeader, AtRadio,
    AtModalContent, AtModalAction, AtModal,
    AtInput, AtMessage,
} from 'taro-ui'
import './index.scss'



function BlueScan({ display }) {

    return (
        <View className={`index-${display}`}>
            <AtMessage />
            <AtNoticebar>已发现 {1} 个BLE设备</AtNoticebar>
            <View className='btn-group'>
                <AtButton
                    className='btn'
                    type='primary'
                    loading={true}
                    onClick={() => {}}
                >
                    扫描设备
                </AtButton>
                <AtButton
                    className='btn'
                    type='secondary'
                    onClick={() => {}}
                >
                    停止扫描
                </AtButton>
                <AtButton
                    className='btn'
                    type='secondary'
                    onClick={() => {}}
                >
                    设置UUID
                </AtButton>
            </View>
        </View>
    )
}

export default BlueScan;
