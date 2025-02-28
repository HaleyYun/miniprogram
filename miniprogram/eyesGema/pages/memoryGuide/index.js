// eyesGema/pages/albumEnd/index.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepData:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      stepData: app.globalData.eyeGamesStepData[app.globalData.eyeGamesStepIndex]
    },()=>{
      this.innerAudioContext = wx.createInnerAudioContext({
        useWebAudioImplement: false
      });
      this.innerAudioContext.src = this.data.stepData.steps[0].elements[1].content;
      this.innerAudioContext.loop = false;
      this.innerAudioContext.play();
    })
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
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
  nextPage() {
    app.globalData.eyeGamesStepIndex++
    this.innerAudioContext.stop()
    wx.redirectTo({
      url: '../albumMemory/index',
    })
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
    this.innerAudioContext.stop();
    this.innerAudioContext.destroy();
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