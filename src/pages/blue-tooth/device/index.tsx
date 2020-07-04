import { useRouter } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtIcon } from 'taro-ui'


function Device() {
    const router = useRouter();
    console.log(router);
    return (
        <View>
            <View className="indicator-lights">
                <AtIcon prefixClass='lw' value='indicator-light' size='16' color='#000' />
            </View>
        </View>
    )
}

export default Device;
