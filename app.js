//app.js
App({
  data: {
    //servsersUrl: "http://localhost:8080/wechat/"
  },
  onLaunch: function() {
    var that = this
    var user = wx.getStorageSync('user') || {};
    var userInfo = wx.getStorageSync('userInfo') || {};
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)) {
      wx.login({
        success: function(res) {
          if (res.code) {

            that.getOpenId(res.code);

            /**
            wx.getUserInfo({
              success: function(res) {
                var objz = {};
                objz.avatarUrl = res.userInfo.avatarUrl;
                objz.nickName = res.userInfo.nickName; 
                wx.setStorageSync('userInfo', objz); //存储userInfo
              }
            });
            var d = that.globalData; //这里存储了appid、secret、token串  
            var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
            wx.request({
              url: l,
              data: {},
              method: 'GET',                
              success: function(res) {
                var obj = {};
                obj.openid = res.data.openid; 
                console.log(obj);
                wx.setStorageSync('user', obj); //存储openid  
              }
            });*/
          } else {}
        }
      });
    }
  },

  //获取openid
  getOpenId: function(code) {
    var that = this;
    wx.request({
      url: 'http://172.16.0.39:8080/wechat/GetOpenId',
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'code': code
      },
      success: function(res) {
        // var openId = res.data.openid;
        var obj = {};
        obj.openid = res.data.openid;
        wx.setStorageSync('user', obj); //存储openid 
      }
    })
  },
  globalData: {
    userInfo: null,
    servsersUrl: "http://172.16.0.39:8080/wechat",
    //  appid: 'wx3c6ad1ea41695b0c', 
    //secret: '8a5c0cf5996aaaa815686c3c92b2c74a', 
  }
})