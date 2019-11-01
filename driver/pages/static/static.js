// pages/static/static.js
let wxCharts = require('../../common/js/wxcharts-min.js');
var lineChart = null;
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */

  data: {
    array: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    objectArray: [{
        id: 0,
        name: '1月'
      },
      {
        id: 1,
        name: '2月'
      },
      {
        id: 2,
        name: '3月'
      },
      {
        id: 3,
        name: '四月'
      },
      {
        id: 4,
        name: '5月'
      },
      {
        id: 5,
        name: '6月'
      },
      {
        id: 6,
        name: '7月'
      },
      {
        id: 7,
        name: '8月'
      },
      {
        id: 8,
        name: '9月'
      },
      {
        id: 9,
        name: '10月'
      },
      {
        id: 10,
        name: '11月'
      },
      {
        id: 11,
        name: '12月'
      }
    ],
    index: 0,
  },
  bindPickerChange(e) {
    //console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getMothElectro();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
  getMothElectro: function() {
    lineChart = new wxCharts({
      canvasId: 'lineCanvas',
      type: 'line',
      categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
      animation: true,
      series: [{
        name: '流水',
        data: [1, 6, 9, 1, 0, 2, 9, 2, 8, 6, 0, 9, 8, 0, 3, 7, 3, 9, 3, 8, 9, 5, 4, 1, 5, 8, 2, 4, 9, 8, 7],
        format: function(val) {
          return val.toFixed(2) + '元';
        }
      }],
      yAxis: {
        title: '流水',
        format: function(val) {
          return val.toFixed(2);
        },
        min: 0
      },
      xAxis: {
        disableGrid: true
      },
      dataLabel: false,
      dataPointShape: true,
      legend: false,
      width: app.devwidth,
      height: 250
    });
  },
  touchHandler: function(e) { //当月用电触摸显示
    //console.log(daylineChart.getCurrentDataIndex(e));
    lineChart.showToolTip(e, { //showToolTip图表中展示数据详细内容
      background: '#7cb5ec',
      format: function(item, category) {
        return category + '日 ' + item.name + ':' + item.data
      }
    });
  }
})