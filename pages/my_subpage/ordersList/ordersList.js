
let api = require('../../../utils/api.js');
const app = getApp();

// var canLoadMore = true;
var loding = false;
var page_num = 1;


Page({

  data: {
    windowWidth: app.systemInfo.windowWidth,
    windowHeight: app.systemInfo.windowHeight,

    sliderOffset: 0,
    sliderLeft: 22,
    sliderWidth: 64,
    canLoadMore: true,

    tabs: ['全部', '待付款', '待发货', '待收货', '已完成'],
    orders_list: [],
    cancel_reason: [],
    reason_id: '',  // 取消原因id
    order_sn: '',   // 订单号

    state_id: '',  // 订单类型
    keyword: '', // 搜索关键词

    isShowCancelView: false,
    cancel_bottom: '-100%',
    canScrollY: true,

    focus: false,
    isSearch: false, //是否是搜索页
  },

  onLoad: function (options) {
    const self = this;
    let orders_state = options.order_state;
    let isSearchPage = options.isSearchPage == '1';
    let item_width = self.data.windowWidth/self.data.tabs.length;

    this.setData({
      state_id: orders_state,
      isSearch: isSearchPage,
      sliderWidth: orders_state == '0' ? 64 : 96,
      sliderOffset: item_width*(orders_state == '5' ? 4 : orders_state) + (orders_state == '0' ? 0 : -8),
    });

    wx.setNavigationBarTitle({
      title: this.data.isSearch ? '搜索订单' : '我的订单',
    });

    if (!this.data.isSearch) {
      this.ordersList();
    } 
  },

  onShow: function(options) {
    if (this.data.isSearch) {
      this.setData({
        focus: true
      });
    }
  },

  // 刷新
  onPullDownRefresh: function () {
    this.setData({
      canLoadMore: true
    });
    page_num = 1;
    this.ordersList();
  },

  // 加载更多 
  onReachBottom: function () {
    if (loding || !this.data.canLoadMore) {
      return;
    }
    page_num++;
    loding = true;
    this.ordersList();
  },

  // 订单列表
  ordersList: function(e) {
    wx.showLoading({
      title: '加载中...',
    })

    const self = this;
    api.ordersList({
      data: {
        'order_state': self.data.state_id,
        'page': page_num,
        'keyword' : self.data.keyword,
      },
      success:(res) => {
        console.log(res);
        var order_list = res.data.data.list ? res.data.data.list : [];
        if (order_list.length < 10) {
          self.setData({
            canLoadMore: false
          });
        }
        if (order_list.length > 0) {
          if (page_num > 1) {
            order_list = self.data.orders_list.concat(order_list);
          }
          self.setData({
            orders_list: order_list
          });
        } 
      },
      fail(res) {
        wx.showToast({
          title: '加载错误',
          icon: 'none',
        })
      },
      complete(res) {
        loding = false;
         wx.hideLoading();
         wx.stopPullDownRefresh();
      },
    })
  },

  // segment 点击
  tabClick: function(e) {
    const self = this;
    var index = e.currentTarget.id;
    this.setData({
      state_id: index,
      sliderWidth: e.currentTarget.id == '0' ? 64 : 96,
      sliderOffset: e.currentTarget.offsetLeft + (e.currentTarget.id == '0' ? 0 : -8),
      orders_list: []
    });
    self.ordersList();
  },

  // 订单详情
  viewOrdersDetail: function(e) {
    wx.navigateTo({
      url: '/pages/my_subpage/ordersDetail/ordersDetail?order_sn=' + e.currentTarget.dataset.ordersn,
    });
    this.setData({
      order_sn: e.currentTarget.dataset.ordersn
    });
  },

  // 订单功能操作
  tapFunctionButton: function(e) {
    const self = this;
    let order_model = e.currentTarget.dataset.order;
    let title = e.currentTarget.dataset.title;

    if (title === "取消订单") {
      api.ordersCancelReason({
        success:(res) => {
          self.setData({
            cancel_reason: res.data.data.list
          });
        }
      });
      this.setData({
        cancel_bottom: '0',
        isShowCancelView: true,
        canScrollY: false
      });
    } else if (title == '确认收货') {
      wx.showModal({
        title: '',
        content: '为保障您的售后权益,请收到货确认无误后,再确认收货',
        confirmColor: '#ef6601',
        success(res) {
          if (res.confirm) {
            api.confirmOrders({
              data: {
                'order_sn': order_model.order_sn,
                'order_id': order_model.order_id
              },
              success(res) {
                wx.showToast({
                  title: '收货成功',
                });
                self.ordersList();
              },
              fail(res) {
                wx.showToast({
                  title: '收货失败',
                });
              }
            });
          }
        }
      })
    } else if (title == '查看物流') {
       wx.navigateTo({
         url: '/pages/my_subpage/logistics/logistics?order_sn=' + order_model.order_sn,
       })
    } else if (title == '评价' || title == '查看评价') {
      wx.navigateTo({
        url: '/pages/my_subpage/orderEvaluetion/orderEvaluetion?order_sn=' + order_model.order_sn,
      })
    }
  },

  // 隐藏取消原因
  hideCancelView: function(e) {
    this.setData({
      cancel_bottom: '-100%',
      isShowCancelView: false,
      canScrollY: true
    });
  },

  radioChange: function(e) {
    console.log(e);
    var cancel_reason = this.data.cancel_reason, index = e.detail.value;
    for (var i = 0; i < cancel_reason.length; i++) {
      cancel_reason[i].checked = false;
    }
    cancel_reason[index].checked = true;
    let select_reason = cancel_reason[index];
    this.setData({
      reason_id: select_reason.reason_id,
      cancel_reason: cancel_reason
    });
  },

  sureCancelOrders: function(e) {
    const self = this;
    api.preSaleCancel({
      data: {
        order_sn: self.data.order_sn,
        reason_id: self.data.reason_id
      },
      success(res) {
        wx.showToast({
          title: '取消成功',
        });
        this.ordersList();
      },
      fail(res) {
        wx.showToast({
          title: '取消失败',
        })  
      }
    });
  },

  pushtoSearch: function(e) {
    if (this.data.isSearch == '0') {
      wx.navigateTo({
        url: '/pages/my_subpage/ordersList/ordersList?order_state=' + e.currentTarget.id + '&isSearchPage=1',
      });
    }
  },

  willInputText: function(e) {
    this.setData({
      focus: true
    });
  },

  doneInputText: function (e) {
    page_num = 1;
    this.setData({
      focus: false,
      orders_state: '0',
      keyword: e.detail.value
    });
    this.ordersList();
  },

  cancelSearch: function(e) {
    this.setData({
      focus:false
    });
    wx.navigateBack({});
  },

  move: function () { },
})