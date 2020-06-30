import { View, Button } from "@tarojs/components";
import {
    AtButton, AtNoticebar, AtList,
    AtListItem, AtModalHeader, AtRadio,
    AtModalContent, AtModalAction, AtModal,
    AtInput, AtMessage, AtIcon,
} from 'taro-ui'
import './index.scss'



function BlueScan({ display }) {

    return (
        <View className={`index-${display}`}>
            <AtMessage />
            <AtNoticebar>已发现 {1} 个BLE设备</AtNoticebar>
            <View className='btn-group'>
                <Button
                    className="scan-btn setting"
                    onClick={() => {}}
                >
                    <AtIcon prefixClass='lw' value='setting' size='16' color='#6190E8' />
                </Button>
                <Button
                    className='scan-btn'
                    onClick={() => {}}
                >
                    停止扫描
                </Button>
                <Button
                    className='scan-btn main'
                    loading={true}
                    onClick={() => {}}
                >
                    扫描设备
                </Button>
            </View>
        </View>
    )
}

BlueScan.options = {
    addGlobalClass: true
}

export default BlueScan;
