// pages/myCollection/myCollection.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collection: [], //收藏列表
    page: 1, //页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/member/getFavorites',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        page: 1
      },
      success(res) {
        if(res.data.code) {
          _this.setData({
            collection: res.data.data.list
          });
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
    this.onLoad();
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
    if (_this.data.page < _this.data.pagecount) {
      wx.request({
        url: 'http://tapi.fulibuy.cn/member/getFavorites',
        data: {
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          page: _this.data.page
        },
        method: "POST",
        success(res) {
          _this.setData({
            collection: _this.data.collection.concat(res.data.data.list)
          });
          wx.hideLoading();
        }
      })
    } else {
      wx.showToast({
        title: '没有更多了',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})