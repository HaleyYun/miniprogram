// eyesGema/pages/taskBeforeGuide/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepData: {},
    countdown: 3,
    countdownStatus: false,
    stepState: false,
    clickState: true,
    timeKey: null
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
        this.countdown(3)
        this.setData({
          stepState: true
        })
      })
    })
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  countdown(time) {
    this.setData({
      countdown: time,
      countdownStatus: true
    })
    this.innerAudioContext.stop();
    this.data.timeKey = setInterval(() => {
      if (this.data.countdown === 1) {
        clearInterval(this.data.timeKey)
        app.globalData.eyeGamesStepIndex++
        this.setData({
          clickState: false
        })
        wx.redirectTo({
          url: '../eyesGame/index',
        })
        return false
      }
      this.setData({
        countdown: this.data.countdown -= 1
      })
    }, 1000)
  },
  backPage() {
    clearInterval(this.data.timeKey)
    if (this.data.clickState) {
      app.globalData.eyeGamesStepIndex -= 1
      wx.redirectTo({
        url: '../videoGuide/index',
      })
    } else {
      return false
    }
  },
  onUnload() {
    this.innerAudioContext.stop();
  },
})