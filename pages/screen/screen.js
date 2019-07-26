// pages/screen/screen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjE3MTgxMDcsImV4cCI6MzEyMzQzNjIxNCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjEsIm5pY2tuYW1lIjoiXHU1NGM4XHU1NGM4XHU1NGM4IiwiY29tcGFueV9pZCI6NCwidXNlcm5hbWUiOiIxMzQzNjE4NzcyMyIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNC0yNCAxMTozNToxMyIsImRldmljZV9pZCI6ImZmYmNiNWVmZmY2YWEyOTQiLCJtYWluX3VybCI6Imh0dHA6XC9cL3Rlc3QuZnVsaWJ1eS5jbiJ9fQ.WxNSAWdLRhXPUZI5ybtSTBm5QCK9zecIUhqJbRp1AOA',
    deviceId: 'ffbcb5efff6aa294',
    brandArr: [], //品牌
    store: [], //店铺
    brandHeight: '141px',
    isShowCheck: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var _this = this;
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: 'http://tapi.fulibuy.cn/Search/searchGoods',
      data: {
        // keyword: options.keyword != 'undefined' ? options.keyword : '',
        keyword: '衣服',
        id: options.classId != 'undefined' ? options.classId : '',
        page: 1,
        sort: 'asc',
        sortField: '综合排序',
        // ev: '',
        // brandId: '',
        // source: '',
        user_token: _this.data.userToken,
        device_id: _this.data.deviceId
      },
      method: "POST",
      success(res) {
        if(res.data.code) {
          _this.setData({
            brandArr: res.data.data.brand,
            store: res.data.data.store
          });
        }
        wx.hideLoading();
        // console.log(_this.data.brandArr, _this.data.store);
      }
    })
  },

  //查看全部品牌
  checkAll: function() {
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.screen-brand-item-wrapper').boundingClientRect(function (rect) {
      that.setData({
        brandHeight: rect.height + 'px'
      });
    }).exec();
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
    var query = wx.createSelectorQuery();
    var _this = this;
    query.select('.screen-brand-item-wrapper').boundingClientRect(function (rect) {
      console.log(rect);
      if (rect.height <= 141) {
        _this.setData({
          isShowCheck: false
        });
      } else {
        _this.setData({
          isShowCheck: true
        });
      }
    }).exec();
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