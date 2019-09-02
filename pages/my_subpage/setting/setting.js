Page({

  /**
   * 页面的初始数据
   */
  data: {
    pwPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let isPwPage = options.password;
    
    this.setData({
      pwPage: isPwPage == 1
    });
  },

  didSelectCell: function (e) {
    let title = e.currentTarget.dataset.title;
    if (title == '个人信息') {
      wx.navigateTo({
        url: '/pages/my_subpage/userinfo/userinfo',
      })
    } else if (title == '账户安全') {
      wx.navigateTo({
        url: '/pages/my_subpage/setting/setting?password=1',
      })
    } else if (title == '支付密码') {
      wx.navigateTo({
        url: '/pages/my_subpage/editPaymentPword/editPaymentPword',
      })
    } else if (title == '兴趣管理') {
      wx.navigateTo({
        url: '/pages/my_subpage/interestManage/interestManage',
      })
    }
  }

})