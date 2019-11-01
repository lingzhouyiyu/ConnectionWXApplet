// pages/deliver/deliver.js
// Page({
// 
//   /**
//    * 页面的初始数据
//    */
//   data: {
// 
//   },
// 
//   /**
//    * 生命周期函数--监听页面加载
//    */
//   onLoad: function (options) {
// 
//   },
// 
//   /**
//    * 生命周期函数--监听页面初次渲染完成
//    */
//   onReady: function () {
// 
//   },
// 
//   /**
//    * 生命周期函数--监听页面显示
//    */
//   onShow: function () {
// 
//   },
// 
//   /**
//    * 生命周期函数--监听页面隐藏
//    */
//   onHide: function () {
// 
//   },
// 
//   /**
//    * 生命周期函数--监听页面卸载
//    */
//   onUnload: function () {
// 
//   },
// 
//   /**
//    * 页面相关事件处理函数--监听用户下拉动作
//    */
//   onPullDownRefresh: function () {
// 
//   },
// 
//   /**
//    * 页面上拉触底事件的处理函数
//    */
//   onReachBottom: function () {
// 
//   },
// 
//   /**
//    * 用户点击右上角分享
//    */
//   onShareAppMessage: function () {
// 
//   },
//   // intoMap: function () {
//   //   wx.getLocation({
//   //     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
//   //     success: function (res) {  //因为这里得到的是你当前位置的经纬度
//   //       var latitude = res.latitude
//   //       var longitude = res.longitude
//   //       wx.openLocation({        //所以这里会显示你当前的位置
//   //         latitude: latitude,
//   //         longitude: longitude,
//   //         name: "南宁市西乡塘区秀厢大道东",
//   //         address: "南宁市西乡塘区秀厢大道东",
//   //         scale: 15
//   //       })
//   //     }
//   //   })
//   // },
// })

var coors;
Page({
  data: {
    polyline: [],
    markers: [],
    drivetime: 0,
    distance: 0
  },
  onReady: function() {
    this.mapContext = wx.createMapContext("map", this);
  },
  onLoad: function(options) {
    // 获取当前地图，设置经纬度，传递过来的坐标，用户下单的坐标地址。
    //console.log(options);
    wx.getLocation({
      success: (res) => {
        // this.setData({
        // 	latitude: options.latitude,
        // 	longitude: options.longitude
        // });
        this.getCenterLocation(res);
        wx.request({
          url: 'https://apis.map.qq.com/ws/direction/v1/driving/?from=' + this.data.markers[0].latitude + ',' + this
            .data.markers[0].longitude + '&to=' + this.data.markers[1].latitude + ',' + this.data.markers[1].longitude +
            '&output=json&callback=cb&key=PD5BZ-K2VRO-CPEWZ-SOBAC-4KCDT-KAFLF',
          success: (res) => {
            console.log(res);
            coors = res.data.result.routes[0].polyline
           var cdrivetime = res.data.result.routes[0].duration
           var cdistance = res.data.result.routes[0].distance
            for (var i = 2; i < coors.length; i++) {
              coors[i] = coors[i - 2] + coors[i] / 1000000
            }
            console.log(this.data.markers[0].latitude + ',' + this
              .data.markers[0].longitude )
            //划线
            var b = [];
            for (var i = 0; i < coors.length; i = i + 2) {
              b[i / 2] = {
                latitude: coors[i],
                longitude: coors[i + 1]
              };
              //console.log(b[i / 2])
            }
            this.setData({
              polyline: [{
                points: b,
                color: "#00ae20",
                width: 4,
                dottedLine: false
              }],
              drivetime: cdrivetime,
              distance: cdistance
            })
          }
        })
      }
    });
  },
  //  两个坐标 一个下单地址，一个工程师接单地址，然后不停的更新工程师的坐标位置。
  getCenterLocation: function(res) {
    this.setData({
      markers: [{
          iconPath: "../../common/images/center.png",
          id: 0,
          latitude: res.latitude,
          longitude: res.longitude,
          width: 50,
          height: 50,
          alpha: 0.8,
          callout: {
            content: " 我的位置 ",
            color: "#ffffff",
            fontSize: 10,
            borderRadius: 10,
            bgColor: "#6e707c",
            padding: 5,
            display: "ALWAYS"
          }
        },
        {
          iconPath: "../../common/images/user.png",
          id: 1,
          latitude: 24.836532,
          longitude: 102.841961,
          width: 50,
          height: 50,
          alpha: 0.8,
          callout: {
            content: " 乘客的位置 ",
            color: "#ffffff",
            fontSize: 10,
            borderRadius: 10,
            bgColor: "#6e707c",
            padding: 5,
            display: "ALWAYS"
          }
        }
      ],
    });
  },
  intoMap: function() {
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function(res) { //因为这里得到的是你当前位置的经纬度
        var latitude = res.latitude
        var longitude = res.longitude
        wx.openLocation({ //所以这里会显示你当前的位置
          latitude: 25.037159,
          longitude: 102.711631,
          name: "南屏街",
          address: "南屏街",
          scale: 13
        })
      }
    })
  },
  //微信打电话
  maketel: function () {
    wx.makePhoneCall({
      phoneNumber: '18788888888',
    })
  },
  //定位到自己的位置事件
  my_location: function (e) {
    var that = this;
    that.onLoad();
  },
});