// pages/screen/screen.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjE3MTgxMDcsImV4cCI6MzEyMzQzNjIxNCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjEsIm5pY2tuYW1lIjoiXHU1NGM4XHU1NGM4XHU1NGM4IiwiY29tcGFueV9pZCI6NCwidXNlcm5hbWUiOiIxMzQzNjE4NzcyMyIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNC0yNCAxMTozNToxMyIsImRldmljZV9pZCI6ImZmYmNiNWVmZmY2YWEyOTQiLCJtYWluX3VybCI6Imh0dHA6XC9cL3Rlc3QuZnVsaWJ1eS5jbiJ9fQ.WxNSAWdLRhXPUZI5ybtSTBm5QCK9zecIUhqJbRp1AOA',
    deviceId: 'ffbcb5efff6aa294',
    brandArr: [], //品牌
    store: [], //店铺
    brandHeight: '141px',
    isShowCheck: true,
    currentData: -1, //品牌选中样式
    currentData2: -1, //品牌选中样式
    shopCurrent: -1, //店铺选中样式
    shopCurrent2: -1, //店铺选中样式
    minVal: '', //价格区间最小值
    maxVal: '', //价格区间最大值
    brandId: '', //品牌id
    source: '', //店铺val
    classId: '', //分类id
    keyWord: '',  //商品关键字
    election: '', //选中的品牌
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      classId: options.id,
      keyWord: options.keyWord
    });
    var _this = this;
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: 'http://tapi.fulibuy.cn/Search/searchGoods',
      data: {
        keyword: options.keyWord != 'undefined' ? options.keyWord : '',
        // keyword: '衣服',
        // id: options.classId != 'undefined' ? options.classId : '',
        page: 1,
        sort: 'asc',
        sortField: '',
        // ev: '',
        // brandId: '',
        // source: '',
        user_token: _this.data.userToken,
        device_id: _this.data.deviceId
      },
      method: "POST",
      success(res) {
        if(res.data.code) {
          _this.setData({
            brandArr: res.data.data.brand,
            store: res.data.data.store
          });
        }
        wx.hideLoading();
        // console.log(_this.data.brandArr, _this.data.store);
      }
    })
  },

  //查看全部品牌
  checkAll: function() {
    var query = wx.createSelectorQuery();
    //选择id
    var that = this;
    query.select('.screen-brand-item-wrapper').boundingClientRect(function (rect) {
      that.setData({
        brandHeight: rect.height + 'px',
        isShowCheck: false
      });
    }).exec();
  },

  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current,
      shopCurrent: e.detail.shopcur
    })
  },

  //选择品牌
  checkBrand: function(e) {
    const _this = this;
    var _index = e.target.dataset.current;
    // if (_this.data.currentData === e.target.dataset.current) {
    // return false;
    // } else {
    _this.setData({
      currentData: e.target.dataset.current,
      currentData2: e.target.dataset.current,
      election: e.target.dataset.name,
      brandId: e.target.dataset.id
    });
    wx.setStorage({
      key: 'checkBrand',
      data: e.target.dataset.current
    });
  },

  //选择店铺
  checkShop: function(e) {
    const _this = this;
    var _index = e.target.dataset.current;
    // if (_this.data.currentData === e.target.dataset.current) {
    // return false;
    // } else {
    _this.setData({
      shopCurrent: e.target.dataset.shopcur,
      shopCurrent2: e.target.dataset.shopcur,
      source: e.target.dataset.val
    });
    wx.setStorage({
      key: 'checkShop',
      data: e.target.dataset.shopcur
    });
  },

  //重置
  resetScreen: function() {
    var _this = this;
    wx.setStorage({
      key: 'checkBrand',
      data: '-1'
    });
    wx.setStorage({
      key: 'checkShop',
      data: '-1'
    });
    wx.setStorage({
      key: 'minVal',
      data: ''
    });
    wx.setStorage({
      key: 'maxVal',
      data: ''
    });

    _this.setData({
      currentData: -1,
      currentData2: -1,
      shopCurrent: -1,
      shopCurrent2: -1,
      minVal: '',
      maxVal: '',
    });
  },

  //确认
  confirmScreen: function() {
    var _this = this;
    let pages = getCurrentPages();//当前页面    （pages就是获取的当前页面的JS里面所有pages的信息）
    let prevPage = pages[pages.length - 2];//上一页面（prevPage 就是获取的上一个页面的JS里面所有pages的信息）
    wx.request({
      url: 'http://tapi.fulibuy.cn/Search/searchGoods',
      data: {
        keyword: _this.data.keyWord != undefined ? _this.data.keyWord : '',
        // keyword: '衣服',
        id: _this.data.classId != undefined ? _this.data.classId : '',
        page: 1,
        sort: 'asc',
        sortField: '',
        ev: _this.data.minVal + '-' + _this.data.maxVal,
        brandId: _this.data.brandId,
        source: _this.data.source,
        user_token: _this.data.userToken,
        device_id: _this.data.deviceId
      },
      method: "POST",
      success(res) {
        console.log(res);
        if(res.data.code) {
          var a = prevPage.handleData(res.data.data.goods_list);
          prevPage.setData({
            goodsList: a,
            waterfall: a,
            minVal: _this.data.minVal,
            maxVal: _this.data.maxVal,
            brandId: _this.data.brandId,
            source: _this.data.source,
          });
        }
      },
      fail(data) {
        console.log(data);
      }
    });

    wx.navigateBack({
      delta: 1
    })
  },

  //获取最小值
  minEvent: function(e) {
    var _this = this;
    _this.setData({
      minVal: e.detail.value
    });

    wx.setStorage({
      key: 'minVal',
      data: e.detail.value
    });
  },

  //获取最大值
  maxEvent: function (e) {
    var _this = this;
    _this.setData({
      maxVal: e.detail.value
    });

    wx.setStorage({
      key: 'maxVal',
      data: e.detail.value
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
    var query = wx.createSelectorQuery();
    var _this = this;
    setTimeout(function() {
      query.select('.screen-brand-item-wrapper').boundingClientRect(function (rect) {
        if (rect.height <= 141) {
          _this.setData({
            isShowCheck: false
          });
        } else {
          _this.setData({
            isShowCheck: true
          });
        }
      }).exec();
    }, 1000);

    wx.getStorage({
      key: 'checkBrand',
      success(res) {
        _this.setData({
          currentData2: res.data
        });
      }
    });

    wx.getStorage({
      key: 'checkShop',
      success(res) {
        _this.setData({
          shopCurrent2: res.data
        });
      }
    });
    
    wx.getStorage({
      key: 'minVal',
      success(res) {
        _this.setData({
          minVal: res.data
        });
      }
    });

    wx.getStorage({
      key: 'maxVal',
      success(res) {
        _this.setData({
          maxVal: res.data
        });
      }
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