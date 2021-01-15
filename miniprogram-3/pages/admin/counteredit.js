// pages/admin/counteredit.js
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    remark: "",
    id: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
   
 
    this.setData({
      name: options.name,
      remark: options.remark!="null"?options.remark:"",
      deviceId: options.deviceId
    })
  },
  edit() {
    let that = this
    if (that.data.name == "") {
      Toast('设备名称不能为空');
      return;
    }

    wx.request({

      url: app.globalData.url + 'vending/foreground/device/update',
      dataType: 'json',
      method: "POST",
      data: {
        deviceId: that.data.deviceId,
        name: that.data.name,
        remrak: that.data.remark,
      },
      header: {
        'msToken': app.globalData.userInfo.token
      },
      success(res) {
        if (res.data.code == 1) {
          Toast("修改成功");
          wx.navigateTo({
            url: '/pages/admin/counter'
          })

        } else {
          Toast(res.data.message);
        }

      }
    })
  },
  toinex(){
    wx.navigateBack()
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