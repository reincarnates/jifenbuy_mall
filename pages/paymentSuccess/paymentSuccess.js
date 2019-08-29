// pages/paymentSuccess/paymentSuccess.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    guessLikeArr: [], //推荐
    price: 0.00, //商品价格
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      price: options.price
    });
    wx.request({
      url: 'http://tapi.fulibuy.cn/index/guessLike',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        page: 1,
        per_page: '20'
      },
      success(res) {
        if (res.data.code) {
          res.data.data.list.forEach(item => {
            if (item.source == '') {
              item.source = '市场价';
            } else if (item.source == 'jd') {
              item.source = '京东价';
            } else if (item.source == 'wyyx') {
              item.source = '严选价';
            }
          });
          _this.setData({
            guessLikeArr: res.data.data.list
          });
        }
      }
    });
  },

  //返回详情页
  returnDetail: function() {
    // wx.navigateTo({
    //   url: `/pages/goodsDetail/goodsDetail`
    // });
    wx.navigateBack({
      delta: 1
    })
  },

  //查看订单
  checkOrder: function() {
    wx.navigateTo({
      url: `/pages/my_subpage/ordersList/ordersList?order_state=2&isSearchPage=0`
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