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
    containerState: "",
    page: 0, //当前页
    pages: 2, //每页条数
    total: 0, //总条数
    totalPages:0
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
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    //下拉刷新,重新初始化,isMerge = false
    this.querycounterlist();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
    this.setPage();
  },
  /**
 * method:分页加载控制函数
 * 
 */
 setPage() {
   let that=this
  const {
      page,
      pages,
      total
  } = that.data;


  const value =Math.ceil(total / pages);
 
that.setData({
  totalPages:value
})

  if (page >= that.data.totalPages || that.isLoading) {
      //控制触底是否加载需要两个条件,满足一下两个条件,都不能调用请求函数
      // 1.当前页是最后一页,
      // 2. 正在加载中
      return
  }
  //分页加载需要传递isMerge=true参数,表示需要合并到原来的数组上
  this.querycounterlist(true);
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
  querycounterlist(isMerge) {
    var that = this;
    that.isLoading = true
    wx.showLoading({
        title: '加载中',
    })
    
    let data = {}
    that.data.page= Number(that.data.page) + 1;
    data.pageNum = that.data.page;
    if(!isMerge){
        //不合并,页码需要重新设置为1
        data.pageNum = 1;
    }

    data.pageSize=2
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

          let shop = that.data.counterlist;
          if (!isMerge) {
            //不合并,shop需要初始化
            shop = [];
        }
        shop = shop.concat(res.data.data)||[];

          that.setData({
            counterlist: shop,
            total: res.data.totalNum
          })

        } else if (res.statusCode == 401) {
          Toast("登录信息过期,请重新登录")
          wx.redirectTo({
            url: '/pages/index/event/login'
          })
        } else {
          Toast(res.statusCode + res.data.message)
        }
      },
      complete:function(){
        that.isLoading = false
        wx.stopPullDownRefresh();
        setTimeout(function(){
            wx.hideLoading()
        },500)
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})