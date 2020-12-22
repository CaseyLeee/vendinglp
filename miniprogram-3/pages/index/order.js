// pages/index/order.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const time = require('../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderlist: [],
    imgurl: "https://www.iimiim.cn/",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  toinex() {
    wx.navigateBack()
  },
  del(e) {
    let order = e.currentTarget.dataset.order
    let that = this
    wx.request({

      url: 'https://www.iimiim.cn/vending/public/order/delete',
      dataType: 'json',
      method: "GET",
      data: {
        orderId: order
      },
      success(res) {

        if (res.data.code == 1) {
          that.onLoad()
        } else {
          Toast(res.data.message);
        }
      }
    })
  },
  use(e) {
    let order = e.currentTarget.dataset.order
    let that = this
    wx.request({

      url: 'https://www.iimiim.cn/vending/public/order/resend',
      dataType: 'json',
      method: "GET",
      data: {
        orderId: order
      },
      success(res) {

        if (res.data.code == 1) {
          that.onLoad()
        } else {
          Toast(res.data.message);
        }
      }
    })
  },
  updatestatus(e) {
    let order = e.currentTarget.dataset.order
    let that = this
    wx.request({

      url: 'https://www.iimiim.cn/vending/public/order/queryWeixin',
      dataType: 'json',
      method: "GET",
      data: {
        orderId: order
      },
      success(res) {

        if (res.data.code == 1) {
          that.onLoad()
        }
      }
    })
  },
  onLoad: function (options) {
    var that = this;
    var openid = app.globalData.openid
    var containList = app.globalData.containList
    var containmap = {}
    containList.map((item) => {
      containmap[item.commodifyId] = item
    })
    wx.request({

      url: 'https://www.iimiim.cn/vending/public/order/query',
      dataType: 'json',
      method: "POST",
      data: {
        comumerId: openid
      },
      success(res) {

        if (res.data.code == 1) {
          res.data.data.map(function (item) {
            item.status == 0 ? item.status = "删除" : item.status == 1 ? item.status = "未完成" : item.status == 2 ? item.status = "已支付" : item.status == 3 ? item.status = "支付异常" : item.status == 4 ? item.status = "已撤销" : item.status == 5 ? item.status = "退款" : "其他"
            item.createTime = time.formatTimeTwo(item.createTime, 'Y/M/D h:m:s')
            item.contain = containmap[item.commodifyId]
          })
          that.setData({
            orderlist: res.data.data
          })

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