const app = getApp()
const api = require('../../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ossImg:app.globalData.ossImgUrl,
    outTradeNo:'',
    payType:'serve',

  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      outTradeNo:options.outTradeNo,
      payType:options.type
    })
    this.geTorderDetail()
  },
  //获取详细信息
  geTorderDetail(){
    if(this.data.payType=='appointmen'){
      api.orderDetail({code:this.data.outTradeNo}).then(res=>{
        console.log(res);
        this.setData({
          order:res.data
        })
      })
    }else if(this.data.payType=='serve'){
      api.packageDetail({code:this.data.outTradeNo}).then(res=>{
        console.log(res);
        this.setData({
          order:res.data
        })
      })
    }
    
  },
  //跳到首页
  home(){
    wx.switchTab({
      url: '/page/home/index',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  //电话咨询
  call(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
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