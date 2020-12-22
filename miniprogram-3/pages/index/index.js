//index.js
//获取应用实例
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Notify  from '../../miniprogram_npm/@vant/weapp/notify/notify';
Page({
  data: {
    showdialog:false,
    
    imgurl: "https://www.iimiim.cn/",
    requrl: "https://www.iimiim.cn/vending/",

    containerState: "",
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
    
     if (item.number== 8&&item.available==0) {
      this.setData({
        showgoon: true
      });
    }
    else{
      this.setData({
        show: true
      });
    }
   
    this.setData({
      goodschoose: item
    });
    this.setData({
      price: this.data.goodschoose.commodify.price
    });


  },
  goorder(){
    this.setData({
      showgoon: false
    });
    wx.navigateTo({
      url: '/pages/index/order'
    })
  },
  gouse(){
    
    this.setData({
      showgoon: false
    });
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
    this.setData({
      showgoon: false
    });
  },
  toorder() {
    wx.navigateTo({
      url: '/pages/index/order'
    })
  },

  guid() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
  },
  onSubmit(e) {
    this.setData({
      show: false
    });
    let that = this;
    if (app.globalData.openid != null) {
      if (that.data.goodschoose.number != 7 && that.data.goodschoose.number != 8) {
        this.setData({
          goodschoose: e.currentTarget.dataset.item
        });
      }


      if (that.data.goodschoose.available == 0) {
        Toast('此商品暂时无货');

      } else {

        var openid = app.globalData.openid
        if (openid != "") {
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
          param.deviceId = app.globalData.deviceId
          param.statusCosumer = "1"
          wx.request({
            url: that.data.requrl + 'public/order/insert',
            data: param,
            method: "POST",
            success(res) {

              if (res.data.code == 1) {
                if (that.data.goodschoose.number == 7 && that.data.goodschoose.typeId == 1) { 
                  Toast('支付成功,您可以使用此功能啦');
                } else {
                  wx.requestPayment({
                    'timeStamp': res.data.data.timeStamp.toString(),
                    'nonceStr': res.data.data.nonceStr,
                    'package': res.data.data._package,
                    'signType': res.data.data.signType,
                    'paySign': res.data.data.paySign,
                    'success': function (res) {
                      Toast('支付成功,请取出商品');
                     

                      that.onLoad();
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
              else{
                Toast(res.data.message);
              }
            }
          })
        }
      }
    }
  },
  deviceisOnline(){
   let  deviceId=app.globalData.deviceId;
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
          Notify({ type: 'danger', message: '设备不在线' ,duration: 10000,});
        }
      }
    })
  },
  onLoad: function () {
   let  that=this
    setInterval(() => {
      
      that.deviceisOnline()
    }, 10000);
   
    wx.request({
      url: 'https://www.iimiim.cn/vending/public/device/info',
      dataType: 'json',
      method: "GET",
      data: {
        deviceId: app.globalData.deviceId
      },
      success(res) {

        if (res.data.code == 1) {
          that.setData({
            containerState: res.data.data.containerState
          })
          app.globalData.containList =  res.data.data.containList
          that.setData({
            list: res.data.data.containList.filter((item) => {

              if (that.data.containerState.substring(item.number - 1, item.number) > 0) {
                item.available = 1
              } else  {
                item.available = 0
              }
              return item.number != 8 && item.number != 7
            })
          })
          that.setData({
            listfix: res.data.data.containList.filter((item) => {
              if (that.data.containerState.substring(item.number - 1, item.number) > 0) {
                item.available = 1
              } else  {
                item.available = 0
              }

              if (item.number == 7) {
                item.commodify.price = 0
              }
              return item.number == 8 || item.number == 7
            })
          })

        }
      }
    })
  }
})