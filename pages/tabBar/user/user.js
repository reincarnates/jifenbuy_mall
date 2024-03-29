// pages/user/user.js
var storages = require('../../../lib/js/storage.js');
let api = require('../../../utils/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    personal: [
      {
        url: '../../../images/address.png',
        toUrl: '/pages/address/addressManage/addressManage',
        personalName: '收货地址'
      },
      {
        url: '../../../images/integral.png',
        toUrl: '/pages/notOpen/notOpen',
        personalName: '积分中心'
      },
      {
        url: '../../../images/footprint.png',
        toUrl: '/pages/MyTracks/MyTracks',
        personalName: '我的足迹'
      },
      {
        url: '../../../images/purchase.png',
        toUrl: '/pages/goodsOften/goodsOften',
        personalName: '常购商品'
      },
      {
        url: '../../../images/cooperation.png',
        toUrl: '/pages/businessCooperation/businessCooperation',
        personalName: '商务合作'
      },
      {
        url: '../../../images/invoice.png',
        toUrl: '/pages/notOpen/notOpen',
        personalName: '我的发票'
      },
      {
        url: '../../../images/feed_back.png',
        toUrl: '/pages/feedBack/feedBack',
        personalName: '意见反馈'
      },
      {
        url: '../../../images/service_help.png',
        toUrl: '/pages/serviceHelp/serviceHelp',
        personalName: '服务与帮助'
      }
    ],
    isShow: false, //登录后显示
    isLogin: true, //提示登录页面
    userInfo: {}, //用户信息
    code: '', //临时凭证
    orderNum: {}, //订单数量
    guessLikeArr: [], //推荐
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

  //允许获取手机号
  getPhoneNumber: function (e) {
    var _this = this;
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        _this.loginSuccess(e, _this.data.code);
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.navigateTo({
          url: `/pages/login/login`
        });
      }
    })
  },

  loginSuccess: function (msg, code) {
    var _this = this;
    if (msg.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.navigateTo({
        url: `/pages/login/login`
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
          code: code,
          encryptedData: msg.detail.encryptedData,
          iv: msg.detail.iv,
          client: 'wx'
        },
        success(res) {
          if (res.data.data.wrong == "code") {
            wx.showToast({
              title: '连接服务器超时，请重试！',
              icon: 'none',
              duration: 2000
            });
          } else {
            if (res.data.data.is_visitor == false && res.data.data.is_login == true) {
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
              _this.getLoginStatus();
              _this.getUserInfo();
            } else {
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

  //跳转余额页面
  locationBanlace: function() {
    wx.navigateTo({
      url: '/pages/balance/balancePage/balancePage'
    });
  },

  //充值
  recharge: function() {
    wx.navigateTo({
      url: '/pages/balance/rechargeCenter/rechargeCenter'
    });
  },

  //收藏
  collection: function() {
    wx.navigateTo({
      url: '/pages/myCollection/myCollection'
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //推荐
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;
    //获取登陆状态
    _this.getLoginStatus();
    //获取用户信息
    _this.getUserInfo();
    //获取订单数量
    _this.getOrderNumber();
  },

  //获取用户信息
  getUserInfo: function() {
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/Member/gerUserInfo',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id')
        // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjU2MDYzNDcsImV4cCI6MzEzMTIxMjY5NCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.pm1Q-zYlqy1ZVZ3Tzbtu7l4tib5mZ19f2Mj5DFa2FYA',
        // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk'
      },
      success(res) {
        if (res.data.code) {
          console.log(res);
          _this.setData({
            userInfo: res.data.data
          });
          wx.setStorageSync('userinfoModel', _this.data.userInfo);
          if (_this.data.userInfo != undefined) {
            wx.setStorageSync('memberAvatar', _this.data.userInfo.member_avatar);
          }
        }
      }
    })
  },

  //获取登陆状态
  getLoginStatus: function () {
    var _this = this;
    var user = wx.getStorageSync('userInfo');
    if (user != undefined) {
      if (user.is_visitor == false && user.is_login == true) {
        _this.setData({
          isShow: true,
          isLogin: false
        });
      }
    }
  },

  //获取各订单数量
  getOrderNumber: function() {
    var _this = this;
    // wx.request({
    //   url: 'http://tapi.fulibuy.cn/Member/getOrderNum',
    //   method: 'POST',
    //   data: {
    //     user_token: wx.getStorageSync('user_token'),
    //     device_id: wx.getStorageSync('device_id')
    //     // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjU2MDYzNDcsImV4cCI6MzEzMTIxMjY5NCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.pm1Q-zYlqy1ZVZ3Tzbtu7l4tib5mZ19f2Mj5DFa2FYA',
    //     // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk'
    //   },
    //   success(res) {
    //     if(res.data.code) {
    //       console.log(res);
    //       _this.setData({
    //         orderNum: res.data.data
    //       });
    //     }
    //   }
    // })
    api.getOrderNumber({
      success: (res) => {
        if (res.data.code) {
          console.log(res);
          _this.setData({
            orderNum: res.data.data
          });
        }
      }
    });
  },

  // 设置
  setting: function () {
    wx.navigateTo({
      url: '/pages/my_subpage/setting/setting?password=0',
    })
  },

  viewOrders: function (e) {
    wx.navigateTo({
      url: '/pages/my_subpage/ordersList/ordersList?order_state=' + e.currentTarget.id +'&isSearchPage=0',
    })
  },

  //消息
  serviceMessage: function() {
    wx.navigateTo({
      url: '/pages/message/messageCenter/messageCenter',
    })
  },


})