// pages/shopcart/shopcart.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    servsersUrl: app.globalData.servsersUrl,
    'checkAll': false,
    'totalCount': 0,
    'totalPrice': 0
  },
  cartPage: function() {
    var goodList = this.data.goodList;
    wx.setStorageSync("goodList", goodList) //存缓存  
    wx.navigateTo({
      url: '../cart/cart',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    /**
    var that = this;     
    that.getdata(); */
  },

  getdata: function() {
    //定义函数名称    
    var that = this;
    var userInfo = wx.getStorageSync('user'); 
    wx.request({
      url: app.globalData.servsersUrl +'/product/ShoppingCart/findCartList.do', //请求地址      
      data: {//发送给后台的数据        
        userId: userInfo.openid 
      },       
      header: { //请求头        
        "Content-Type": "applciation/json"
      },
      //method: "post",//get为默认方法/POST     
      success: function(res) {       
        that.setData({ 
          goodList: res.data
        })
      },
      fail: function(err) {}, //请求失败     
      complete: function() {} //请求完成后执行的函数    
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.calculateTotal();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this;
    //调用读取数据库的方法   
    that.getdata();
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

  /**
   * 更新商品数据
   */
  updateShopCount: function(event) {
    //定义函数名称    
    var that = this;
    // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了   
    var index = event.currentTarget.dataset.index;
    var goodList = this.data.goodList;
    //var count = event.currentTarget.dataset.count;
    wx.request({
      url: app.globalData.servsersUrl +'/product/ShoppingCart/updateShopCount.do', //请求地址      
      data: { //发送给后台的数据        
        id: goodList[index].id,
        count: goodList[index].count
      },

      header: { //请求头        
        "Content-Type": "applciation/json"
      },
      //method: "post",//get为默认方法/POST     
      success: function(res) {},
      fail: function(err) {}, //请求失败     
      complete: function() {} //请求完成后执行的函数    
    })
  },

  /**
   * 删除购物车商品
   */
  deleteShopCart: function(event) {
    //定义函数名称    
    var that = this; 
    var id = event.currentTarget.dataset.id;
    wx.request({
      url: app.globalData.servsersUrl +'/product/ShoppingCart/deleteShop.do', //请求地址      
      data: { //发送给后台的数据        
        id: id
      },
      header: { //请求头        
        "Content-Type": "applciation/json"
      },
      //method: "post",//get为默认方法/POST     
      success: function(res) {
        console.log(res.data); //res.data相当于ajax里面的data,为后台返回的数据   
      },
      fail: function(err) {}, //请求失败     
      complete: function() {} //请求完成后执行的函数    
    })
  },

  /**
   * 计算商品总数
   */
  calculateTotal: function() {
    var goodList = this.data.goodList;
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
        'totalPrice': totalPrice
      })
    }
  },

  /**
   * 用户点击商品减1
   */
  subtracttap: function(e) {
    var index = e.target.dataset.index;
    var goodList = this.data.goodList;
    var count = goodList[index].count;
    if (count <= 1) {
      return;
    } else {
      goodList[index].count--;
      this.setData({
        'goodList': goodList
      });
      this.updateShopCount(e);
      this.calculateTotal();
    }
  },

  /**
   * 用户点击商品加1
   */
  addtap: function(e) {
    var index = e.target.dataset.index;
    var goodList = this.data.goodList;
    var count = goodList[index].count;
    goodList[index].count++;
    this.setData({
      'goodList': goodList
    });
    this.updateShopCount(e);
    this.calculateTotal();
  },
  /**
   * 用户选择购物车商品
   */
  checkboxChange: function(e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value);
    var checkboxItems = this.data.goodList;
    var values = e.detail.value;
    for (var i = 0; i < checkboxItems.length; ++i) {
      checkboxItems[i].checked = false;
      for (var j = 0; j < values.length; ++j) {
        if (checkboxItems[i].id == values[j]) {
          checkboxItems[i].checked = true;
          break;
        }
      }
    }

    var checkAll = false;
    if (checkboxItems.length == values.length) {
      checkAll = true;
    }

    this.setData({
      'goodList': checkboxItems,
      'checkAll': checkAll
    });
    this.calculateTotal();
  },

  /**
   * 用户点击全选
   */
  selectalltap: function(e) {
    console.log('用户点击全选，携带value值为：', e.detail.value);
    var value = e.detail.value;
    var checkAll = false;
    if (value && value[0]) {
      checkAll = true;
    }

    var goodList = this.data.goodList;
    for (var i = 0; i < goodList.length; i++) {
      var good = goodList[i];
      good['checked'] = checkAll;
    }

    this.setData({
      'checkAll': checkAll,
      'goodList': goodList
    });
    this.calculateTotal();
  },
  //删除
  shanchu: function(e) {
    var goodList = this.data.goodList //获取购物车列表
    var index = e.currentTarget.dataset.index //获取当前点击事件的下标索引
    //var values = e.detail.value;
    goodList.splice(index, 1);

    var checkAll = this.data.checkAll;
    if (goodList.length == 0 && checkAll) {
      checkAll = false;
    }

    this.setData({
      goodList: goodList,
      'checkAll': checkAll
    });
    if (goodList.length) {
      /** this.setData({
         cartList: false
       });**/
    }
    this.deleteShopCart(e);
    this.calculateTotal();
    wx.setStorageSync("goodList", goodList) //存缓存  
  },


  /**
   * 跳转到详情页面
   */
  gotoProductinfo: function(e) {
    var that = this;
    //拿到点击的index下标
    var index = e.currentTarget.id;
    //将对象转为string
    // var productBean = JSON.stringify(that.data.productList[index]);
    if (index != "" && index != "null" && index != null && index != "undefined") {
      var proId = that.data.goodList[index].proId;
      wx.navigateTo({
        url: '../goodsDetail/goodsDetail?proId=' + proId,
      })
    }
  }


})