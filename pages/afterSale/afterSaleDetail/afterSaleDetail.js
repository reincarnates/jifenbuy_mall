// pages/afterSale/afterSaleDetail/afterSaleDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countPic: 4,//上传图片最大数量
    showImgUrl: "", //路径拼接，一般上传返回的都是文件名，
    uploadImgUrl: 'http://tapi.fulibuy.cn/Member/uploadRefundImg',//图片的上传的路径
    wxImgUrl: [], //微信返回的图片地址
    uploadImg: [], //上传服务器的图片地址
    refundReason: [], //取消原因
    isCause: false,
    isApply: '-100%',
    daddressInfo: {}, //商家信息
    goodsInfo: {}, //商品信息
    memberInfo: {}, //寄件信息
    reasonId: '', //售後原因id
    reasonWord: '请选择申请原因', //售后原因名称
    option: {}, //上個頁面參數
    returnCause: '', //退貨原因
    getUserVal: '', //寄件信息聯係人
    getPhoneVal: '', //寄件信息聯係方式
    locationState: 0, //从申请记录页面进入带过来的状态
    stepState: 0, //步骤条状态
    showState: [], //展示状态
    saleData: [], //售后中的数据
    getNameVal: '', //物流公司
    getNumberVal: '', //物流单号
    notSaleData: [], //审核不通过数据
    saleFinish: [], //售后完成
    isSpace: false, //判断json是否是空
    isShow: true, //问题描述文本框是否显示
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({ title: '加载中', mask: true });
    console.log(options);
    _this.setData({
      option: options,
      locationState: options.status
    });
    if (options.state == 1) {
      wx.request({
        url: 'http://tapi.fulibuy.cn/Member/refundDetail',
        method: 'POST',
        data: {
          // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
          // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          order_sn: options.order,
          refund_sn: options.refund
        },
        success(res) {
          if(res.data.code) {
            console.log(res);
            // if (res.data.data.admin_state == 0 && res.data.data.seller_state == 1 && res.data.data.refund_state == 1) {
              
            // }
            _this.setData({
              showState: res.data.data,
              stepState: 2
            });
            wx.hideLoading();
          }
        }
      })
    } else if (options.state == 2) {
      wx.request({
        url: 'http://tapi.fulibuy.cn/Member/refundDetail',
        method: 'POST',
        data: {
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
          // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          order_sn: options.order,
          refund_sn: options.refund
        },
        success(res) {
          if (res.data.code) {
            console.log(res);
            if (Object.keys(res.data.data.express_info).length == 0) {
              _this.setData({
                isSpace: true
              });
            }
            _this.setData({
              saleData: res.data.data,
              stepState: 3
            });
            wx.hideLoading();
          }
        }
      })
    } else if (options.state == 3) {
      wx.request({
        url: 'http://tapi.fulibuy.cn/Member/refundDetail',
        method: 'POST',
        data: {
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
          // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          order_sn: options.order,
          refund_sn: options.refund
        },
        success(res) {
          if (res.data.code) {
            console.log(res);
            _this.setData({
              notSaleData: res.data.data,
            });
            wx.hideLoading();
          }
        }
      })
    } else if (options.state == 4) {
      wx.request({
        url: 'http://tapi.fulibuy.cn/Member/refundDetail',
        method: 'POST',
        data: {
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
          // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          order_sn: options.order,
          refund_sn: options.refund
        },
        success(res) {
          if (res.data.code) {
            console.log(res);
            _this.setData({
              saleFinish: res.data.data,
              stepState: 3
            });
            wx.hideLoading();
          }
        }
      })
    } else {
      wx.request({
        url: 'http://tapi.fulibuy.cn/Member/refundInfo',
        method: 'POST',
        data: {
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
          // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          // order_sn: '195155974910541',
          // sku: '3ce4ed35fd21785'
          order_sn: options.order,
          sku: options.sku
        },
        success(res) {
          if (res.data.code) {
            _this.setData({
              refundReason: res.data.data.refundReason.list,
              daddressInfo: res.data.data.daddressInfo,
              goodsInfo: res.data.data.goods_info,
              memberInfo: res.data.data.memberInfo,
              getUserVal: res.data.data.memberInfo.true_name,
              getPhoneVal: res.data.data.memberInfo.mob_phone
            });
            wx.hideLoading();
          }
        }
      })
    }
  },

  //获取上传到服务器的图片地址
  myEventListener: function (e) {
    var _this = this;
    _this.setData({
      uploadImg: e.detail.picsList
    });
    _this.subSaleReq();
  },

  //提交申请
  subSaleReq: function() {
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/Member/applyRefund',
      method: 'POST',
      data: {
        // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
        // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        order_sn: _this.data.option.order,
        sku: _this.data.option.sku,
        // order_sn: '195155100110542',
        // sku: 'cfcf90b91b',
        goods_num: _this.data.goodsInfo.getAbleRefundNum,
        refund_type: 'all',
        reason_id: _this.data.reasonId,
        buyer_question: _this.data.returnCause,
        image: _this.data.uploadImg,
        return_way: 'express',
        user_name: _this.data.getUserVal,
        user_phone: _this.data.getPhoneVal
      },
      success(res) {
        if (res.data.code) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 500
          });
          setTimeout(function () {
            wx.redirectTo({
              url: '/pages/afterSale/applicationRecord/applicationRecord',
            })
          }, 500);
        }
      }
    })
  },

  //获取微信返回的图片地址
  myEventListener2: function (e) {
    this.setData({
      wxImgUrl: e.detail.picsList
    });
  },

  //上传图片
  uploadImg: function () {
    let upload = this.upload
    //upload.clickA()  // 调用自定义组件中的方法
    upload.uploadimg({
      url: this.data.uploadImgUrl, //这里是你图片上传的接口
      path: this.data.wxImgUrl, //这里是选取的图片的地址数组
    });
  },

  //選擇原因
  checkCause: function() {
    var _this = this;
    _this.setData({
      isCause: true,
      isApply: 0,
      isShow: false
    });
  },

  //關閉選擇原因彈框
  closeCause: function() {
    var _this = this;
    _this.setData({
      isCause: false,
      isApply: '-100%',
      isShow: true
    });
  },

  //獲取選擇售後原因的id
  radioChange: function(e) {
    var _this = this;
    _this.data.refundReason.forEach(item => {
      if (item.reason_id == e.detail.value) {
        _this.setData({
          reasonWord: item.reason_info
        });
      }
    });
    _this.setData({
      reasonId: e.detail.value
    });
  },

  //獲取退貨原因
  getCause: function(e) {
    this.setData({
      returnCause: e.detail.value
    });
  },

  //寄件信息聯係人
  getUser: function(e) {
    this.setData({
      getUserVal: e.detail.value
    });
  },

  //寄件信息聯係方式
  getPhone: function(e) {
    this.setData({
      getPhoneVal: e.detail.value
    });
  },

  //提交售後申請
  submitService: function() {
    var _this = this;

    if (_this.data.reasonId == '') {
      wx.showToast({
        title: '请选择申请原因',
        icon: 'none',
        duration: 2000
      });
      return false;
    } else if (_this.data.returnCause == '') {
      wx.showToast({
        title: '请填写问题描述',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    if (_this.data.wxImgUrl.length != 0) {
      _this.uploadImg();
    } else {
      wx.request({
        url: 'http://tapi.fulibuy.cn/Member/applyRefund',
        method: 'POST',
        data: {
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
          // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          order_sn: _this.option.order,
          sku: _this.option.sku,
          // order_sn: '195155100110542',
          // sku: 'cfcf90b91b',
          goods_num: _this.data.goodsInfo.getAbleRefundNum,
          refund_type: 'all',
          reason_id: _this.data.reasonId,
          buyer_question: _this.data.returnCause,
          image: _this.data.uploadImg,
          return_way: 'express',
          user_name: _this.data.getUserVal,
          user_phone: _this.data.getPhoneVal
        },
        success(res) {
          if (res.data.code) {
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            });
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/afterSale/applicationRecord/applicationRecord',
              })
            }, 500);
          }
        }
      })
    }
    
  },

  //获取物流公司
  getName: function(e) {
    this.setData({
      getNameVal: e.detail.value
    });
  },

  //获取物流单号
  getNumber: function (e) {
    this.setData({
      getNumberVal: e.detail.value
    });
  },

  //售后进度
  saleProgress: function(e) {
    var _this = this;
    wx.navigateTo({
      url: `/pages/afterSale/saleProgress/saleProgress?order=${_this.data.option.order}&refund=${e.currentTarget.dataset.refund}`,
    })
  },

  //售后中提交物流信息
  submitSale: function() {
    var _this = this;

    if (_this.data.getNameVal == '') {
      wx.showToast({
        title: '请填写物流公司',
        icon: 'none',
        duration: 2000
      });
      return false;
    } else if (_this.data.getNumberVal == '') {
      wx.showToast({
        title: '请填写物流单号',
        icon: 'none',
        duration: 2000
      });
      return false;
    }

    wx.request({
      url: 'http://tapi.fulibuy.cn/Member/buyerDelivery',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
        // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
        refund_sn: _this.data.option.refund,
        express_name: _this.data.getNameVal,
        express_no: _this.data.getNumberVal
      },
      success(res) {
        if(res.data.code) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          });
          setTimeout(function () {
            wx.navigateBack({
              delta: 1
            })
          }, 500);
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //  页面初次渲染完成后，使用选择器选择组件实例节点，返回匹配到组件实例对象  
    this.upload = this.selectComponent('#upload');
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