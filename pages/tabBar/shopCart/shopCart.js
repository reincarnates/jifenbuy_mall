var storages = require('../../../lib/js/storage.js');
// pages/shopCart/shopCart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cardTeams: [],
    checked_all: false, //全选
    newArr: [], //复选框选中
    countMoney: 0, //结算价格
    countNum: 0,
    goodsNum: 0,
    cardTeamsLen: [],
    selectedAll: false,
    shopSelect: false,
    manage: '管理',
    mState: 1,
    settState: true,
    oper: false,
    classState: true,
    num: 1,
    zonglength: 0, //总条目
    yixuanlength: 0, //已选条目
    invalidArr: [], //失效商品
    invState: true,
    isGoods: true,
    isShow: false, //登录后显示
    isLogin: true, //登录前显示
    code: '', //临时凭证
  },

  // 购物车+
  getPlus: function(e) {
    var that = this;
    var cardTeams = that.data.cardTeams;
    var key = e.currentTarget.dataset.key;
    var index = e.currentTarget.dataset.index;
    // console.log(index)
    var goods_num = cardTeams[key].list[index].goods_num;
    goods_num++;
    that.shopCartNum(cardTeams[key].list[index].cart_id, goods_num);
    // var maxNum = cardTeams[key].list[index].stock;
    // for (var i = 0; i < maxNum.length; i++) {
    //   if (cardTeams[key].list[index].goods_sku == maxNum[i].goods_sku) {
    //     if (cardTeams[key].list[index].goods_num < maxNum[i].goods_storage) {
    //       goods_num++
    //     } else if (cardTeams[key].list[index].goods_num == maxNum[i].goods_storage) {
    //       wx.showToast({
    //         title: '没有库存了哦~',
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     }
    //   }
    // }

    cardTeams[key].list[index].goods_num = goods_num;
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

    if (cardTeams[key].list[index].goods_num > 1) {
      // cardTeams[key].list[index].goods_num = 1
      // that.delItem(e)
      cardTeams[key].list[index].goods_num--;
      that.shopCartNum(cardTeams[key].list[index].cart_id, cardTeams[key].list[index].goods_num);
    }
    // console.log(cardTeams[key].list[index].goods_num)
    that.setData({
      cardTeams: cardTeams
    })
    that.getTotalPrice();
  },

  //请求购物车商品数量
  shopCartNum: function(id, num) {
    wx.request({
      url: 'http://tapi.fulibuy.cn/Cart/CartUpdate',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        cart_id: id,
        sum: num
      },
      success(res) {
        console.log(res);
      }
    })
  },

  // 单选
  goodsdagou: function(e) {
    var that = this;

    // 本身
    var cardtanmess = 'cardTeams[' + e.target.dataset.fuindex + '].list[' + e.target.dataset.index + '].is_xuan';
    // 父级别
    var fucardtanmess = 'cardTeams[' + e.target.dataset.fuindex + '].lengths';
    if (that.data.cardTeams[e.target.dataset.fuindex].list[e.target.dataset.index].is_xuan == 0) {
      that.setData({
        [cardtanmess]: 1,
        [fucardtanmess]: that.data.cardTeams[e.target.dataset.fuindex].lengths + 1,
        yixuanlength: that.data.yixuanlength + 1,
        selectGoods: that.data.cardTeams[e.target.dataset.fuindex].list[e.target.dataset.index],
        selectIndex: e.target.dataset.fuindex
      });
    } else if (that.data.cardTeams[e.target.dataset.fuindex].list[e.target.dataset.index].is_xuan == 1) {
      that.setData({
        [cardtanmess]: 0,
        [fucardtanmess]: that.data.cardTeams[e.target.dataset.fuindex].lengths - 1,
        yixuanlength: that.data.yixuanlength - 1,
        selectGoods: '',
        selectIndex: 0
      });
    };

    var num = that.data.num;
    var cardTeams = that.data.cardTeams;
    var cardTeamsLen = that.data.cardTeamsLen;
    var index = e.currentTarget.dataset.checkid;
    var key = e.currentTarget.dataset.key;
    var arr = that.data.newArr;
    var selected = cardTeams[key].list[index].selected;
    cardTeams[key].list[index].selected = !selected;
    if (!selected) {
      arr.push(cardTeams[key].list[index].cart_id);
      this.setData({
        classState: false
      });
    } else {
      var _index = arr.indexOf(cardTeams[key].list[index].cart_id);
      arr.splice( _index, 1);
      if (arr.length == 0) {
        this.setData({
          classState: true
        });
      }
    };

    if (arr.length == cardTeamsLen.length) {
      that.setData({
        checked_all: true,
        selectedAll: true
      })
      cardTeams[key].shopSelect = true;
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

    // 父级别
    if (that.data.yixuanlength != that.data.zonglength) {
      for (var i = 0; i < that.data.cardTeams.length; i++) {
        var fucardtanmess = 'cardTeams[' + i + '].lengths'
        var fucardtanmezz = that.data.cardTeams[i].lengthz
        for (var j = 0; j < that.data.cardTeams[i].list.length; j++) {
          var cardtanmess = 'cardTeams[' + i + '].list[' + j + '].is_xuan'
          this.setData({
            [cardtanmess]: 1,
            [fucardtanmess]: fucardtanmezz,
            yixuanlength: that.data.zonglength
          });
        }
      };
    } else {
      for (var i = 0; i < that.data.cardTeams.length; i++) {
        var fucardtanmess = 'cardTeams[' + i + '].lengths'
        var fucardtanmezz = that.data.cardTeams[i].lengthz
        for (var j = 0; j < that.data.cardTeams[i].list.length; j++) {
          var cardtanmess = 'cardTeams[' + i + '].list[' + j + '].is_xuan'
          this.setData({
            [cardtanmess]: 0,
            [fucardtanmess]: 0,
            yixuanlength: 0
          });
        }
      };
    }

    var cardTeams = that.data.cardTeams;
    var arr = [];
    for (var i = 0; i < cardTeams.length; i++) {
      for (var j = 0; j < cardTeams[i].list.length; j++) {
        if (cardTeams[i].list[j].is_xuan == 1) {
          arr.push(cardTeams[i].list[j].cart_id);
          cardTeams[i].lengths = cardTeams[i].lengthz;
          this.setData({
            classState: false,
            checked_all: true
          });
        } else {
          arr = [];
          cardTeams[i].lengths = 0;
          this.setData({
            classState: true,
            checked_all: false
          });
        };
      }
    };
    that.setData({
      cardTeams: cardTeams,
      newArr: arr
    });

    that.getTotalPrice();
  },

  //店铺全选
  checkedShopAll: function(e) {
    var that = this;
    var cardTeams = that.data.cardTeams;
    // 父级别
    var fucardtanmess = 'cardTeams[' + e.target.dataset.indes + '].lengths';
    if (that.data.cardTeams[e.target.dataset.indes].lengthz == that.data.cardTeams[e.target.dataset.indes].lengths) {
      that.setData({
        yixuanlength: that.data.yixuanlength - that.data.cardTeams[e.target.dataset.indes].lengthz
      })

      for (var i = 0; i < that.data.cardTeams[e.target.dataset.indes].lengthz; i++) {
        var cardtanmess = 'cardTeams[' + e.target.dataset.indes + '].list[' + i + '].is_xuan';
        that.setData({
          [cardtanmess]: 0
        });
      };

      for (let i = 0; i < cardTeams[e.target.dataset.indes].list.length; i++) {
        if (cardTeams[e.target.dataset.indes].list[i].is_xuan != 1) {
          var id = cardTeams[e.target.dataset.indes].list[i].cart_id;
          var _index = that.data.newArr.indexOf(id);
          that.data.newArr.splice(_index, 1);
        }
      }
      
      that.setData({
        [fucardtanmess]: 0,
        newArr: that.data.newArr,
      });

      that.getTotalPrice();
    } else {
      that.setData({
        yixuanlength: that.data.yixuanlength - that.data.cardTeams[e.target.dataset.indes].lengths + that.data.cardTeams[e.target.dataset.indes].lengthz
      });

      for (var i = 0; i < that.data.cardTeams[e.target.dataset.indes].lengthz; i++) {
        var cardtanmess = 'cardTeams[' + e.target.dataset.indes + '].list[' + i + '].is_xuan';
        that.setData({
          [cardtanmess]: 1
        });
      };

      var len = that.data.cardTeams[e.target.dataset.indes].list;
      for (var i = 0; i < len.length; i++) {
        that.data.newArr.push(len[i].cart_id);
      }

      that.setData({
        [fucardtanmess]: that.data.cardTeams[e.target.dataset.indes].lengthz,
        newArr: that.data.newArr,
      });

      that.setData({
        yixuanlength: that.data.yixuanlength - that.data.cardTeams[e.target.dataset.indes].lengths + that.data.cardTeams[e.target.dataset.indes].lengthz
      });

      that.getTotalPrice();
    };
  },
  
  //管理
  manageClick: function() {
    var state = this.data.mState;
    if (state == 1) {
      this.setData({
        manage: '完成',
        mState: 2,
        settState: false,
        oper: true
      });
    } else {
      this.setData({
        manage: '管理',
        mState: 1,
        settState: true,
        oper: false
      });
    }
  },

  settlement: function() {
    console.log(this.data.newArr);
    wx.navigateTo({
      url: `/pages/confirmOrder/confirmOrder?cartId=${this.data.newArr}`
    });
  },

  // 计算商品价格
  getTotalPrice() {
    var cardTeams = this.data.cardTeams;
    var total = 0;
    var totalNum = 0;
    for (var i = 0; i < cardTeams.length; i++) {
      for (var j = 0; j < cardTeams[i].list.length; j++) {
        if (cardTeams[i].list[j].is_xuan == 1) {
          total += cardTeams[i].list[j].goods_num * cardTeams[i].list[j].goods_price;
          totalNum += cardTeams[i].list[j].goods_num;
        }
      }
    }
    this.setData({
      cardTeams: cardTeams,
      countMoney: total.toFixed(2),
      countNum: totalNum
    })
  },

  // 删除
  delItem: function(e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var key = e.currentTarget.dataset.key;
    const cardTeams = that.data.cardTeams;
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      cancelText: '否',
      confirmText: '是',
      success: function(res) {
        if (res.confirm) {
          var _index = cardTeams[key].list.indexOf(cardTeams[key].list[index]);
          wx.request({
            url: 'http://tapi.fulibuy.cn/Cart/delCart',
            method: 'POST',
            data: {
              user_token: wx.getStorageSync('user_token'),
              device_id: wx.getStorageSync('device_id'),
              cart_id: cardTeams[key].list[index].cart_id,
            },
            success(res) {
              console.log(res);
            }
          });
          cardTeams[key].list.splice(_index, 1);
          if (cardTeams[key].list.length != 0) {
            cardTeams[key].lengthz = cardTeams[key].list.length;
          }
          if (cardTeams[key].list.length == 0) {
            cardTeams.splice(key, 1);
          }
          if (that.data.invalidArr.length == 0 && that.data.cardTeams == 0) {
            that.setData({
              isGoods: false
            });
          }
          var aasindex = 0;
          for (var k = 0; k < cardTeams.length; k++) {
            for (var l = 0; l < cardTeams[k].list.length; l++) {
              aasindex++;
              that.setData({
                zonglength: aasindex
              });
            }
          }
          that.setData({
            cardTeams: cardTeams,
          });
          that.getTotalPrice();
        }
      }
    })
  },

  //操作删除
  semDelItem: function() {
    var _this = this;
    var cardTeams = this.data.cardTeams;
    var selectIndex = this.data.selectIndex;
    //全部选中删除
    if (_this.data.yixuanlength == _this.data.zonglength) {
      wx.showModal({
        title: '提示',
        content: '确定删除吗？',
        cancelText: '否',
        confirmText: '是',
        success: function (res) {
          if (res.confirm) {
            _this.semDelItemReq();
            _this.setData({
              cardTeams: [],
              manage: '管理',
              yixuanlength: 0,
              zonglength: 0,
            });
            if (_this.data.invalidArr.length == 0) {
              _this.setData({
                isGoods: false
              });
            }
          }
        }
      })
    }
    
    //选中两个以上删除
    if (_this.data.yixuanlength >= 1) {
      if (_this.data.yixuanlength != _this.data.zonglength) {
        wx.showModal({
          title: '提示',
          content: '确定删除吗？',
          cancelText: '否',
          confirmText: '是',
          success: function (res) {
            if (res.confirm) {

              _this.semDelItemReq();
              for (var i = 0; i < cardTeams.length; i++) {
                for (var j = cardTeams[i].list.length; j > 0; j--) {
                  if (cardTeams[i].list[j-1].is_xuan == 1) {
                    var _index = cardTeams[i].list.indexOf(cardTeams[i].list[j - 1]);
                    cardTeams[i].list.splice(_index, 1);
                    _this.setData({
                      cardTeams: cardTeams,
                    });
                    
                    
                    var aasindex = 0;
                    for (var k = 0; k < cardTeams.length; k++) {
                      for (var l = 0; l < cardTeams[k].list.length; l++) {
                        aasindex++;
                        _this.setData({
                          zonglength: aasindex,
                          yixuanlength: 0
                        });
                      }
                    }
                  }
                }
              }
            }
          }
        })
      }
    }
  },

  //操作删除请求接口
  semDelItemReq: function() {
    var _this = this;
    wx.request({
      url: 'http://tapi.fulibuy.cn/Cart/delCart',
      method: 'POST',
      data: {
        user_token: wx.getStorageSync('user_token'),
        device_id: wx.getStorageSync('device_id'),
        cart_id: _this.data.newArr.join(','),
      },
      success(res) {
        console.log(res);
        _this.setData({
          newArr: []
        });
      }
    });
  },

  //清理失效商品
  clearInvalid: function() {
    this.setData({
      invalidArr: [],
      invState: false
    });
    if (this.data.invalidArr.length == 0 && this.data.cardTeams == 0) {
      this.setData({
        isGoods: false
      });
    }
  },

  //获取临时凭证
  getCode: function () {
    var _this = this;
    wx.login({
      success(res) {
        _this.setData({
          code: res.code
        });
      }
    })
  },

  //允许获取手机号
  getPhoneNumber: function(e) {
    var _this = this;
    wx.checkSession({
      success() {
        //session_key 未过期，并且在本生命周期一直有效
        _this.loginSuccess(e, _this.data.code);
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        wx.navigateTo({
          url: `/pages/login/login`
        });
      }
    })
  },

  loginSuccess: function (msg, code) {
    var _this = this;
    if (msg.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.navigateTo({
        url: `/pages/login/login`
      });
    } else {
      //提交给服务端审核
      wx.request({
        url: 'http://tapiserv.fulibuy.cn/Member/programLogin',
        method: 'POST',
        header: {
          'content-type': 'application/json',
          'Accept': 'application/json;charset=UTF-8',
        },
        data: {
          code: code,
          encryptedData: msg.detail.encryptedData,
          iv: msg.detail.iv
        },
        success(res) {
          if (res.data.data.wrong == "code") {
            wx.showToast({
              title: '连接服务器超时，请重试！',
              icon: 'none',
              duration: 2000
            });
          } else {
            if (res.data.data.is_visitor == false) {
              wx.showToast({
                title: '登陆成功',
                icon: 'none',
                duration: 1000
              });
              storages.put('userInfo', res.data.data);
              wx.setStorage({
                key: 'device_id',
                data: res.data.data.device_id,
              });
              wx.setStorage({
                key: 'user_token',
                data: res.data.data.user_token,
              });
              _this.getLoginStatus();
            } else {
              wx.showToast({
                title: '当前微信绑定的手机号未注册,请使用已注册阳光福利商城的手机号登录。',
                icon: 'none',
                duration: 2000
              });
            }
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   var _this = this;
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {
    var that = this;
    // var cardTeams;
    var arr = that.data.newArr;

    wx.request({
      url: 'http://tapi.fulibuy.cn/Cart/cart',
      method: 'POST',
      data: {
         user_token: wx.getStorageSync('user_token'),
         device_id: wx.getStorageSync('device_id')
        // user_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJKV1QiLCJpYXQiOjE1NjYyODk1NzAsImV4cCI6MzEzMjU3OTE0MCwiYXVkIjoiYXBpQmFzZSIsInN1YiI6IjExMTFhcGlCYXNlIiwiZGF0YSI6eyJtZW1iZXJfaWQiOjIwMDIyMiwibmlja25hbWUiOiJcdTc1MzBcdTRmMWYiLCJjb21wYW55X2lkIjoxOSwidXNlcm5hbWUiOiIxNzYxMTY0MDExOSIsImNyZWF0ZV90aW1lIjoiMjAxOS0wNi0yNCAxNjozNzo1OCIsImRldmljZV9pZCI6Im9rTE9hNWRNSThNVkthVUNGYXJkWGFQMHFVVWsiLCJhcGlfdXJsIjoiaHR0cDpcL1wvdGFwaS5mdWxpYnV5LmNuIn19.ldqA94qbhwLGcG9e4UjvbrKDvr4vt2TEUgPTbJ7fUaQ',
        // device_id: 'okLOa5dMI8MVKaUCFardXaP0qUUk',
      },
      success(res) {
        if (res.data.code) {
          //  console.log(res);
          // cardTeams = res.data.data.cart_list[0].list;
          that.setData({
            cardTeams: res.data.data.cart_list
          });

          var arr2 = [];
          var arr3 = [];
          var zlength = 0;
          for (var i = 0; i < that.data.cardTeams.length; i++) {
            that.data.cardTeams[i].lengthz = that.data.cardTeams[i].list.length;
            that.data.cardTeams[i].lengths = 0;
            arr3.push({
              store_id: that.data.cardTeams[i].store_id,
              store_name: that.data.cardTeams[i].store_name,
              list: [],
              lengths: that.data.cardTeams[i].lengths
            });
            for (var j = 0; j < that.data.cardTeams[i].list.length; j++) {
              if (that.data.cardTeams[i].list[j].stock && that.data.cardTeams[i].list[j].goods_state == 1) {
                zlength++;
                that.setData({
                  zonglength: zlength
                });
              }

              that.data.cardTeamsLen.push(that.data.cardTeams[i].list.length);

              if (that.data.checked_all) {
                that.data.cardTeams[i].list[j].is_xuan = 1;
                // that.data.cardTeams[i].shopSelect = true;
                arr.push(that.data.cardTeams[i].list[j].cart_id);
              } else {
                that.data.cardTeams[i].list[j].is_xuan = 0;
                // that.data.cardTeams[i].shopSelect = false;
                arr = [];
              }

              var state = that.data.cardTeams[i].list[j].goods_state;
              if (state != 1) {
                arr2.push(that.data.cardTeams[i].list[j]);
              }

              if (that.data.cardTeams[i].list[j].stock && that.data.cardTeams[i].list[j].goods_state == 1) {
                arr3[i].list.push(that.data.cardTeams[i].list[j]);
                arr3[i].lengthz = arr3[i].list.length;
              }
            }
          }

          that.setData({
            cardTeams: arr3,
            newArr: arr,
            invalidArr: arr2,
          });
        }
      }
    });

    that.getTotalPrice(); //合计

    that.getLoginStatus();
  },

  //获取登陆状态
  getLoginStatus: function() {
    var _this = this;
    var user = wx.getStorageSync('userInfo');
    if (user != undefined) {
      if (user.is_visitor == false && user.is_login == true) {
        _this.setData({
          isShow: true,
          isLogin: false
        });
      }
    }
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
    this.data.cardTeams[key].list.forEach(function(v, i) {
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
    that.data.cardTeams[key].list.forEach(function(v, i) {
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