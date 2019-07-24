// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 88,
    isMore: true,
    currentData: 0,
    searchVal: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    const that = this;

    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {

      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //获取输入的值
  selectVal: function(e) {
    this.setData({
      searchVal: e.detail.value
    });
  },

  //搜索内容
  search: function(e) {
    wx.navigateTo({
      url: `/pages/listPage/listPage?keyWord=${e.detail.value}`
    });
  },

  searchClick: function() {
    wx.navigateTo({
      url: `/pages/listPage/listPage?keyWord=${this.data.searchVal}`
    });
  },

  //返回上一级页面
  returnBack: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  //查看更多历史记录
  moreHistory: function() {
    var query = wx.createSelectorQuery();
    var _this = this;
    query.select('.search-record-wrapper').boundingClientRect(function (rect) {
      _this.setData({
        height: rect.height + 'px',
        isMore: false
      })
    }).exec();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var query = wx.createSelectorQuery();
    var _this = this;
    query.select('.search-record-wrapper').boundingClientRect(function (rect) {
      if (rect.height <= _this.data.height) {
        _this.setData({
          isMore: false
        });
      } else {
        _this.setData({
          isMore: true
        });
      }
    }).exec();
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