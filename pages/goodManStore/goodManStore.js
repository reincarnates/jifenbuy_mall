// pages/publicSelected/publicSelected.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    bannerImg: [], //banner图片
    navArr: [], //导航名称
    winHeight: 4270,
    brandArr: [],
    brandArr2: [],
    brandArr3: [],
    brandArr4: [],
    brandArr5: [],
  },

  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    var current = e.detail.current;
    that.setData({
      currentData: e.detail.current
    });
    if (current == 0) {
      that.reqTab(139, current);
      that.setData({
        winHeight: 4270
      });
    } else if (current == 1) {
      that.reqTab(140, current);
      that.setData({
        winHeight: 3612
      });
    } else if (current == 2) {
      that.reqTab(141, current);
      that.setData({
        winHeight: 2320
      });
    } else if (current == 3) {
      that.reqTab(142, current);
      that.setData({
        winHeight: 2840
      });
    } else if (current == 4) {
      that.reqTab(143, current);
      that.setData({
        winHeight: 1550
      });
    }
  },

  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;
    var current = e.target.dataset.current;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      });
      // if (that.data.special.length == 0 || that.data.special2.length == 0 || that.data.special3.length == 0 || that.data.special4.length == 0 || that.data.special5.length == 0) {
      //   that.reqTab(e.target.dataset.atid, e.target.dataset.current);
      // }
    }
  },

  //请求选项卡数据
  reqTab: function (id, index) {
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/Thematic/getThematic',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        at_id: id
      },
      success(res) {
        if (res.data.code) {
          res.data.data.floor.forEach(item => {
            if (item.type == 6) {
              if (index == 1) {
                item.data6.list.forEach(itemName => {
                  if (itemName.source == '') {
                    itemName.source = '市场价';
                  } else if (itemName.source == 'jd') {
                    itemName.source = '京东价';
                  } else if (itemName.source == 'wyyx') {
                    itemName.source = '严选价';
                  }
                });
                _this.setData({
                  brandArr2: _this.data.brandArr2.concat(item)
                });
              } else if (index == 2) {
                item.data6.list.forEach(itemName => {
                  if (itemName.source == '') {
                    itemName.source = '市场价';
                  } else if (itemName.source == 'jd') {
                    itemName.source = '京东价';
                  } else if (itemName.source == 'wyyx') {
                    itemName.source = '严选价';
                  }
                });
                _this.setData({
                  brandArr3: _this.data.brandArr3.concat(item)
                });
              } else if (index == 3) {
                item.data6.list.forEach(itemName => {
                  if (itemName.source == '') {
                    itemName.source = '市场价';
                  } else if (itemName.source == 'jd') {
                    itemName.source = '京东价';
                  } else if (itemName.source == 'wyyx') {
                    itemName.source = '严选价';
                  }
                });
                _this.setData({
                  brandArr4: _this.data.brandArr4.concat(item)
                });
              } else if (index == 4) {
                item.data6.list.forEach(itemName => {
                  if (itemName.source == '') {
                    itemName.source = '市场价';
                  } else if (itemName.source == 'jd') {
                    itemName.source = '京东价';
                  } else if (itemName.source == 'wyyx') {
                    itemName.source = '严选价';
                  }
                });
                _this.setData({
                  brandArr5: _this.data.brandArr5.concat(item)
                });
              }
            }
          });
        }
      }
    })
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
        at_id: options.id
      },
      success(res) {
        console.log(res);
        if (res.data.code) {
          res.data.data.floor.forEach(item => {
            if (item.type == 11) {
              item.data11.list.forEach(itemName => {
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
            navArr: res.data.data.nav,
            brandArr: res.data.data.floor
          });
          console.log(_this.data.brandArr);
        }
      }
    });
    //  高度自适应
    // wx.getSystemInfo({
    //   success: function (res) {
    //     var clientHeight = res.windowHeight,
    //       clientWidth = res.windowWidth,
    //       rpxR = 750 / clientWidth;
    //     var calc = clientHeight * rpxR + 180;
    //     _this.setData({
    //       winHeight: calc
    //     });
    //   }
    // });
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
    var _this = this;
    // var query = wx.createSelectorQuery();
    // //选择id
    // setTimeout(function() {
    //   query.select('.import-goods-item').boundingClientRect(function (rect) {
    //     console.log(rect.height * 15);
    //     _this.setData({
    //       winHeight: rect.height * 15
    //     });
    //   }).exec();
    // }, 1000);
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