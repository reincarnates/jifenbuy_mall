// pages/user/user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderOperation: [
      {
        url: '../../../images/payment_made.png',
        toUrl: '/pages/de/de',
        orderName: '待付款',
        orderClass: 'payment-made',
        orderNum: 10
      },
      {
        url: '../../../images/shipped_made.png',
        toUrl: '/pages/de/de',
        orderName: '待发货',
        orderClass: 'shipped-made',
        orderNum: 4
      },
      {
        url: '../../../images/received_made.png',
        toUrl: '/pages/de/de',
        orderName: '待收货',
        orderClass: 'received-made',
        orderNum: 0
      },
      {
        url: '../../../images/comment_made.png',
        toUrl: '/pages/de/de',
        orderName: '待评价',
        orderClass: 'comment-made',
        orderNum: 99
      },
      {
        url: '../../../images/after_sale.png',
        toUrl: '/pages/de/de',
        orderName: '售后/退款',
        orderClass: 'after-sale',
        orderNum: 12
      },
    ],
    personal: [
      {
        url: '../../../images/address.png',
        toUrl: '/pages/de/de',
        personalName: '收货地址'
      },
      {
        url: '../../../images/integral.png',
        toUrl: '/pages/de/de',
        personalName: '积分中心'
      },
      {
        url: '../../../images/footprint.png',
        toUrl: '/pages/de/de',
        personalName: '我的足迹'
      },
      {
        url: '../../../images/purchase.png',
        toUrl: '/pages/de/de',
        personalName: '常购商品'
      },
      {
        url: '../../../images/cooperation.png',
        toUrl: '/pages/businessCooperation/businessCooperation',
        personalName: '商务合作'
      },
      {
        url: '../../../images/invoice.png',
        toUrl: '/pages/de/de',
        personalName: '我的发票'
      },
      {
        url: '../../../images/feed_back.png',
        toUrl: '/pages/de/de',
        personalName: '意见反馈'
      },
      {
        url: '../../../images/service_help.png',
        toUrl: '/pages/de/de',
        personalName: '服务与帮助'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.startSoterAuthentication({
    //   requestAuthModes: ['fingerPrint'],
    //   challenge: '123456',
    //   authContent: '请用指纹解锁',
    //   success(res) {
    //     console.log(res);
    //   }
    // })
    wx.checkIsSoterEnrolledInDevice({
      checkAuthMode: 'fingerPrint',
      success(res) {
        console.log(res)
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