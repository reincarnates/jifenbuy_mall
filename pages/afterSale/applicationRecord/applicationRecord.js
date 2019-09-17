// pages/afterSale/applicationRecord/applicationRecord.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    current: 1,
    audited: [], //待审核
    sending: [], //售后中
    done: [], //已完成
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.auditedReq();
    _this.setData({
      height: wx.getSystemInfoSync().windowHeight,
    })
  },

  //待审核
  auditedReq: function() {
    var _this = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: 'http://tapi.fulibuy.cn/member/getRefundList',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
        // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
        refund_state: 'auditing',
        current_page: 1,
        per_page: 10
      },
      success(res) {
        if (res.data.code) {
          _this.setData({
            audited: res.data.data.list
          });
          wx.hideLoading();
        }
      }
    })
  },

  //切换状态
  tabClick: function(e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    _this.setData({
      current: e.currentTarget.dataset.index
    });
    
    if (index == 1) {
      _this.auditedReq();
    } else if (index == 2) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      wx.request({
        url: 'http://tapi.fulibuy.cn/member/getRefundList',
        method: 'POST',
        data: {
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
          // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          refund_state: 'sending',
          current_page: 1,
          per_page: 10
        },
        success(res) {
          if (res.data.code) {
            _this.setData({
              sending: res.data.data.list
            });
            wx.hideLoading();
          }
        }
      })
    } else if (index == 3) {
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      wx.request({
        url: 'http://tapi.fulibuy.cn/member/getRefundList',
        method: 'POST',
        data: {
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
          // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          refund_state: 'done',
          current_page: 1,
          per_page: 10
        },
        success(res) {
          if (res.data.code) {
            _this.setData({
              done: res.data.data.list
            });
            wx.hideLoading();
          }
        }
      })
    }
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