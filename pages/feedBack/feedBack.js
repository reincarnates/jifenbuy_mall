// pages/feedBack/feedBack.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false, //弹框背景是否显示
    maskPos: '-100%', //弹框定位
    feedBackStr: '请选择反馈类型', //反馈类型
    feedBackVal: '', //反馈类型的值
    countPic: 4,//上传图片最大数量
    showImgUrl: "", //路径拼接，一般上传返回的都是文件名，
    uploadImgUrl: 'http://tapi.fulibuy.cn/Member/upload',//图片的上传的路径
    wxImgUrl: [], //微信返回的图片地址
    uploadImg: [], //上传服务器的图片地址
    phoneNumber: '', //手机号
    advise: '', //建议
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //选择反馈类型
  checkType: function() {
    this.setData({
      isShow: true,
      maskPos: 0
    });
  },

  //获取选择类型的值
  selectType: function(e) {
    this.setData({
      feedBackStr: e.currentTarget.dataset.type,
      feedBackVal: e.currentTarget.dataset.val,
      isShow: false,
      maskPos: '-100%'
    });
  },

  //关闭选择反馈类型弹框
  closeFeedBack: function() {
    this.setData({
      isShow: false,
      maskPos: '-100%'
    });
  },

  //获取上传到服务器的图片地址
  myEventListener: function (e) {
    this.setData({
      uploadImg: e.detail.picsList
    });
    wx.request({
      url: 'http://tapi.fulibuy.cn/Member/saveMemberIdea',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        image: this.data.uploadImg,
        type: this.data.feedBackVal,
        content: this.data.advise,
        phone: this.data.phoneNumber,
      },
      success(res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          })
        }
      }
    });
  },

  //获取微信返回的图片地址
  myEventListener2: function (e) {
    this.setData({
      wxImgUrl: e.detail.picsList
    });
  },

  //获取手机号
  getPhone: function(e) {
    this.setData({
      phoneNumber: e.detail.value
    });
  },

  //获取建议
  getAdvise: function(e) {
    this.setData({
      advise: e.detail.value
    });
  },

  //上传图片
  uploadImg: function() {
    let upload = this.upload
    //upload.clickA()  // 调用自定义组件中的方法
    upload.uploadimg({
      url: this.data.uploadImgUrl, //这里是你图片上传的接口
      path: this.data.wxImgUrl, //这里是选取的图片的地址数组
    });
  },

  //提交反馈
  submitFeedBack: function() {
    var _this = this;

    if (_this.data.feedBackVal == '') {
      wx.showToast({
        title: '请选择反馈类型',
        icon: 'none',
        duration: 2000
      });
      return false;
    } else if (_this.data.phoneNumber == '') {
      wx.showToast({
        title: '请填写手机号',
        icon: 'none',
        duration: 2000
      });
      return false;
    } else if (!(/^1[34578]\d{9}$/.test(_this.data.phoneNumber))) {
      wx.showToast({
        title: '请填写正确的手机号',
        duration: 2000,
        icon: 'none'
      });
      return false;
    }


    if (_this.data.wxImgUrl.length != 0) {
      _this.uploadImg();
    }else{
      wx.request({
        url: 'http://tapi.fulibuy.cn/Member/saveMemberIdea',
        method: 'POST',
        data: {
          user_token: wx.getStorageSync('user_token'),
          device_id: wx.getStorageSync('device_id'),
          device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
          image: _this.data.uploadImg,
          type: _this.data.feedBackVal,
          content: _this.data.advise,
          phone: _this.data.phoneNumber,
        },
        success(res) {
          if (res.data.code == 0) {
            console.log(res);
            wx.showToast({
              title: '提交成功',
              icon: 'success',
              duration: 2000
            })
          }
        }
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //  页面初次渲染完成后，使用选择器选择组件实例节点，返回匹配到组件实例对象  
    this.upload = this.selectComponent('#upload')
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