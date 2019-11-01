// pages/pickup/pickup.js
const gcoord = require('../../utils/gcoord.js')
const app = getApp()
var coors;
Page({
	data: {
		polyline: [],
		markers: [],
		drivetime: 0,
		distance: 0,
		endAddr: '',
		startAddr: '',
		looktel: '',
		startTime:'',
		endTime:'',
		lookStatus: -1
	},
	onReady: function() {
		this.mapContext = wx.createMapContext("map", this);
	},
	onLoad: function(options) {
		var that = this;
		var endAddr = wx.getStorageSync('endAddr');
		var startAddr = wx.getStorageSync('startAddr');
		var looktel = wx.getStorageSync('looktel');
		var lookStatus = wx.getStorageSync('lookStatus');
		var startTime = wx.getStorageSync('startTime');
		var endTime = wx.getStorageSync('endTime');
		console.log(startAddr);
		
		startTime = that.doTime(startTime);
		endTime = that.doTime(endTime);
		console.log(startTime);
		console.log(endTime);
		that.setData({
			startAddr: startAddr,
			endAddr: endAddr,
			looktel: looktel,
			lookStatus: lookStatus,
			startTime: startTime,
			endTime: endTime,
		});
		wx.getLocation({
			success: (res) => {
				// this.setData({
				// 	latitude: options.latitude,
				// 	longitude: options.longitude
				// });
				this.getCenterLocation(res);
				// console.log(res);
				wx.request({
					url: 'https://apis.map.qq.com/ws/direction/v1/driving/?from=' + this.data.markers[0].latitude + ',' + this
						.data.markers[0].longitude + '&to=' + this.data.markers[1].latitude + ',' + this.data.markers[1].longitude +
						'&output=json&callback=cb&key=PD5BZ-K2VRO-CPEWZ-SOBAC-4KCDT-KAFLF',
					success: (res) => {
						console.log(res);
						coors = res.data.result.routes[0].polyline
						var cdrivetime = res.data.result.routes[0].duration
						var resistance = res.data.result.routes[0].distance
						var cdistance = resistance/1000
						cdistance = cdistance.toFixed(2)
						for (var i = 2; i < coors.length; i++) {
							coors[i] = coors[i - 2] + coors[i] / 1000000
						}
						// console.log(this.data.markers[0].latitude + ',' + this.data.markers[0].longitude)
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
		var pointLatLng = [res.longitude,res.latitude];
		console.log(pointLatLng);
		pointLatLng = gcoord.transform(pointLatLng, // 经纬度坐标
			gcoord.WGS84, // 当前坐标系
			gcoord.GCJ02 // 目标坐标系
		);
		console.log(pointLatLng);
		this.setData({
			markers: [{
					iconPath: "../../common/images/center.png",
					id: 0,
					latitude: pointLatLng[1],
					longitude: pointLatLng[0],
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
					latitude: app.globalData.lookLat,
					longitude: app.globalData.lookLng,
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
					latitude: app.globalData.lookLat,
					longitude: app.globalData.lookLng,
					name: app.globalData.lookAddr,
					address: app.globalData.lookAddr,
					scale: 13
				})
			}
		})
	},
	//微信打电话
	maketel: function() {
		var looktel = wx.getStorageSync('looktel');
		wx.makePhoneCall({
			phoneNumber: looktel,
		})
	},
	//定位到自己的位置事件
	my_location: function(e) {
		var that = this;
		that.onLoad();
	},
	//已上车
	upcar: function(e) {
		var that = this;
		wx.showModal({
			title: '系统提示',
			content: '已接到乘客？',
			success(res) {
				if (res.confirm) {
					// console.log(1);
					var curid = wx.getStorageSync('lookId');
					that.changeTask(curid, 6);
				} else if (res.cancel) {
					return;
				}
			}
		})
	},
	//已下车
	downcar: function(e) {
		var that = this;
		wx.showModal({
			title: '系统提示',
			content: '乘客已到达目的地？',
			success(res) {
				if (res.confirm) {
					var curid = wx.getStorageSync('lookId');
					that.changeTask(curid, 8);
				} else if (res.cancel) {
					return;
				}
			}
		})
	},
	//确认订单
	sureorder: function(e) {
		var that = this;
		var curid = wx.getStorageSync('lookId');
		that.changeTask(curid, 3);
	},
	//改变订单状态
	changeTask: function(orderId, state) {
		var that = this;
		var url = app.globalData.Serverurl + app.wxapi.api_changeTask;
		var driverId = app.globalData.driverinfor[0].Id;
		var queryJson = {
			id: orderId,
			orderState: state
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
					wx.showToast({
						title: res.data.Message,
						icon: 'none',
						duration: 2000
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
	doTime: function(curtime){
		var str = curtime.replace(/-/g, '/');
		var myDate = new Date(str); 
		var hous = myDate.getHours();
		var minute = myDate.getMinutes(); 
		if(hous < 10){
			hous = "0" + hous;
		}
		if(minute < 10){
			minute = "0" + minute;
		}
		var lastTime = hous+ ":" + minute;
		return lastTime;
	}
});
