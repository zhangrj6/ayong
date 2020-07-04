import {Text, View} from "@tarojs/components";
import { AtIcon } from "taro-ui";

function Lights() {
    return (
        <View className="indicator-lights">
            <AtIcon prefixClass='lw' value='indicator-light' size='16' color='#000' />
            <Text>运行</Text>
        </View>
    )
}

export default Lights;
