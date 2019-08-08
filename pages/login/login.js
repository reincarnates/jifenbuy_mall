// pages/login/login.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    statusBarHeight2: app.globalData.statusBarHeight,
    phoneVal: '', //手机号
    codeVal: '', //验证码
  },

  //手机号取值
  phoneChange: function(e) {
    var _this = this;
    _this.setData({
      phoneVal: e.detail.value
    });
  },

  //验证码取值
  codeChange: function(e) {
    var _this = this;
    _this.setData({
      codeVal: e.detail.value
    });
  },

  //获取验证码
  getRuleCode: function() {
    var _this = this;
    var num = "";
    for (var i = 0; i < 6; i++) {
      num += Math.floor(Math.random() * 10);
    };
    wx.request({
      url: 'http://tapiserv.fulibuy.cn/Member/saveVerifyCode',
      method: 'POST',
      data: {
        appid: 'kj234nfygfl',
        access_token: '442c37d110cb894036fdd4e9bfcd8b12',
        phone: _this.data.phoneVal,
        verifyCode: num,
        type: '1'
      },
      success(res) {
        console.log(res);
      }
    })
  },

  //点击登录
  loginClick: function() {
    // wx.login({
    //   success(res) {
    //     console.log(res);
    //   }
    // })
    wx.request({
      url: 'http://tapiserv.fulibuy.cn/Member/loginByVerifyCode',
      method: 'POST',
      data: {
        appid: 'kj234nfygfl',
        access_token: '442c37d110cb894036fdd4e9bfcd8b12',
        phone: _this.data.phoneVal,
        verifyCode: num,
      },
      success(res) {
        console.log(res);
      }
    })
  },

  //微信授权手机号登录
  getPhoneNumber: function(e) {
    var _this = this;
    console.log(e);
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showToast({
        title: '微信授权登陆失败，请使用短信验证码登录',
        icon: 'none',
        duration: 2000
      });
    }else{
      wx.login({
        success(res) {
          // if(res.code) {
            wx.request({
              url: 'http://tapiserv.fulibuy.cn/Member/programLogin',
              method: 'POST',
              data: {
                appid: 'kj234nfygfl',
                access_token: 'ea50e97f58f369f858961d8ae14999aa',
                code: res.code,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv
              },
              success(data) {
                console.log(data);
              }
            })
          // }
        }
      })
    }
  },

  //返回上一页
  returnPage: function() {
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (_this.data.statusBarHeight2 == 44) {
      _this.setData({
        statusBarHeight2: 28
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})