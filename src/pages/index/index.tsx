import Taro, {Component, Config} from '@tarojs/taro'
import {View, ScrollView} from '@tarojs/components'
import './index.scss'

interface Device {
    name: string,
    localName: string,
    RSSI: number,
    deviceId: string,
}
interface IState {
    devices: Array<Device>,
}
export default class Index extends Component<{}, IState> {

  /**
   * 指定config的类型声明为: Taro.Config
   *
   * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
   * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
   * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
   */
  config: Config = {
    navigationBarTitleText: '首页'
  };

  constructor(props) {
      super(props);
      this.state = {
          devices: [],
      }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  toComm = () => {};

  render () {
    const { devices } = this.state;
    return (
        <View className='index'>
            <View>
                <ScrollView
                    scrollY
                    scrollWithAnimation
                >
                    { devices.map((item) => (
                        <View
                            onClick={this.toComm}
                            data-name={item.name || item.localName}
                        >
                            <View>{item.name}</View>
                            <View>{item.RSSI}dBm</View>
                            <View>{item.deviceId}</View>
                        </View>
                    ))
                    }
                </ScrollView>
            </View>
        </View>
    )
  }
}
