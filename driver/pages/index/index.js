var app = getApp();
Page({

	data: {
		userName: '',
		password: '',
		UsernameInputValue: "",
		PasswordInputValue: "",
		isLogin: false
	},
	onLoad: function(options) {
		var that = this;
		var username = wx.getStorageSync('username');
		var password = wx.getStorageSync('password');
		var driverinfor = wx.getStorageSync('driverinfor');
		// console.log(driverinfor);
		if(driverinfor && driverinfor != ''){
			app.globalData.driverinfor = driverinfor;
			wx.navigateTo({
				url: '../../pages/tasklist/tasklist',
			})
		}
		if (username && username != '') {
			this.setData({
				UsernameInputValue: username
			});
		}
		if (password && password != '') {
			this.setData({
				PasswordInputValue: password
			});
		}
	},
	onReady: function() {

	},

	onShow: function() {

	},
	bindUsernameInput: function(e) {
		this.setData({
			UsernameInputValue: e.detail.value
		})
	},
	bindPasswordInput: function(e) {
		this.setData({
			PasswordInputValue: e.detail.value
		})
	},
	checkLogin: function() {
		var that = this;
		var url = app.globalData.Serverurl + app.wxapi.api_driverLogin;
		var queryJson = {
			userName: that.data.UsernameInputValue,
			password: that.data.PasswordInputValue
		}
		if (that.data.UsernameInputValue.length == 0 || that.data.PasswordInputValue.length == 0) {
			wx.showToast({
				title: '用户名和密码不能为空',
				icon: 'none',
				mask: true,
				duration: 2000
			})
		} else {
			wx.setStorageSync("username", that.data.UsernameInputValue);
			wx.setStorageSync("password", that.data.PasswordInputValue);
			var dd = JSON.stringify(queryJson);
			//console.log(dd);
			wx.request({
				url: url,
				method: 'GET',
				data: {
					json: JSON.stringify(queryJson)
				},
				success: function(res) {
					// console.log(res);
					if (res.data.ResuleType == 0) {
						app.globalData.driverinfor = res.data.Datas;
						wx.setStorageSync("driverinfor", res.data.Datas);
						that.setData({
							isLogin: true,
						})
						wx.navigateTo({
							url: '../../pages/tasklist/tasklist',
						})
						wx.hideToast();
					} else if (res.data.Message) {
						wx.showToast({
							title: res.data.Message,
							icon: 'none',
							duration: 2000
						})
					} else {
						wx.showToast({
							title: '登录失败',
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
	}
})
