import Taro, {useEffect, useState} from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtFloatLayout, AtInput, AtRadio } from "taro-ui";
// @ts-ignore
import { MODE_TYPE, defaultUuid, bt16Uuid } from "@common/const/uuid";

/**
 * 设置uuid，自定义uuid的修改需要持久化
 * @param showSetting
 * @param uuid
 * @constructor
 */
function SetUuid({ showSetting= false, onChangeUuid }) {
    const [modeType, setModeType] = useState(MODE_TYPE.default);
    const [customUuid, setCustomUuid] = useState(defaultUuid);

    useEffect(() => {
        // 从持久化数据中重置数据
        const modelType = Taro.getStorageSync('modeType');
        const customUuid = Taro.getStorageSync('customUuid');
        setModeType(modelType);
        setCustomUuid(customUuid || defaultUuid);
    }, []);

    const changeUuidInput = (value, event) => {
        const id = event.currentTarget.id;
        const uuid = event.currentTarget.value;
        if (uuid !== customUuid[id]) {
            setCustomUuid({ ...customUuid, [id]: uuid })
        }
        return value
    };

    const updateUuidInfoAtClose = () => {
        // 持久化模组类型
        Taro.setStorageSync('modeType', modeType);
        if (modeType === MODE_TYPE.custom) Taro.setStorageSync('customUuid', customUuid);
        const uuid = {
            [MODE_TYPE.defaultUuid]: defaultUuid,
            [MODE_TYPE.bt16]: bt16Uuid,
            [MODE_TYPE.custom]: customUuid,
        }[modeType];
        onChangeUuid(uuid);
    };

    return (
        <View>
            <AtFloatLayout
                title="设置模组"
                isOpened={showSetting}
                scrollY
                onClose={updateUuidInfoAtClose}
            >
                <AtRadio
                    options={[
                        { label: '常规模组', value: MODE_TYPE.default },
                        { label: 'BT16模组', value: MODE_TYPE.bt16 },
                        { label: '制定UUID', value: MODE_TYPE.custom },
                    ]}
                    value={modeType}
                    onClick={value => setModeType(value)}
                />
                <View>
                    <AtInput
                        name='serviceuuid'
                        editable={modeType === MODE_TYPE.custom}
                        title='Service'
                        type='text'
                        maxLength={37}
                        value={customUuid.serviceuuid}
                        onChange={changeUuidInput}
                    />
                    <AtInput
                        name='txduuid'
                        editable={modeType === MODE_TYPE.custom}
                        title='Notify'
                        type='text'
                        maxLength={37}
                        value={customUuid.txduuid}
                        onChange={changeUuidInput}
                    />
                    <AtInput
                        name='rxduuid'
                        editable={modeType === MODE_TYPE.custom}
                        title='Write'
                        type='text'
                        maxLength={37}
                        value={customUuid.rxduuid}
                        onChange={changeUuidInput}
                    />
                </View>
            </AtFloatLayout>
        </View>
    )
}

export default SetUuid;
