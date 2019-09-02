// pages/my_subpage/interestManage/interestManage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    interest: [], //兴趣
    height: 0,
    interestId: [], //兴趣id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/member/getMemberCateList',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
      },
      success(res) {
        if(res.data.code) {
          res.data.data.forEach(item => {
            if(item.choose) {
              _this.data.interestId.push(item.gc_id);
            }
          });
          _this.setData({
            interest: res.data.data,
            interestId: _this.data.interestId
          });
        }
      }
    });
    this.setData({
      height: wx.getSystemInfoSync().windowHeight
    })
  },

  //选择兴趣
  checkInterest: function(e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.curid;
    _this.data.interest[index].choose = !_this.data.interest[index].choose;
    if (_this.data.interest[index].choose) {
      _this.data.interestId.push(id);
    }else{
      var _index = _this.data.interestId.indexOf(id);
      _this.data.interestId.splice(_index, 1);
    }
    console.log(_this.data.interestId);
    _this.setData({
      interest: _this.data.interest,
      interestId: _this.data.interestId
    });
  },

  //确定设置
  confirmInterest: function() {
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/member/saveMemberCateList',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        gc_id: _this.data.interestId.join(',')
      },
      success(res) {
        if(res.data.code) {
          wx.showToast({
            title: '设置成功',
            icon: 'success',
            duration: 2000
          });
          setTimeout(function() {
            wx.navigateBack({
              delta: 1
            });
          }, 500);
        }
      }
    })
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