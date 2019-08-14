// pages/login/login.js
const app = getApp();
var storages = require('../../lib/js/storage.js');
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
  phoneChange: function (e) {
    var _this = this;
    _this.setData({
      phoneVal: e.detail.value
    });
  },

  //验证码取值
  codeChange: function (e) {
    var _this = this;
    _this.setData({
      codeVal: e.detail.value
    });
  },

  //获取验证码
  getRuleCode: function () {
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
      return false;
    } else if (_this.data.phoneVal.length != 11) {
      wx.showToast({
        title: '请输入正确格式的手机号',
        icon: 'none',
        duration: 2000
      });
      return false;
    } else {
      _this.setData({
        isGetCode: false,
        isCode: true
      });
      _this.time();
      wx.request({
        url: 'http://tapiserv.fulibuy.cn/Member/saveWxVerifyCode',
        method: 'POST',
        data: {
          appid: 'kj234nfygfl',
          // access_token: wx.getStorageSync('accessToken'),
          phone: _this.data.phoneVal,
          verifyCode: num,
          type: '1'
        },
        success(res) {
          wx.showToast({
            title: '短信验证码已发送，请注意查收',
            icon: 'none',
            duration: 2000
          });
        }
      });
    }
  },

  //倒计时
  time: function () {
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
  loginClick: function () {
    var _this = this;
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: 'http://tapiserv.fulibuy.cn/Member/wxLoginByVerifyCode',
      method: 'POST',
      data: {
        appid: 'kj234nfygfl',
        device_id: wx.getStorageSync('device_id'),
        // access_token: wx.getStorageSync('accessToken'),
        phone: _this.data.phoneVal,
        verifyCode: _this.data.codeVal,
      },
      success(res) {
        console.log(res);
        if (res.data.code == 2010006) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          });
          return false;
        } else if (res.data.code == 2010007) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          });
          return false;
        }
        if(res.data.code == 0) {
          console.log(res);
          storages.put('userInfo', res.data.data);
          wx.setStorage({
            key: 'device_id',
            data: res.data.data.device_id,
          });
          wx.setStorage({
            key: 'user_token',
            data: res.data.data.user_token,
          });
          wx.hideLoading();
          wx.navigateBack({
            delta: 1
          });
        }
      }
    })
  },

  //获取临时凭证
  getCode: function () {
    var _this = this;
    wx.login({
      success(res) {
        _this.setData({
          code: res.code
        });
      }
    })
  },

  //微信授权手机号登录
  getPhoneNumber: function (e) {
    var _this = this;
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        _this.loginSuccess(e, _this.data.code);
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.login({
          success(res) {
            _this.setData({
              code: res.code
            });
          }
        })
        _this.loginSuccess(e, _this.data.code);
      }
    })

  },

  loginSuccess: function (msg, code) {
    var _this = this;
    if (msg.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showToast({
        title: '微信授权登陆失败，请使用短信验证码登录',
        icon: 'none',
        duration: 2000
      });
    } else {
      //提交给服务端审核
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
          code: code,
          encryptedData: msg.detail.encryptedData,
          iv: msg.detail.iv
          // encryptedData: encodeURIComponent(e.detail.encryptedData),
          // iv: encodeURIComponent(e.detail.iv)
        },
        success(res) {
          if (res.data.data.wrong == "code") {
            wx.showToast({
              title: '连接服务器超时，请重试！',
              icon: 'none',
              duration: 2000
            });
          } else {
            if (res.data.data.is_visitor == false) {
              wx.showToast({
                title: '登陆成功',
                icon: 'none',
                duration: 1000
              });
              storages.put('userInfo', res.data.data);
              wx.setStorage({
                key: 'device_id',
                data: res.data.data.device_id,
              });
              wx.setStorage({
                key: 'user_token',
                data: res.data.data.user_token,
              });
              wx.navigateBack({
                delta: 1
              })
            }else{
              wx.showToast({
                title: '当前微信绑定的手机号未注册,请使用已注册阳光福利商城的手机号登录。',
                icon: 'none',
                duration: 2000
              });
            }
          }
        }
      })
    }
  },

  //返回上一页
  returnPage: function () {
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