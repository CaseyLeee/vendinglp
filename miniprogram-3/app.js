//app.js
App({

  onLaunch: function (options) {
    console.log(options)
    let that=this
    if(options&&options.query){//发布版
      if(options.query.scene){
        let  scene = decodeURIComponent(options.query.scene)
        that.globalData.deviceId = scene 
      }
    }

   
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
    deviceId:'10000000'
  }
})