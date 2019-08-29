let api = require('../../../utils/api.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluateModel: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    api.orderEvaluetion({
      data: {
        order_sn: options.order_sn
      },
      success(res) {
        let code = res.data.code;
        if (code == 200) {
          self.setData({
            evaluateModel: res.data.data,
          });
          console.log(self.data.evaluateModel);
        }
      },
      fail(res) {
        wx.showToast({
          title: '加载错误',
        });
        wx.navigateBack();  
      },
      complete(res) {

      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

})