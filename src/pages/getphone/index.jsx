import Taro, { useState,useEffect } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import BlueScan from "@components/blue-scan"
import { AtButton } from 'taro-ui'
import axios from "../../request"
import './index.scss'

function Login() {

  const getPhone = (e) => {
      let userinfo = Taro.getStorageSync("userinfo")
      let { encryptedData, iv,cloudID} = e.detail
     axios.post("/wechat/upphone", {
        session_key:userinfo.session_key,encryptedData:encryptedData,iv:iv
     }).then(res=>{
        Taro.reLaunch({
            url:"../index/index"
        })
     })
  }
  return (
      <View className='index'>
         <Button type="primary" openType="getPhoneNumber" onGetPhoneNumber={getPhone}>绑定手机号</Button>
      </View>
  )
}

export default Login;
