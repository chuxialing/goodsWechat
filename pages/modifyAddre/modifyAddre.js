var flag = false;
const AreaData = require("area.js");
const app = getApp()
Page({
  data: {     
    receiver: "请填写您的姓名",
    phone: "请填写您的联系方式", 
    detailAddress: "街道门牌信息",
    index: "0"
  },
  onLoad: function(options) {
   
    this.setData({
      id:options.id,
      receiver: options.receiver,
      phone: options.phone,
      //region: options.region,
      province: options.province,
      city: options.city,
      area: options.area,
      detailAddress: options.detailAddress,
      index: options.index
    })
  },

  // 省市地三级联动
  sureSelectAreaListener: function(e) {
    var that = this;
    that.setData({
      province: e.detail.currentTarget.dataset.province,
      city: e.detail.currentTarget.dataset.city,
      area: e.detail.currentTarget.dataset.area,
      show: false,
    })
  },
  chooseAddress: function() {
    var that = this;
    that.setData({
      show: true
    })
  },
   
  //点击删除
  delete: function(e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除该地址信息吗？',
      success: function(res) {
        if (res.confirm) {
           
          wx.request({
            url: app.globalData.servsersUrl +'/address/Address/deleteAddr.do', //请求地址      
            data: {//发送给后台的数据 
              id: e.currentTarget.dataset.id 
            },

            header: { //请求头        
              'content-type': 'application/x-www-form-urlencoded',
            },
            method: "post",//get为默认方法/POST     
            success: function (res) {
              console.log(res.data); //res.data相当于ajax里面的data,为后台返回的数据   
              wx.redirectTo({//跳转到收货地址列表页面
                url: '../address/address'
              });
            },
            fail: function (err) { }, //请求失败     
            complete: function () { } //请求完成后执行的函数    
          }) 

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //点击取消，返回上个页面
  cancel: function() {
    wx.navigateBack({
      delta: 1
    })
  },
  //点击保存
  formSubmit: function(e) {
    var warn = "";
    var that = this;
    if (e.detail.value.receiver == "") {
      warn = "请填写您的姓名！";
    } else if (e.detail.value.phone == "") {
      warn = "请填写您的手机号！";
    } else if (!(/^1(3|4|5|7|8)\d{9}$/.test(e.detail.value.phone))) {
      warn = "手机号格式不正确";
    } else if (e.detail.value.area == '0') {
      warn = "请选择您的所在区域";
    } else if (e.detail.value.detailAddress == "") {
      warn = "请输入您的具体地址";
    } else {
      flag = true;
      
      var userInfo = wx.getStorageSync('user');       
      wx.request({
        url: app.globalData.servsersUrl +'/address/Address/updateAddr.do', //请求地址      
        data: {//发送给后台的数据        
          userId: userInfo.openid,
          id: e.detail.value.id,
          receiver: e.detail.value.receiver,
          phone: e.detail.value.phone,
          province: that.data.province,
          city: that.data.city,
          area: that.data.area,
          //  re: that.data.province + '-' + that.data.city + '-' + that.data.area ,
          detailAddress: e.detail.value.detailAddress
        },

        header: { //请求头        
          'content-type': 'application/x-www-form-urlencoded',
        },
        method: "post",//get为默认方法/POST     
        success: function (res) {
          console.log(res.data); //res.data相当于ajax里面的data,为后台返回的数据   
          wx.redirectTo({//跳转到收货地址列表页面
            url: '../address/address'
          });
        },
        fail: function (err) { }, //请求失败     
        complete: function () { } //请求完成后执行的函数    
      })

    }
    if (flag == false) {
      wx.showModal({
        title: '提示',
        content: warn
      })
    }

  },

})