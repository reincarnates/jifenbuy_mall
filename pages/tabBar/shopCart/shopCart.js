const list = [
  {
    shopName: '哈哈哈哈哈哈',
    goods:[
      {
        id: 0,
        img: '../../../images/avatar.png',
        goodsName: '韩后花痴氨基酸洗面奶洁面补税保湿 温空还有深层清洁',
        price: 38.8,
        shopNum: 1,
        // stock: 0
      },
      {
        id: 1,
        img: '../../../images/avatar.png',
        goodsName: '联想（Lenovo）ThinkPad L570 15.6英寸笔记本（i5-6200U/8G/256G SSD/win 10 home）',
        price: 38.8,
        shopNum: 1,
        // stock: 0
      },
    ]
  },
  {
    shopName: '呵呵哈哈哈h',
    goods: [
      {
        id: 2,
        img: '../../../images/avatar.png',
        goodsName: '韩后花痴氨基酸洗面奶洁面补税保湿 温空还有深层清洁',
        price: 11.8,
        shopNum: 3,
        // stock: 20
      },
      {
        id: 3,
        img: '../../../images/avatar.png',
        goodsName: '韩后花痴氨基酸洗面奶洁面补税保湿 温空还有深层清洁',
        price: 11.8,
        shopNum: 3,
        // stock: 20
      },
      {
        id: 4,
        img: '../../../images/avatar.png',
        goodsName: '韩后花痴氨基酸洗面奶洁面补税保湿 温空还有深层清洁',
        price: 11.8,
        shopNum: 3,
        // stock: 20
      }
    ]
  }
]

