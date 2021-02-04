//app.js
import Notify from './miniprogram_npm/@vant/weapp/notify/notify';
import Toast from './miniprogram_npm/@vant/weapp/toast/toast';

App({
  onShow: function (options) {

    let that = this
    if (options && options.query && options.query.scene) { //扫小程序码进入
      let scene = decodeURIComponent(options.query.scene)
      that.globalData.deviceId = scene
      that.tointervalnumber()
      console.log("options", that.globalData.deviceId)
      wx.setStorageSync('deviceId', scene)
    } else if (options && options.query && options.query.q) { //扫二维码序码进入

      let q = decodeURIComponent(options.query.q);
      console.log(q)
      //&是我们定义的参数链接方式
      //  let deviceId = q.split("=")[2];
      //  that.globalData.deviceId = deviceId 

      let params = that.getparamsurl(q)
      console.log(params)


      that.globalData.deviceId = params.code
      if (params.aaa == "ccc") {
        console.log("ccc")
        that.globalData.url = "https://iim.ltd/"
        that.globalData.imgurl = "https://iim.ltd/"
      }

    } else if (that.globalData.deviceId == "") { //下拉进去的
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
  getparamsurl(url) {
    var temp1 = url.split('?');
    var pram = temp1[1];
    var keyValue = pram.split('&');
    var obj = {};
    for (var i = 0; i < keyValue.length; i++) {
      var item = keyValue[i].split('=');
      var key = item[0];
      var value = item[1];
      obj[key] = value;
    }
    return obj
  },
  onLaunch: function (options) {


    
    console.log(options)
    let that = this


//订阅
// 这里是获取下发权限地方，根据官方文档，可以根据  wx.getSetting() 的 withSubscriptions   这个参数获取用户是否打开订阅消息总开关。后面我们需要获取用户是否同意总是同意消息推送。所以这里要给它设置为true 。
// let  tmplIds="DntYaS73_0gd09HpdT7z4VkKnk4YUFph5Ye5gYuXflI"
// wx.getSetting({
//   withSubscriptions: true,   //  这里设置为true,下面才会返回mainSwitch
//   success: function(res){   
  
//     // 调起授权界面弹窗
//     if (res.subscriptionsSetting.mainSwitch) {  // 用户打开了订阅消息总开关
//       if (res.subscriptionsSetting.itemSettings != null) {   // 用户同意总是保持是否推送消息的选择, 这里表示以后不会再拉起推送消息的授权
//         let moIdState = res.subscriptionsSetting.itemSettings[tmplIds];  // 用户同意的消息模板id
//         if(moIdState === 'accept'){   
//           console.log('接受了消息推送');

//         }else if(moIdState === 'reject'){
//           console.log("拒绝消息推送");

//         }else if(moIdState === 'ban'){
//           console.log("已被后台封禁");

//         }
//       }else {
//         // 当用户没有点击 ’总是保持以上选择，不再询问‘  按钮。那每次执到这都会拉起授权弹窗
//         wx.showModal({
//           title: '提示',
//           content:'请授权开通服务通知',
//           showCancel: true,
//           success: function (ress) {
//             if (ress.confirm) {  
//               wx.requestSubscribeMessage({   // 调起消息订阅界面
//                 tmplIds: [tmplIds],
//                 success (res) { 
//                   console.log('订阅消息 成功 ');
//                   console.log(res);
//                 },
//                 fail (er){
//                   console.log("订阅消息 失败 ");
//                   console.log(er);
//                 }
//               })     
                    
//             }
//           }
//         })
//       }

//     }else {
//       console.log('订阅消息未开启')
//     }      
//   },
//   fail: function(error){
//     console.log(error);
//   },
// })


    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId

        wx.request({
          url: that.globalData.url + 'vending/public/cosumer/getOpenId',
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
        console.log("userInfoappjs", res.data)
        that.globalData.userInfo = res.data


      }

    })
    let arrbuffer = [];

    for (let i = 0; i < 6; i++) {
      let arori = [0x00, 0x96, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x02, 0x00, 0x02, 0x01, 0x01, 0x91]
      // 把对象定义在外面, 始终指向一个地址, 每次赋值都赋值给了同一个地址, 所以最后赋值的会覆盖之前的值;

      //把对象定义在循环中, 每次循环arori都会指向不同的地址, 每次都是一个新对象
      arori[11] = arori[11] + i
      arori[13] = arori[13] + i

      // arr.push(arori)

      let buffer = new ArrayBuffer(14)
      let dataView = new DataView(buffer)
      arori.map(function (item, index) {

        dataView.setUint8(index, item)
      })
      arrbuffer.push(buffer)
    }
    that.globalData.arrbuffer =arrbuffer
  },



  deviceisOnline() {
    let deviceId = this.globalData.deviceId;
    let that = this
    wx.request({

      url: that.globalData.url + 'vending/public/device/isOnline',
      dataType: 'json',
      method: "GET",
      data: {
        deviceId: deviceId
      },
      success(res) {

        if (res.data.code == 1) {
          that.globalData.isonline=true
        } else {
          that.globalData.isonline=false
          Toast('设备不在线');
          // Notify({
          //   type: 'danger',
          //   message: '设备不在线',
          //   duration: 2000,
          //   safeAreaInsetTop: true
          // });
        }
      }
    })
  },
  tointervalnumber() {
    let that = this


console.log("that.globalData.intervalnumber````",that.globalData.intervalnumber )
    if (that.globalData.intervalnumber == null) {

      that.globalData.intervalnumber = setInterval(() => {
        that.deviceisOnline()
      }, 10000);
    }
  },
  globalData: {
    //url:"https://www.iimiim.cn/",
    //imgurl:"https://www.iimiim.cn/",
    url: "https://iim.ltd/",
    imgurl: "https://iim.ltd",
    userInfo: null,
    openid: "",
    containList: [],
    deviceId: '',
    intervalnumber: null,
    arrbuffer:[],
    isonline:true
  },
})