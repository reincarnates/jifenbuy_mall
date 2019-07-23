//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    likeNum: 4
  },
  onLoad: function () {
    
  },

  onReady: function () {
    //获得dialog组件
    this.dialog = this.selectComponent("#dialog");
  },

  showDialog: function () {
    this.dialog.showDialog();
  },

  confirmEvent: function () {
    this.dialog.hideDialog();
  },

  bindGetUserInfo: function () {
    // 用户点击授权后，这里可以做一些登陆操作
    this.login();
  },

  scanCode() {
    // this.showDialog();
    wx.scanCode({
      success(res) {
        console.log(res)
      }
    })
    // wx.login({
    //   success(res) {
    //     console.log(res);
    //     wx.request({
    //       url: 'https://test.com/onLogin',
    //       data: {
    //         code: res.code
    //       },
    //       success(data) {
    //         console.log(data);
    //       }
    //     })
    //   }
    // })
  },
  
  onReachBottom: function () {
    var _this = this;
    //wx.showNavigationBarLoading() //在标题栏中显示加载
    wx.showLoading({ title: '加载中' });
    // wx.request({
    //   url: '',
    // })
    //模拟加载
    setTimeout(function () {
      // complete
      _this.setData({
        likeNum: _this.data.likeNum + 5
      });
      //wx.hideNavigationBarLoading() //完成停止加载
      wx.hideLoading();
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },
})
