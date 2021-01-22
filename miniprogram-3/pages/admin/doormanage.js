import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchvalue: "",
    deviceId: "",
    number: "",
    show: false,
    imgurl: "",
    counterlist: [],
    containerlist: [],
    containerState: ""
  },
  toinex() {
    wx.redirectTo({
      url: '/pages/admin/home'
    })
  },
  toSearch() {
    console.log("this.data.searchvalue", this.data.searchvalue)

    var that = this;
    that.querycounterlist()

  },
  showpop(e) {

    this.setData({
      show: true
    });

    this.setData({
      deviceId: e.currentTarget.dataset.deviceid
    });
    this.setData({
      number: e.currentTarget.dataset.number
    });
  
    this.setData({
      containerState: e.currentTarget.dataset.containerstate
    });

  },
  onClose() {
    this.setData({
      show: false
    });
  },
  openconfirm(e) {
    let oper = e.currentTarget.dataset.oper
    var that = this;
    let containerState = that.data.containerState;
    let number = that.data.number;
    
    let arr = containerState.split('')

    if (oper == 0) {
      arr[number - 1] = "0"
    } else if (oper == 1) {
      arr[number - 1] = "1"
    }
   
    containerState = arr.toString().replace(/,/g, '')
    console.log("containerState", containerState)
    let data = {
      deviceId: that.data.deviceId,
      containerState: containerState
    }
    if (oper == 2) {
      data = {
        deviceId: that.data.deviceId,
      }
    }
    wx.request({

      url: app.globalData.url + 'vending/foreground/device/open/confirm',
      dataType: 'json',
      method: "GET",
      data,
      header: {
        'msToken': app.globalData.userInfo.token
      },
      async success(res) {
        if (res.data.code == 1) {
          let msg = oper == 1 ? "补货成功" : oper == 0 ? "缺货成功" : "操作成功"
          Toast(msg)
          that.setData({
            show: false
          });
          await that.querycontainerlist()
          await that.querycounterlist()

        } else {
          Toast(res.data.message)
        }
      }
    })
  },
  devicecomand() {
    var that = this;

    wx.request({

      url: app.globalData.url + 'vending/foreground/device/comand',
      dataType: 'json',
      method: "GET",
      data: {
        deviceId: that.data.deviceId,
        number: that.data.number
      },
      header: {
        'msToken': app.globalData.userInfo.token
      },
      success(res) {
        if (res.data.code == 1) {
          Toast("开" + that.data.number + "号仓门成功")
          that.setData({
            show: false
          });

        } else {
          Toast(res.data.message)
        }
      }
    })
  },
  allopen(e) {
    var that = this;

    wx.request({

      url: app.globalData.url + 'vending/foreground/device/open',
      dataType: 'json',
      method: "GET",
      data: {
        deviceId: e.currentTarget.dataset.deviceid
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
  onLoad: async function (options) {

    var that = this;
    that.setData({
      imgurl: app.globalData.imgurl
    })
    await that.querycontainerlist()
   

  },
  querycounterlist() {
    var that = this;
    let data = {}

    if (that.data.searchvalue != "") {
      data.name = that.data.searchvalue
    }
    wx.request({

      url: app.globalData.url + 'vending/foreground/device/list',
      dataType: 'json',
      method: "POST",
      data: data,
      header: {
        'msToken': app.globalData.userInfo.token
      },
      success(res) {
        if (res.data.code == 1) {
          console.log("counterlist", res.data.data)
          res.data.data.map(function (item) {
            item.containerlist = that.data.containerlist.filter(function (data) {
              return data.number != 1 && data.number != 2;
            })
          })
          that.setData({
            counterlist: res.data.data
          })

        } else if (res.statusCode == 401) {
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
   querycontainerlist() {
    var that = this;
    wx.request({

      url: app.globalData.url + 'vending/public/container/list',
      dataType: 'json',
      method: "GET",
      data: {
        deviceTypeId: 1
      },
      header: {
        'msToken': app.globalData.userInfo.token
      },
      async success(res) {
        if (res.data.code == 1) {
          console.log("containerlist", res.data.data)
          that.setData({
            containerlist: res.data.data
          })
          await that.querycounterlist()
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