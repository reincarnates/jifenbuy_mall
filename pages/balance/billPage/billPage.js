// pages/balance/billPage/billPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    current: 1,
    bill: [], //全部余额明细
    paymentBill: [], //充值明细
    page: 1, //页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //余额明细
    wx.request({
      url: 'http://tapi.fulibuy.cn/Member/getMemberBalanceDetail',
      method: 'POST',
      data: {
        user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
        device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
        balance_type : 0,
        page: 1,
        per_page: 10,
        start_time: '',
        end_time: ''
      },
      success(res) {
        if(res.data.code) {
          _this.setData({
            bill: res.data.data.list
          });
        }
      },
    });
    //充值明细
    wx.request({
      url: 'http://tapi.fulibuy.cn/Member/getMemberBalanceRecharge',
      method: 'POST',
      data: {
        user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
        device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
        page: 1,
        per_page: 10,
        start_time: '',
        end_time: ''
      },
      success(res) {
        if (res.data.code) {
          _this.setData({
            paymentBill: res.data.data.list
          });
        }
      },
    });
    _this.setData({
      height: wx.getSystemInfoSync().windowHeight,
    })
  },

  //切换展示
  tabBill: function(e) {
    this.setData({
      current: e.currentTarget.dataset.index
    });
  },

  //跳至交易详情
  dealDetail: function(e) {
    var source = e.currentTarget.dataset.source;
    var order = e.currentTarget.dataset.order;
    if(source == 'order') {
      wx.navigateTo({
        url: `/pages/balance/dealDetailBalance/dealDetailBalance?order=${order}&paydesc=${e.currentTarget.dataset.paydesc}&paytype=${e.currentTarget.dataset.paytype}&price=${e.currentTarget.dataset.price}`
      });
    } else {
      wx.navigateTo({
        url: `/pages/balance/dealDetailPayment/dealDetailPayment?order=${order}&paydesc=${e.currentTarget.dataset.paydesc}&paytype=${e.currentTarget.dataset.paytype}&balance=${e.currentTarget.dataset.balance}&createtime=${e.currentTarget.dataset.createtime}&state=${e.currentTarget.dataset.state}`
      });
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
    var _this = this;
    //推荐
    if (_this.data.current == 1) {
      _this.data.page++;
      wx.showLoading({ title: '加载中' });
      wx.request({
        url: 'http://tapi.fulibuy.cn/Member/getMemberBalanceDetail',
        method: 'POST',
        data: {
          user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
          device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          balance_type: 0,
          page: _this.data.page,
          per_page: 10,
          start_time: '',
          end_time: ''
        },
        success(res) {
          if (res.data.code) {
            _this.setData({
              bill: _this.data.bill.concat(res.data.data.list)
            });
            wx.hideLoading();
          }
        }
      });
    } else {

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})