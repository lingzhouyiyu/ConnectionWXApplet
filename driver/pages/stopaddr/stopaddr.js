// pages/stopaddr/stopaddr.js
var app = getApp();
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		stopaddr: '选择夜间停车地址'
	},
	onLoad: function(options) {
		var stopaddr = app.globalData.driverinfor[0].NightParkingAddress;
		if (stopaddr && stopaddr != '') {
			// app.globalData.driverinfor[0].NightParkingAddress = stopaddr
			this.setData({
				stopaddr: stopaddr
			});
		}
	},
	onReady: function() {

	},
	onShow: function() {
		var pages = getCurrentPages();
		var currPage = pages[pages.length - 1]; //当前页面
		let json = currPage.data.stopaddr;
		console.log(json) //为传过来的值
	},
	onHide: function() {

	},
	loadaddr: function() {

	}


})
