// pages/goodsOften/goodsOften.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    often: [], //常购商品列表
    page: 1, //页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: 'http://tapi.fulibuy.cn/Goodsoften/goodsOftenList',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        page: 1,
        per_page: 10
      },
      success(res) {
        if (res.data.code) {
          _this.setData({
            often: res.data.data.data
          });
          wx.hideLoading();
        }
      }
    })
  },

  //跳转商品详情
  locationDeatil: function(e) {
    wx.navigateTo({
      url: `/pages/goodsDetail/goodsDetail?id=${e.currentTarget.dataset.sku}`
    });
  },

  //删除商品
  removeGoods: function(e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    wx.request({
      url: 'http://tapi.fulibuy.cn/Goodsoften/delGoodsOften',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        goods_sku: e.currentTarget.dataset.sku
      },
      success(res) {
        if(res.data.code) {
          _this.data.often.splice(index, 1);
          _this.setData({
            often: _this.data.often
          });
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    })
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

  //滑动删除
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.often.forEach(function (v, i) {
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    });
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      often: this.data.often
    })
  },

  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
          X: touchMoveX,
          Y: touchMoveY
        });

    that.data.often.forEach(function (v, i) {
      v.isTouchMove = false

      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }

    })
    //更新数据
    // console.log(that.data.cardTeams)
    that.setData({
      often: that.data.often
    })

  },

  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  drawEnd: function () {

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
    var _this = this;
    _this.data.page++;
    wx.showLoading({ title: '加载中' });
    //推荐
    wx.request({
      url: 'http://tapi.fulibuy.cn/Goodsoften/goodsOftenList',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        page: _this.data.page,
        per_page: '10'
      },
      success(res) {
        if (res.data.code) {
          if (res.data.data.data.length != 0) {
            _this.setData({
              often: _this.data.often.concat(res.data.data.data)
            });
            wx.hideLoading();
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '没有更多商品',
              icon: 'none',
              duration: 2000
            });
          }
        }
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})