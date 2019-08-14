//app.js
App({
  onLaunch: function () {
    if (wx.getStorageSync('user_token') == '') {
      wx.login({
        success(res) {
          wx.request({
            url: 'http://tapiserv.fulibuy.cn/Member/wxVisitorLogin',
            method: 'POST',
            header: {
              'content-type': 'application/json',
              'Accept': 'application/json;charset=UTF-8',
            },
            data: {
              code: res.code,
            },
            success(data) {
              if (!data.data.code) {
                wx.setStorage({
                  key: 'device_id',
                  data: data.data.data.device_id,
                });
                wx.setStorage({
                  key: 'user_token',
                  data: data.data.data.user_token,
                });
              }
            }
          })
        }
      })
    }
  },
  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
  }
})