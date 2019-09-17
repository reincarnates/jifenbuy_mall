// pages/message/activityCenter/activityCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    activity: [], //活动信息内容
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    wx.request({
      url: 'http://tapi.fulibuy.cn/member/getMsgList',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        type: 'activity',
        page: 1
      },
      success(res) {
        if (res.data.code == 0) {
          _this.setData({
            activity: res.data.data.list
          });
          wx.hideLoading()
        }
      }
    })


    _this.setData({
      height: wx.getSystemInfoSync().windowHeight    // 获取当前窗口的高度
    });
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