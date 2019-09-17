let api = require('../../../utils/api.js');
var star_1 = -1, star_2 = -1, star_3 = -1;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluateModel: null,
    images_paths: [],
    images_src: [],
    comments: [],

    items: ['快递包装', '送货速度', '配送服务'],
    level_titles: ['很差', '差', '一般', '好', '很好'],

    goods_star_index: 4,
    goods_star: [],
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
          let model = res.data.data;
          self.setData({
            evaluateModel: model,
          });
          var tempArray = self.data.images_paths;
          var starArray = self.data.goods_star;
          var tempComments = self.data.comments;

          for (let item in model.orderGoods) {
             tempArray.push([]);
             starArray.push(5);
             tempComments.push("");
          }
          self.setData({
            images_paths: tempArray,
            goods_star: starArray,
            comments: tempComments
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
    let itemIndex = e.currentTarget.dataset.itemindex;q
    let star = e.currentTarget.dataset.index;
    var starArr = this.data.goods_star;
    starArr[itemIndex] = star;

    this.setData({
      goods_star: starArr
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

  textAreainput: function (e) {
    let item_index = e.currentTarget.dataset.index;
    var tempComments = this.data.comments;
    tempComments[item_index] = e.detail.value;
    this.setData({
      comments: tempComments
    });
  },

  tapImage: function (e) {
    let item_index = e.currentTarget.dataset.itemindex;
    const self = this;
    wx.chooseImage({
      count:4,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths;
        var tempArray = self.data.images_paths;
        tempArray[item_index] = tempFilePaths;
    
        self.setData({
          images_paths: tempArray,
        });
      },
      fail:function(res) {

      }
    });
  },

  deletePic: function (e) {
    let item_index = e.currentTarget.dataset.itemindex;
    let index = e.currentTarget.dataset.index;

    var images_temp = this.data.images_paths;
    var images_temp_item = images_temp[item_index];

    images_temp_item.splice(index, 1);
    
    this.setData({
      images_paths: images_temp
    });
  },

  //多张图片上传
  uploadimg: function (data) {
    const self = this;
    var i = data.i ? data.i : 0;
    var j = data.j ? data.j : 0;

    api.uploadPicEvaluation({
      filePath: data.images[i],
      name: 'file',
      data: {
        "file": "evaluation_img/" + Math.random(),
        "type": "evaluate"
      },
      success(res) {
        let obj = JSON.parse(res.data);
        debugger
        //obj.data.src
        var tempImageSrc = self.data.images_src;
        var tempImageSrc_item = tempImageSrc[j];
        tempImageSrc.push(obj.imgUrl);
        self.setData({
          images_src: tempImageSrc
        });
      },
      fail(res) {

      },
      complete(res) {
        i++;
        if (i == data.images.length) {
          data.j = j;
          data.src = self.data.images_src[j];
          debugger
          self.submitAction(data);
        } else {
          data.i = i;
          debugger
          self.uploadimg(data);
        }
      }
    });
  },

  // 多商品
  recursion: function (index) {
    const self = this;
    let data = {
      images: self.data.images_paths[index],
      j: index,
      src: []
    };
    if (index == self.data.images_paths.length) {
      // 全部提交后
      wx.showToast({
        title: '提交成功',
      });
      wx.navigateBack({});
    } else {
      if (data.images.length == 0) {
        self.submitAction(data);
      } else {
        self.uploadimg(data);
      }
    }
  },

  submitAction: function (data) {
    const self = this;
    var j = data.j ? data.j : 0;
    let orderGoods = self.data.evaluateModel.orderGoods[j];
    debugger
    api.submitEvaluation({
      data: {
        "orderno": self.data.evaluateModel.geval_orderno,//订单号
        "spu": orderGoods.goods_sku,//评论的产品goods_sku
        "store_id": orderGoods.store_id,//店铺id
        "geval_image": data.src,//评论的图片 用数组方式 跟提交意见那个一样
        "type": "1",			//不是追评的话就传1 
        "goodsname": orderGoods.goods_name,//产品名字
        "goodsprice": orderGoods.goods_price,//产品价格
        "goodsimage": orderGoods.goods_image,//产品图片
        "content": self.data.comments[j],//评论内容
        "scores": self.data.goods_star[j],//商品评分
        "parcel_scores": self.data.logistics_star_indexs[0],//快递评分
        "speed_scores": self.data.logistics_star_indexs[1],//送货速度评分
        "serve_scores": self.data.logistics_star_indexs[2],//送货员服务评分
      },
      success(res) {
        debugger
        j++;
        self.recursion(j); 
      },
      fail(res) {
        debugger
        wx.showToast({
          icon: 'none',
          title: '提交失败',
        })
      },
      complete(res) {

      }
    });
  },

  // 提交
  submit: function () {
    if (star_1 == -1 || star_2 == -1 || star_3 == -1) {
      wx.showToast({
        icon: 'none',
        title: '请对物流进行打分',
      })
      return;
    }
    this.recursion(0);
  },


})