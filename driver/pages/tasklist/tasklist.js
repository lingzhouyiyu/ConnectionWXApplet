//index.js
//获取应用实例
const app = getApp()
var curcar = '';
var Flat, Flng;
var pointarry = [];
var orderlist = [];
var newsarry = [];
Page({
	data: {
		isRuleTrue: false,
		isOrderTrue: false,
		loaded: false,
		items: [],
		driverId: '',
		orderList: [],
		TodayUndertakeOrderNum: 0,
		OnLineTimeForHours: 0,
		OnLineTimeForMinute: 0,
		TodayFinishOrderNum: 0,
		TodayIncome: 0,
		hasorder: 0,
		isNew: [],
		canIUse: wx.canIUse('button.open-type.getUserInfo')
	},
	onLoad: function() {
		//console.log(app.globalData.driverinfor)
		var that = this;
		var dcarId = wx.getStorageSync('carId');
		curcar = dcarId;
		var dcarName = wx.getStorageSync('carName');
		if (dcarId && dcarId != '') {
			app.globalData.carId = dcarId;
		}
		if (dcarName && dcarName != '') {
			app.globalData.carName = dcarName;
		}
		if (dcarId === null || dcarId === '' || dcarName === null || dcarName == '') {
			that.getCarList();
		}
		that.getCarList();
		that.getOrderList();
		that.getFormData();
		that.getCurLoaction();
		that.autoOrder();
		that.startReportHeart();
		

	},
	//获取订单列表
	getOrderList: function() {
		pointarry = [];
		orderlist = [];
		newsarry = [];
		var that = this;
		var url = app.globalData.Serverurl + app.wxapi.api_taskList;
		var driverId = app.globalData.driverinfor[0].Id;
		var queryJson = {
			driverId: driverId,
		}
		//console.log(JSON.stringify(queryJson));
		wx.request({
			url: url,
			method: 'GET',
			data: {
				json: JSON.stringify(queryJson)
			},
			success: function(res) {

				if (res.data.Datas.length > 0) {
					var datas = res.data.Datas[0].PassengerTransportOrder;
					// console.log(datas);
					that.setData({
						orderList: res.data.Datas[0].PassengerTransportOrder,
						loaded: true,
						hasorder: 1
					});
					for (var i = 0; i < datas.length; i++) {
						var startitem = {};
						var enditem = {}
						var startLat = String(datas[i].StartPointCoordinate_Latitude);
						var startLng = String(datas[i].StartPointCoordinate_Longitude);
						var endLat = String(datas[i].EndPointCoordinate_Latitude);
						var endLng = String(datas[i].EndPointCoordinate_Longitude);
						var startAddr = datas[i].StartPointAddress;
						var endAddr = datas[i].EndPointAddress;
						var orderid = datas[i].Id;
						var newsitem = datas[i].IsNew;
						newsitem = newsitem.toString();
						startitem.id = i + 1;
						startitem.placeName = startAddr;
						startitem.placeLongitude = startLng;
						startitem.placeLatitude = startLat;
						pointarry.push(startitem);
						orderlist.push(orderid);
						newsarry.push(newsitem);
					}
					// console.log('订单id');
					// console.log(orderlist);
					wx.setStorageSync("pointarry", pointarry);
					that.checkisnew();
					// that.autoOrder();

				} else {
					that.setData({
						orderList: [],
						loaded: true,
						hasorder: 0
					});
				}


				// if (res.data.Datas != null && res.data.Datas != '') {
				// 	
				// } else if (res.data.Message) {
				// 	// wx.showToast({
				// 	// 	title: res.data.Message,
				// 	// 	icon: 'none',
				// 	// 	duration: 2000
				// 	// })
				// } else {
				// 	wx.showToast({
				// 		title: '请求失败',
				// 		icon: 'none',
				// 		duration: 2000
				// 	})
				// }

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
	//获取车辆列表
	getCarList: function() {
		var that = this;
		var url = app.globalData.Serverurl + app.wxapi.api_carList;
		var driverId = app.globalData.driverinfor[0].Id;
		var queryJson = {
			driverId: driverId
		}
		wx.showToast({
			title: '正在加载数据',
			icon: 'loading',
			mask: true,
			duration: 20000
		})
		wx.request({
			url: url,
			method: 'GET',
			data: {
				json: JSON.stringify(queryJson)
			},
			success: function(res) {
				//console.log(res);
				if (res.data.ResuleType == 0) {
					if (res.data.Datas.length > 1) {
						that.setData({
							items: res.data.Datas,
							isRuleTrue: true
						});
					}
					if (res.data.Datas.length == 1) {
						curcar = res.data.Datas[0].Id;
						app.globalData.carId = res.data.Datas[0].Id;
						app.globalData.carName = res.data.Datas[0].VehicleNum;
						wx.setStorageSync("carId", res.data.Datas[0].Id);
						wx.setStorageSync("carName", res.data.Datas[0].VehicleNum);
					}
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
			},
			complete: function(res) {
				wx.hideToast();
			}
		})
	},
	checkisnew: function() {
		var that = this;
		// console.log('开始播放')
		var inarry = newsarry.indexOf('true');
		// console.log(inarry);
		if (inarry != -1) {
			that.neworderplay();
		}

	},
	//新订单语音播放
	neworderplay: function() {
		const innerAudioContext = wx.createInnerAudioContext()
		innerAudioContext.autoplay = true
		innerAudioContext.src = 'https://js.laiyunyou.cn/DocumentCenter/common/neworder.mp3'
		// innerAudioContext.src = '../../common/video/neworder.mp3'
		innerAudioContext.onPlay(() => {
			// console.log('开始播放')
		})
		innerAudioContext.onError((res) => {
			// console.log(res.errMsg)
			// console.log(res.errCode)
		})
	},
	//关闭车辆选择弹窗
	canelmask: function() {
		this.setData({
			isRuleTrue: false
		})
	},
	// 车辆单选择
	changecar: function(e) {
		var carInfor = JSON.parse(e.detail.value);
		// console.log(carInfor.carName);
		curcar = carInfor.carId;
		app.globalData.carId = carInfor.carId;
		app.globalData.carName = carInfor.carName;
		wx.setStorageSync("carId", carInfor.carId);
		wx.setStorageSync("carName", carInfor.carName);
	},
	//车辆选择确认按钮
	savecar: function() {
		this.setData({
			isRuleTrue: false
		})
	},
	//出车
	startCar: function() {
		var that = this;
		var url = app.globalData.Serverurl + app.wxapi.api_dotask;
		var driverId = app.globalData.driverinfor[0].Id;
		var queryJson = {
			transportDriverId: driverId,
			transportVehicleId: curcar
		}
		wx.request({
			url: url,
			method: 'GET',
			data: {
				json: JSON.stringify(queryJson)
			},
			success: function(res) {
				// console.log('出车');
				// console.log(res);
				if (res.data.ResuleType == 0) {
					wx.showToast({
						title: '出车成功',
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
	//确认订单
	sureorder: function(e) {
		var that = this;
		var curid = e.currentTarget.dataset.id;
		that.changeTask(curid, 3);
	},
	//取消接客
	canelorder: function(e) {
		var that = this;
		wx.showModal({
			title: '系统提示',
			content: '是否取消接送该乘客',
			success(res) {
				if (res.confirm) {
					var curid = e.currentTarget.dataset.id;
					that.changeTask(curid, 4);
				} else if (res.cancel) {
					return;
				}
			}
		})
	},

	//已上车
	upcar: function(e) {
		var that = this;
		wx.showModal({
			title: '系统提示',
			content: '已接到乘客？',
			success(res) {
				if (res.confirm) {
					var curid = e.currentTarget.dataset.id;
					that.changeTask(curid, 6);
					that.setData({
						isUpCar: true
					})
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
					var curid = e.currentTarget.dataset.id;
					that.changeTask(curid, 8);
				} else if (res.cancel) {
					return;
				}
			}
		})
	},
	//微信打电话
	maketel: function(e) {
		// console.log(e);
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.tel,
		})
	},
	//司机打电话
	drivertel: function(e) {
		// console.log(e);
		wx.makePhoneCall({
			phoneNumber: e.currentTarget.dataset.tel,
		})
	},
	//查看乘客位置
	lookLoaction: function(e) {
		var staus = e.currentTarget.dataset.staus;
		var startLat = e.currentTarget.dataset.startlat;
		var startLng = e.currentTarget.dataset.startlng;
		var endLat = e.currentTarget.dataset.endlat;
		var endLng = e.currentTarget.dataset.endlng;
		var startAddr = e.currentTarget.dataset.startaddr;
		var endAddr = e.currentTarget.dataset.endaddr;
		var looktel = e.currentTarget.dataset.tel;
		var lookId = e.currentTarget.dataset.id;
		var startTime = e.currentTarget.dataset.starttime;
		var endTime = e.currentTarget.dataset.endtime;
		// console.log(e);
		wx.setStorageSync("startAddr", startAddr);
		wx.setStorageSync("endAddr", endAddr);
		wx.setStorageSync("looktel", looktel);
		wx.setStorageSync("lookId", lookId);
		wx.setStorageSync("lookStatus", staus);
		wx.setStorageSync("startTime", startTime);
		wx.setStorageSync("endTime", endTime);
		// console.log(staus);
		// console.log(startLat,startLng);
		// console.log(endLat,endLng);
		if (staus == 6) {
			app.globalData.lookLat = endLat;
			app.globalData.lookLng = endLng;
			app.globalData.lookAddr = endAddr;
		} else {
			app.globalData.lookLat = startLat;
			app.globalData.lookLng = startLng;
			app.globalData.lookAddr = startAddr;
		}
		wx.navigateTo({
			url: '../../pages/pickup/pickup',
		})
	},
	//订单刷新定时器
	autoOrder: function() {
		var that = this;
		var orderTem = setTimeout(function() {
			that.getOrderList();
			that.autoOrder();
		}, app.globalData.order_delay)
		// 保存定时器name
		// that.setData({
		// 	timer: timerTem
		// })
	},
	//传送地址定时器
	startReportHeart() {
		var that = this;
		var timerTem = setTimeout(function() {
			that.getCurLoaction();
			that.startReportHeart()
		}, app.globalData.heart_delay)
		// 保存定时器name
		// that.setData({
		// 	timer: timerTem
		// })
	},
	//传送地址
	heartReport: function() {
		var that = this;
		var url = app.globalData.Serverurl + app.wxapi.api_curLocation;
		var driverId = app.globalData.driverinfor[0].Id;
		var queryJson = {
			passengerTransportOrderIds: orderlist,
			freightTransportOrderIds: [],
			driverId: driverId,
			vehicleId: curcar,
			currentLongitude: Flng,
			currentLatitude: Flat
		}
		// console.log('车辆位置');
		// console.log( queryJson);
		wx.request({
			url: url,
			method: 'GET',
			data: {
				json: JSON.stringify(queryJson)
			},
			success: function(res) {
				// console.log(res);
				if (res.data.ResuleType == 0) {

				} else if (res.data.Message) {
					wx.showToast({
						title: res.data.Message,
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
	//获取当前位置
	getCurLoaction: function() {
		var that = this;
		// 获取定位，并把位置标示出来
		wx.getLocation({
			type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
			success: function(res) {
				Flng = res.longitude;
				Flat = res.latitude;
				that.heartReport();
			},
			fail: function() {
				// fail
			},
			complete: function() {
				// complete
			}
		})
	},
	getFormData: function() {
		var that = this;
		var url = app.globalData.Serverurl + app.wxapi.api_indexTotal;
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
						OnLineTimeForHours: res.data.Datas[0].OnLineTimeForHours,
						OnLineTimeForMinute: res.data.Datas[0].OnLineTimeForMinute,
						TodayFinishOrderNum: res.data.Datas[0].TodayFinishOrderNum,
						TodayIncome: res.data.Datas[0].TodayIncome,
						TodayUndertakeOrderNum: res.data.Datas[0].TodayUndertakeOrderNum,
					});
				} else if (res.data.Message) {
					wx.showToast({
						title: res.data.Message,
						icon: 'none',
						duration: 2000
					})
				} else {
					// wx.showToast({
					// 	title: '请求失败',
					// 	icon: 'none',
					// 	duration: 2000
					// })
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
					that.getOrderList();
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
	// 下拉刷新
	onPullDownRefresh: function() {
		// wx.showNavigationBarLoading()
		this.onLoad()
		setTimeout(() => {
			wx.hideNavigationBarLoading()
			wx.stopPullDownRefresh()
		}, 3000);
	},
})
