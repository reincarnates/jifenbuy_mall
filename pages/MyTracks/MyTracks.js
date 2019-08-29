// pages/MyTracks/MyTracks.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tracks: [], //足迹列表、
    page: 1, //页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: 'http://tapi.fulibuy.cn/Browse/getGoodsBrowse',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        page: 1,
        per_page: 10
      },
      success(res) {
        if(res.data.code) {
          _this.setData({
            tracks: res.data.data.list
          });
          wx.hideLoading();
        }
      }
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
    var _this = this;
    _this.data.page++;
    wx.showLoading({ title: '加载中' });
    //推荐
    wx.request({
      url: 'http://tapi.fulibuy.cn/Browse/getGoodsBrowse',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        page: _this.data.page,
        per_page: '10'
      },
      success(res) {
        if (res.data.code) {
          if (res.data.data.list.length != 0) {
            _this.setData({
              tracks: _this.data.tracks.concat(res.data.data.list)
            });
          }else{
            wx.showToast({
              title: '没有更多商品',
              icon: 'none',
              duration: 2000
            });
          }
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