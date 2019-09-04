// pages/balance/rechargeCenter/rechargeCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    price: '', //输入的金额
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      height: wx.getSystemInfoSync().windowHeight,
    })
  },

  //获取输入金额
  getPrice: function(e) {
    this.setData({
      price: e.detail.value
    });
  },

  //去充值
  goRecharge: function() {
    var _this = this;
    if (_this.data.price == '') {
      wx.showToast({
        title: '请先填写金额',
        icon: 'none',
        duration: 2000
      })
    } else if (_this.data.price < 10) {
      wx.showToast({
        title: '请输入大于10的充值金额',
        icon: 'none',
        duration: 2000
      })
    }else{
      wx.request({
        url: 'http://tapi.fulibuy.cn/order/appCreatPdr',
        method: 'POST',
        data: {
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          payment_code: 'wxpay',
          pay_type: 'wx',
          amount: Number(_this.data.price)
        },
        success(res) {
          if (res.data.code == 0) {
            console.log(res);
            wx.requestPayment({
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.package,
              signType: res.data.data.signType,
              paySign: res.data.data.paySign,
              success(res) {
                wx.navigateTo({
                  url: `/pages/paymentSucc/paymentSucc?price=${_this.data.price}`
                });
              },
              fail(res) {
                console.log('错误', res);
              }
            })
          }
        }
      })
    }
    
  },

  //跳转至问题页面
  locationProblem: function() {
    wx.navigateTo({
      url: '/pages/balance/rechargeProblem/rechargeProblem',
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