const app = getApp()
const api = require('../../../http/api')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    ossImg:app.globalData.ossImgUrl,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userCode:'',
    disabled:false,
  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    let token = wx.getStorageSync("token")
    console.log(token)
    if(token!=''){
      if (wx.getStorageSync('jlqy')=='jlqy') {
        wx.removeStorageSync('jlqy')
        wx.reLaunch({
          url: '/packageHome/pages/interests/index',
        })
      } else {
        wx.switchTab({
          url: '/page/home/index',
        })
      }
    }else{
       // 查看是否授权
       let that = this
       wx.getSetting({
         success (res){
           if (res.authSetting['scope.userInfo']) {
             // 已经授权，可以直接调用 getUserInfo 获取头像昵称
             wx.login({
               success (res) {
                 console.log(res.code)
                 that.setData({
                   userCode:res.code
                 })
               }
             })
           }
         }
       })
    }
  },



  bindGetUserInfo (e) {
    let params= {
      code: this.data.userCode,
      encryptedData: e.detail.encryptedData,
      iv: e.detail.iv,
      rawData:e.detail.rawData,
      signature: e.detail.signature,
    }
    console.log(params)
    api.getUserInfo(params).then((res) => {
      if(res.data.openId!=null){
        app.globalData.openId = res.data.openId
        wx.setStorageSync("openId",res.data.openId)
        console.log(app.globalData)
      }
      if(res.data.token!=null){
        wx.setStorageSync("token",res.data.token)
        if (wx.getStorageSync('jlqy')=='jlqy') {
          wx.removeStorageSync('jlqy')
          wx.reLaunch({
            url: '/packageHome/pages/interests/index',
          })
        } else {
          wx.switchTab({
            url: '/page/home/index',
          })
        }
      }else{
        wx.reLaunch({
          url: '/page/login/start/index',
        })
      }
      if(res.data.phone!=null){
        wx.setStorageSync('phone',res.data.phone)
      }
    })
    this.setData({
      disabled:true
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})