// pages/personal/personal.js
const app = getApp()
Page({
  data: {
	userName: '',
	userTel: '',
	carName: '',
	TodayIncome: 0,
	TodayOrderNum: 0,
	CurrentMonthIncome: 0
  },
  onLoad: function (options) {
	var that = this;
	var dcarName = wx.getStorageSync('carName');
	console.log(dcarName);
	that.setData({
		userName: app.globalData.driverinfor[0].DriverName,
		userTel: app.globalData.driverinfor[0].DriverMobilePhone,
		carName: dcarName,
	});
	that.getFormData();
  },
  onReady: function () {

  },

  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  },
  getUserInfor: function(){
	  
  },
	getFormData: function() {
		var that = this;
		var url = app.globalData.Serverurl + app.wxapi.api_formData;
		var driverId = app.globalData.driverinfor[0].Id;
		var queryJson = {
			driverId: driverId,
		}
		wx.request({
			url: url,
			method: 'GET',
			data: {
				json: JSON.stringify(queryJson)
			},
			success: function(res) {
				// console.log(res);
				if (res.data.ResuleType == 0) {
					that.setData({
						TodayIncome: res.data.Datas[0].TodayIncome,
						TodayOrderNum: res.data.Datas[0].TodayOrderNum,
						CurrentMonthIncome: res.data.Datas[0].CurrentMonthIncome,
					});
				} else if (res.data.Message) {
					wx.showToast({
						title: res.data.Message,
						icon: 'none',
						duration: 2000
					})
				} else {
					return;
				}
	
			},
			fail: function(res) {
				//console.log(res);
				wx.hideToast();
				wx.showToast({
					title: '调用接口失败',
					icon: 'none',
					duration: 2000
				})
			}
		})
	},
})