// pages/balance/billPage/billPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 0,
    current: 1,
    bill: [], //全部余额明细
    paymentBill: [], //充值明细
    page: 1, //页数
    billPos: '-100%', //定位位置
    isMask: false,
    billPos2: '-100%', //定位位置
    isMask2: false,
    screenData: [
      {
        title: '类型',
        list: [
          { name: '下单支付', choose: false, value: 'order' },
          { name: '单位充值', choose: false, value: 'company' },
          { name: '个人充值', choose: false, value: 'memberpay' },
          // { name: '订单取消', choose: false, value: 'return' },
          { name: '退款', choose: false, value: 'return' },
          { name: '全部', choose: false, value: 'all' },
        ],
        state: 1
      },
      {
        title: '全部',
        list: [
          { name: '收入', choose: false, value: '1' },
          { name: '支出', choose: false, value: '2' },
          { name: '全部', choose: false, value: '0' },
        ]
      },
      {
        title: '时间',
        list: [
          { name: '近3个月', choose: false, value: 'threeHour' },
          { name: '今年内', choose: false, value: 'oneYear' },
          { name: '全部', choose: false, value: '' },
        ]
      },
    ], //筛选数据
    screenData2: [
      {
        title: '类型',
        list: [
          { name: '微信充值', choose: false, value: 'wxpay' },
          { name: '支付宝充值', choose: false, value: 'alipay' },
          { name: '单位充值', choose: false, value: 'company' },
          { name: '全部', choose: false, value: 'all' },
        ],
        state: 1
      },
      {
        title: '时间',
        list: [
          { name: '近3个月', choose: false, value: 'threeHour' },
          { name: '今年内', choose: false, value: 'oneYear' },
          { name: '全部', choose: false, value: '' },
        ]
      },
    ], //筛选数据
    balanceType: '0', //全部类型
    startTime: '', //订单创建时间
    endTime: '', //订单结束时间
    sourceType: 'all', //充值类型
    totalPage: 0, //总页数
    page2: 1,
    startTime2: '', //订单创建时间
    endTime2: '', //订单结束时间
    sourceType2: 'all', //充值类型
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    wx.showLoading({ title: '加载中', mask: true });

    //充值明细
    _this.recharge();

    //余额明细
    _this.balance();


    _this.setData({
      height: wx.getSystemInfoSync().windowHeight,
    })
  },

  //获取三个月之前的今天
  getLastThreeMonthYestdy: function (date) {
    var daysInMonth = new Array([0], [31], [28], [31], [30], [31], [30], [31], [31], [30], [31], [30], [31]);
    var strYear = date.getFullYear();
    var strDay = date.getDate();
    var strMonth = date.getMonth() + 1;
    if (strYear % 4 == 0 && strYear % 100 != 0) {
      daysInMonth[2] = 29;
    }
    if (strMonth < 4) {
      strYear -= 1;
      if (strMonth == 1) {
        strMonth = 10
      } else if (strMonth == 2) {
        strMonth = 11;
      } else if (strMonth == 3) {
        strMonth = 12;
      }
    }
    else {
      strMonth -= 3;
    }
    strDay = daysInMonth[strMonth] >= strDay ? strDay : daysInMonth[strMonth];
    if (strMonth < 10) {
      strMonth = "0" + strMonth;
    }
    if (strDay < 10) {
      strDay = "0" + strDay;
    }
    var dataStr = strYear + "-" + strMonth + "-" + strDay;
    return dataStr;
  },

  //充值明细
  recharge: function() {
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/Member/getWxMemberBalanceRecharge',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
        // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
        page: _this.data.page2,
        per_page: 10,
        start_time: _this.data.startTime2,
        end_time: _this.data.endTime2,
        source_type: _this.data.sourceType2
      },
      success(res) {
        if (res.data.code) {
          _this.setData({
            paymentBill: res.data.data.list,
            isMask2: false,
            billPos2: '-100%'
          });
        }
      },
    });
  },

  //余额明细
  balance: function () {
    var _this = this;
    wx.showLoading({ title: '加载中', mask: true });
    wx.request({
      url: 'http://tapi.fulibuy.cn/Member/getWxMemberBalanceDetail',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
        // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
        balance_type: _this.data.balanceType,
        page: _this.data.page,
        per_page: '10',
        start_time: _this.data.startTime,
        end_time: _this.data.endTime,
        source_type: _this.data.sourceType
      },
      success(res) {
        if (res.data.code) {
          _this.setData({
            bill: res.data.data.list,
            totalPage: res.data.data.total_page,
            isMask: false,
            billPos: '-100%',
          });
          wx.hideLoading();
        }
      },
    });
  },

  //切换展示
  tabBill: function (e) {
    this.setData({
      current: e.currentTarget.dataset.index
    });
  },

  //跳至交易详情
  dealDetail: function (e) {
    var source = e.currentTarget.dataset.source;
    var order = e.currentTarget.dataset.order;
    if (source == 'order') {
      wx.navigateTo({
        url: `/pages/balance/dealDetailBalance/dealDetailBalance?order=${order}&paydesc=${e.currentTarget.dataset.paydesc}&paytype=${e.currentTarget.dataset.paytype}&price=${e.currentTarget.dataset.price}`
      });
    } else {
      wx.navigateTo({
        url: `/pages/balance/dealDetailPayment/dealDetailPayment?order=${order}&paydesc=${e.currentTarget.dataset.paydesc}&paytype=${e.currentTarget.dataset.paytype}&balance=${e.currentTarget.dataset.balance}&createtime=${e.currentTarget.dataset.createtime}&state=${e.currentTarget.dataset.state}`
      });
    }
  },

  //筛选
  screen: function () {
    var _this = this;
    if (_this.data.current == 1) {
      _this.setData({
        isMask: true,
        billPos: 0,
        page: 1
      });
    }else{
      _this.setData({
        isMask2: true,
        billPos2: 0,
        page: 1
      });
    }
  },

  //关闭筛选
  closeScreen: function () {
    var _this = this;
    _this.setData({
      isMask: false,
      billPos: '-100%',
      isMask2: false,
      billPos2: '-100%'
    });
  },

  //选择筛选条件
  checkType: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var key = e.currentTarget.dataset.key;
    var value = e.currentTarget.dataset.value;
    for (var i = 0; i < _this.data.screenData[key].list.length; i++) {
      var delzhuangtai = 'screenData[' + key + '].list[' + i + '].choose';
      _this.setData({
        [delzhuangtai]: false
      })
    }
    var iszhuangtai = 'screenData[' + key + '].list[' + index + '].choose';
    _this.setData({
      [iszhuangtai]: true
    });

    if (key == 0) {
      _this.setData({
        sourceType: _this.data.screenData[0].list[index].value
      });
    } else if (key == 1) {
      _this.setData({
        balanceType: _this.data.screenData[1].list[index].value
      });
    } else if (key == 2) {
      if (value == 'threeHour') {
        _this.setData({
          startTime: parseInt(new Date(_this.getLastThreeMonthYestdy(new Date())).getTime() / 1000),
          endTime: parseInt(new Date().getTime() / 1000)
        });
      } else if (value == 'oneYear') {
        //开始时间
        var date = new Date();
        date.setDate(1);
        date.setMonth(0);
        //结束时间
        var date_ = new Date();
        var year = date_.getFullYear();
        var month = date_.getMonth() + 4;
        var day = new Date(year, month, 0);
        var lastdate = year + '-' + month + '-' + day.getDate();
        _this.setData({
          startTime: parseInt(date.getTime() / 1000),
          endTime: parseInt(new Date(lastdate).getTime() / 1000)
        });
      } else if (value == '') {
        _this.setData({
          startTime: '',
          endTime: ''
        });
      }
    }
  },

  //选择筛选条件
  checkType2: function (e) {
    var _this = this;
    var index = e.currentTarget.dataset.index;
    var key = e.currentTarget.dataset.key;
    var value = e.currentTarget.dataset.value;
    for (var i = 0; i < _this.data.screenData2[key].list.length; i++) {
      var delzhuangtai2 = 'screenData2[' + key + '].list[' + i + '].choose';
      _this.setData({
        [delzhuangtai2]: false
      })
    }
    var iszhuangtai2 = 'screenData2[' + key + '].list[' + index + '].choose';
    _this.setData({
      [iszhuangtai2]: true
    });

    if (key == 0) {
      _this.setData({
        sourceType2: _this.data.screenData2[0].list[index].value
      });
    }else{
      if (value == 'threeHour') {
        _this.setData({
          startTime2: parseInt(new Date(_this.getLastThreeMonthYestdy(new Date())).getTime() / 1000),
          endTime2: parseInt(new Date().getTime() / 1000)
        });
      } else if (value == 'oneYear') {
        //开始时间
        var date = new Date();
        date.setDate(1);
        date.setMonth(0);
        //结束时间
        var date_ = new Date();
        var year = date_.getFullYear();
        var month = date_.getMonth() + 4;
        var day = new Date(year, month, 0);
        var lastdate = year + '-' + month + '-' + day.getDate();
        _this.setData({
          startTime2: parseInt(date.getTime() / 1000),
          endTime2: parseInt(new Date(lastdate).getTime() / 1000)
        });
      } else if (value == '') {
        _this.setData({
          startTime2: '',
          endTime2: ''
        });
      }
    }
  },

  //重置筛选条件
  resetScreen: function () {
    var _this = this;
    _this.data.screenData.forEach(item => {
      item.list.forEach(element => {
        element.choose = false;
      });
    });
    _this.data.screenData2.forEach(item => {
      item.list.forEach(element => {
        element.choose = false;
      });
    });
    _this.setData({
      screenData: _this.data.screenData,
      screenData2: _this.data.screenData2,
      balanceType: '0', //全部类型
      startTime: '', //订单创建时间
      endTime: '', //订单结束时间
      sourceType: 'all', //充值类型
      page: 1,
      startTime2: '', //订单创建时间
      endTime2: '', //订单结束时间
      sourceType2: 'all', //充值类型
      page2: 1,
    });
    if(_this.data.current == 1) {
      _this.balance();
    } else {
      _this.recharge();
    }
  },

  //确定筛选条件
  confirmScreen: function () {
    var _this = this;
    if(_this.data.current == 1) {
      _this.balance();
    } else {
      _this.recharge();
    }
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
    var _this = this;
    //推荐
    if (_this.data.current == 1 && _this.data.page < _this.data.totalPage) {
      _this.data.page++;
      wx.showLoading({ title: '加载中' });
      wx.request({
        url: 'http://tapi.fulibuy.cn/Member/getWxMemberBalanceDetail',
        method: 'POST',
        data: {
          // user_token: wx.getStorageSync('user_token'),
          // device_id: wx.getStorageSync('device_id'),
          user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
          device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          balance_type: _this.data.balanceType,
          page: _this.data.page,
          per_page: '10',
          start_time: _this.data.startTime,
          end_time: _this.data.endTime,
          source_type: _this.data.sourceType
        },
        success(res) {
          if (res.data.code) {
            _this.setData({
              bill: _this.data.bill.concat(res.data.data.list)
            });
            wx.hideLoading();
          }
        },
      });
    } else {

    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})