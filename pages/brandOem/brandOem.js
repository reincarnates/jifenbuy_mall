// pages/special/fuliMall/fuliMall.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brandArr: [], //品牌数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log(options);
    wx.request({
      url: 'http://tapi.fulibuy.cn/Thematic/getThematic',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        at_id: options.id
      },
      success(res) {
        if (res.data.code) {
          res.data.data.floor.forEach(item => {
            if (item.type == 3) {
              item.data3.list.forEach(itemName => {
                if (itemName.source == '') {
                  itemName.source = '市场价';
                } else if (itemName.source == 'jd') {
                  itemName.source = '京东价';
                } else if (itemName.source == 'wyyx') {
                  itemName.source = '严选价';
                }
              });
            } else if (item.type == 6) {
              item.data6.list.forEach(itemName => {
                if (itemName.source == '') {
                  itemName.source = '市场价';
                } else if (itemName.source == 'jd') {
                  itemName.source = '京东价';
                } else if (itemName.source == 'wyyx') {
                  itemName.source = '严选价';
                }
              });
            }
          });
          _this.setData({
            brandArr: res.data.data.floor
          });
        }
      }
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