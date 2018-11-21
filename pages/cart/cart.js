// pages/cart/cart.js
const app = getApp();
var index = 0;
var li = [];
var productList = [];
Page({
  addressPage: function() {
    wx.navigateTo({
      url: '../address/address?flag=0',
    })
  },
  /**
   * 页面的初始数据
   */
  data: {
    servsersUrl: app.globalData.servsersUrl,
    'totalCount': 0,
    'totalPrice': 0,
     "receiver":'',
     "phone":'',
     "detailAddress":'',
     productList: productList 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this; 
    var list = wx.getStorageSync("goodList") //取缓存
     
    //计算商品总额
    var goodList = list;
    if (goodList != null && goodList != "" && goodList != "undefined") {
      var totalCount = 0;
      var totalPrice = 0;
      for (var i = 0; i < goodList.length; i++) {
        var good = goodList[i];
        if (good.checked) {
          totalCount += good.count;
          totalPrice += good.count * good.proPrice;
        }
      }
      totalPrice = totalPrice.toFixed(2);
      this.setData({
        'totalCount': totalCount,
        'totalPrice': totalPrice,       
         productList: list
      })

      if (options.receiver != null && options.receiver != "" && options.receiver != "undefined") {
        this.setData({ 
          "receiver": options.receiver,
          "phone": options.phone,
          "detailAddress": options.detailAddress 
        })
      }
    }
  },

  /**
   * 保存订单
   */
  saveOrder: function (e) {
    var warn = "";
    var that = this; 

    var userInfo = wx.getStorageSync('user'); 

    wx.request({
      url: app.globalData.servsersUrl +'/product/OrderGoods/saveOrder.do', //请求地址      
      data: {//发送给后台的数据        
        userId: userInfo.openid,
        receiver: that.data.receiver,
        phone: that.data.phone, 
        detailAddress: that.data.detailAddress,
        invoice: that.data.invoice,
        remark: that.data.remark,
        total: that.data.totalPrice ,
        productListStr: JSON.stringify(that.data.productList)
      },

      header: { //请求头        
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: "post",//get为默认方法/POST     
      success: function (res) {
        //支付
        that.payoff(e);
        /** 
        wx.reLaunch({
          url: '../order/order'
        }) */
      },
      fail: function (err) { }, //请求失败     
      complete: function () { } //请求完成后执行的函数    
    })  
  },
 
  //获取用户输入的发票抬头
  invoiceInput: function (e) {
    this.setData({
      invoice: e.detail.value
    })
  },

  //获取用户输入的备注
  remarkInput: function (e) {
    this.setData({
      remark: e.detail.value
    })
  },

  payoff: function (e) {
    var that = this;
    wx.login({
      success: function (res) {
        that.getOpenId(res.code);
      }
    });

  },
  //获取openid
  getOpenId: function (code) {
    var that = this;
    wx.request({
      url: app.globalData.servsersUrl +'/GetOpenId',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 'code': code },
      success: function (res) {
        var openId = res.data.openid;
        that.xiadan(openId);
      }
    })
  },
  //下单
  xiadan: function (openId) {
    var that = this;
    wx.request({
      url: app.globalData.servsersUrl +'/xiadan',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 'openid': openId },
      success: function (res) {
        var prepay_id = res.data.prepay_id;
        that.sign(prepay_id);
      }
    })
  },
  //签名
  sign: function (prepay_id) {
    var that = this;
    wx.request({
      url: app.globalData.servsersUrl +'/sign',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: { 'repay_id': prepay_id },
      success: function (res) {
        that.requestPayment(res.data);

      }
    })
  },
  //申请支付
  requestPayment: function (obj) {
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function (res) {
        //支付成功之后，跳转到 订单列表页面
        wx.reLaunch({
          url: '../order/order'
        })
      },
      'fail': function (res) {
      }
    })
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

  }
})