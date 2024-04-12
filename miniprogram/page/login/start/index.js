// page/login/start/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      //路由入参
      pageUrl: '',
      latitude: '',
      longitude: '',
      url: '',
      type: '',
      str: '',
      id: '',
      prodCode:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      pageUrl: options?.pageUrl,
      latitude: options?.latitude,
      longitude: options?.longitude,
      url: options?.url,
      type: options?.type,
      str: options?.str,
      id: options?.id,
      prodCode: options?.prodCode
    })
  },
  login(){
    wx.redirectTo({
      url: "/page/login/phone/index?pageUrl=" + this.data.pageUrl+ "&latitude=" + this.data.latitude+ "&longitude=" + this.data.longitude+ "&url=" + this.data.url+ "&type=" + this.data.type+ "&str=" + this.data.str+ "&id=" + this.data.id+ "&prodCode=" + this.data.prodCode
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