// pages/my_subpage/editPaymentPword/editPaymentPword.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 1, //当前选中的状态
    coderStr: '发送验证码', //发送验证码文字
    currentTime: 120, //验证码倒计时时间
    isCode: false,
    isGetCode: true,
    codeVal: '', //验证码的值
    userPhone: '', //用户手机号
    isOne: true, //身份验证
    isTwo: false, //设置支付密码
    nePassWord: '', //新密码
    confirmPassWord: '', //确认新密码
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    var phone = wx.getStorageSync('userinfoModel');
    _this.setData({
      userPhone: phone.mobile
    });
  },

  //获取短信验证码
  getRuleCode: function() {
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/Member/getVerifyCode',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        type: 4,
        phone: _this.data.userPhone
        // phone: '17611640119'
      },
      success(res) {
        if(res.data.code) {
          _this.setData({
            isGetCode: false,
            isCode: true
          });
          _this.time();
        }
      }
    })
  },

  //获取输入的验证码的值
  getCodeVal: function(e) {
    this.setData({
      codeVal: e.detail.value
    });
  },

  //下一步
  editNext: function() {
    var _this = this;
    if (_this.data.codeVal != '') {
      wx.request({
        url: 'http://tapi.fulibuy.cn/Member/verifyAppMember',
        method: 'POST',
        data: {
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          type: 4,
          verifyCode: _this.data.codeVal
        },
        success(res) {
          if(res.data.code) {
            if (res.data.code == 4000017) {
              wx.showToast({
                title: '验证码输入错误',
                icon: 'none',
                duration: 2000
              });
            }else{
              wx.showToast({
                title: '验证成功',
                icon: 'none',
                duration: 2000
              });
              _this.setData({
                current: 2,
                isOne: false,
                isTwo: true
              });
            }
          }
        }
      })
    }else{
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 2000
      });
    }
  },

  //获取新密码
  getNewPass: function(e) {
    var _this = this;
    _this.setData({
      nePassWord: e.detail.value
    });
  },

  //确认新密码
  confirmPass: function(e) {
    var _this = this;
    _this.setData({
      confirmPassWord: e.detail.value
    });
  },

  //确定修改
  sureEdit: function() {
    var _this = this;
    if (_this.data.nePassWord == '') {
      wx.showToast({
        title: '新密码不能为空',
        icon: 'none',
        duration: 2000
      });
      return false;
    } else if (_this.data.confirmPassWord == '') {
      wx.showToast({
        title: '确认密码不能为空',
        icon: 'none',
        duration: 2000
      });
      return false;
    } else if (_this.data.confirmPassWord != _this.data.nePassWord) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none',
        duration: 2000
      });
      return false;
    } else {
      wx.request({
        url: 'http://tapi.fulibuy.cn/Member/updPassword',
        method: 'POST',
        data: {
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          type: 2,
          new_password: _this.data.nePassWord
        },
        success(res) {
          if(res.data.code) {
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 2000
            });
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
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
          currentTime: 120,
        })
      }
    }, 1000);
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