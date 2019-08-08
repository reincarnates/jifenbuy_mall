//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    likeNum: 4,
    userToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjE3MTgxMDcsImV4cCI6MzEyMzQzNjIxNCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjEsIm5pY2tuYW1lIjoiXHU1NGM4XHU1NGM4XHU1NGM4IiwiY29tcGFueV9pZCI6NCwidXNlcm5hbWUiOiIxMzQzNjE4NzcyMyIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNC0yNCAxMTozNToxMyIsImRldmljZV9pZCI6ImZmYmNiNWVmZmY2YWEyOTQiLCJtYWluX3VybCI6Imh0dHA6XC9cL3Rlc3QuZnVsaWJ1eS5jbiJ9fQ.WxNSAWdLRhXPUZI5ybtSTBm5QCK9zecIUhqJbRp1AOA',
    deviceId: 'ffbcb5efff6aa294',
    specialArr: [], //专题数组
    floorArr: [], //楼层数组
    guessLikeArr: [], //推荐
    page: 1, //页数
  },

  getPhoneNumber: function(e) {
    console.log(e);
  },

  onLoad: function () {
    var _this = this;
    //专题
    wx.request({
      url: 'http://tapi.fulibuy.cn/index/nav',
      method: 'POST',
      data: {
        device_id: _this.data.deviceId,
        user_token: _this.data.userToken
      },
      success(res) {
        if(res.data.code) {
          _this.setData({
            specialArr: res.data.data
          });
        }
      }
    });
    //楼层
    wx.request({
      url: 'http://tapi.fulibuy.cn/index/floor',
      method: 'POST',
      data: {
        device_id: _this.data.deviceId,
        user_token: _this.data.userToken
      },
      success(res) {
        if(res.data.code) {
          res.data.data.forEach((item, index) => {
            if (item.type == 3) {
              console.log(item);
              item.data3.list.forEach((element, key) => {
                if (element.source == '') {
                  element.source = '市场价';
                } else if (element.source == 'jd') {
                  element.source = '京东价';
                } else if (element.source == 'wyyx') {
                  element.source = '严选价';
                }
              });
            }
          });
          _this.setData({
            floorArr: res.data.data
          });
        }
      }
    });
    //推荐
    wx.request({
      url: 'http://tapi.fulibuy.cn/index/guessLike',
      method: 'POST',
      data: {
        device_id: _this.data.deviceId,
        user_token: _this.data.userToken,
        page: 1,
        per_page: '10'
      },
      success(res) {
        console.log(res);
        if(res.data.code) {
          _this.setData({
            guessLikeArr: res.data.data.list
          });
        }
      }
    });
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

  //跳转至搜索页
  jumpSearch: function() {
    wx.navigateTo({
      url: '/pages/search/search'
    });
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
    _this.data.page++;
    wx.showLoading({ title: '加载中' });
    //推荐
    wx.request({
      url: 'http://tapi.fulibuy.cn/index/guessLike',
      method: 'POST',
      data: {
        device_id: _this.data.deviceId,
        user_token: _this.data.userToken,
        page: _this.data.page,
        per_page: '10'
      },
      success(res) {
        if (res.data.code) {
          _this.setData({
            guessLikeArr: _this.data.guessLikeArr.concat(res.data.data.list)
          });
          wx.hideLoading();
          console.log(_this.data.guessLikeArr);
        }
      }
    });
  },
})
