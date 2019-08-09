//app.js
App({
  onLaunch: function () {
    // wx.request({
    //   url: 'http://tapiserv.fulibuy.cn/Oauth/authorize',
    //   method: 'POST',
    //   data: {
    //     appkey: 'lkaf4e4n5ygfl234',
    //     appid: 'kj234nfygfl'
    //   },
    //   success(res) {
    //     if(!res.code) {
    //       wx.request({
    //         url: 'http://tapiserv.fulibuy.cn/Oauth/getToken',
    //         method: 'POST',
    //         data: {
    //           code: res.data.data
    //         },
    //         success(datas) {
    //           if(!datas.code) {
    //             wx.setStorage({
    //               key: "accessToken",
    //               data: datas.data.data.access_token
    //             });
    //           }
    //         },
    //         fail(err) {
    //           console.log('222', err);
    //         }
    //       })
    //     }
    //   },
    //   fail(err) {
    //     console.log('111', err);
    //   }
    // })
  },
  globalData: {
    statusBarHeight: wx.getSystemInfoSync()['statusBarHeight']
  }
})