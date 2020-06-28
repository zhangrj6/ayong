import Taro, { useState } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import BlueScan from "component/blue-scan"
import { AtTabBar } from 'taro-ui'
import './index.scss'

// 枚举值和TabBar顺序有关
const TABBAR_ENUM = {
    home: 1,
    device: 0,
}

function Index() {
  const [current, setCurrent] = useState(TABBAR_ENUM.device);
  return (
      <View className='index'>
          { current == TABBAR_ENUM.home &&
            <Image
                src="cloud://luowang01-05e98.6c75-luowang01-05e98-1302520003/eu5lJs.png"
                style="height: 100vh;width: 100vw;"
            />
          }
          { current == TABBAR_ENUM.device &&
            <BlueScan />
          }
          <AtTabBar
              fixed
              tabList={[
                  { title: '控制器', iconType: 'equalizer' },
                  { title: '罗网', iconType: 'user' },
              ]}
              onClick={value => setCurrent(value)}
              current={current}
          />
      </View>
  )
}

Index.config = {
  navigationBarTitleText: '首页'
}

export default Index;
