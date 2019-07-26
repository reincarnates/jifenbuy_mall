// pages/classification/classification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topCategory: [], //一级分类数组
    categoryChild: '', //子类分类
    num: 0,
    topId: 0,
    userToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjE3MTgxMDcsImV4cCI6MzEyMzQzNjIxNCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjEsIm5pY2tuYW1lIjoiXHU1NGM4XHU1NGM4XHU1NGM4IiwiY29tcGFueV9pZCI6NCwidXNlcm5hbWUiOiIxMzQzNjE4NzcyMyIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNC0yNCAxMTozNToxMyIsImRldmljZV9pZCI6ImZmYmNiNWVmZmY2YWEyOTQiLCJtYWluX3VybCI6Imh0dHA6XC9cL3Rlc3QuZnVsaWJ1eS5jbiJ9fQ.WxNSAWdLRhXPUZI5ybtSTBm5QCK9zecIUhqJbRp1AOA',
    deviceId: 'ffbcb5efff6aa294',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({ title: '加载中' });
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/Category/getCategoryParent',
      method: 'post',
      data: {
        user_token: _this.data.userToken,
        device_id: _this.data.deviceId
      },
      success(res) {
        if(res.data.code) {
          _this.setData({
            topCategory: res.data.data,
            topId: res.data.data[0].gc_id
          });
          wx.request({
            url: 'http://tapi.fulibuy.cn/Category/getCategoryChildren',
            method: 'post',
            data: {
              user_token: _this.data.userToken,
              device_id: _this.data.deviceId,
              gc_id: res.data.data[0].gc_id
            },
            success(res) {
              if(res.data.code) {
                _this.setData({
                  categoryChild: res.data.data
                });
                wx.hideLoading();
              }
            }
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //跳转列表
  jumpList: function(e) {
    var classId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/listPage/listPage?id=${classId}`
    });
  },

  //跳转至搜索页
  jumpSearch: function () {
    wx.navigateTo({
      url: '/pages/search/search'
    });
  },

  scanCode() {
    wx.scanCode({
      success(res) {
        console.log(res)
      }
    })
  },
  
  switchTab: function (e) {
    let id = e.currentTarget.dataset.id,
      index = parseInt(e.currentTarget.dataset.index);
    this.curIndex = parseInt(e.currentTarget.dataset.index);
    var _this = this;
    this.setData({
      curNavId: id,
      curIndex: index,
      num: index
    });
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: 'http://tapi.fulibuy.cn/Category/getCategoryChildren',
      method: 'post',
      data: {
        user_token: _this.data.userToken,
        device_id: _this.data.deviceId,
        gc_id: id
      },
      success(res) {
        if (res.data.code) {
          var query = wx.createSelectorQuery();
          query.select('.cification-onemenu-right').boundingClientRect(function (rect) {
            wx.pageScrollTo({
              scrollTop: 0
            })
          }).exec();
          _this.setData({
            categoryChild: res.data.data
          });
          wx.hideLoading();
        }
      }
    })
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
    var _this = this;
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: 'http://tapi.fulibuy.cn/Category/getCategoryChildren',
      method: 'post',
      data: {
        user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjE3MTgxMDcsImV4cCI6MzEyMzQzNjIxNCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjEsIm5pY2tuYW1lIjoiXHU1NGM4XHU1NGM4XHU1NGM4IiwiY29tcGFueV9pZCI6NCwidXNlcm5hbWUiOiIxMzQzNjE4NzcyMyIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNC0yNCAxMTozNToxMyIsImRldmljZV9pZCI6ImZmYmNiNWVmZmY2YWEyOTQiLCJtYWluX3VybCI6Imh0dHA6XC9cL3Rlc3QuZnVsaWJ1eS5jbiJ9fQ.WxNSAWdLRhXPUZI5ybtSTBm5QCK9zecIUhqJbRp1AOA',
        device_id: 'ffbcb5efff6aa294',
        gc_id: _this.data.topId
      },
      success(res) {
        if (res.data.code) {
          _this.setData({
            categoryChild: res.data.data
          });
          wx.hideLoading();
        }
      }
    })
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