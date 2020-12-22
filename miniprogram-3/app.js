//app.js
App({

  onLaunch: function () {

   let that=this
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      
        wx.request({
          url: 'https://www.iimiim.cn/vending/public/cosumer/getOpenId',
          dataType: 'json',
          method:"GET",
          data: {
            code: res.code
          },
          success(res) {
          
            if(res.data.code==1){
             
              that.globalData.openid = res.data.data
            
            }
          }
        })
      }
    })
 
  },
  globalData: {
    userInfo: null,
    openid:"",
    containList:[],
    deviceId:'40f55091ecb93c432c9d83b1b97a581e'
  }
})