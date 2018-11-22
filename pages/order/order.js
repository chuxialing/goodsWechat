//logs.js
const util = require('../../utils/util.js')
var app = getApp();
Page({
  data: {
    servsersUrl: app.globalData.servsersUrl,
    'checkAll': false,
    'totalCount': 0,
    'totalPrice': 0
  },
  toOrderItem: function(e) {
    var that = this;
    //拿到点击的index下标
    var orderId = e.currentTarget.dataset.orderid;
    if (orderId != "" && orderId != "null" && orderId != null && orderId != "undefined") {
      wx.navigateTo({
        url: '../orderItem/orderItem?orderId=' + orderId
      })
    }
  },

  onLoad: function() {
    /** 
    var that = this;
    //调用读取数据库的方法   
    this.getdata();
    */
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    //调用读取数据库的方法   
    that.getdata();
  },

  getdata: function() {
    //定义函数名称    
    var that = this;
    var userInfo = wx.getStorageSync('user');
    wx.request({
      url: app.globalData.servsersUrl + '/product/OrderGoods/findOrderList.do', //请求地址      
      data: { //发送给后台的数据        
        userId: userInfo.openid
      },
      header: { //请求头        
        "Content-Type": "applciation/json"
      },
      //method: "post",//get为默认方法/POST     
      success: function(res) {
        that.setData({
          orderList: res.data
        })
      },
      fail: function(err) {}, //请求失败     
      complete: function() {} //请求完成后执行的函数    
    })
  },
  //继续支付
  continuePay: function(e) {
    var warn = "";
    var that = this;
    var userInfo = wx.getStorageSync('user');
    wx.request({
      url: app.globalData.servsersUrl + '/product/OrderGoods/saveOrder.do', //请求地址      
      data: { //发送给后台的数据        
        userId: userInfo.openid,
        orderId: that.data.orderList[0].orderId,
        totolPrice: that.data.orderList[0].totalPrice,
      },

      header: { //请求头        
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: "post", //get为默认方法/POST     
      success: function(res) {
        //支付
        that.payoff(e);
        /** 
        wx.reLaunch({
          url: '../order/order'
        }) */
      },
      fail: function(err) {}, //请求失败     
      complete: function() {} //请求完成后执行的函数    
    })
  },
  payoff: function(e) {
    var that = this;
    wx.login({
      success: function(res) {
        that.getOpenId(res.code);
      }
    });

  },
  //获取openid
  getOpenId: function(code) {
    var that = this;
    wx.request({
      url: app.globalData.servsersUrl + '/GetOpenId',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'code': code
      },
      success: function(res) {
        var openId = res.data.openid;
        that.xiadan(openId);
      }
    })
  },
  //下单
  xiadan: function(openId) {
    var that = this;
    wx.request({
      url: app.globalData.servsersUrl + '/xiadan',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'openid': openId
      },
      success: function(res) {
        var prepay_id = res.data.prepay_id;
        that.sign(prepay_id);
      }
    })
  },
  //签名
  sign: function(prepay_id) {
    var that = this;
    wx.request({
      url: app.globalData.servsersUrl + '/sign',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'repay_id': prepay_id
      },
      success: function(res) {
        that.requestPayment(res.data);

      }
    })
  },
  //申请支付
  requestPayment: function(obj) {
    wx.requestPayment({
      'timeStamp': obj.timeStamp,
      'nonceStr': obj.nonceStr,
      'package': obj.package,
      'signType': obj.signType,
      'paySign': obj.paySign,
      'success': function(res) {
        //支付成功之后，跳转到 订单列表页面
        wx.reLaunch({
          url: '../order/order'
        })
      },
      'fail': function(res) {}
    })
  },

  //删除
  shanchu: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          var orderList = this.data.orderList //获取订单列表
          var index = e.currentTarget.dataset.index //获取当前点击事件的下标索引

          orderList.splice(index, 1);

          this.setData({
            orderList: orderList
          });
          this.deleteOrder(e);
          wx.setStorageSync("orderList", orderList) //存缓存  
        } else if (sm.cancel) {}
      }
    })
  },

  //删除订单
  deleteOrder: function(event) {

    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function(sm) {
        if (sm.confirm) {
          //定义函数名称    
          var that = this;
          var id = event.currentTarget.dataset.id;
          wx.request({
            url: app.globalData.servsersUrl + '/product/OrderGoods/deleteOrder.do', //请求地址      
            data: { //发送给后台的数据        
              id: id
            },
            header: { //请求头        
              "Content-Type": "applciation/json"
            },
            //method: "post",//get为默认方法/POST     
            success: function(res) {
              wx.reLaunch({
                url: '../order/order'
              })
            },
            fail: function(err) {}, //请求失败     
            complete: function() {} //请求完成后执行的函数    
          })
        } else if (sm.cancel) {}
      }
    })

  },


  //取消
  tapCancel: function(event) {
    wx.showModal({
      title: '提示',
      content: '确定要取消该订单吗？',
      success: function(sm) {
        if (sm.confirm) {
          // 用户点击了确定 此处调用取消订单方法 

          //定义函数名称    
          var that = this;
          var id = event.currentTarget.dataset.id;
          wx.request({
            url: app.globalData.servsersUrl + '/product/OrderGoods/cancelOrder.do', //请求地址      
            data: { //发送给后台的数据        
              id: id
            },
            header: { //请求头        
              "Content-Type": "applciation/json"
            },
            //method: "post",//get为默认方法/POST     
            success: function(res) {
              wx.reLaunch({
                url: '../order/order'
              })
            },
            fail: function(err) {}, //请求失败     
            complete: function() {} //请求完成后执行的函数    
          })
        } else if (sm.cancel) {}
      }
    })
  }
})