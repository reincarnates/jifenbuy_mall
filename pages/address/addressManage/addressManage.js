// pages/addressManage/addressManage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0, //页面高度
    address: [], //用户地址
    status: '', //判断从哪个页面进来的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      status: options.status
    });

    _this.getUserAddress();
    
    //获取设备高度
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          winHeight: res.windowHeight
        });
      }
    });
  },

  //获取用户地址列表
  getUserAddress: function() {
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
        list_rows: 20,
        page: 1
      },
      success(res) {
        if (!res.code) {
          // console.log(res);
          var res = res.data.data;
          _this.setData({
            address: res.data
          });
        }
      },
    });
  },

  //返回提交订单
  returnOrder: function(e) {
    var _this = this;
    if (_this.data.status == 1) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        address_id: e.currentTarget.dataset.addressid
      })
      wx.navigateBack({
        delta: 1
      });
    }
  },

  //修改收货地址
  editAddress: function(e) {
    var info = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/address/newBuiltAddress/newBuiltAddress?id=${info.id}&name=${info.name}&phone=${info.phone}&area=${info.area}&address=${info.address}&defaults=${info.defaults}&provinceid=${info.provinceid}&cityid=${info.cityid}&areaid=${info.areaid}`
    });
  },

  //新增收货地址
  newAddress: function() {
    wx.navigateTo({
      url: '/pages/address/newBuiltAddress/newBuiltAddress'
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
    this.getUserAddress();
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