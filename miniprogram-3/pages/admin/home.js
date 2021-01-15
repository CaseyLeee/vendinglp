// pages/admin/home.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{},
    imgurl: "https://www.iimiim.cn/",
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
 goout(){
 //清除缓存内的用户信息
 wx.setStorageSync('userInfo', null)
 app.globalData.userInfo=null
 
 wx.redirectTo({
  url: '/pages/index/index'
})
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("app.globalData.userInfo ",app.globalData.userInfo )
    this.setData({
      userInfo: app.globalData.userInfo 
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