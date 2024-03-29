// pages/afterSale/checkAfterSaleType/checkAfterSaleType.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      goods: options
    });
  },

  //减
  reduce: function() {
    var _this = this;
    if(_this.data.goods.num > 1) {
      _this.data.goods.num --;
      _this.setData({
        goods: _this.data.goods
      });
    }
  },

  //加
  plus: function() {
    var _this = this;
    if (_this.data.goods.num != _this.data.goods.num) {
      _this.data.goods.num++;
      _this.setData({
        goods: _this.data.goods
      });
    }
  },

  //退款退貨
  returnPrice: function() {
    var _this = this;
    wx.redirectTo({
      url: `/pages/afterSale/afterSaleDetail/afterSaleDetail?order=${_this.data.goods.order}&sku=${_this.data.goods.sku}&status=1`,
    })
  },

  //在线客服
  service: function() {
    wx.redirectTo({
      url: '/pages/afterSale/checkAfterSaleType/checkAfterSaleType',
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