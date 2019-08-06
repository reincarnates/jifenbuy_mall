// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentIndex: 0,
    userToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjE3MTgxMDcsImV4cCI6MzEyMzQzNjIxNCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjEsIm5pY2tuYW1lIjoiXHU1NGM4XHU1NGM4XHU1NGM4IiwiY29tcGFueV9pZCI6NCwidXNlcm5hbWUiOiIxMzQzNjE4NzcyMyIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNC0yNCAxMTozNToxMyIsImRldmljZV9pZCI6ImZmYmNiNWVmZmY2YWEyOTQiLCJtYWluX3VybCI6Imh0dHA6XC9cL3Rlc3QuZnVsaWJ1eS5jbiJ9fQ.WxNSAWdLRhXPUZI5ybtSTBm5QCK9zecIUhqJbRp1AOA',
    deviceId: 'ffbcb5efff6aa294',
    listCount: {}, //评论类型数量
    commentList: [], //评论条数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: 'http://tapi.fulibuy.cn/Goods/getGoodsEvaluate',
      method: 'POST',
      data: {
        user_token: _this.data.userToken,
        device_id: _this.data.deviceId,
        sku: 'ZY6ec8d9147c',
        order_state: 0,
        page: 1,
        per_page: 10
      },
      success(res) {
        var data = res.data.data;
        if (res.data.code) {  
          _this.setData({
            listCount: data.listCount,
            commentList: data.list
          });
        }
        wx.hideLoading();
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //选择评论类型
  checkType: function (e) {
    var _this = this;
    wx.showLoading({ title: '加载中' });
    var _index = e.currentTarget.dataset.index;
    _this.setData({
      currentIndex: _index
    });

    if(_index == 2) {
      _this.returnType(1);
    } else if (_index == 4) {
      _this.returnType(2);
    }
  },

  //根据评论类型返回对应的数据
  returnType: function(type) {
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/Goods/getGoodsEvaluate',
      method: 'POST',
      data: {
        user_token: _this.data.userToken,
        device_id: _this.data.deviceId,
        sku: 'ZY6ec8d9147c',
        order_state: type,
        page: 1,
        per_page: 10
      },
      success(res) {
        var data = res.data.data;
        if (res.data.code) {
          _this.setData({
            listCount: data.listCount,
            commentList: data.list
          });
          wx.hideLoading();
        }
      }
    });
  },

  //查看图片
  previewImg: function(e) {
    var that = this;
    // console.log(e.currentTarget.dataset.img);
    wx.previewImage({
      current: that.data.commentList[e.currentTarget.dataset.fuindex].geval_image[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: that.data.commentList[e.currentTarget.dataset.fuindex].geval_image // 需要预览的图片http链接列表
    });
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