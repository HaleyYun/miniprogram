// eyesGema/pages/albumOne/index.js
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    countdownNum: 3,
    countdownStatus: false,
    stepData: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      stepData: app.globalData.eyeGamesStepData[app.globalData.eyeGamesStepIndex]
    }, () => {
      this.innerAudioContext = wx.createInnerAudioContext({
        useWebAudioImplement: false
      });
      this.innerAudioContext.src = this.data.stepData.steps[0].elements[1].content;
      this.innerAudioContext.loop = false;
      this.innerAudioContext.play();
      this.innerAudioContext.onEnded(() => {
        this.countdown(3)
      })
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
  countdown(time) {
    this.setData({
      countdownNum: time,
      countdownStatus: true,
    })
    let timeKey = setInterval(() => {
      if (this.data.countdownNum === 1) {
        clearInterval(timeKey)
        app.globalData.eyeGamesStepIndex += 1;
        wx.redirectTo({
          url: '../albumContent/index?tip=1',
        })
      }
      this.setData({
        countdownNum: this.data.countdownNum -= 1
      })
    }, 1000)
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