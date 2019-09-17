// pages/confirmOrder/confirmOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: [], //默认地址
    address2: [], //用户所有地址
    address_id: '', //地址id
    orderGood: [], //单个商品
    orderGoods: [], //多个商品
    price_num: 0.00, //总价
    status: 0, //判断从哪个页面进入
    isList: false, //商品清单遮罩层
    maskBottom: '-100%', //商品清单定位
    checkGoods: [], //商品清单
    goodsSku: '', //单个商品goods_sku
    cartSku: '', //单个商品sku
    quantity: 0, //单个商品的数量
    cartId: '', //购物车进来商品的id
    remarks: [], //订单备注
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    //获取用户地址
    wx.request({
      url: 'http://tapi.fulibuy.cn/Member/getAddressList',
      method: 'POST',
      data: {
        // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
        // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        list_rows: 10,
        page: 1
      },
      success(res) {
        if(!res.code) {
          // console.log(res);
          var res = res.data.data;
          res.data.forEach(item => {
            item.mob_phone = item.mob_phone.replace(item.mob_phone.substring(3, 7), "****");
            if (item.is_default == 1) {
              _this.setData({
                address: item,
                address_id: item.address_id
              });
            }else{
              _this.setData({
                address: res.data[0],
              });
            }
          });
          _this.setData({
            address2: res.data
          });
        }
      },
    });
    wx.showLoading({ title: '加载中' });
    if (options.status == 1) {
      //立即购买获取订单
      _this.setData({
        status: options.status,
        goodsSku: options.goodsSku,
        cartSku: options.sku,
        quantity: options.quantity
      });
      _this.getSignCartOrder();
    }else{
      //购物车结算获取订单
      _this.setData({
        cartId: options.cartId
      });
      setTimeout(function() {
        _this.getCartOrder();
      }, 300);
    }
  },

  //选择地址
  checkAddress: function() {
    wx.navigateTo({
      url: "/pages/address/addressManage/addressManage?status=1"
    });
  },

  //查看多商品详情
  checkGoods: function(e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    _this.data.checkGoods = [];
    _this.setData({
      checkGoods: _this.data.orderGoods[index].list,
      isList: true,
      maskBottom: 0
    });
  },

  //关闭商品清单
  closeGoodsList: function() {
    this.setData({
      isList: false,
      maskBottom: '-100%'
    });
  },

  //立即购买获取订单
  getSignCartOrder:function() {
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/buy/confirmOrder',
      method: 'POST',
      data: {
        // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
        // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        type: 'buynow',
        goods_sku: _this.data.goodsSku,
        cart_id: _this.data.cartSku,
        quantity: _this.data.quantity,
        address_id: _this.data.address_id
      },
      success(res) {
        if (res.data.code) {
          _this.setData({
            price_num: res.data.data.price_num,
            orderGood: res.data.data.cart_list
          });
          wx.hideLoading();
        }
      },
    });
  },

  //购物车结算获取订单
  getCartOrder: function() {
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/buy/confirmOrder',
      method: 'POST',
      data: {
        // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
        // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        cart_id: _this.data.cartId,
        address_id: _this.data.address_id
      },
      success(res) {
        if (res.data.code) {
          var nowmch = res.data.data.cart_list;
          for (var i = 0; i < nowmch.length; i++) {
            var mchmay = 0;
            for (var o = 0; o < nowmch[i].list.length; o++) {
              mchmay = Number(mchmay) + Number(nowmch[i].list[o].goods_total);
            }
            nowmch[i].price = mchmay;
            mchmay = Number(mchmay) + Number(nowmch[i].freight);
            nowmch[i].total = Number(mchmay).toFixed(2);
          }
          _this.setData({
            orderGoods: nowmch,
            price_num: res.data.data.price_num
          });
          wx.hideLoading();
        }
      },
    });
  },

  //禁止页面滚动
  move: function() {},

  //提交订单
  submitOrder: function() {
    var _this = this;
    if (_this.data.status == 1) {
      wx.redirectTo({
        url: `/pages/fuliCashier/fuliCashier?goodsSku=${_this.data.goodsSku}&cartId=${_this.data.cartSku}&quantity=${_this.data.quantity}&addressId=${_this.data.address_id}&remarks=${_this.data.remarks}&status=1&total=${_this.data.price_num}`
      });
    }else{
      wx.redirectTo({
        url: `/pages/fuliCashier/fuliCashier?cartId=${_this.data.cartId}&addressId=${_this.data.address_id}&remarks=${_this.data.remarks}&total=${_this.data.price_num}`
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
    var _this = this;
    //获取用户地址
    wx.request({
      url: 'http://tapi.fulibuy.cn/Member/getAddressList',
      method: 'POST',
      data: {
        // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
        // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        list_rows: 10,
        page: 1
      },
      success(res) {
        if (res.data.code) {
          var res = res.data.data;
          res.data.forEach(item => {
            item.mob_phone = item.mob_phone.replace(item.mob_phone.substring(3, 7), "****");
          });
          _this.setData({
            address2: res.data
          });
          _this.data.address2.forEach(item => {
            if (item.address_id == _this.data.address_id) {
              _this.setData({
                address: item,
                address_id: item.address_id
              });
              if (_this.data.status != 1) {
                _this.getCartOrder();
              } else {
                _this.getSignCartOrder();
              }
            }
          });
        }
      },
    });
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