// eyesGema/pages/peopleCorrect/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cameraContext: {},
    stepData:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(app.globalData.eyeGamesStepIndex)
    this.setData({
      stepData: app.globalData.eyeGamesStepData[app.globalData.eyeGamesStepIndex]
    })
    console.log(app.globalData.eyeGamesStepData[app.globalData.eyeGamesStepIndex])
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async onReady() {

    // 获取摄像头上下文
    this.data.cameraContext = await wx.createCameraContext()
    console.log("this.data.cameraContext", this.data.cameraContext)
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },
  nextPage() {
    app.globalData.eyeGamesStepIndex += 1;
    // wx.redirectTo({
    //   url: '../calibration/index',
    // })
    wx.redirectTo({
      // url: '../tipPage/index',
      url: '../calibration/index',
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