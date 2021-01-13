// pages/index/event/login.js
import Toast from '../../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  toinex() {
    wx.navigateBack()
  },
  login() {
    let that = this
    if(that.data.username==""||that.data.password==""){
      Toast('账号和密码不能为空');
      return;
    }
   
    wx.request({

      url: app.globalData.url + 'vending/user/login',
      dataType: 'json',
      method: "POST",
      data: {
        account: that.data.username,
        password: that.data.password,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if(res.data.code==1){
          wx.navigateTo({
            url: '/pages/admin/home'
          })
          app.globalData.userInfo=res.data.data
          app.globalData.userInfo.token=res.data.message
          wx.setStorageSync('userInfo', app.globalData.userInfo)
        }
        else{
          Toast(res.data.message);
        }
        
      }
    })

  },
  onLoad: function (options) {

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