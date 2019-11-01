//app.js
App({
  hostUrl: 'https://bus.laiyunyou.cn',
  devwidth: null,
  devheight: null,

  globalData: {
    userInfo: null,
    district: null, //当前选定县区
    localcity: null, //当前定位信息 城市
    localdistrict: null, //当前定位信息 县区
    locationInfo: null,
    latitude: null,
    longitude: null,
    socketOpen: false
    
  },
  wxapi: {
    api_wxlogin: '/',

  },
  onLaunch: function () {
    var app = this;
    wx.getSystemInfo({
      success: function (res) {
        app.devwidth = res.windowWidth;
        app.devheight = res.windowHeight;
        //app.globalData.platform = res.platform;        //devtools（windows系统），ios,android
      }
    })
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onconnet: function () {
    wx.connectSocket({
      url: "ws://49.4.88.155:12308",
    })

    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      this.globalData.socketOpen  = true
      console.log('数据发送中' + socketMsgQueue)
      sendSocketMessage(socketMsgQueue)
    })

    function sendSocketMessage(msg) {
      if (socketOpen) {
        wx.sendSocketMessage({
          data: msg
        })
      } else {
        socketMsgQueue.push(msg)
      }
    }

    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + JSON.stringify(res))
    })
  },
})