import Taro, {Component, Config} from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtTabBar } from 'taro-ui'
import './index.scss'

interface IState {
    current: number,
}
export default class Index extends Component<{}, IState> {

  /**
   * 指定config的类型声明为: Taro.Config
   * https://imgchr.com/i/eu5lJs
   */
  config: Config = {
    navigationBarTitleText: '首页'
  };

    constructor () {
        super(...arguments)
        this.state = {
            current: 0
        }
    }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

    handleClick = (value) => {
        this.setState({ current: value });
    };

    previewImage = () => {
        const imgShop = 'https://s2.ax1x.com/2019/07/27/euLHoV.png';
        const qrCode = 'https://s2.ax1x.com/2019/07/27/eu7qvn.png';
        Taro.previewImage({
            current: qrCode,
            urls: [imgShop, qrCode]
        })
    }

  render () {
    const { current } = this.state;
    return (
        <View>
            { current == 0 && <View className="about"/> }
            { current == 2 &&
                <View
                    className="shop"
                    onClick={this.previewImage}
                />
            }
            { current == 1 &&
                <View/>
            }
            <AtTabBar
                fixed
                tabList={[
                    { title: '关于我们', iconType: 'user' },
                    { title: '工具集', iconType: 'equalizer' },
                    { title: '商城', iconType: 'shopping-cart' }
                ]}
                onClick={this.handleClick}
                current={current}
            />
        </View>
    )
  }
}
