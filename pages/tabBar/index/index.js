//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    likeNum: 4,
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
    setTimeout(function() {
      //专题
      wx.request({
        url: 'http://tapi.fulibuy.cn/index/nav',
        method: 'POST',
        data: {
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id')
        },
        success(res) {
          if (res.data.code) {
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
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id')
        },
        success(res) {
          if (res.data.code) {
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
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          page: 1,
          per_page: '10'
        },
        success(res) {
          console.log(res);
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
    }, 1000);
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
  
  //跳转专题
  navigatorClick: function(e) {
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.bindid;
    if (name == "福利商城") {
      wx.navigateTo({
        url: `/pages/special/fuliMall/fuliMall?id=${id}`
      });
    } else if (name == "京东商城") {
      wx.navigateTo({
        url: `/pages/special/jdMall/jdMall?id=${id}`
      });
    } else if (name == "网易严选") {
      wx.navigateTo({
        url: `/pages/special/wyMall/wyMall?id=${id}`
      });
    } else if (name == "休闲零食") {
      wx.navigateTo({
        url: `/pages/special/casualSnacks/casualSnacks?id=${id}`
      });
    } else if (name == "新品首发") {
      wx.navigateTo({
        url: `/pages/special/newGoods/newGoods?id=${id}`
      });
    } else if (name == "生鲜优选") {
      wx.navigateTo({
        url: `/pages/special/freshFood/freshFood?id=${id}`
      });
    } else if (name == "办公好物") {
      wx.navigateTo({
        url: `/pages/special/officeGoodies/officeGoodies?id=${id}`
      });
    } else if (name == "亲子家庭") {
      wx.navigateTo({
        url: `/pages/special/parentChildFamily/parentChildFamily?id=${id}`
      });
    }
    
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
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
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
