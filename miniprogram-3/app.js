//app.js
App({
  onLocalService:function(){
    let that = this
    // 监听服务发现事件
    wx.onLocalServiceFound(function (obj) {
      console.log("obj",obj)
    
    })
    },
  onLaunch: function () {
  //   // 展示本地存储能力
  //   var logs = wx.getStorageSync('logs') || []
  //   logs.unshift(Date.now())
  //   wx.setStorageSync('logs', logs)
  let that = this
  wx.startLocalServiceDiscovery({
    
    // 当前手机所连的局域网下有一个 _http._tcp. 类型的服务
    serviceType: '_http._tcp.',
    success: function(res){
      that.onLocalService()
      
    },
    fail: console.log
  })
 



    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
       
        wx.request({
          url: 'http://lyz:7126/vending/public/cosumer/getOpenId',
          dataType: 'json',
          method:"GET",
          data: {
            code: res.code
          },
          success(res) {
            if(res.code==1){
              this.globalData.openid = res.data
            }
          }
        })
      }
    })
  //   // 获取用户信息
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
  //         wx.getUserInfo({
  //           success: res => {
  //             // 可以将 res 发送给后台解码出 unionId
  //             this.globalData.userInfo = res.userInfo

  //             // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //             // 所以此处加入 callback 以防止这种情况
  //             if (this.userInfoReadyCallback) {
  //               this.userInfoReadyCallback(res)
  //             }
  //           }
  //         })
  //       }
  //     }
  //   })
  },
  globalData: {
    userInfo: null,
    openid:""
  }
})