// pages/shopCart/shopCart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardTeams: list,
    checked_all: false, //全选
    newArr: [], //复选框选中
    countMoney: 0, //结算价格
    goodsNum: 0,
    cardTeamsLen: [],
    selectedAll: false,
    shopSelect: false
  },

  // 购物车+
  getPlus: function(e) {
    var that = this;
    var cardTeams = that.data.cardTeams;
    var key = e.currentTarget.dataset.key;
    var index = e.currentTarget.dataset.index;
    // console.log(index)
    var shopnum = cardTeams[key].goods[index].shopNum;
    shopnum++
    cardTeams[key].goods[index].shopNum = shopnum;
    that.setData({
      cardTeams: cardTeams
    })
    that.getTotalPrice();
  },
  // 购物车-
  getMain: function(e) {
    var that = this;
    var cardTeams = that.data.cardTeams;
    var key = e.currentTarget.dataset.key;
    var index = e.currentTarget.dataset.index;
    // console.log(index)
    
    if (cardTeams[key].goods[index].shopNum > 1) {
        // cardTeams[key].goods[index].shopNum = 1
        // that.delItem(e)
        cardTeams[key].goods[index].shopNum--;
      }
    // console.log(cardTeams[key].goods[index].shopNum)
    that.setData({
      cardTeams: cardTeams
    })
    that.getTotalPrice();
  },
  // 单选
  goodsdagou: function(e) {
    var that = this;
    var num = that.data.num;
    var cardTeams = that.data.cardTeams;
    var cardTeamsLen = that.data.cardTeamsLen;
    var index = e.currentTarget.dataset.checkid;
    var key = e.currentTarget.dataset.key;
    // console.log(index)
    var arr = that.data.newArr;
    var selected = cardTeams[key].goods[index].selected;
    cardTeams[key].goods[index].selected = !selected;
    for (var i = cardTeams[key].goods.length - 1; i >= 0; i--) {
      if (cardTeams[key].goods[i].selected) {
        cardTeams[key].shopSelect = false;
        break;
      }else{
        cardTeams[key].shopSelect = true;
      }
      console.log('111',cardTeams[key].goods[i].selected);
      // for (var j = cardTeams[i].goods.length - 1; j >= 0; j--) {
      //   // console.log(cardTeams[key]);
      //   if (cardTeams[i].goods[j].selected) {
      //     cardTeams[key].shopSelect = true;
      //     break;
      //   }else{
      //     cardTeams[key].shopSelect = false;
      //   }
      // }
    }
    if (!selected) {
      arr.push(index);
    } else {
      arr.pop();
    };
    console.log(arr);
    if (arr.length == cardTeamsLen.length) {
      that.setData({
        checked_all: true,
        selectedAll: true
      })
    } else {
      that.setData({
        checked_all: false,
        selectedAll: false
      })
    };
    that.setData({
      cardTeams: cardTeams,
      newArr: arr
    });
    that.getTotalPrice();
  },
  // 全选
  checkedAll: function() {
    var that = this;
    var selectedAll = that.data.checked_all;
    selectedAll = !selectedAll;
    var cardTeams = that.data.cardTeams;
    var arr = [];
    for (var i = 0; i < cardTeams.length; i++) {
      for (var j = 0; j < cardTeams[i].goods.length; j++) {
        cardTeams[i].goods[j].selected = selectedAll;
        console.log(selectedAll);
        if (selectedAll) {
          arr.push(cardTeams[i].goods[j].id);
        } else {
          arr = [];
        };
      }
    };
    console.log(arr);
    that.setData({
      cardTeams: cardTeams,
      checked_all: selectedAll,
      newArr: arr
    });
    that.getTotalPrice();
  },
  //店铺全选
  checkedShopAll: function() {

  },
  // 计算商品价格
  getTotalPrice() {
    var cardTeams = this.data.cardTeams;
    var total = 0;
    for (var i = 0; i < cardTeams.length; i++) {
      for (var j = 0; j < cardTeams[i].goods.length; j++) {
        if (cardTeams[i].goods[j].selected) {
          total += cardTeams[i].goods[j].shopNum * cardTeams[i].goods[j].price;
        }
      }
    }
    this.setData({
      cardTeams: cardTeams,
      countMoney: total.toFixed(2)
    })
  },
  // 删除
  delItem: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    const cardTeams = that.data.cardTeams;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      cancelText: '否',
      confirmText: '是',
      success: function(res) {
        if (res.confirm) {
          cardTeams.splice(index, 1);
          that.setData({
            cardTeams: cardTeams
          });
          that.getTotalPrice();
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    var cardTeams = that.data.cardTeams;
    var arr = that.data.newArr;
    for (var i = 0; i < cardTeams.length; i++) {
      for (var j = 0; j < cardTeams[i].goods.length; j++) {
        that.data.cardTeamsLen.push(cardTeams[i].goods.length);
        if (that.data.checked_all) {
          cardTeams[i].goods[j].selected = true;
          cardTeams[i].shopSelect = true;
          arr.push(cardTeams[i].goods[j].id);
        } else {
          cardTeams[i].goods[j].selected = false;
          cardTeams[i].shopSelect = false;
          arr = [];
        }
      }
      
    }
    that.setData({
      cardTeams: cardTeams,
      newArr: arr
    })
    that.getTotalPrice(); //合计
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  //滑动删除
  //手指触摸动作开始 记录起点X坐标
  touchstart: function(e) {
    // var index = e.currentTarget.dataset.checkid;
    var key = e.currentTarget.dataset.key;
    //开始触摸时 重置所有删除
    this.data.cardTeams[key].goods.forEach(function(v, i) {
      console.log(v);
      if (v.isTouchMove) //只操作为true的
        v.isTouchMove = false;
    });
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      cardTeams: this.data.cardTeams
    })
  },
  //滑动事件处理
  touchmove: function(e) {
    var that = this,
      index = e.currentTarget.dataset.index, //当前索引
      startX = that.data.startX, //开始X坐标
      startY = that.data.startY, //开始Y坐标
      touchMoveX = e.changedTouches[0].clientX, //滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY, //滑动变化坐标
      //获取滑动角度
      angle = that.angle({
        X: startX,
        Y: startY
      }, {
        X: touchMoveX,
        Y: touchMoveY
      });

    var key = e.currentTarget.dataset.key;
    that.data.cardTeams[key].goods.forEach(function(v, i) {
      v.isTouchMove = false

      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }

    })
    //更新数据
    // console.log(that.data.cardTeams)
    that.setData({
      cardTeams: that.data.cardTeams
    })

  },
  angle: function(start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },
  drawEnd: function() {

  }
})