// pages/message/tradeLogistics/tradeLogistics.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    trade: [], //物流信息
    page: 1, //页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: 'http://tapi.fulibuy.cn/member/getMsgList',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        type: 'order',
        page: 1
      },
      success(res) {
        if(res.data.code == 0) {
          _this.setData({
            trade: res.data.data.list
          });
          wx.hideLoading();
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
    var _this = this;
    _this.data.page++;
    wx.showLoading({ title: '加载中' });
    //推荐
    wx.request({
      url: 'http://tapi.fulibuy.cn/member/getMsgList',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        type: 'order',
        page: _this.data.page
      },
      success(res) {
        if (res.data.code == 0) {
          _this.setData({
            trade: _this.data.trade.concat(res.data.data.list)
          });
          wx.hideLoading();
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})