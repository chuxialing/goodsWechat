// pages/goodsDetail/goodsDetail.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    servsersUrl: app.globalData.servsersUrl,
    indicatorDots: true,
    afterColor: "#1296db"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    //var productBean = JSON.parse(options.productBean);     
    that.getDetailProduct(options.proId);

  },
  cartPage: function(e) {
    var that = this;
    var proId = e.currentTarget.dataset.proid;
    wx.navigateTo({
      url: '../cartOnly/cartOnly?proId=' + proId
        + "&proLevel=" + e.currentTarget.dataset.prolevel
        + "&proName=" + e.currentTarget.dataset.proname
        + "&proStandard=" + e.currentTarget.dataset.prostandard 
        + "&proPrice=" + e.currentTarget.dataset.proprice
        + "&proPic=" + e.currentTarget.dataset.propic 
    })
  },
  addCart: function(e) {
    var that = this;

    var userInfo = wx.getStorageSync('user');
    var proId = e.currentTarget.dataset.id;

    wx.request({
      url: app.globalData.servsersUrl +'/product/ShoppingCart/saveShop.do', //请求地址      
      data: { //发送给后台的数据        
        userId: userInfo.openid,
        proId: proId
      },

      header: { //请求头        
        'content-type': 'application/x-www-form-urlencoded',
      },
      method: "post", //get为默认方法/POST     
      success: function(res) {

      },
      fail: function(err) {}, //请求失败     
      complete: function() {} //请求完成后执行的函数    
    })

    var cartCount = that.data.cartCount;
    cartCount++;
    that.setData({
      'cartCount': cartCount,
    })

  },
  toShopcart: function() {
    wx.reLaunch({
      url: '../shopcart/shopcart',
      // success: function (e) {
      //  var page = getCurrentPages().pop();
      //  if (page == undefined || page == null) return;
      //  page.onLoad();
      // }  
    })
  },

  getDetailProduct: function(proId) {
    //定义函数名称    
    var that = this;
    var userInfo = wx.getStorageSync('user');
    wx.request({
      url: app.globalData.servsersUrl +'/product/Product/findById.do', //请求地址      
      data: { //发送给后台的数据       
        proId: proId,
        userId: userInfo.openid
      },
      header: { //请求头        
        "Content-Type": "applciation/json"
      },
      //method: "post",//get为默认方法/POST     
      success: function(res) {       
        that.setData({ //如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数          　　
          product: res.data[0].product,
          lbList: res.data[0].lbList,
          xqList: res.data[0].xqList,
          cartCount: res.data[0].cartCount
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

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐 */
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