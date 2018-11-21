//index.js
//获取应用实例
const app = getApp()

Page({
  addCart: function(e) {
    var index = e.currentTarget.id;
    var goodList = this.data.productList;
    var count = goodList[index].count;
    goodList[index].count++;
    this.setData({
      'productList': goodList
    });
    this.calculateTotal();
  },
  decreseCart: function(e) {
    var index = e.currentTarget.id;
    var goodList = this.data.productList;
    var count = goodList[index].count;
    if (count < 1) {
      return;
    } else {
      goodList[index].count--;
      this.setData({
        'productList': goodList
      });
      this.calculateTotal();
    }
  },
  selectMenu: function(res) {
    var clickId = this.data.clickId
    this.setData({
      clickId: res.currentTarget.id
    })
  },
  cartPage: function() {
    wx.navigateTo({
      url: '../cart/cart',
    })
  },
  //跳转详情界面
  toDetail: function(e) {
    var that = this;
    //拿到点击的index下标
    var index = e.currentTarget.id;
    //将对象转为string
   // var productBean = JSON.stringify(that.data.productList[index]);
    if (index != "" && index != "null" && index != null && index !="undefined" ){
      var proId = that.data.productList[index].id;
      wx.navigateTo({
        url: '../goodsDetail/goodsDetail?proId=' + proId,
      })
    }
  },

  /**
   * 计算商品总数
   */
  calculateTotal: function() {
    var goodList = this.data.productList;
    var totalCount = 0;
    var totalPrice = 0;
    for (var i = 0; i < goodList.length; i++) {
      var good = goodList[i];
      if (good.count > 0) {
        totalCount += good.count;
        totalPrice += good.count * good.proPrice;
      }
    }
    totalPrice = totalPrice.toFixed(2);
    this.setData({
      'totalCount': totalCount,
      'totalPrice': totalPrice
    }) 
  },

  /**
   * 页面的初始数据
   */
  data: {
    servsersUrl: app.globalData.servsersUrl,
    //count: 0,
    // price: 10,
    minPrice: 20,
    totalCount: 0,
    totalPrice: 0,
    isSelectMenu: false,
    indicatorDots: true,
    clickId: '',
    
    movies: [{
      url: '/image/banner/banner.jpg'
      },
      {
        url: '/image/banner/food.jpg'
      },
      {
        url: '/image/banner/油.jpg'
      } 
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var list = that.data.list;
    var currentPage = that.data.currentPage;
    wx.showNavigationBarLoading(); //在标题栏中显示加载  
    //调用读取数据库的方法   
    this.getdata();
  },


  getdata: function() {
    //定义函数名称    
    var that = this;
    // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了   
    wx.request({
      url: app.globalData.servsersUrl +'/product/ProType/list.do', //请求地址      
      /*data: {//发送给后台的数据        name: "bella",        age: 20      },*/
      header: { //请求头        
        "Content-Type": "applciation/json"
      },
      //method: "post",//get为默认方法/POST     
      success: function(res) {        
        that.setData({ //如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数          　　
          proTypeList: res.data[0].proTypeList,
          productList: res.data[0].productList
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