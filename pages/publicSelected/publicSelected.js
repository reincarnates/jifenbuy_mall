// pages/publicSelected/publicSelected.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    bannerImg: [], //banner图片
    navArr: [], //导航名称
    special: [], //专题商品
    special2: [],
    special3: [],
    special4: [],
    special5: [],
    winHeight: 2000,
  },

  //获取当前滑块的index
  bindchange: function (e) {
    const that = this;
    var current = e.detail.current;
    that.setData({
      currentData: e.detail.current
    });
    if (current == 0 && that.data.special.length == 0) {
      that.reqTab(133, current);
      that.setData({
        winHeight: 2000
      });
    } else if (current == 1 && that.data.special2.length == 0) {
      that.reqTab(134, current);
      that.setData({
        winHeight: 1200
      });
    } else if (current == 2 && that.data.special3.length == 0) {
      that.reqTab(135, current);
      that.setData({
        winHeight: 1100
      });
    } else if (current == 3 && that.data.special4.length == 0) {
      that.reqTab(136, current);
      that.setData({
        winHeight: 1800
      });
    } else if (current == 4 && that.data.special5.length == 0) {
      that.reqTab(137, current);
      that.setData({
        winHeight: 850
      });
    }
  },

  //点击切换，滑块index赋值
  checkCurrent: function (e) {
    const that = this;

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
            if(item.type != 8) {
              if (index == 0) {
                if (item.data5 != undefined) {
                  item.data5.list.forEach(itemName => {
                    if (itemName.source == '') {
                      itemName.source = '市场价';
                    } else if (itemName.source == 'jd') {
                      itemName.source = '京东价';
                    } else if (itemName.source == 'wyyx') {
                      itemName.source = '严选价';
                    }
                  });
                }
                _this.setData({
                  special: _this.data.special.concat(item)
                });
              }
            }
            if (item.type == 5) {
              if(index == 1) {
                item.data5.list.forEach(itemName => {
                  if (itemName.source == '') {
                    itemName.source = '市场价';
                  } else if (itemName.source == 'jd') {
                    itemName.source = '京东价';
                  } else if (itemName.source == 'wyyx') {
                    itemName.source = '严选价';
                  }
                });
                _this.setData({
                  special2: _this.data.special2.concat(item)
                });
              } else if(index == 2) {
                item.data5.list.forEach(itemName => {
                  if (itemName.source == '') {
                    itemName.source = '市场价';
                  } else if (itemName.source == 'jd') {
                    itemName.source = '京东价';
                  } else if (itemName.source == 'wyyx') {
                    itemName.source = '严选价';
                  }
                });
                _this.setData({
                  special3: _this.data.special3.concat(item)
                });
              } else if (index == 3) {
                item.data5.list.forEach(itemName => {
                  if (itemName.source == '') {
                    itemName.source = '市场价';
                  } else if (itemName.source == 'jd') {
                    itemName.source = '京东价';
                  } else if (itemName.source == 'wyyx') {
                    itemName.source = '严选价';
                  }
                });
                _this.setData({
                  special4: _this.data.special4.concat(item)
                });
              } else if (index == 4) {
                item.data5.list.forEach(itemName => {
                  if (itemName.source == '') {
                    itemName.source = '市场价';
                  } else if (itemName.source == 'jd') {
                    itemName.source = '京东价';
                  } else if (itemName.source == 'wyyx') {
                    itemName.source = '严选价';
                  }
                });
                _this.setData({
                  special5: _this.data.special5.concat(item)
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
        var num = 0;
        if (res.data.code) {
          _this.setData({
            navArr: res.data.data.nav
          });
          res.data.data.floor.forEach(item => {
            if (item.type == 8) {
              _this.setData({
                bannerImg: item
              });
            } else if (item.type != 8) {
              if (item.data5 != undefined) {
                item.data5.list.forEach(itemName => {
                  if (itemName.source == '') {
                    itemName.source = '市场价';
                  } else if (itemName.source == 'jd') {
                    itemName.source = '京东价';
                  } else if (itemName.source == 'wyyx') {
                    itemName.source = '严选价';
                  }
                });
                num = num + item.data5.list.length;
                // console.log(num);
              }
              _this.setData({
                special: _this.data.special.concat(item),
              });
            }
          });
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