// pages/listPage/listPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjE3MTgxMDcsImV4cCI6MzEyMzQzNjIxNCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjEsIm5pY2tuYW1lIjoiXHU1NGM4XHU1NGM4XHU1NGM4IiwiY29tcGFueV9pZCI6NCwidXNlcm5hbWUiOiIxMzQzNjE4NzcyMyIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNC0yNCAxMTozNToxMyIsImRldmljZV9pZCI6ImZmYmNiNWVmZmY2YWEyOTQiLCJtYWluX3VybCI6Imh0dHA6XC9cL3Rlc3QuZnVsaWJ1eS5jbiJ9fQ.WxNSAWdLRhXPUZI5ybtSTBm5QCK9zecIUhqJbRp1AOA',
    deviceId: 'ffbcb5efff6aa294',
    currentData: 0,
    goodsList: '',
    waterfall: '',
    page: 0, //当前页数
    pagecount: 0, //列表总页数
    classId: 0, //分类id
    keyWord: '',
    flag: 1,
    argum: {
      sort: '综合排序',
      sort2: 'asc'
    },
    isOrdinary: true,
    isWaterfall: false,
    changeState: 1,
    iconClass: 'icon-shangxiajiantou',
    floorstatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options);
    this.setData({
      classId: options.id,
      keyWord: options.keyWord
    });
    var _this = this;
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: 'http://tapi.fulibuy.cn/Search/searchGoods',
      data: {
        keyword: options.keyWord != undefined ? options.keyWord : '',
        // keyword: '衣服',
        id: options.id != undefined ? options.id : '',
        page: 1,
        sort: 'asc',
        sortField: '综合排序',
        // ev: '',
        // brandId: '',
        // source: '',
        user_token: _this.data.userToken,
        device_id: _this.data.deviceId
      },
      method: "POST",
      success(res) {
        _this.setData({
          goodsList: _this.handleData(res.data.data.goods_list),
          waterfall: _this.handleData(res.data.data.goods_list),
          pagecount: res.data.data.pagecount
        });
        wx.hideLoading();
        // console.log(_this.data.goodsList);
      },
      fail(data) {
        wx.hideLoading();
        console.log(data);
        wx.showToast({
          title: data.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },

  handleData: function(data) {
    var arr = [];
    for (var i = 0; i < data.length; i++) {
      arr.push({
        goods_image: data[i].goods_image,
        goods_ad_words: data[i].goods_ad_words,
        goods_price: data[i].goods_price,
        goods_marketprice: data[i].goods_marketprice,
        store_name: data[i].store_name,
      });
    }
    return arr;
  },

  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })
  },

  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const _this = this;
    var _index = e.target.dataset.current;
    // if (_this.data.currentData === e.target.dataset.current) {
      // return false;
    // } else {
      _this.setData({
        currentData: e.target.dataset.current
      })
    // }
    _this.goTop();
    if (_index == 0) {
      _this.data.argum.sort = '综合排序';
      _this.data.argum.sort2 = '';
      _this.requestList(_this.data.argum);
    } else if (_index == 1) {
      _this.data.argum.sort = 'salenum';
      _this.data.argum.sort2 = '';
      _this.requestList(_this.data.argum);
    }

    if (_index == 2) {
      if (_this.data.flag == 1) {
        _this.setData({
          iconClass: 'icon-jiantou'
        });
        _this.data.argum.sort = 'price';
        _this.data.argum.sort2 = 'asc';
        _this.requestList(_this.data.argum);
        _this.data.flag = 2;
      } else {
        _this.data.argum.sort = 'price';
        _this.data.argum.sort2 = 'desc';
        _this.requestList(_this.data.argum);
        _this.data.flag = 1;
        _this.setData({
          iconClass: 'icon-jiantou-copy'
        });
      }
    }else{
      _this.setData({
        iconClass: 'icon-shangxiajiantou'
      });
    }

    if (_index == 3) {
      wx.navigateTo({
        url: `/pages/screen/screen?keyword=${_this.data.keyWord}&classId=${_this.data.classId}`,
      })
    }
  },

  //切换样式
  changeStyle: function() {
    this.goTop();
    if (this.data.changeState == 1) {
      this.setData({
        isWaterfall: true,
        isOrdinary: false
      });
      this.data.changeState = 2;
    }else{
      this.setData({
        isWaterfall: false,
        isOrdinary: true
      });
      this.data.changeState = 1;
    }
  },

  requestList: function (argus) {
    var _this = this;
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: 'http://tapi.fulibuy.cn/Search/searchGoods',
      data: {
        keyword: _this.data.keyWord != undefined ? _this.data.keyWord : '',
        // keyword: '衣服',
        id: _this.data.classId != undefined ? _this.data.classId : '',
        page: 1,
        sort: argus.sort2,
        sortField: argus.sort,
        // ev: '',
        // brandId: '',
        // source: '',
        user_token: _this.data.userToken,
        device_id: _this.data.deviceId
      },
      method: "POST",
      success(res) {
        _this.setData({
          goodsList: _this.handleData(res.data.data.goods_list),
          waterfall: _this.handleData(res.data.data.goods_list),
          pagecount: res.data.data.pagecount
        });
        wx.hideLoading();
        // console.log(_this.data.goodsList, res.data.data);
      }
    })
  },

  returnSearch: function() {
    // 获取页面栈
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; // 当前页
    var prevPage = pages[pages.length - 2]; // 上一个页面
    // 如果存在上一页
    if (prevPage.route == 'pages/search/search') {
      // 可以调用上一页的函数
      prevPage.changeDataPageA();
      wx.navigateBack({
        delta: 1
      })
    }else{
      // wx.navigateBack({
      //   delta: 1
      // })
      wx.navigateTo({
        url: '/pages/search/search'
      });
    }
  },

  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 100) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  
  //返回顶部
  goTop: function() {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
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
    // 获取页面栈
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1]; // 当前页
    var prevPage = pages[pages.length - 2]; // 上一个页面
    var data = prevPage.data // 获取上一页data里的数据
    // 如果存在上一页
    if (prevPage.route == 'pages/search/search') {
      // 可以调用上一页的函数
      prevPage.changeDataPageA();
    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log(1);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this;
    _this.data.page++;
    wx.showLoading({ title: '加载中' });
    if (_this.data.page < _this.data.pagecount) {
      wx.request({
        url: 'http://tapi.fulibuy.cn/Search/searchGoods',
        data: {
          keyword: _this.data.keyWord != undefined ? _this.data.keyWord : '',
          // keyword: '衣服',
          id: _this.data.classId != undefined ? _this.data.classId : '',
          page: _this.data.page,
          sort: _this.data.argum.sort2,
          sortField: _this.data.argum.sort,
          // ev: '',
          // brandId: '',
          // source: '',
          user_token: _this.data.userToken,
          device_id: _this.data.deviceId
        },
        method: "POST",
        success(res) {
          _this.setData({
            goodsList: _this.data.goodsList.concat(_this.handleData(res.data.data.goods_list)),
            waterfall: _this.data.goodsList.concat(_this.handleData(res.data.data.goods_list))
          });
          wx.hideLoading();
        }
      })
    }else{
      wx.showToast({
        title: '已经没有商品啦~',
        icon: 'none',
        duration: 2000
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})