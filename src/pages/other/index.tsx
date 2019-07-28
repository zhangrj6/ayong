import Taro, { Component, Config } from '@tarojs/taro'
import { Image } from '@tarojs/components'
import './index.scss'

export default class Shop extends Component {

    config: Config = {
        navigationBarTitleText: '商城'
    };

    componentWillMount () { }

    componentDidMount () { }

    componentWillUnmount () { }

    componentDidShow () { }

    componentDidHide () { }

    render () {
        return (
            <Image src='https://s2.ax1x.com/2019/07/27/eu5lJs.png'/>
        )
    }
}
