// pages/admin/counter.js
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const time = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */

  data: {
    counterlist: [],
  },

toinex(){
  
  wx.redirectTo({
    url: '/pages/admin/home'
   })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    wx.request({

      url: app.globalData.url + 'vending/foreground/order/query',
      dataType: 'json',
      method: "POST",
      data: {},
      header: {
        'msToken': app.globalData.userInfo.token
      },
      success(res) {
        if (res.data.code == 1) {
          res.data.data.map(function (item) {
           
            item.createTime = time.formatTimeTwo(item.createTime, 'Y/M/D h:m:s')
  
          })

          that.setData({
            list: res.data.data
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