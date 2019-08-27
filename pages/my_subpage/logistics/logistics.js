
let api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderModel: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
          let shipping_array = res.data.data.shipping_info.reverse();
          var order_model = res.data.data;
          for (let i = 0; i < shipping_array.length; i++) {
            var shipping_item = shipping_array[i];
            if (shipping_item.AcceptStation.indexOf('已签收') > -1) {
              shipping_item.title = '已签收';
            } else {
              shipping_item.title = '运送中';
            }
            let shipping_item_time = shipping_item.AcceptTime.split(' ');
            shipping_item.day = shipping_item_time[0].slice(5, shipping_item_time[0].length);
            shipping_item.time = shipping_item_time[1].slice(0, 5);
          }
          order_model.shipping_info = shipping_array;

          self.setData({
            orderModel: order_model,
          });
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
 
  copyLogisticsSN: function(e) {
    wx.setClipboardData({
      data: this.data.orderModel.express.shipping_code
    })
  }
})