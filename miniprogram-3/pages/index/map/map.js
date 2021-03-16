const app = getApp()
Page({
  data: {
    Height: 0,
    scale: 13,
    latitude: "",
    longitude: "",
    markers: [],

    circles: [],
    show: false,
  },
  onClickShow() {
    this.setData({
      show: true
    });
  },

  onClickHide() {
    this.setData({
      show: false
    });
  },
  onLoad: function () {
    var _this = this;


    wx.getSystemInfo({
      success: function (res) {
        //设置map高度，根据当前设备宽高满屏显示
        _this.setData({
          view: {
            Height: res.windowHeight
          }
        })
      }
    })

    wx.getLocation({
      type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
      success: function (res) {

        _this.setData({	
       //   113.941779999999994,22.5461500000000008
          latitude: res.latitude,
          longitude: res.longitude,
          // markers: [{

          //   id: "1",
          //   latitude: res.latitude,
          //   longitude: res.longitude,
          //   width: 50,
          //   height: 50,
          //   iconPath: "/images/mapicon.png",
          //   anchor: {
          //     x: 0.5,
          //     y: 1
          //   },
          //   joinCluster: true, //聚合

          // }],
        })
        let positionstr = res.longitude + "," + res.latitude
        console.log("positionstr", positionstr)
        wx.request({

          url: app.globalData.url + 'vending/public/device/near',
          dataType: 'json',
          method: "GET",
          data: {
            position: positionstr

          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res) {
            console.log(res)
            if (res.data.code == 1) {
              const marker = {
                id: 1,
                iconPath: "/images/mapicon.png",
                width: 50,
                height: 50,
                joinCluster: true, // 指定了该参数才会参与聚合
                label: {
                  width: 50,
                  height: 30,
                  borderWidth: 1,
                  borderRadius: 10,
                  bgColor: '#ffffff'
                },
                anchor: {
                  x: 0.5,
                  y: 1
                },
              }

              const markers = []
              res.data.data.forEach((p, i) => {
                let pjson = {
                  longitude: p.position.split(',')[0],
                  latitude: p.position.split(',')[1],
                  remrak: p.remrak,
                  name: p.name
                }

                const newMarker = Object.assign(marker, pjson)
                newMarker.id = i + 1
                newMarker.label.content = `label ${i + 1}`
                let a = JSON.parse(JSON.stringify(newMarker))
                markers.push(a)

              })
              console.log("markers", markers)
              _this.setData({
                markers: markers
              })
              // this.mapCtx.addMarkers({
              //   markers,
              //   clear: false,
              //   complete(res) {
              //     console.log('addMarkers', res)
              //   }
              // })
            } else {
              console.log(res.statusCode + res.data.message)
            }

          }
        })

      }

    })

  },

  regionchange(e) {
    console.log("regionchange===" + e.type)
  },

  //点击merkers
  markertap(e) {
    console.log(e.markerId)

    //显示地址详细信息

  },



})