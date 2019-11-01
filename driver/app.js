//app.js
//正式版：wx25ed81b4d2dc1023
// 测试版：wx42745df69b8989d8

App({
	globalData: {
		Serverurl: "https://js.laiyunyou.cn",
		// Serverurl: "https://jstest.laiyunyou.cn",
		latitude: null,
		longitude: null,
		devwidth: '',
		devheight: '',
		driverinfor: {},
		carId: '',
		carName:'',
		lookLat: 0,
		lookLng: 0,
		lookAddr: '',
		heart_delay: 7000,
		order_delay: 60000,
	},
	wxapi: {
		api_driverLogin: '/AccountApi/Login', //司机登录
		api_taskList: '/MobileDevices/GetManualMission', //任务列表
		api_changeTask: '/MobileDevices/EditPassengerTransportOrderState', //修改任务状态
		api_curLocation: '/MobileDevices/RefreshPositionInformation', //司机当前位置
		api_parkAddr: '/MobileDevices/RegisterNightParking', //夜间停车位置
		api_formData: '/MobileDevices/GetPersonalData', //个人中心统计数据
		api_carList: '/MobileDevices/GetRegularTransportVehicleList', //车辆列表
		api_dotask: '/MobileDevices/StartWork', //出车
		api_indexTotal: '/MobileDevices/GetPresentation', //首页统计
	},
	onLaunch: function() {
		var app = this;
		wx.getSystemInfo({
			success: function(res) {
				app.globalData.devwidth = res.windowWidth;
				app.globalData.devheight = res.windowHeight;

			}
		})
	},
	
	checkLogin: function() {

	}
})
