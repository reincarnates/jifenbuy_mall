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
        // user_token: wx.getStorageSync('user_token'),
        // device_id: wx.getStorageSync('device_id'),
        user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
        device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
        page: 1,
        per_page: 10
      },
      success(res) {
        if(res.data.code) {
          console.log(res);
          res.data.data.list.forEach(item => {
            item.time = _this.getTime(item.browsetime);
          });
          _this.setData({
            tracks: res.data.data.list
          });
          wx.hideLoading();
        }
      }
    })
  },

  getTime: function timestampToTime(timestamp) {
    var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return Y + M + D;
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
            res.data.data.list.forEach(item => {
              item.time = _this.getTime(item.browsetime);
            });
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