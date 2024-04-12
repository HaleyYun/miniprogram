let app = getApp()
Page({
  data: {
    stepData: {},
  },
  onLoad(options) {
    console.log(app.globalData.eyeGamesStepData[1])
    this.setData({
      stepData: app.globalData.eyeGamesStepData[1]
    }, () => {
      this.innerAudioContext = wx.createInnerAudioContext({
        useWebAudioImplement: false
      });
      this.innerAudioContext.src = this.data.stepData.steps[0].elements[0].content;
      this.innerAudioContext.loop = false;
      this.innerAudioContext.play();
      this.innerAudioContext.onEnded(() => {
        // this.routView()
      })
    })
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  goIndex() {
    // wx.redirectTo({
    //   url: '../index/index',
    // })
    app.globalData.eyeGamesStepIndex += 2;
    wx.redirectTo({
      url: '../peopleCorrect/index',
    })
  },
  onUnload() {
    this.innerAudioContext.stop();
  },
})