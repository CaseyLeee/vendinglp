//app.js
import Notify from './miniprogram_npm/@vant/weapp/notify/notify';
import Toast from './miniprogram_npm/@vant/weapp/toast/toast';

App({
onShow:function (options) {

  let that = this
  if (options && options.query && options.query.scene) {//扫小程序码进入
    let scene = decodeURIComponent(options.query.scene)
    that.globalData.deviceId = scene
    that.tointervalnumber()
    console.log("options", that.globalData.deviceId)
    wx.setStorageSync('deviceId', scene)
  } 
 else if (options && options.query && options.query.q) {//扫二维码序码进入
  
        let q = decodeURIComponent(options.query.q); 
        console.log( q)
      //&是我们定义的参数链接方式
       let deviceId = q.split("=")[2];
       that.globalData.deviceId = deviceId 
  } 
  else if (that.globalData.deviceId == "") {//下拉进去的
    wx.getStorage({
      key: 'deviceId',
      success: function (res) {
        // success
        that.globalData.deviceId = res.data
        console.log("deviceIdgetStorage", that.globalData.deviceId)

        that.tointervalnumber()

        if (that.getdecid) {
          that.getdecid()
        }
      },
      fail: function () {
        Toast('请先退出目前小程序,重新扫码进入小程序');
      }
    })
  }

},
  onLaunch: function (options) {


    console.log(options)
    let that = this
    



    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId

        wx.request({
          url: that.globalData.url+'vending/public/cosumer/getOpenId',
          dataType: 'json',
          method: "GET",
          data: {
            code: res.code
          },
          success(res) {

            if (res.data.code == 1) {

              that.globalData.openid = res.data.data

            }
          }
        })
      }
    })

    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        // success
        console.log("userInfoappjs",res.data)
        that.globalData.userInfo = res.data
       
        
      }
      
    })

  },

  
  
  deviceisOnline() {
    let deviceId = this.globalData.deviceId;
    let that = this
    wx.request({

      url: that.globalData.url+'vending/public/device/isOnline',
      dataType: 'json',
      method: "GET",
      data: {
        deviceId: deviceId
      },
      success(res) {

        if (res.data.code ==0) {

        } else {
         
          Notify({
            type: 'danger',
            message: '设备不在线',
            duration: 7000,
            safeAreaInsetTop: true
          });
        }
      }
    })
  },
  tointervalnumber() {
    let that = this
    
    if (that.globalData.intervalnumber == null) {
    
      that.globalData.intervalnumber = setInterval(() => {
        that.deviceisOnline()
      }, 10000);
    }
  },
  globalData: {
    url:"https://www.iimiim.cn/",
    userInfo: null,
    openid: "",
    containList: [],
    deviceId: '',
    intervalnumber: null
  },
})