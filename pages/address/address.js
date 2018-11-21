const app = getApp();
var index = 0; 
Page({
  data: { 
    'proId': '',
    'proLevel':  '',
    'proName':  '',
    'proStandard': '',
    'proPrice':  '',
    'proPic':'',
    'totalPrice': ''
  },
  onLoad: function (options) {    
    //调用读取数据库的方法   
    this.setData({
      flag:options.flag
    })
    if (options.flag==1){
      this.setData({
        'proId': options.proId,
        'proLevel': options.proLevel,
        'proName': options.proName,
        'proStandard': options.proStandard,
        'proPrice': options.proPrice,
        'proPic':options.proPic,
        'totalPrice': options.proPrice
      }) 
    }
    this.getdata();
  },
 
  addAddre: function(e) {
    wx.navigateTo({
      url: '../newAddre/newAddre'
    })
  },
  toModifyAddre: function(e) { 
    var that = this;
    //拿到点击的index下标
    var index = e.currentTarget.id; 
    if (index != "" && index != "null" && index != null && index != "undefined") {   
      wx.navigateTo({
        url: '../modifyAddre/modifyAddre?receiver=' + that.data.addrList[index].receiver 
          + "&phone=" + that.data.addrList[index].phone
          + "&province=" + that.data.addrList[index].province
          + "&city=" + that.data.addrList[index].city
          + "&area=" + that.data.addrList[index].area
          + "&detailAddress=" + that.data.addrList[index].detailAddress
          + "&id=" + that.data.addrList[index].id 
          + "&index=" + index
      })
    } 
  },
   
  toCart: function(e) {
    var that = this;
    var addrList = this.data.addrList;
    for (var i = 0; i < this.data.addrList.length; i++) {
      if (i == e.currentTarget.dataset.index) {
        addrList[e.currentTarget.dataset.index].image = "../../image/check.jpg"
      } else {
        addrList[i].image = "../../image/uncheck.png"
      }
    }
    var index = e.currentTarget.id; 
    var flag = this.data.flag;
    if(flag == '0'){
      wx.redirectTo({
        url: '../cart/cart?receiver=' + that.data.addrList[index].receiver
          + "&phone=" + that.data.addrList[index].phone
          + "&detailAddress="
          + that.data.addrList[index].province
          + that.data.addrList[index].city
          + that.data.addrList[index].area
          + that.data.addrList[index].detailAddress
      }); 
    }
    if(flag == '1'){
      wx.redirectTo({
        url: '../cartOnly/cartOnly?receiver=' + that.data.addrList[index].receiver
          + "&phone=" + that.data.addrList[index].phone
          + "&detailAddress="
          + that.data.addrList[index].province
          + that.data.addrList[index].city
          + that.data.addrList[index].area
          + that.data.addrList[index].detailAddress
          + "&proId=" + that.data.proId
          + "&proLevel=" + that.data.proLevel
          + "&proName=" + that.data.proName
          + "&proStandard=" + that.data.proStandard
          + "&proPrice=" + that.data.proPrice
          + "&proPic=" + that.data.proPic
          + '&totalPrice=' + that.data.proPrice
      }); 
    }
    
  },  
 
  getdata: function () {
    //定义函数名称    
    var that = this;
    // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了   
    var userInfo = wx.getStorageSync('user');   
    wx.request({
      url: app.globalData.servsersUrl +'/address/Address/findAddrList.do', //请求地址      
      data: {//发送给后台的数据      
        userId: userInfo.openid
        },  
      header: { //请求头        
        "Content-Type": "applciation/json"
      },
      //method: "post",//get为默认方法/POST     
      success: function (res) {     
        that.setData({  
          addrList: res.data 
        })
      },
      fail: function (err) { }, //请求失败     
      complete: function () { } //请求完成后执行的函数    
    })
  },
})