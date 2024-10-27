import Taro, { useEffect, useState } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import BlueScan from "@components/blue-scan"
import { parseLed } from '@common/utils/code-handle'
import { AtTabBar } from 'taro-ui'
import './index.scss'

// 枚举值和TabBar顺序有关
const TABBAR_ENUM = {
    home: 1,
    device: 0,
};


function Index() {
  const [current, setCurrent] = useState(TABBAR_ENUM.device);
  // useEffect(() => {
  //   let token =  Taro.getStorageSync('token')
  //   if(!token) {
  //       Taro.navigateTo({
  //           url: '../login/index'
  //       })
  //   }
  // }, [])
  return (
      <View className='index'>
          {/* <Image
              src="cloud://luowang01-05e98.6c75-luowang01-05e98-1302520003/eu5lJs.png"
              style={`height: calc(100vh - 60px);width: 100vw;${current != TABBAR_ENUM.home ? 'display: none' : ''}`}
          /> */}
          <BlueScan display={current == TABBAR_ENUM.device} />
          {/* <AtTabBar
              fixed
              fontSize={10}
              iconSize={20}
              tabList={[
                  { title: '控制器', iconType: 'equalizer' },
                //   { title: '罗网', iconType: 'user' },
              ]}
              onClick={value => setCurrent(value)}
              current={current}
          /> */}
      </View>
  )
}

Index.config = {
  navigationBarTitleText: '首页'
}

export default Index;
