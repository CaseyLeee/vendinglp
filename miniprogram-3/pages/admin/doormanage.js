
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId: "",
    number: "",
    show:false,
    imgurl: "https://www.iimiim.cn/",
    counterlist:[],
    containerlist:[]
  },
  toinex(){
    wx.navigateBack()
  },
  showpop(e){
  
    this.setData({ show: true });
 
    this.setData({ deviceId: e.currentTarget.dataset.deviceid });
    this.setData({ number: e.currentTarget.dataset.number });
   
  },
  onClose(){
    this.setData({ show: false });
  },
  openconfirm(){
   
    var that = this;
    console.log("that.data.deviceId",that.data)
    wx.request({

      url: app.globalData.url + 'vending/foreground/device/open/confirm',
      dataType: 'json',
      method: "POST",
      data: {
        deviceId:that.data.deviceId
      },
      header: {
        'msToken': app.globalData.userInfo.token
      },
      success(res) {
        if (res.data.code == 1) {
          Toast("全部补货成功")
          
        } else {
          Toast(res.data.message)
        }
      }
    })
  },
  devicecomand(){
    var that = this;
  
    wx.request({

      url: app.globalData.url + 'vending/foreground/device/comand',
      dataType: 'json',
      method: "POST",
      data: {
        deviceId:that.data.deviceId,
        number:that.data.number
      },
      header: {
        'msToken': app.globalData.userInfo.token
      },
      success(res) {
        if (res.data.code == 1) {
          Toast("开"+that.data.number+"号仓门成功")
          
        } else {
          Toast(res.data.message)
        }
      }
    })
  },
  allopen(e){
    var that = this;

    wx.request({

      url: app.globalData.url + 'vending/foreground/device/open',
      dataType: 'json',
      method: "POST",
      data: {
        deviceId:e.currentTarget.dataset.deviceid
      },
      header: {
        'msToken': app.globalData.userInfo.token
      },
      success(res) {
        if (res.data.code == 1) {
          Toast("全部开门成功")
          
        } else {
          Toast(res.data.message)
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async  function (options) {
    var that = this;
    await that.querycontainerlist()
    await wx.request({

      url: app.globalData.url + 'vending/foreground/device/list',
      dataType: 'json',
      method: "POST",
      data: {},
      header: {
        'msToken': app.globalData.userInfo.token
      },
      success(res) {
        if (res.data.code == 1) {
          res.data.data.map(function(item){
            item.containerlist=that.data.containerlist.filter(function (data) {
              return data.number != 1 && data.number != 2;
            })
          })
          that.setData({
            counterlist: res.data.data
          })
          
        } else if(res.statusCode==401) {
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
  querycontainerlist(){
    var that = this;
     wx.request({

      url: app.globalData.url + 'vending/public/container/list',
      dataType: 'json',
      method: "GET",
      data: {
        deviceTypeId:1
      },
      header: {
        'msToken': app.globalData.userInfo.token
      },
      success(res) {
        if (res.data.code == 1) {
        console.log("containerlist",res.data.data)
          that.setData({
            containerlist:res.data.data
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