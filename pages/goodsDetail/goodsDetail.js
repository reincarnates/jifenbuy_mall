// pages/goodsDetail/goodsDetail.js
var WxParse = require('../../wxParse/wxParse.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    statusBarHeight: app.globalData.statusBarHeight,
    returnPage: '../../images/detail_return.png',
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
    goodsNumber: 1,
    params: '-100%',
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
    checkWord: '请选择',
    goodsClass: '',
    goodsStorage: '', //商品库存
    pinjie: [], //创建串对象
    ispinjie: true, //是否已经创建
    cartNumber: 100, //购物车数量
    listCount: {}, //评论类别
    goodsSku: '', //商品sku
    source: '', //商城名称
    collectImg: '../../images/collection.png', //收藏商品状态图片
    collectStatus: '', //商品收藏的状态
    collectNum: 1, // 判断收藏/取消收藏
    nodes: '', //详情
    bgs: [], //背景图片
    imgs: [],
    imgs2: [],
    swiperIndex: 1, //轮播下标
    seleGoodsSku: '', //选择商品参数的sku
    confirmSku: '', //跳转提交订单的sku
    checkSkuData: '', //跳转提交订单的goods_sku
    quantity: 1, //商品数量
    goodsState: '', //商品是否下架
    bgColorBtn: '#fe9901', //商品下架按钮颜色
    bgColorBtn2: '#fe6601', //商品下架按钮颜色
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    _this.setData({
      goodsSku: options.id
    });
    wx.showLoading({ title: '加载中', mask: true });
    setTimeout(function() {
      wx.request({
        url: 'http://tapi.fulibuy.cn/goods/goodsDetail',
        method: 'POST',
        data: {
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          // sku: '4d5528fbf9',
          sku: options.id,
          type: 'html',
          server: 'is_wx'
        },
        success(res) {
          if (res.data.code) {
            var a = [];
            var res = res.data.data;
            a.push(res.goods_image);
            res.image_more.forEach(item => {
              a.push(item.goods_image);
              _this.setData({
                goodsImg: a,
              });
            });

            //循环处理参数内容，增加is_xuan
            res.spec_value_ar.forEach((element, key) => {
              element.forEach((item, index) => {
                item.is_xuan = false;
                element[0].is_xuan = true;
              });
            });

            if (res.favorites == 1) {
              _this.setData({
                collectImg: '../../images/collection_ac.png',
              });
            }

            //判断source是哪个商城
            if (res.source == '') {
              res.source = '市场价';
            } else if (res.source == 'jd') {
              res.source = '京东商城价';
            } else if (res.source == 'wyyx') {
              res.source = '网易严选价';
            }


            var imgs = res.mobile_body.match(/h[^']+g/g);
            var bgs = res.mobile_body.match(/background-image:url([^)]+)/g);
            var imgs2 = res.mobile_body.match(/img30[^"]+g/g);
            var imgs3 = res.mobile_body.match(/img10[^"]+g/g);

            //计算折扣率
            var discount = (res.goods_marketprice - res.goods_price) / res.goods_marketprice;

            //判断商品是否下架
            if (res.goods_state == 0) {
              _this.setData({
                bgColor: '#ccc',
                bgColor2: '#ccc',
              });
            }

            _this.setData({
              goodsName: res.goods_name,
              goodsPrice: res.goods_price,
              goodsSalenum: res.goods_salenum,
              goodsDiscount: parseInt(discount * 100),
              goodsMarketprice: res.goods_marketprice,
              goodsParams: res.spec_name,
              specName: res.spec_name,
              specValue: res.spec_value_ar,
              goodsImage: res.goods_image,
              skuData: res.sku_data,
              paramsPrice: res.goods_price,
              goodsClass: res.spec_name,
              listCount: res.comment.listCount,
              source: res.source,
              collectStatus: res.favorites,
              // nodes: res.mobile_body
              bgs: bgs,
              imgs: imgs,
              imgs2: imgs2 != undefined ? imgs2 : imgs3,
              confirmSku: res.sku,
              goodsState: res.goods_state,
              //如果是一条参数，默认取第一条数据
              goodsImage: res.sku_data[0].goods_image,
              paramsPrice: res.sku_data[0].goods_price,
              goodsClass: res.sku_data[0].goods_spec,
              checkWord: '已选择',
              goodsStorage: res.sku_data[0].goods_storage + res.sku_data[0].goods_unit,
              seleGoodsSku: res.sku_data[0].goods_sku,
              checkSkuData: res.sku_data[0].goods_sku
            });

            if (_this.data.goodsParams.length == 0) {
              _this.setData({
                checkSkuData: res.sku_data[0].goods_sku
              });
            }

            // console.log(_this.data.skuData[0].goods_sku);
            // var article = res.mobile_body;
            // WxParse.wxParse('article', 'html', article, _this, 0);

          }
          wx.hideLoading();
        }
      });
    }, 1000);

    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          winHeight: res.windowHeight
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //查看全部评论
  checkAll: function () {
    wx.navigateTo({
      url: `/pages/comment/comment?sku=${this.data.goodsSku}`
    });
  },

  scroll: function (e) {
    var _this = this;
    // console.log(e.detail.scrollTop);
    if (e.detail.scrollTop > 365) {
      _this.setData({
        columState: true,
        bgReturnColor: '#fff',
        textColor: '#999',
        bgColor: '#fff',
        returnPage: '../../images/detail_return2.png',
      });
    } else {
      _this.setData({
        columState: false,
        bgReturnColor: 'rgba(0, 0, 0, .3)',
        textColor: '#fff',
        bgColor: 'none',
        returnPage: '../../images/detail_return.png',
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
  checkParams: function (e) {
    var _this = this;
    _this.setData({
      params: '0',
      isParams: true
    });
  },

  checkParams2: function (e) {
    var _this = this;
    _this.newdobj();

    var pinjiein = 'pinjie[' + e.target.dataset.fuji + '].id';
    _this.setData({
      [pinjiein]: _this.data.specValue[e.target.dataset.fuji][e.target.dataset.index].id
    })
    var str = ''
    for (var o = 0; o < _this.data.pinjie.length; o++) {
      if (o == 0) {
        0
        if (_this.data.pinjie[0].id == null || _this.data.pinjie[0].id == "" || _this.data.pinjie[0].id == undefined) {

        } else {
          str += _this.data.pinjie[0].id + "-"
        }
      } else {
        if (_this.data.pinjie[o].id == null || _this.data.pinjie[o].id == "" || _this.data.pinjie[o].id == undefined) {

        } else {
          str += _this.data.pinjie[o].id + "-"
        }

      }
    }
    // console.log(str.substring(0, str.length - 1))

    var checkStr = str.substring(0, str.length - 1);
    _this.data.skuData.forEach(item => {
      if (checkStr == item.spec_compose) {
        // console.log(item);
        _this.setData({
          goodsImage: item.goods_image,
          paramsPrice: item.goods_price,
          goodsClass: item.goods_spec,
          checkWord: '已选择',
          goodsStorage: item.goods_storage + item.goods_unit,
          seleGoodsSku: item.goods_sku,
          checkSkuData: item.goods_sku
        });
      }
    });

    // console.log(_this.data.specValue[0][0])
    for (var i = 0; i < _this.data.specValue[e.target.dataset.fuji].length; i++) {
      var delzhuangtai = 'specValue[' + e.target.dataset.fuji + '].[' + i + '].is_xuan';
      _this.setData({
        [delzhuangtai]: false
      })
    }
    var iszhuangtai = 'specValue[' + e.target.dataset.fuji + '].[' + e.target.dataset.index + '].is_xuan';
    _this.setData({
      [iszhuangtai]: true
    });

    // console.log(_this.data.pinjie)
  },

  // 为id串添加对象
  newdobj: function () {
    var that = this
    if (that.data.ispinjie) {
      for (var i = 0; i < that.data.specValue.length; i++) {
        var nopin = that.data.pinjie;
        var pin = {}
        for (var r = 0; r < that.data.specValue[i].length; r++) {
          // if (that.data.specValue[i][r].is_xuan == true) {
          //   nopin.id = that.data.specValue[i][r].id;
          // } else {
          //   nopin.id = "";
          // }
          pin.id = "";
        }
        nopin.push(pin)
      }
      that.setData({
        pinjie: nopin
      })
    }
    that.setData({
      ispinjie: false
    })
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
        goodsNumber: _this.data.goodsNumber,
        quantity: _this.data.goodsNumber
      });
    }
  },

  //加商品数量
  plus: function () {
    var _this = this;
    _this.data.goodsNumber++;
    _this.setData({
      goodsNumber: _this.data.goodsNumber,
      quantity: _this.data.goodsNumber
    });
  },

  //加入购物车
  plusShopCart: function() {
    var _this = this;
    var user = wx.getStorageSync('userInfo');
    if(_this.data.goodsState == 1) {
      if (user != undefined && user != '') {
        if (_this.data.goodsParams.length != 0) {
          _this.checkParams();
        } else {
          _this.plusShopCartReq(_this.data.skuData[0].goods_sku);
        }
      } else {
        wx.navigateTo({
          url: '/pages/login/login'
        });
      }
    }
  },

  //选择参数加入购物车
  paramsAddCart: function() {
    var _this = this;
    _this.plusShopCartReq(_this.data.seleGoodsSku);
  },

  plusShopCartReq: function(sku) {
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/Cart/addCart',
      method: 'POST',
      data: {
        // sku: '6e728080b3',
        sku: _this.data.goodsSku,
        quantity: _this.data.goodsNumber,
        goods_sku: sku,
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id')
      },
      success(res) {
        if(res.data.code) {
          console.log(res);
          _this.closeParams();
          wx.showToast({
            title: '已加入购物车',
            icon: 'succes',
            duration: 1000,
            mask: true
          })
        }
      }
    })
  },

  //立即购买
  buyImdy: function () {
    var _this = this;
    var user = wx.getStorageSync('userInfo');
    if(_this.data.goodsState == 1) {
      if (user != undefined && user != '') {
        if (_this.data.goodsParams.length != 0) {
          _this.checkParams();
        } else {
          wx.navigateTo({
            url: `/pages/confirmOrder/confirmOrder?status=1&sku=${_this.data.confirmSku}&goodsSku=${_this.data.checkSkuData}&quantity=${_this.data.quantity}`
          });
        }
      } else {
        wx.navigateTo({
          url: '/pages/login/login'
        });
      }
    }
  },

  //选择参数立即购买
  buyNow: function() {
    var _this = this;
    var user = wx.getStorageSync('userInfo');
    if (user != undefined && user != '') {
      wx.navigateTo({
        url: `/pages/confirmOrder/confirmOrder?status=1&sku=${_this.data.confirmSku}&goodsSku=${_this.data.checkSkuData}&quantity=${_this.data.quantity}`
      });
    } else {
      wx.navigateTo({
        url: '/pages/login/login'
      });
    }
  },

  //收藏
  collect: function() {
    var _this = this;
    var user = wx.getStorageSync('userInfo');
    console.log(user.username);
    if (_this.data.collectNum == 1) {
      if (user.username != undefined && user.username != '') {
        _this.collectReq(user.username);
        _this.setData({
          collectNum: 2
        });
      } else {
        wx.navigateTo({
          url: '/pages/login/login'
        });
      }
    }else {
      _this.collectReq(user.username);
      _this.setData({
        collectNum: 1
      });
    }
  },

  //添加/取消收藏
  collectReq: function (userName) {
    var _this = this
    wx.request({
      url: 'http://tapi.fulibuy.cn/goods/userFavorites',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        sku: _this.data.goodsSku,
        username: userName,
        fav_type: 'goods'
      },
      success(res) {
        if(!res.code) {
          var res = res.data.data;  
          if (res.status == 1) {
            _this.setData({
              collectImg: '../../images/collection_ac.png',
            });
            wx.showToast({
              title: '收藏成功',
              icon: 'none',
              duration: 2000
            });
          }else{
            _this.setData({
              collectImg: '../../images/collection.png',
            });
            wx.showToast({
              title: '取消成功',
              icon: 'none',
              duration: 2000
            });
          }
        }
      }
    });
  },

  //跳转购物车页面
  shopCartUrl: function() {
    wx.switchTab({
      url: '/pages/tabBar/shopCart/shopCart'
    })
  },

  //获取轮播图的下标
  swiperchange: function (e) {
    this.setData({
      swiperIndex: e.detail.current + 1
    });
  },

  //禁止滑动
  move: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var _this = this;

    setTimeout(function() {
      if (_this.data.collectStatus == 1) {
        _this.setData({
          collectImg: '../../images/collection_ac.png'
        });
      }
    }, 1000);
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