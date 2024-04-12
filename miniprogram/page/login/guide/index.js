const app = getApp()
const api = require('../../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  ossImg:app.globalData.ossImgUrl,
    list: [
      {imgUrl:app.globalData.ossImgUrl +'guide1.png',title:'AI技术',text:'赋能脑健康评估与干预，全面的脑健康守护',bgUrl:app.globalData.ossImgUrl +'bg1.png'},
      {imgUrl:app.globalData.ossImgUrl +'guide2.png',title:'脑健康评估',text:'权威准确快速自查，脑健康管理更科学',bgUrl:app.globalData.ossImgUrl +'bg2.png'},
      {imgUrl:app.globalData.ossImgUrl +'guide3.png',title:'数字化干预',text:'脑建康风险趋势分析，全周期数字化干预管理',bgUrl:app.globalData.ossImgUrl +'bg3.png'},
      {}
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    let token = wx.getStorageSync('token') ? wx.getStorageSync('token') : ''
    if(token!=''){
      if (wx.getStorageSync('jlqy')=='jlqy') {
        wx.removeStorageSync('jlqy')
        wx.reLaunch({
          url: '/packageHome/pages/interests/index',
        })
      } else {
        // wx.switchTab({
        //   url: '/page/home/index',
        // })
      }
    }else{
      this.change()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    wx.hideHomeButton();
  },
  change(e){
    if(e.detail.current===3){
      if (wx.getStorageSync('jlqy')==='jlqy') {
        wx.removeStorageSync('jlqy')
        wx.reLaunch({
          url: '/packageHome/pages/interests/index',
        })
      } else {
        wx.switchTab({
          url: '/page/home/index',
        })
      }
    }
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