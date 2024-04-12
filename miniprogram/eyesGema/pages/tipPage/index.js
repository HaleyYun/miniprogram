// eyesGema/pages/tipPage/index.js
let app = getApp()
Page({
  data: {
    stepData: {},
  },
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
        this.routView()
      })
    })
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  routView() {
    this.innerAudioContext.stop();
    app.globalData.eyeGamesStepIndex++
    wx.redirectTo({
      url: '../calibration/index',
    })
  },
  onUnload() {
    this.innerAudioContext.stop();
  },
})