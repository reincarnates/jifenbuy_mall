// pages/fuliCashier/fuliCashier.js
var pass = [];
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    totalPrice: 0.00, //订单总金额
    paymentType: '余额', //支付方式
    passWord: [], //支付密码
    // 输入框参数设置
    inputData: {
      input_value: "",//输入框的初始内容
      value_length: 0,//输入框密码位数
      isNext: false,//是否有下一步的按钮
      get_focus: true,//输入框的聚焦状态
      focus_class: false,//输入框聚焦样式
      value_num: [1, 2, 3, 4, 5, 6],//输入框格子数
      height: "72rpx",//输入框高度
      width: "427rpx",//输入框宽度
      see: false,//是否明文展示
      interval: true,//是否显示间隔格子
    },
    payment: false, //支付弹框
    blanceInfo: {}, //余额支付参数
    wxPay: {}, //微信支付参数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({ title: '正在生成订单' });
    _this.setData({
      totalPrice: options.total
    });
    if(options.status == 1) {
      wx.request({
        url: 'http://tapi.fulibuy.cn/Buy/creatOrder',
        method: 'POST',
        data: {
          // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
          // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          type: 'buynow',
          goods_sku: options.goodsSku,
          cart_id: options.cartId,
          quantity: options.quantity,
          address_id: options.addressId,
          order_message: options.remarks,
          pay_type: 'wx'
        },
        success(res) {
          if (res.data.code) {
            _this.setData({
              blanceInfo: res.data.data.blance_info,
              wxPay: res.data.data.xcxpay_str
            });
            wx.hideLoading();
          }
        },
      });
    }else{
      wx.request({
        url: 'http://tapi.fulibuy.cn/Buy/creatOrder',
        method: 'POST',
        data: {
          // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
          // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          cart_id: options.cartId,
          address_id: options.addressId,
          order_message: options.remarks,
          pay_type: 'wx'
        },
        success(res) {
          if (res.data.code) {
            _this.setData({
              blanceInfo: res.data.data.blance_info,
              wxPay: res.data.data.xcxpay_str
            });
            wx.hideLoading();
          }
        },
      });
    }
  },

  //选择支付方式
  radioChange: function(e) {
    var _this = this;
    _this.setData({
      paymentType: e.detail.value
    });
  },

  //确认支付
  confirmPayment: function() {
    var _this = this;
    if (_this.data.paymentType == '余额') {
      _this.setData({
        payment: true
      });
    } else {
      console.log('微信');
      wx.requestPayment({
        timeStamp: _this.data.wxPay.timeStamp,
        nonceStr: _this.data.wxPay.nonceStr,
        package: _this.data.wxPay.package,
        signType: _this.data.wxPay.signType,
        paySign: _this.data.wxPay.paySign,
        success(res) {
          wx.redirectTo({
            url: `/pages/paymentSuccess/paymentSuccess?price=${_this.data.totalPrice}`
          });
        },
        fail(res) {
          console.log('错误', res);
        }
      })
    }
  },

  //输入密码正确之后
  valueSix(e) {
    var _this = this;
    _this.setData({
      payment: false
    });
    if (_this.data.paymentType == '余额') {
      wx.request({
        url: 'http://tpay.fulibuy.cn/pay/payAppOrder',
        method: 'POST',
        data: {
          // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
          // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          orderSn: _this.data.blanceInfo.orderSn,
          paySn: _this.data.blanceInfo.paySn,
          orderType: _this.data.blanceInfo.orderType,
          payPwd: e.detail
        },
        success(res) {
          if(res.data.code == 200) {
            console.log(res);
            wx.redirectTo({
              url: `/pages/paymentSuccess/paymentSuccess?price=${_this.data.totalPrice}`
            });
          }else{
            if (res.data.code == 4030) {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              });
            }else{
              wx.showToast({
                title: '支付出错',
                icon: 'none',
                duration: 2000
              });
            }
            _this.setData({
              payment: false
            });
          }
        },
        fail() {
          wx.showToast({
            title: '请求超时',
            icon: 'none',
            duration: 2000
          });
          _this.setData({
            payment: false
          });
        }
      })
    }
  },

  //关闭支付弹框
  closePayment: function() {
    var _this = this;
    _this.setData({
      payment: false
    });
    wx.redirectTo({
      url: `/pages/my_subpage/ordersDetail/ordersDetail?order_sn=${_this.data.blanceInfo.orderSn}`
    });
  },

  //是否返回详情页面
  returnDetail: function() {
    wx.showModal({
      title: '',
      content: '还未支付，确定退出吗？',
      success(res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 1
          });
        }
      }
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