// pages/afterSale/saleProgress/saleProgress.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    traces: [],
    expressTraces: [], //轨迹信息
    isTraces: false, //物流弹框
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({ title: '加载中', mask: true });
    wx.request({
      url: 'http://tapi.fulibuy.cn/Member/refundDetail',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
        // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
        // order_sn: '195157995510550',
        // refund_sn: '630620927868125222486503'
        order_sn: options.order,
        refund_sn: options.refund
      },
      success(res) {
        if (res.data.code) {
          _this.setData({
            traces: res.data.data.Traces,
            expressTraces: JSON.stringify(res.data.data.express_traces) == '{}' ? [] : res.data.data.express_traces.Traces.reverse()
          });
          wx.hideLoading();
        }
      }
    })

    _this.setData({
      height: wx.getSystemInfoSync().windowHeight
    })
  },

  //查看物流
  checkTraces: function() {
    this.setData({
      isTraces: true
    });
  },

  //关闭物流弹框
  closeTraces: function() {
    this.setData({
      isTraces: false
    });
  },

  //联系客服
  phoneService: function() {
    wx.navigateTo({
      url: '/pages/serviceHelp/serviceHelp',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})