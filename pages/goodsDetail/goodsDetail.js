// pages/goodsDetail/goodsDetail.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userToken: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjE3MTgxMDcsImV4cCI6MzEyMzQzNjIxNCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjEsIm5pY2tuYW1lIjoiXHU1NGM4XHU1NGM4XHU1NGM4IiwiY29tcGFueV9pZCI6NCwidXNlcm5hbWUiOiIxMzQzNjE4NzcyMyIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNC0yNCAxMTozNToxMyIsImRldmljZV9pZCI6ImZmYmNiNWVmZmY2YWEyOTQiLCJtYWluX3VybCI6Imh0dHA6XC9cL3Rlc3QuZnVsaWJ1eS5jbiJ9fQ.WxNSAWdLRhXPUZI5ybtSTBm5QCK9zecIUhqJbRp1AOA',
    deviceId: 'ffbcb5efff6aa294',
    statusBarHeight: app.globalData.statusBarHeight,
    returnPage: '<',
    goodsImg: [],
    bgReturnColor: 'rgba(0, 0, 0, .3)',
    textColor: '#fff',
    bgColor: 'none',
    columState: false,
    goTop: false,
    currentData: 0,
    maskHeight: '-100%',
    isCoupon: false,
    winHeight: 0,
    toView: '',
    returnHeight: '',
    isComment: false,
    isDetail: false,
    goodsNumber: 0,
    params: '0',
    isParams: false,
    goodsName: '', //商品名称
    goodsPrice: '', //商品现价
    goodsSalenum: '', //商品销量
    goodsDiscount: '', //商品折扣
    goodsMarketprice: '', //商品原价
    goodsImage: '', //商品图片
    goodsParams: [], //商品参数名称
    specName: [], //商品参数名称
    specValue: [], //商品参数内容
    skuData: [], //根据所选参数显示对应内容
    paramsPrice: '', //参数价格
    currentId: -1,
    currentId2: [],
    checkWord: '请选择',
    goodsClass: '',
    goodsStorage: '', //商品库存
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: 'http://tapi.fulibuy.cn/goods/goodsDetail',
      method: 'POST',
      data: {
        user_token: _this.data.userToken,
        device_id: _this.data.deviceId,
        sku: '7717fbd938',
        type: 'html',
        server: 'is_wx'
      },
      success(res) {
        if(res.data.code) {
          console.log(res.data.data);
          var a = [];
          var res = res.data.data;
          a.push(res.goods_image);
          res.image_more.forEach(item => {
            a.push(item.goods_image);
            _this.setData({
              goodsImg: a,
            });
          });

          _this.setData({
            goodsName: res.goods_name,
            goodsPrice: res.goods_price,
            goodsSalenum: res.goods_salenum,
            goodsDiscount: res.goods_discount,
            goodsMarketprice: res.goods_marketprice,
            goodsParams: res.spec_name,
            specName: res.spec_name,
            specValue: res.spec_value_ar,
            goodsImage: res.goods_image,
            skuData: res.sku_data,
            paramsPrice: res.goods_price,
            goodsClass: res.spec_name
          });
          // console.log(_this.data.skuData);
          // var article = res.mobile_body;
          // WxParse.wxParse('article', 'html', article, _this, 5);
          
        }
        wx.hideLoading();
      }
    });

    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          winHeight: res.windowHeight
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  scroll: function (e) {
    var _this = this;
    // console.log(e.detail.scrollTop);
    if (e.detail.scrollTop > 365) {
      _this.setData({
        columState: true,
        bgReturnColor: '#fff',
        textColor: '#999',
        bgColor: '#fff'
      });
    } else {
      _this.setData({
        columState: false,
        bgReturnColor: 'rgba(0, 0, 0, .3)',
        textColor: '#fff',
        bgColor: 'none'
      });
    }

    if (e.detail.scrollTop > 617) {
      _this.setData({
        goTop: true
      });
    } else {
      _this.setData({
        goTop: false
      });
    }

    if (e.detail.scrollTop == 616) {
      _this.setData({
        currentData: 1
      });
      console.log(1);
    } else if (e.detail.scrollTop == 902) {
      _this.setData({
        currentData: 2
      });
      console.log(2);
    }
  },

  onPageScroll: function (e) {
    var _this = this;
    if (e.scrollTop > 365) {
      _this.setData({
        columState: true,
        bgReturnColor: '#fff',
        textColor: '#999',
        bgColor: '#fff'
      });
    } else {
      _this.setData({
        columState: false,
        bgReturnColor: 'rgba(0, 0, 0, .3)',
        textColor: '#fff',
        bgColor: 'none'
      });
    }

    if (e.scrollTop > 617) {
      _this.setData({
        goTop: true
      });
    } else {
      _this.setData({
        goTop: false
      });
    }

    // if (e.scrollTop == 616) {
    //   _this.setData({
    //     currentData: 1
    //   });
    //   console.log(1);
    // } else if (e.scrollTop == 907) {
    //   _this.setData({
    //     currentData: 2
    //   });
    //   console.log(2);
    // }else {
    //   _this.setData({
    //     currentData: 0
    //   });
    // }
  },

  //返回顶部
  goTop: function () {
    this.setData({
      returnHeight: 0
    });
  },

  //返回上一页
  returnUp: function () {
    wx.navigateBack({
      delta: 1
    });
  },

  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const _this = this;
    var _index = e.target.dataset.current;

    _this.setData({
      currentData: e.target.dataset.current
    });

    if (_index == 0) {
      _this.setData({
        returnHeight: 0
      });
    } else if (_index == 1) {
      _this.setData({
        toView: 'mao1',
        isComment: true,
        isDetail: false
      });
    } else if (_index == 2) {
      _this.setData({
        toView: 'mao2',
        isComment: false,
        isDetail: true
      });
    }
  },

  //弹出优惠券页面
  alertCoupon: function () {
    var _this = this;
    _this.setData({
      maskHeight: '0',
      isCoupon: true
    });
  },

  //关闭优惠券页面
  closeCoupon: function () {
    var _this = this;
    _this.setData({
      maskHeight: '-100%',
      isCoupon: false
    });
  },

  //优惠券点击完成
  completeCoupon: function () {
    var _this = this;
    _this.closeCoupon();
  },

  //弹出选择参数页面
  checkParams: function () {
    var _this = this;
    _this.setData({
      params: '0',
      isParams: true
    });
  },

  //关闭选择参数页面
  closeParams: function () {
    var _this = this;
    _this.setData({
      params: '-100%',
      isParams: false
    });
  },

  //减商品数量
  reduce: function () {
    var _this = this;
    if (_this.data.goodsNumber > 0) {
      _this.data.goodsNumber--;
      _this.setData({
        goodsNumber: _this.data.goodsNumber
      });
    }
  },

  //加商品数量
  plus: function () {
    var _this = this;
    _this.data.goodsNumber++;
    _this.setData({
      goodsNumber: _this.data.goodsNumber
    });
  },

  //选择商品参数
  checkParams: function(e) {
    const _this = this;
    var _index = e.currentTarget.dataset.id;
    _this.setData({
      currentId: _index
    });
    _this.data.currentId2 += _index + '-';
    var checkStr = _this.data.currentId2.substring(0, _this.data.currentId2.length - 1);
    _this.data.skuData.forEach(item => {
      // console.log(item.spec_compose);
      // console.log(11111, checkStr);
      if (checkStr == item.spec_compose) {
        console.log(item);
        _this.setData({
          goodsImage: item.goods_image,
          paramsPrice: item.goods_price,
          goodsClass: item.goods_spec,
          checkWord: '已选择',
          goodsStorage: item.goods_storage + item.goods_unit
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.loadFontFace({
      family: 'tw',
      source: 'url("https://reincarnation.oss-cn-beijing.aliyuncs.com/font/%E6%A5%B7%E4%BD%93_GB2312.ttf")',
      desc: {
        style: 'normal',
        weight: 'normal',
        variant: 'normal'
      }
    })
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