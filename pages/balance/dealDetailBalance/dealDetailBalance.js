// pages/balance/dealDetail/dealDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    payDesc: '', //商品备注
    payType: '', //商品说明
    data: {}, //页面内容
    reducePrice: '', //支出金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      payDesc: options.paydesc,
      payType: options.paytype,
      reducePrice: options.price
    });
    wx.request({
      url: 'http://tapi.fulibuy.cn/Order/getOrderInfo',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        order_sn: options.order
      },
      success(res) {
        if(res.data.code) {
          console.log(res);
          _this.setData({
            data: res.data.data
          });
        }
      }
    })
    _this.setData({
      height: wx.getSystemInfoSync().windowHeight,
    })
  },

  //跳至客服页面
  phoneService: function() {
    wx.navigateTo({
      url: '/pages/serviceHelp/serviceHelp'
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