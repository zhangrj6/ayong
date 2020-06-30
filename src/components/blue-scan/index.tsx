import { useState } from "@tarojs/taro";
import { View, Button } from "@tarojs/components";
import {
    AtNoticebar, AtList, AtFloatLayout,
    AtListItem, AtModalHeader, AtRadio,
    AtModalContent, AtModalAction, AtModal,
    AtInput, AtMessage, AtIcon, AtAccordion,
} from 'taro-ui'
import { MODE_TYPE, defaultUuid, bt16Uuid } from './const';
import './index.scss'


function BlueScan({ display }) {
    const [loadingScan, setLoadingScan] = useState(false); // 是否正在扫描设备中
    const [showSetting, setShowSetting] = useState(false); // 是否显示模组设置
    const [modeType, setModeType] = useState(MODE_TYPE.default);
    const [uuid, setUuid] = useState(defaultUuid);

    function switchModeType(value) {
        setModeType(value)
    }

    return (
        <View className={`index-${display}`}>
            <AtMessage />
            <AtFloatLayout
                title="设置模组"
                isOpened={showSetting}
                scrollY
                onClose={() => setShowSetting(false)}
            >
                <AtRadio
                    options={[
                        { label: '常规模组', value: MODE_TYPE.default },
                        { label: 'BT16模组', value: MODE_TYPE.bt16 },
                        { label: '制定UUID', value: MODE_TYPE.custom },
                    ]}
                    value={modeType}
                    onClick={value => switchModeType(value)}
                />
                <View>
                    <AtInput
                        name='service'
                        editable={modeType === MODE_TYPE.custom}
                        title='Service'
                        type='text'
                        maxLength={37}
                        value={uuid.serviceuuid}
                        onChange={this.bindReplaceInput}
                        onClick={() => {}}
                    />
                    <AtInput
                        name='notify'
                        editable={modeType === MODE_TYPE.custom}
                        title='Notify'
                        type='text'
                        maxLength={37}
                        value={uuid.txduuid}
                        onChange={this.bindReplaceInput}
                        onClick={() => {}}
                    />
                    <AtInput
                        name='write'
                        editable={modeType === MODE_TYPE.custom}
                        title='Write'
                        type='text'
                        maxLength={37}
                        value={uuid.rxduuid}
                        onChange={this.bindReplaceInput}
                        onClick={() => {}}
                    />
                </View>
            </AtFloatLayout>
            <AtNoticebar>已发现 {1} 个BLE设备</AtNoticebar>
            <View className='btn-group'>
                <Button className="scan-btn setting" onClick={() => setShowSetting(true)}>
                    <AtIcon prefixClass='lw' value='setting' size='16' color='#fff' />
                </Button>
                { loadingScan &&
                    <Button
                        className='scan-btn'
                        onClick={() => {}}
                    >
                        停止扫描
                    </Button>
                }
                <Button
                    className='scan-btn main'
                    loading={loadingScan}
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
