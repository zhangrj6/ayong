import Taro, { useState,useEffect } from '@tarojs/taro'
import { View, Image, Button } from '@tarojs/components'
import BlueScan from "@components/blue-scan"
import { AtAvatar, AtButton } from 'taro-ui'
import axios from "../../request"
let socket;
var QQMapWX = require('../../common/utils/qqmap-wx-jssdk');
var qqmapsdk;

import './index.scss'

function Login() {
  let code = ""
  useEffect(() => {
    Taro.login({
        success: function (res) {
            if (res.code) {
            //发起网络请求
            code = res.code
            } else {
            console.log('登录失败！' + res.errMsg)
            }
        }
      })
       // 实例化API核心类
    qqmapsdk = new QQMapWX({
        key: 'EGEBZ-KSLWX-M7W4V-ZNWTV-YARNK-5WFXI'
    });
  })
 
  const login = (e) => {
    Taro.login({
        success: function (res) {
            if (res.code) {
            //发起网络请求
            
            // axios.post('/wechat/login',{
            //     code:res,
            //     nickName:"",
            //     avatarUrl:"",
            //     phone:"",
            // }).then(res=>{
            //     console.log(res)
            code = res.code
            console.log(code)
            // })
            } else {
            console.log('登录失败！' + res.errMsg)
            }
        }
    })
    
    wx.getUserProfile({
        desc: "获取你的昵称、头像、地区及性别",
        success: res => {
          let {nickName, avatarUrl} = res.userInfo;
          axios.post("/wechat/login",{
              code:code,
              nickName,
              headImg:avatarUrl,
          }).then(res=>{
              Taro.setStorageSync("token",res.data.token)
              Taro.setStorageSync("userinfo",res.data.userinfo)
              const userinfo = res.data.userinfo
              Taro.getLocation({
                type: 'wgs84',
                success: function (res) {
                  const latitude = res.latitude
                  const longitude = res.longitude
                  const speed = res.speed
                  const accuracy = res.accuracy
                  qqmapsdk.reverseGeocoder({
                    location:{
                        latitude,longitude
                    },
                    success:function(e){
                        let { province, city, district } = e.result.address_component
                        let location = e.result.location.lat + "," + e.result.location.lng 
                        let from = {
                            province,city,area:district,location
                        }
                        axios.post("/admin/wechat/comm/upwxuserlocation",from).then(t=>{
                            if(!userinfo.phone){
                                Taro.navigateTo({
                                    url:"../getphone/index"
                                })
                            }else{
                                // console.log("登记结束")
                                Taro.reLaunch({
                                    url:"../index/index"
                                })
                            }
                        })
                    }
                  })
                },
                fail:function(res){
                    Taro.showToast({
                        title:"授权被拒绝"
                    })
                }
              })
          })
         
           
        },
        fail: res => {
            console.log(res)
             //拒绝授权
          return;
        }
    })
  }
  return (
      <View className='index'>
         <Button type="primary" onClick={login}>一键登陆</Button>
      </View>
  )
}

export default Login;
