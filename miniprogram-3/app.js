//app.js
import Notify from './miniprogram_npm/@vant/weapp/notify/notify';
App({

  onLaunch: function (options) {


    console.log(options)
    let that = this
    if (options && options.query) { //发布版
      if (options.query.scene) {
        let scene = decodeURIComponent(options.query.scene)
        that.globalData.deviceId = scene
        that.tointervalnumber()
        console.log("options", that.globalData.deviceId)
        wx.setStorageSync('deviceId', scene)
      }
    }

    if (that.globalData.deviceId == "") {
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



    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId

        wx.request({
          url: 'https://www.iimiim.cn/vending/public/cosumer/getOpenId',
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

  },
  tointervalnumber(){
    let that=this
    that.deviceisOnline()
    if (that.globalData.intervalnumber == null) {
      that.globalData.intervalnumber = setInterval(() => {
        that.deviceisOnline()
      }, 10000);
    }
  },
  deviceisOnline() {
    let deviceId = this.globalData.deviceId;
    let that = this
    wx.request({

      url: 'https://www.iimiim.cn/vending/public/device/isOnline',
      dataType: 'json',
      method: "GET",
      data: {
        deviceId: deviceId
      },
      success(res) {

        if (res.data.code == 1) {

        } else {
          Notify({
            type: 'danger',
            message: '设备不在线',
            duration: 9000,
            safeAreaInsetTop:true
          });
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openid: "",
    containList: [],
    deviceId: '',
    intervalnumber:null
  }
})