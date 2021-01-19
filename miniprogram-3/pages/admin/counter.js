// pages/admin/counter.js
const app = getApp()
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */

  data: {
    counterlist: [],
  },
del(e){
  let id = e.currentTarget.dataset.id
  let that=this
  Dialog.confirm({
    title: '删除',
    message: '确认删除此设备吗',
  })
    .then(() => {
      wx.request({

        url: app.globalData.url + 'vending/foreground/device/update',
        dataType: 'json',
        method: "POST",
        data: {
          deviceId: id,
          userId:""
         
        },
        header: {
          'msToken': app.globalData.userInfo.token
        },
        success(res) {
          if (res.data.code == 1) {
            Toast("删除成功");
            wx.redirectTo({
              url: '/pages/admin/counter'
            })
  
          } else {
            Toast(res.data.message);
          }
  
        }
      })
    })
    .catch(() => {
      // on cancel
    });
},
toinex(){
  
  wx.redirectTo({
    url: '/pages/admin/home'
   })
},
edit(e){
  let item = e.currentTarget.dataset.item;
  wx.redirectTo({
    url: '/pages/admin/counteredit?deviceId=' +item.deviceId+'&name='+item.name+'&remark='+item.remrak
   })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
            counterlist: res.data.data
          })
        } else {
          Toast(res.data.message)
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