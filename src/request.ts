import Taro from "@tarojs/taro"
const openUrl = "https://api.luowanggroup.com" //正式
//const openUrl = "http://192.168.124.13:8001" // 本机
//const openUrl = "http://192.168.1.7:8001" //测试
function wxPromisify(fn) {
  return function(obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function(res) {
        //成功
        // if (res.data.code !== 200) {
        //   if (res.data.msg){
        //     Taro.showToast({
        //       title: res.data.msg,
        //       icon: 'none',
        //       duration:3500
        //     })
        //   }
        //   if(res.statusCode == 462 || res.statusCode == 461){
        //     Taro.clearStorage()
        //     app.globalData.userInfo = {}
        //     app.globalData.token = ''
        //     app.globalData.loginStatus = false
        //     Taro.showModal({
        //       title: '提示',
        //       content: '当前用户未登录是否前往登录',
        //       success (res) {
        //         if (res.confirm) {
        //         Taro.navigateTo({
        //           url: '/pages/my/login/login',
        //         })
        //         } else if (res.cancel) {
        //           console.log('用户点击取消')
        //         }
        //       }
        //     })

        //   }
        //   reject(res.data)
        //   return
        // }
        resolve(res.data)
      }
      obj.fail = function(res) {
        //失败
        console.log(res)
        Taro.showToast({
          title: '服务器错误',
          icon:'none',
          duration: 1000
        })
        reject(res)
      }
      fn(obj)
    })
  }
}
//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function(callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => {
      throw reason
    })
  );
};
/**
 * 微信请求get方法
 * url
 * data 以对象的格式传入
 */
function getRequest(url, data) {
  var getRequest = wxPromisify(Taro.request)
  let token =  Taro.getStorageSync('token')
  for(var a in data){
    if(!(data[a] + '')){
      delete data[a]
    }
  }
  return getRequest({
    url: openUrl + url,
    method: 'GET',
    data: {
      ...data,
    },
    header: {
      'content-type': 'application/x-www-form-urlencoded',
     'Authorization':token
    },
    complete: function (res) {
      console.log(res)
        if(res.statusCode == 401){
          Taro.redirectTo({
            url: '/pages/login/login',
          })
          Taro.clearStorage()
      }
    },
    fail:function(res){
      Taro.showToast({
        title: '服务器错误',
        icon:'none',
        duration: 1000
      })
      console.log(res)

    }
    // success:(res)=>{
    //   console.log(res)
    //   if(res.status == 401){
    //     Taro.navigateTo({
    //       url: '../pages/user/login/login',
    //     })
    //   }
    // },
  })
}

/**
 * 微信请求post方法封装
 * url
 * data 以对象的格式传入
 */
function postRequest(url, data) {
  var postRequest = wxPromisify(Taro.request)
  let token =  Taro.getStorageSync('token')
  for(var a in data){
    if(!(data[a] + '')){
      delete data[a]
    }
  }
  return postRequest({
    url: openUrl + url,
    method: 'POST',
    data: {
      ...data,
    },
    complete: function (res) {
      if(res.statusCode == 401){
        Taro.redirectTo({
          url:  '/pages/login/login',
        })
        Taro.clearStorage()
    }
    },
    fail:function(res){
      Taro.showToast({
        title: '服务器错误',
        icon:'none',
        duration: 1000
      })
        console.log(res)

    },
    // success:(res)=>{
    //   if(res.status == 401){
    //     Taro.navigateTo({
    //       url: '../pages/user/login/login',
    //     })
    //   }
    // },
    header: {
      'content-type': 'application/json',
      'Authorization':token
    },
  })
}

function uploadRequest(url,filePath,name,data={}){
  let token =  Taro.getStorageSync('token')
  // let uid = Taro.getStorageSync('userId')
  return new Promise(resolve=>{
    console.log(123213)
    Taro.uploadFile({
      filePath: filePath,
      name: name,
      url:openUrl+ url,
      formData:data,
      header: {
       'Authorization':token,
       'content-type': 'application/x-www-form-urlencoded',
      },
      success:function(res){
        resolve(res.data)
      }
    })
  })
}
export default {
  post: postRequest,
  get: getRequest,
  openUrl: openUrl,
  uploadRequest:uploadRequest,
}