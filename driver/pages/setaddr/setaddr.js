var app = getApp()
var QQMapWX = require('../../common/js/qqmap-wx-jssdk.min');
var qqmapsdk = new QQMapWX({
	key: 'INFBZ-FAZK3-S2W3B-3UOH3-NOGL2-XJBIS' // 必填
});
var Flng,Flat,Faddr;
Page({
	data: {
		longitude: null,
		latitude: null,
		locationString: '',
		curaddr: '',
		inputValue: null,
	},
	onLoad: function() {
				var that = this;
			// 获取定位，并把位置标示出来
			wx.getLocation({
				type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
				success: function(res) {
					// Flng = res.longitude;
					// Flat = res.latitude;
					that.setData({
						longitude: res.longitude,
						latitude: res.latitude,
						locationString: res.latitude + "," + res.longitude
					})
					that.geocoder(res.latitude + "," + res.longitude);
				},
				fail: function() {
					// fail
				},
				complete: function() {
					// complete
				}
			})
		}
		//获取中间点的经纬度，并mark出来
		,
	regionchange(e) {
		if (e.type == 'end' && (e.causedBy == 'scale' || e.causedBy == 'drag')) {
			var that = this;
			this.mapCtx = wx.createMapContext("mapselect");
			this.mapCtx.getCenterLocation({
				type: 'gcj02',
				success: function(res) {
					// console.log(res)
					// Flng = res.longitude;
					// Flat = res.latitude;
					that.setData({
						latitude: res.latitude,
						longitude: res.longitude,
						controls: [{
							id: 1,
							iconPath: '../../common/images/marker.png',
							position: {
								left: app.devwidth / 2 - 15,
								top: app.devheight / 2 - 15,
								width: 30,
								height: 30
							},
							clickable: true,
							scale: 28
						}],
						locationString: res.latitude + "," + res.longitude
					})
					that.geocoder(res.latitude + "," + res.longitude);
				}
			})
		}
	},

	//定位到自己的位置事件
	my_location: function(e) {
		var that = this;
		that.onLoad();
	},
	//逆地址解析
	geocoder: function(locationString) {
		var that = this;
		qqmapsdk.reverseGeocoder({
			location: locationString,
			success: function(res) { //成功后的回调
			// Faddr = res.result.formatted_addresses.recommend;
				that.setData({
					// longitude: res.data.result.location.lng,
					// latitude: res.data.result.location.lng,
					curaddr: res.result.formatted_addresses.recommend
				})
			},
			fail: function(error) {
				console.error(error);
			},
			complete: function(res) {
				console.log(res);
			}
		})
		// wx.request({
		//   url: 'https://apis.map.qq.com/ws/geocoder/v1/',
		//   data: {
		//     "key": "INFBZ-FAZK3-S2W3B-3UOH3-NOGL2-XJBIS",
		//     "location": locationString
		//   },
		//   method: 'GET',
		//   success: function (res) {
		//     console.log(res);
		//     that.setData({
		//       // longitude: res.data.result.location.lng,
		//       // latitude: res.data.result.location.lng,
		//       curaddr: res.data.result.formatted_addresses.recommend
		//     })
		//   }
		// });
	},
	getsuggest: function(e) {
		var _this = this;
		//调用关键词提示接口
		qqmapsdk.getSuggestion({
			//获取输入框值并设置keyword参数
			keyword: e.detail.value, //用户输入的关键词，可设置固定值,如keyword:'KFC'
			page_size: 7,
			//region:'北京', //设置城市名，限制关键词所示的地域范围，非必填参数
			success: function(res) { //搜索成功后的回调
				console.log(res);
				var sug = [];
				for (var i = 0; i < res.data.length; i++) {
					sug.push({ // 获取返回结果，放到sug数组中
						title: res.data[i].title,
						id: res.data[i].id,
						addr: res.data[i].address,
						city: res.data[i].city,
						district: res.data[i].district,
						latitude: res.data[i].location.lat,
						longitude: res.data[i].location.lng
					});
				}
				_this.setData({ //设置suggestion属性，将关键词搜索结果以列表形式展示
					suggestion: sug
				});
			},
			fail: function(error) {
				console.error(error);
			},
			complete: function(res) {
				console.log(res);
			}
		})
	},
	clearInputEvent: function(res) {
		this.setData({
			'inputValue': ''
		})
	},
	closepage: function() {
		wx.navigateBack({
			changed: true
		});
	},
	goback: function() {
		var that = this;
		var url = app.globalData.Serverurl + app.wxapi.api_parkAddr;
		var driverId = app.globalData.driverinfor[0].Id;
		var queryJson = {
			transportDriverId: driverId,
			parkingAddress: that.data.curaddr,
			longitude: that.data.longitude,
			latitude: that.data.latitude
		}
		console.log(queryJson);
		wx.request({
			url: url,
			method: 'GET',
			data: {
				json: JSON.stringify(queryJson)
			},
			success: function(res) {
				console.log(res);
				if (res.data.ResuleType == 0) {
					var pages = getCurrentPages();
					var prevPage = pages[pages.length - 2]; //上一个页面
					prevPage.setData({
						stopaddr: that.data.curaddr
					})
					wx.navigateBack({ //返回
						delta: 1
					})
				} else if (res.data.Message) {
					wx.showToast({
						title: res.data.Message,
						icon: 'none',
						duration: 2000
					})
				} else {
					wx.showToast({
						title: '请求失败',
						icon: 'none',
						duration: 2000
					})
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
	sureAddr: function(e) {
		// console.log(e);
		var that = this;
		var url = app.globalData.Serverurl + app.wxapi.api_parkAddr;
		var driverId = app.globalData.driverinfor[0].Id;
		var queryJson = {
			transportDriverId: driverId,
			parkingAddress: e.currentTarget.dataset.address,
			longitude:e.currentTarget.dataset.lng,
			latitude: e.currentTarget.dataset.lat
		}
		console.log(queryJson);
		wx.request({
			url: url,
			method: 'GET',
			data: {
				json: JSON.stringify(queryJson)
			},
			success: function(res) {
				console.log(res);
				if (res.data.ResuleType == 0) {
					var pages = getCurrentPages();
					var prevPage = pages[pages.length - 2]; //上一个页面
					prevPage.setData({
						stopaddr: e.currentTarget.dataset.address
					})
					wx.navigateBack({ //返回
						delta: 1
					})
				} else if (res.data.Message) {
					wx.showToast({
						title: res.data.Message,
						icon: 'none',
						duration: 2000
					})
				} else {
					wx.showToast({
						title: '请求失败',
						icon: 'none',
						duration: 2000
					})
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
	}
})
