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
    isCode: false,
    isGetCode: true,
    currentTime: 60,
    code: '', //临时凭证
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
    if (_this.data.phoneVal == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'none',
        duration: 2000
      });
    } else if (_this.data.phoneVal.length != 11) {
      wx.showToast({
        title: '请输入正确格式的手机号',
        icon: 'none',
        duration: 2000
      });
    } else {
      _this.setData({
        isGetCode: false,
        isCode: true
      });
      _this.time();
    }
    
    // wx.request({
    //   url: 'http://tapiserv.fulibuy.cn/Member/saveVerifyCode',
    //   method: 'POST',
    //   data: {
    //     appid: 'kj234nfygfl',
    //     access_token: '1b2b074c3a2342e6031510c5e829e9c2',
    //     phone: _this.data.phoneVal,
    //     verifyCode: num,
    //     type: '1'
    //   },
    //   success(res) {
    //     console.log(res);
    //   }
    // });
  },

  //倒计时
  time: function() {
    var _this = this;
    var interval = setInterval(function () {
      _this.data.currentTime--; //每执行一次让倒计时秒数减一
      _this.setData({
        currentTime: _this.data.currentTime, //按钮文字变成倒计时对应秒数
      })
      //如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
      if (_this.data.currentTime <= 0) {
        clearInterval(interval)
        _this.setData({
          isGetCode: true,
          isCode: false,
          currentTime: 60,
        })
      }
    }, 1000);
  },

  //点击登录
  loginClick: function() {
    wx.login({
      success(res) {
        console.log(res);
      }
    })
    // wx.request({
    //   url: 'http://tapiserv.fulibuy.cn/Member/loginByVerifyCode',
    //   method: 'POST',
    //   data: {
    //     appid: 'kj234nfygfl',
    //     access_token: '1b2b074c3a2342e6031510c5e829e9c2',
    //     phone: _this.data.phoneVal,
    //     verifyCode: num,
    //   },
    //   success(res) {
    //     console.log(res);
    //   }
    // })
  },

  //获取临时凭证
  getCode: function () {
    var _this = this;
    wx.login({
      success(res) {
        console.log(res);
        _this.setData({
          code: res.code
        });
      }
    })
  },

  //微信授权手机号登录
  getPhoneNumber: function(e) {
    var _this = this;
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showToast({
        title: '微信授权登陆失败，请使用短信验证码登录',
        icon: 'none',
        duration: 2000
      });
    }else{
      wx.request({
        url: 'http://tapiserv.fulibuy.cn/Member/programLogin',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'Accept': 'application/json;charset=UTF-8',
        },
        data: {
          // appid: 'kj234nfygfl',
          // access_token: '1b2b074c3a2342e6031510c5e829e9c2',
          code: _this.data.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
          // encryptedData: encodeURIComponent(e.detail.encryptedData),
          // iv: encodeURIComponent(e.detail.iv)
        },
        success(data) {
          console.log(data);
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