// pages/admin/home.js
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    imgurl: "",
    account:0,
    selltoday:0,
    counterlg:0
  },
  gocounter() {
    wx.redirectTo({
      url: '/pages/admin/counter'
    })
  },
  godoormg(){
    wx.redirectTo({
      url: '/pages/admin/doormanage'
    })
  },
  toinex(){
    wx.redirectTo({
     url: '/pages/index/index'
   })
 },
 goadminorder(){
  wx.redirectTo({
    url: '/pages/admin/admimorder'
  })
 },
 goout(){
 //清除缓存内的用户信息
 wx.setStorageSync('userInfo', null)
 app.globalData.userInfo=null
 
 wx.redirectTo({
  url: '/pages/index/index'
})
},
deviceOutOfStockQuantity(){
  let that=this
  wx.request({

    url: app.globalData.url + 'vending/foreground/device/OutOfStockQuantity',
    dataType: 'json',
    method: "GET",
    data: {},
    header: {
      'msToken': app.globalData.userInfo.token
    },
    success(res) {
      if (res.data.code == 1) {
      
        that.setData({
          OutOfStockQuantity: res.data.data
        })
      }  else if(res.statusCode==401) {
        Toast("登录信息过期,请重新登录")
        wx.navigateTo({
          url: '/pages/index/event/login'
        })
      }
      else{
        Toast(res.statusCode+res.data.message)
      }
    }
  })

},
querycounter(){
  var that = this;

    wx.request({

      url: app.globalData.url + 'vending/foreground/device/list',
      dataType: 'json',
      method: "POST",
      data: {},
      header: {
        'msToken': app.globalData.userInfo.token
      },
      success(res) {
        if (res.data.code == 1) {
        
          that.setData({
            counterlg: res.data.data.length
          })
        }
        else if (res.statusCode == 401) {
          Toast("登录信息过期,请重新登录")
          wx.redirectTo({
            url: '/pages/index/event/login'
          })
        } else {
          Toast(res.statusCode + res.data.message)
        }

      }
    })
},
ordertodaySales(){
  let that=this
  wx.request({

    url: app.globalData.url + 'vending/foreground/order/todaySales',
    dataType: 'json',
    method: "POST",
    data: {
      
    },
    header: {
      'msToken': app.globalData.userInfo.token,
      'content-type': 'application/x-www-form-urlencoded'
    },
    success(res) {
     
      if (res.data.code == 1) {
        console.log(res.data.data)
        that.setData({
          selltoday: res.data.data.toDayMoney/100,
          account:res.data.data.account/100
        })
      }  else if(res.statusCode==401) {
        Toast("登录信息过期,请重新登录")
        wx.navigateTo({
          url: '/pages/index/event/login'
        })
      }
      else{
        console.log(11)
        Toast(res.statusCode+res.data.message)
      }
    }
  })

},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      imgurl:  app.globalData.imgurl
    })
    console.log("app.globalData.userInfo ",app.globalData.userInfo )
    this.setData({
      userInfo: app.globalData.userInfo 
    })
     this.deviceOutOfStockQuantity() 
     this.ordertodaySales()
     this.querycounter()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})