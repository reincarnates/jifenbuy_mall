
let api = require('../../../utils/api.js');

Page({
  data:{
    text:"Page userinfo",
    list_data: ['昵称', '账号', '真实姓名', '单位名称', '性别', '出生日期'],
    list_value: [],
    userinfo: null,
    images_paths: [],

    // 上传参数
    member_avatar: '',
    nickename:'',
  },

  onLoad: function (options) {
    // 页面初始化  
    wx.setNavigationBarTitle({
      title: '个人信息',
    });

    let userinfo_model = wx.getStorageSync("userinfoModel");
    var list_value_array = [];
    list_value_array.push(userinfo_model.nickname);
    list_value_array.push(userinfo_model.mobile);
    list_value_array.push(userinfo_model.member_truename);
    list_value_array.push(userinfo_model.company_name);
    list_value_array.push(userinfo_model.member_sex == 1 ? '男' : '女');
    list_value_array.push(userinfo_model.member_birthday);

    this.setData({
      userinfo: userinfo_model,
      list_value: list_value_array
    });
  },

  onReady: function() {
    // 页面渲染完成
  },

  onShow: function() {
    // 页面显示
  },

  onHide: function() {
    // 页面隐藏
  },

  onUnload: function() {
    // 页面关闭
  },

  changeAvatar: function() {
    const self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        const tempFilePaths = res.tempFilePaths
        self.setData({
          images_paths: tempFilePaths
        });
        wx.showLoading({
          title: '正在上传...',
        });
        api.uploadAvatarimg({
          filePath: self.data.images_paths[0],
          name: 'file',
          data: {
            "file": "avatar_img/" + Math.random(),
           "type" : "headlog"
          },
          success(res) {
            console.log(res);
            var obj = JSON.parse(res.data);
            console.log(obj);
            self.setData({
              member_avatar: obj.data.src
            });
            self.saveinfo();
          },
          fail(res) {
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete(res) {
            wx.hideLoading();
          }
        });
      },
      fail: function (res) {

      }
    });
  },

  saveinfo: function(e) {
    const self = this;
    api.saveUserinfo({
      data: {
        "member_avatar" : self.data.member_avatar,
        "nickename": self.data.nickename,
      },
      success(res) {
        console.log(res);
        let code = res.data.code;
        if (code == 200) {
          wx.showToast({
            title: '保存成功',
          });
        } else {
          wx.showToast({
            icon: 'none',
            title: '保存失败',
          });
        }
      },
      fail(res) {
        wx.showToast({
          icon: 'none',
          title: '保存失败',
        });
      }
    });
  },
 
})