let api = require('../../../utils/api.js');
var star_1 = -1, star_2 = -1, star_3 = -1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluateModel: null,
    images_paths: [],

    items: ['快递包装', '送货速度', '配送服务'],
    level_titles: ['很差', '差', '一般', '好', '很好'],

    goods_star_index: 4,
    logistics_star_indexs: [-1, -1, -1],
    
    // parcel_index: 0, // 快递 
    // speed_index: 0, // 送货速度 
    // serve_index: 0, // 送货员服务 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this;
    api.orderEvaluetion({
      data: {
        order_sn: options.order_sn
      },
      success(res) {
        let code = res.data.code;
        if (code == 200) {
          self.setData({
            evaluateModel: res.data.data,
          });
          console.log(self.data.evaluateModel);
        }
      },
      fail(res) {
        wx.showToast({
          title: '加载错误',
        });
        wx.navigateBack();  
      },
      complete(res) {

      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  tapStar: function (e) {
    this.setData({
      goods_star_index: e.currentTarget.dataset.index
    });
  },

  tapLogisticsStar: function (e) {
    let itemIndex = e.currentTarget.dataset.itemindex;
    let starIndex = e.currentTarget.dataset.starindex;

    if (itemIndex == 0) {
      star_1 = starIndex;
    } else if (itemIndex == 1) {
      star_2 = starIndex;
    } else if (itemIndex == 2) {
      star_3 = starIndex;
    }

    this.setData({
      logistics_star_indexs: [star_1, star_2, star_3]
    });
  },

  tapImage: function (e) {
    const self = this;
    wx.chooseImage({
      count:4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        self.setData({
          images_paths: tempFilePaths
        });
      },
      fail:function(res) {

      }
    });
  },

  deletePic: function (e) {
    let index = e.currentTarget.dataset.index;
    var images_temp = this.data.images_paths;
    images_temp.splice(index, 1);
    this.setData({
      images_paths: images_temp
    });
  },

  submit: function () {
    if (star_1 == -1 || star_2 == -1 || star_3 == -1) {
      wx.showToast({
        icon: 'none',
        title: '请对物流进行打分',
      })
      return;
    }
    for (let i = 0; i < this.data.evaluateModel.orderGoods.length; i++) {
      
    }
  }

})