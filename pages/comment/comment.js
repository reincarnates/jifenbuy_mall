// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    currentIndex: 0,
    listCount: {}, //评论类型数量
    commentList: [], //评论条数
    goodsSku: '', //商品sku
    page: 1, //商品页数
    orderState: 0, //评论类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log(options);
    _this.setData({
      goodsSku: options.sku
    });
    wx.showLoading({ title: '加载中', mask: true });
    wx.request({
      url: 'http://tapi.fulibuy.cn/Goods/getGoodsEvaluate',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        // sku: 'ZY6ec8d9147c',
        sku: options.sku,
        order_state: 0,
        page: 1,
        per_page: 10
      },
      success(res) {
        var data = res.data.data;
        if (res.data.code == 200) {  
          _this.setData({
            listCount: data.listCount,
            commentList: data.list
          });
        } else if (res.data.code == 1000001) {
          wx.navigateTo({
            url: '/pages/login/login',
          })
        }
        wx.hideLoading();
      }
    });

    wx.getSystemInfo({
      success(res) {
        _this.setData({
          height: res.windowHeight
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //选择评论类型
  checkType: function (e) {
    var _this = this;
    var _index = e.currentTarget.dataset.index;
    _this.setData({
      currentIndex: _index
    });

    if (_index == 2) {
      wx.showLoading({ title: '加载中', mask: true });
      _this.returnType(1);
      _this.setData({
        orderState: 1
      });
    } else if (_index == 4) {
      wx.showLoading({ title: '加载中', mask: true });
      _this.returnType(2);
      _this.setData({
        orderState: 4
      });
    }
  },

  //根据评论类型返回对应的数据
  returnType: function(type) {
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/Goods/getGoodsEvaluate',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        // sku: 'ZY6ec8d9147c',
        sku: _this.data.goodsSku,
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
    var _this = this;
    _this.data.page++;
    wx.showLoading({ title: '加载中', mask: true });
    wx.request({
      url: 'http://tapi.fulibuy.cn/Goods/getGoodsEvaluate',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        // sku: 'ZY6ec8d9147c',
        sku: options.sku,
        order_state: _this.data.orderState,
        page: _this.data.page,
        per_page: 10
      },
      success(res) {
        var data = res.data.data;
        if (res.data.code) {
          _this.setData({
            // listCount: _this.data.listCount.concat(data.listCount),
            commentList: _this.data.commentList.concat(data.list)
          });
          if (data.list.length == 0) {
            wx.showToast({
              title: '没有更多评论',
              icon: 'none',
              duration: 2000
            })
          }
        }
        wx.hideLoading();
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})