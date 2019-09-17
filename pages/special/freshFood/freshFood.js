// pages/special/fuliMall/fuliMall.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerImg: [], //banner图片
    special: [], //专题商品
    navName: [], //导航名称
    eveyDay: [], //每日鲜
    currentData: 0, //选中标题的下标
    winHeight: 0, //设备高度
    toView: '', //跳转id
    posVal: '', //导航定位
    isNav: false,
    top: 0,
    isid:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/Thematic/getThematic',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        // at_id: options.id
        at_id: 55
      },
      success(res) {
        console.log(res);
        if (res.data.code) {
          _this.setData({
            navName: res.data.data.nav
          });
          res.data.data.floor.forEach(item => {
            item.forEach(element => {
              if (element.type == 8) {
                _this.setData({
                  bannerImg: _this.data.bannerImg.concat(element)
                });
              } else if (element.type == 6) {
                element.data6.list.forEach(itemName => {
                  if (itemName.source == '') {
                    itemName.source = '市场价';
                  } else if (itemName.source == 'jd') {
                    itemName.source = '京东价';
                  } else if (itemName.source == 'wyyx') {
                    itemName.source = '严选价';
                  }
                });
                let arr = _this.data.special.concat(element)
                arr.forEach(item => {
                  _this.data.navName.forEach(element => {
                    if (item.at_id == element.at_id) {
                      item.goodsName = element.at_name
                    }
                  });
                });
                _this.setData({
                  special: arr
                });
              } else if (element.type == 7) {
                element.data7.list.forEach(itemName => {
                  if (itemName.source == '') {
                    itemName.source = '市场价';
                  } else if (itemName.source == 'jd') {
                    itemName.source = '京东价';
                  } else if (itemName.source == 'wyyx') {
                    itemName.source = '严选价';
                  }
                });
                let arr = _this.data.eveyDay.concat(element)
                arr.forEach(item => {
                  _this.data.navName.forEach(element => {
                    if (item.at_id == element.at_id) {
                      item.goodsName = element.at_name
                    }
                  });
                });
                _this.setData({
                  eveyDay: arr
                });
              }
            });
          });
        }
      }
    });
    //获取设备高度
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          winHeight: res.windowHeight
        })
      }
    });
  },

  //页面滚动
  scroll: function (e) {
    //页面滚动设置固定定位
    var _this = this;
    _this.setData({
      top: e.detail.scrollTop
    });
    if (e.detail.scrollTop < 150) {
      _this.setData({
        posVal: '',
        isNav: false
      });
    } else {
      _this.setData({
        posVal: 'fixed',
        isNav: true
      });
    }
  },

  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    console.log(e)
    const _this = this;
    var _index = e.target.dataset.index;

    _this.setData({
      currentData: e.target.dataset.index,
      toView: 'mao' + e.target.dataset.curid,
      isid: e.target.dataset.curid,
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