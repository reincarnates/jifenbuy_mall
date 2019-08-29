// pages/address/newBuiltAddress/newBuiltAddress.js
var address = []; //保存时传的选择的地区
var editArea = []; //修改时展示的地区
var addressId = []; //省市区id
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight: 0, //设备高度
    region: ['请选择'],
    customItem: '',
    regionValue: [],
    showRegion: false,
    name: '', //姓名
    phone: '', //手机号
    address: '', //详细地址
    defaultAddress: 0, //是否是默认地址
    areaStr: '', //所选地区
    isDefault: 0, //是否选择设置默认
    isShowDel: false,
    editId: '', //修改地址的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    if (options.id != undefined) {
      var area = options.area.split(' ');
      area.forEach(item => {
        editArea.push({
          name: item
        });
      });
      addressId.push(options.provinceid);
      addressId.push(options.cityid);
      addressId.push(options.areaid);
      addressId.forEach((item, index) => {
        editArea[index].id = item;
      });

      //判断是否选中设置默认
      if (options.defaults == 1) {
        _this.setData({
          isDefault: 1,
          defaultAddress: 1
        });
      }

      _this.setData({
        name: options.name,
        phone: options.phone,
        address: options.address,
        regionValue: editArea,
        isShowDel: true,
        editId: options.id
      });
    }

    //获取设备高度
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          winHeight: res.windowHeight
        });
      }
    });
  },

  //姓名
  getUserName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },

  //详细地址
  getDetailAddress: function (e) {
    this.setData({
      address: e.detail.value
    });
  },

  //手机号
  getUserPhone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },

  //是否是默认地址
  checkedShopAll: function (e) {
    this.setData({
      defaultAddress: e.detail.value.length != 0 ? 1 : 0
    });
  },

  chooseRegion: function () {
    this.setData({
      showRegion: true,
    });
  },

  emitHideRegion: function (e) {
    address = [];
    e.detail.regionValue.forEach(item => {
      address.push(item.name);
    });

    this.data.regionValue = [];

    this.setData({
      showRegion: e.detail.showRegion,
      regionValue: e.detail.regionValue,
    });
  },

  //保存收货地址
  saveAddress: function () {
    var _this = this;
    if (_this.data.name == '') {
      wx.showToast({
        title: '请填写姓名',
        icon: 'none',
        duration: 2000
      });
      return false;
    } else if (_this.data.phone == '') {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 2000
      });
      return false;
    } else if (_this.data.regionValue == '') {
      wx.showToast({
        title: '请选择地区',
        icon: 'none',
        duration: 2000
      });
      return false;
    } else if (_this.data.address == '') {
      wx.showToast({
        title: '请填写详细地址',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    if (_this.data.editId == '') {
      wx.request({
        url: 'http://tapi.fulibuy.cn/Member/addUserAddress',
        method: 'POST',
        data: {
          // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
          // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          is_default: _this.data.defaultAddress,
          user_name: _this.data.name,
          province_id: _this.data.regionValue[0].id,
          area_id: _this.data.regionValue[2].id,
          city_id: _this.data.regionValue[1].id,
          area_info: address.join(' '),
          address: _this.data.address,
          mob_phone: _this.data.phone
        },
        success(res) {
          if (res.data.code) {
            wx.showToast({
              title: '添加成功',
              icon: 'success',
              duration: 2000
            });
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              });
            }, 500);
          }
        },
        fail() {

        }
      })
    }else{
      wx.request({
        url: 'http://tapi.fulibuy.cn/Member/saveMemberAddress',
        method: 'POST',
        data: {
          // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
          // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          is_default: _this.data.defaultAddress,
          user_name: _this.data.name,
          province_id: _this.data.regionValue[0].id,
          area_id: _this.data.regionValue[2].id,
          city_id: _this.data.regionValue[1].id,
          area_info: address.join(' '),
          address: _this.data.address,
          mob_phone: _this.data.phone,
          address_id: _this.data.editId
        },
        success(res) {
          if (res.data.code) {
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              duration: 2000
            });

            setTimeout(function () {
              wx.navigateBack({
                delta: 1
              });
            }, 500);
          }
        },
        fail() {

        }
      })
    }

  },

  //删除收货地址
  delAddress: function () {
    var _this = this;
    wx.showModal({
      title: '删除地址',
      content: '删除后不可恢复，确定删除？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: 'http://tapi.fulibuy.cn/Member/delMemberAddress',
            method: 'POST',
            data: {
              // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
              // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
              user_token: wx.getStorageSync('user_token'),
              device_id: wx.getStorageSync('device_id'),
              address_id: _this.data.editId
            },
            success(res) {
              if(res.data.code) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 2000
                });

                setTimeout(function () {
                  wx.navigateBack({
                    delta: 1
                  });
                }, 500);
              }
            }
          })
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
    this.setData({
      regionValue: []
    });
    editArea = [];
    addressId = [];
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