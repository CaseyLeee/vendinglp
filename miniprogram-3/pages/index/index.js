//index.js
//获取应用实例
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({
  data: {
    imgurl: "http://192.168.0.162/",
    requrl: "http://192.168.0.162:7126/vending/",
    // motto: 'Hello World',
    // userInfo: {},
    // hasUserInfo: false,
    // canIUse: wx.canIUse('button.open-type.getUserInfo')
    list: [],
    listfix: [],
    show: false,
    price: 0,
    number: 1,
    goodschoose: {
      id: "",
      price: 0,
      unit: "",
      name: ""
    }
  },
  onChange(event) {
    let price = event.detail * this.data.goodschoose.commodify.price;
    this.setData({
      price: price
    });
  },
  showPopup(e) {

    let item = e.currentTarget.dataset.item
    if (item.number != 8) {
      this.setData({
        show: true
      });
      this.setData({
        goodschoose: item
      });
    }
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  toorder() {
    wx.navigateTo({
      url: '/pages/index/order'
    })
  },
  // //事件处理函数
  // bindViewTap: function() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  // onLoad: function () {
  //   if (app.globalData.userInfo) {
  //     this.setData({
  //       userInfo: app.globalData.userInfo,
  //       hasUserInfo: true
  //     })
  //   } else if (this.data.canIUse){
  //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
  //     // 所以此处加入 callback 以防止这种情况
  //     app.userInfoReadyCallback = res => {
  //       this.setData({
  //         userInfo: res.userInfo,
  //         hasUserInfo: true
  //       })
  //     }
  //   } else {
  //     // 在没有 open-type=getUserInfo 版本的兼容处理
  //     wx.getUserInfo({
  //       success: res => {
  //         app.globalData.userInfo = res.userInfo
  //         this.setData({
  //           userInfo: res.userInfo,
  //           hasUserInfo: true
  //         })
  //       }
  //     })
  //   }
  // },
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
  guid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
  },
  onSubmit(e) {

    if (app.globalData.openid != null) {
      this.setData({
        goodschoose: e.currentTarget.dataset.item
      });
      let that = this;
      wx.login({
        success(res) {
          if (res.code) {
            //发起网络请求
            let param = {};
            param.orderId = that.guid()
            param.commodifyId = that.data.goodschoose.commodifyId
            param.commodifyName = that.data.goodschoose.commodify.name
            param.price = that.data.goodschoose.commodify.price
            param.number = that.data.number
            param.unit = that.data.goodschoose.commodify.unit
            param.totalPrice = param.price * param.number
            param.comumerId = app.globalData.openid
            param.deviceId = 'd8177d0a6f80325401b9ae4980991f40'
            param.statusCosumer = "1"
            wx.request({
              url: that.data.requrl + 'public/order/insert',
              data: param,
              method: "POST",
              success(res) {

                if (res.data.code == 1) {

                  wx.requestPayment({
                    'timeStamp': res.data.data.timeStamp.toString(),
                    'nonceStr': res.data.data.nonceStr,
                    'package': res.data.data._package,
                    'signType': res.data.data.signType,
                    'paySign': res.data.data.paySign,
                    'success': function (res) {
                      console.log(res)
                    },
                    'fail': function (res) {
                      if (res.errMsg.indexOf("cancel") > 0) {
                        //调用订单取消接口
                        wx.request({
                          url: that.data.requrl + 'public/order/cancelOrder',
                          data: {
                            orderId: param.orderId
                          },
                          method: "GET",
                          success(res) {

                            if (res.data.code == 1) {
                              Toast('取消订单成功');
                            }
                          }
                        })

                      }
                    },
                    'complete': function (res) {}
                  })

                }
              }
            })

          } else {
            console.log('登录失败！' + res.errMsg)
          }
        }
      })
    }
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: 'http://192.168.0.162:7126/vending/public/device/info',
      dataType: 'json',
      method: "GET",
      data: {
        deviceId: 'd8177d0a6f80325401b9ae4980991f40'
      },
      success(res) {

        if (res.data.code == 1) {

          that.setData({
            list: res.data.data.containList.filter((item) => {
              return item.number != 8 && item.number != 7
            })
          })
          that.setData({
            listfix: res.data.data.containList.filter((item) => {
              return item.number == 8 || item.number == 7
            })
          })
          console.log(res.data.data.containList)
        }
      }
    })
  }
})