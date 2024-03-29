
const apiURL = "http://tapi.fulibuy.cn";

const wxRequest = (params, url) => {
  var data = params.data || {};
  var user_token = wx.getStorageSync('user_token');
  var device_id = wx.getStorageSync('device_id');

  if (user_token) {
    data.user_token = user_token;
  }
  if (device_id) {
    data.device_id = device_id;
  }

  wx.request({
    url,
    method: params.method || 'POST',
    dataType: params.dataType || 'json',
    data,
    header: {
      Accept: 'application/x-www-form-urlencoded',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    success(res) {
      if (params.success) {
        params.success(res);
      }
    },
    fail(res) {
      if (params.fail) {
        params.fail(res);
      }
    },
    complete(res) {
      if (params.complete) {
        params.complete(res);
      }
    },
  });
};

// 文件上传
const wxUpload = (params, url) => {
  var data = params.data || {};
  var user_token = wx.getStorageSync('user_token');
  var device_id = wx.getStorageSync('device_id');

  if (user_token) {
    data.user_token = user_token;
  }
  if (device_id) {
    data.device_id = device_id;
  }
  wx.uploadFile({
    url,
    filePath: params.filePath,
    name: params.name,
    formData: data ,
    header: {
      Accept: 'application/x-www-form-urlencoded',
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    success(res) {
      if (params.success) {
        params.success(res);
      }
    },
    fail(res) {
      if (params.fail) {
        params.fail(res);
      }
      wx.showModal({
        title: '提示',
        content: '上传失败',
        showCancel: false
      })
    },
    complete(res) {
      if (params.complete) {
        params.complete(res);
      }
      wx.hideToast();
    },
  });
};

/** --------------------------- 首页相关 -------------------------------- */

// 首页八个频道
const nav = (params) => {
  wxRequest(params, `${apiURL}/index/nav`);
}

/** --------------------------- 订单相关 -------------------------------- */

//获取各订单数量
const getOrderNumber = (params) => {
  wxRequest(params, `${apiURL}/Member/getOrderNum`);
}

// 订单列表
const ordersList = (params) => {
  wxRequest(params, `${apiURL}/Order/getOrderList`);
}

// 订单详情
const ordersDetail = (params) => {
  wxRequest(params, `${apiURL}/Order/getOrderInfo`);
}

// 取消原因获取
const ordersCancelReason = (params) => {
  wxRequest(params, `${apiURL}/Order/cancelReason`);
}

// 未付款订单取消
const preSaleCancel = (params) => {
  wxRequest(params, `${apiURL}/Order/preSaleCancle`);
}

// 已付款订单取消接口
const applyWattingRefund = (params) => {
  wxRequest(params, `${apiURL}/Order/applyWattingRefund`);
}

// 确认收货
const confirmOrders = (params) => {
  wxRequest(params, `${apiURL}/member/SaveCompleteOrder`);
}

// 获取订单评价
const orderEvaluetion = (params) => {
  wxRequest(params, `${apiURL}/order/getOrderEvaluateGoods`);
}

// 提交评价
const submitEvaluation = (params) => {
  wxRequest(params, `${apiURL}/order/saveOrderEvaluateGoods`);
}

// 评价图片上传
const uploadPicEvaluation = (params) => {
  wxUpload(params, `${apiURL}/Member/upload`);
}

/** --------------------------- 设置相关 -------------------------------- */
 
// 保存个人信息设置
const saveUserinfo = (params) => {
  wxRequest(params, `${apiURL}/Member/editMemberInfo`);
}

// 头像上传
const uploadAvatarimg = (params) => {
  wxUpload(params, `${apiURL}/Publicauth/upload_img`);
}

module.exports = {
  nav,

  getOrderNumber,
  ordersList,
  ordersDetail,
  ordersCancelReason,
  preSaleCancel,
  applyWattingRefund,
  confirmOrders,
  
  orderEvaluetion,
  uploadPicEvaluation,
  submitEvaluation,

  saveUserinfo,
  uploadAvatarimg
};
