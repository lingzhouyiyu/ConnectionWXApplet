// pages/mapmode/mapmode.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	// {
	//   id: 1,
	//   placeName: "云南省昆明市官渡区机场高速公路",
	//   placeLongitude: "102.873230",
	//   "placeLatitude": "25.050769"
	// }, {
	//   "id": 2,
	//     "placeName": "云南省昆明市呈贡区梁王路",
	//     "placeLongitude": "102.860870",
	//     "placeLatitude": "24.869617"
	// }, {
	//   "id": 3,
	//     placeName: "云南省昆明市五华区海源北路",
	//     placeLongitude: "102.654104",
	//     placeLatitude: "25.072772"
	// }
	data: {
		url: '',
		listData: [],
		scale: '13',
		Height: '0',
		controls: '40',
		latitude: '',
		longitude: '',
		markers: [],
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function() {
		var that = this;
		// that.setData({
		//   url: app.hostUrl
		// })

		var data = JSON.stringify({
			page: 1,
			pageSize: 10,
			request: {
				placeLongitude: app.globalData.longitude,
				placeLatitude: app.globalData.latitude,
				// userId: app.globalData.userId
			}
		})

		wx.getLocation({
			type: 'wgs84', //返回可以用于wx.openLocation的经纬度
			success: (res) => {
				that.setData({
					markers: that.getSchoolMarkers(),
					scale: 13,
					longitude: res.longitude,
					latitude: res.latitude
				})
			}
		});

		wx.getSystemInfo({
			success: function(res) {
				//设置map高度，根据当前设备宽高满屏显示
				that.setData({
					view: {
						Height: res.windowHeight
					},

				})
			}
		})
	},
	controltap(e) {
		this.moveToLocation()
	},
	getSchoolMarkers() {

		var market = [];
		var pointarry = wx.getStorageSync('pointarry');
		//var listData = JSON.stringify(pointarry);
		// console.log(this.data.listData);
		// console.log(pointarry);
		for (let item of pointarry) {

			let marker1 = this.createMarker(item);

			market.push(marker1)
		}
		return market;
	},
	moveToLocation: function() {
		this.mapCtx.moveToLocation()
	},
	strSub: function(a) {
		var str = a.split(".")[1];
		str = str.substring(0, str.length - 1)
		return a.split(".")[0] + '.' + str;
	},
	createMarker(point) {

		let latitude = this.strSub(point.placeLatitude);
		let longitude = point.placeLongitude;
		let marker = {
			iconPath: "../../common/images/start-bg.png",
			id: point.id || 0,
			name: point.placeName || '',
			title: point.placeName || '',
			latitude: latitude,
			longitude: longitude,
			label: {
				bgColor: '#fff',
				padding: '6px',
				borderRadius: '3px',
				content: point.placeName
			},
			width: 30,
			height: 30
		};
		return marker;
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function() {
		// 使用 wx.createMapContext 获取 map 上下文 
		this.mapCtx = wx.createMapContext('myMap')
	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow: function() {

	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide: function() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function() {

	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh: function() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function() {

	},
	//定位到自己的位置事件
	my_location: function(e) {
		var that = this;
		that.onLoad();
	},
})
