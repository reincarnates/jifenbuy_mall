
let api = require('../../../utils/api.js');
var Moment = require('../../../utils/moment.js');

Page({
  data:{
    orderModel: null,
    phone:'',
    add_time:'',

    cancel_reason: [],
    reason_id: '',  // 取消原因id
    order_sn: '',   // 订单号
    isShowCancelView: false,
    cancel_bottom: '-100%',
    canScrollY: true,
  },

  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.showLoading({
      title: '加载中',
    });
    const self = this;
    api.ordersDetail({
      data: {
        "order_sn": options.order_sn
      },
      success(res) {
        let code = res.data.code;
        if (code == 200) {
          var phoneStr = res.data.data.reciver_info.mob_phone;
          phoneStr = phoneStr.replace(phoneStr.substring(3, 7), "****");
          let addtime = Moment(new Date(res.data.data.add_time*1000)).format('yyyy-MM-dd hh:mm:ss');

          self.setData({
            orderModel: res.data.data,
            phone: phoneStr,
            add_time: addtime
          });
          console.log(self.data.orderModel);
        }
      },
      fail(res) {
        wx.showToast({
          title: '加载错误',
        });
        wx.navigateBack();
      },
      complete(res) {
        wx.hideLoading();
      }
    });
  },

  // 订单功能操作
  tapFunctionButton: function (e) {
    const self = this;
    let title = e.currentTarget.dataset.title;
    if (title === "取消订单") {
      api.ordersCancelReason({
        success: (res) => {
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
    }
  },

  // 隐藏取消原因
  hideCancelView: function (e) {
    this.setData({
      cancel_bottom: '-100%',
      isShowCancelView: false,
      canScrollY: true
    });
  },

  radioChange: function (e) {
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

  sureCancelOrders: function (e) {
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

  copyOrderSN: function() {
    wx.setClipboardData({
      data: this.data.orderModel.order_sn,
    })
  },

})