//index.js
//获取应用实例
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
// import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';
Page({
  data: {
    name: "",

    showdialog: false,

    imgurl: "",


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
    this.setData({
      number: event.detail
    });
    let price = event.detail * this.data.goodschoose.commodify.price;
    this.setData({
      price: price
    });
    console.log("this.data.number", this.data.number)
  },
  showPopup(e) {
    this.setData({
      number: 1
    });
    let item = e.currentTarget.dataset.item
    if (item.number == 2 && item.available == 0) {
      this.setData({
        showgoon: true
      });
    } else {
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
  goorder() {
    this.setData({
      showgoon: false
    });

    // wx.navigateTo({
    //   url: '/pages/index/order'
    // })
  },
  gouse() {

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
    clearInterval(app.globalData.intervalnumber)
    app.globalData.intervalnumber = null//必须加null 不能光 clear
    
    console.log("toorder", app.globalData.intervalnumber)

    if (app.globalData.userInfo == null) {
      wx.navigateTo({
        url: '/pages/index/event/person'
      })
    } else {
      wx.redirectTo({
        url: '/pages/admin/home'
      })
    }

  },
  todetail(e){
    let item = e.currentTarget.dataset.item
   console.log(item)
    wx.redirectTo({
      url: '/pages/index/detail?detailsPic=' +item.commodify.detailsPic
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
      if (e.currentTarget.dataset.item != "to1and2") {

        this.setData({
          goodschoose: e.currentTarget.dataset.item
        });
      }
      //数量置为1
      if(that.data.goodschoose.number != 1 && that.data.goodschoose.number != 2){
        that.setData({
          number: 1
        });
      }
      console.log( that.data.number)
      if (!app.globalData.isonline) {
        Toast('设备不在线');
      } else if (that.data.goodschoose.available == 0 && that.data.goodschoose.number != 1 && that.data.goodschoose.number != 2) {
        // console.log(that.data.goodschoose)
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
          param.cosumerId = app.globalData.openid
          param.deviceId = app.globalData.deviceId
          param.statusCosumer = "1"
          wx.request({
            url: app.globalData.url + 'vending/public/order/insert',
            data: param,
            method: "POST",
            success(res) {

              if (res.data.code == 1) {
                if ((that.data.goodschoose.number == 1 || that.data.goodschoose.number == 1) && that.data.goodschoose.typeId == 1) {
                  Toast('支付成功,您可以使用此功能啦');
                } else {
                  console.log(app.globalData.url.indexOf("https://iim.ltd") == -1)
                  if (app.globalData.url.indexOf("https://iim.ltd") == -1) {
                    wx.requestPayment({
                      'timeStamp': res.data.data.timeStamp.toString(),
                      'nonceStr': res.data.data.nonceStr,
                      'package': res.data.data._package,
                      'signType': res.data.data.signType,
                      'paySign': res.data.data.paySign,
                      'success': function (res) {
                        Toast('支付成功,请取出商品');
                        //blestart
                        // that.bleoper(that.data.goodschoose.number)
                        //end
                        that.onLoad();
                      },
                      'fail': function (res) {
                        if (res.errMsg.indexOf("cancel") > 0) {
                          //调用订单取消接口
                          wx.request({
                            url: app.globalData.url + 'vending/public/order/cancelOrder',
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
                  } else {
                    Toast('支付成功,请取货');
                  }

                }
              } else {
                // that.bleoper(that.data.goodschoose.number)
                Toast("失败:" + res.data.message);
              }
            }
          })
        }
      }
    }
  },
  // deviceisOnline() {
  //   let deviceId = app.globalData.deviceId;
  //   let that = this
  //   wx.request({

  //     url: 'https://www.iimiim.cn/vending/public/device/isOnline',
  //     dataType: 'json',
  //     method: "GET",
  //     data: {
  //       deviceId: deviceId
  //     },
  //     success(res) {

  //       if (res.data.code == 1) {

  //       } else {
  //         Notify({
  //           type: 'danger',
  //           message: '设备不在线',
  //           duration: 9000,
  //           safeAreaInsetTop:true
  //         });
  //       }
  //     }
  //   })
  // },
  // onShow: function (options) {
  //   let that = this

  //   if (this.data.intervalnumber == null) {
  //     this.data.intervalnumber = setInterval(() => {
  //       that.deviceisOnline()
  //     }, 10000);
  //   }
  // },
  showindex: function () {

    let that = this
    wx.request({
      url: app.globalData.url + 'vending/public/device/info',
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
          that.setData({
            name: res.data.data.name
          })
          app.globalData.containList = res.data.data.containList
          res.data.data.containList.sort(function (x, y) {
            return x.number - y.number
          });
          that.setData({
            list: res.data.data.containList.filter((item) => {

              if (that.data.containerState.substring(item.number - 1, item.number) > 0) {
                item.available = 1
              } else {
                item.available = 0
              }
              return item.number != 1 && item.number != 2
            })
          })
          that.setData({
            listfix: res.data.data.containList.filter((item) => {
              if (that.data.containerState.substring(item.number - 1, item.number) > 0) {
                item.available = 1
              } else {
                item.available = 0
              }

              return item.number == 1 || item.number == 2
            })
          })

        }
      }
    })
  },
  connect(item, deviceId) {
    wx.writeBLECharacteristicValue({
      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
      deviceId: deviceId,
      serviceId: "0783B03E-8535-B5A0-7140-A304F013C3B7",
      characteristicId: "0783B03E-8535-B5A0-7140-A304F013C3B9",
      value: item,
      success(res) {
        console.log('writeBLECharacteristicValue:', res)

      },
      fail: function (e) {
        console.log('writeBLECharacteristicValuefail!', e)

      }
    })
  },
  bleoper(number) {
    //蓝牙

    let that = this;

    let item = app.globalData.arrbuffer[number - 3]
    console.log(item)
    wx.closeBluetoothAdapter({

      success: function (res) {
        console.log('蓝牙已关闭!');
        wx.openBluetoothAdapter({ //开启蓝牙模块
          success: function (res) {
            console.log('蓝牙已开启!');
            wx.getBluetoothAdapterState({ //返回的适配器可用
              success(res) {
                console.log("getBluetoothAdapterState", res)
                wx.startBluetoothDevicesDiscovery({ //搜索
                  success: function (res) {
                    console.log('startBluetoothDevicesDiscovery success', res)
                    setTimeout(() => {
                      wx.getBluetoothDevices({
                        success: function (res) {
                          console.log("getBluetoothDevices", res)
                          let have = {}
                          res.devices.forEach((item) => {

                            if (item.name == "00002000177B") {
                              console.log("getBluetoothDeviceshave", item)
                              have = item
                            }
                          })

                          if (have && have.name) {
                            let deviceId = have.deviceId
                            console.log(deviceId)
                            wx.stopBluetoothDevicesDiscovery({
                              success(res) {
                                console.log(res)
                              },
                              fail(res) {
                                console.log(res)
                              }
                            });
                            wx.createBLEConnection({
                              // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
                              deviceId,
                              success(res) {
                                console.log(res)
                                wx.getBLEDeviceServices({
                                  // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
                                  deviceId,
                                  success(res) {
                                    console.log('device services:', res.services)
                                    // let serviceId= res.services
                                    wx.getBLEDeviceCharacteristics({
                                      // 这里的 deviceId 需要已经通过 createBLEConnection 与对应设备建立链接
                                      deviceId,
                                      // 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
                                      "serviceId": "0783B03E-8535-B5A0-7140-A304F013C3B7",
                                      success(res) {
                                        console.log('device getBLEDeviceCharacteristics:', res.characteristics)
                                        console.log('特征值匹配成功');
                                        that.connect(item, deviceId)
                                        // arrbuffer.map(async (item) => {
                                        //   await that.connect(item, deviceId)
                                        // })


                                      }
                                    })
                                  }
                                })
                              },
                              fail: function (e) {
                                Toast("与蓝牙建立连接失败");

                              }
                            })
                          } else {
                            Toast("未找到对应的蓝牙设备");
                          }
                        },
                        fail: function (e) {
                          Toast("获取蓝牙设备失败");

                        }
                      })
                    }, 1000);


                  },
                  fail: function (e) {
                    Toast("搜索蓝牙失败");

                  }
                });
              },
              fail: function (e) {
                Toast("蓝牙适配器不可用");

              }
            })

          },
          fail: function (e) {
            Toast("蓝牙未开启或不支持蓝牙!");

          }
        });
      }
    })

    //end
  },
  onLoad: function (options) {

    let that = this;
    // if (options&&options.q) {//体验版  去小程序管理后台加规则进入

    //   let q = decodeURIComponent(options.q); 
    //   //&是我们定义的参数链接方式
    //   let deviceId = q.split("=")[1];
    //   app.globalData.deviceId = deviceId 
    // }
    // let that = this
    that.setData({
      imgurl: app.globalData.imgurl
    })
    console.log("indexjsccc", app.globalData.url)
    if (app.globalData.deviceId != "") {
      that.showindex()
      app.tointervalnumber()
    } else {
      app.getdecid = () => {
        this.showindex()
        app.tointervalnumber()
      }
    }
    app.bleoper = this.bleoper

  }
})