// common/components/neworder.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    isOrderTrue: true,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //取消新订单
    canelneworder: function () {
      this.setData({
        isOrderTrue: false
      })
    },
  //确认新订单
  }
})
