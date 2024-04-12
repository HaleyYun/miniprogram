const app = getApp()
Page({
  data: {
    ossHttpUrl: app.globalData.ossGamesImgUrl,
    timer: null,
    playUrl: null
  },
  onLoad(options) {
    this.data.playUrl = wx.createInnerAudioContext();
    this.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/Test1/tts-BrainCA-LITE-Test1-0018.mp3"
    this.data.playUrl.play()
    this.timerFun()
  },
  timerFun() {
    var that = this
    that.data.timer = setTimeout(function () {
      wx.redirectTo({
        url: '/packageHome/pages/gameSku/photoTwoFirst/index',
      })
    }, 3000)
  },
  onHide() {
    this.data.playUrl.destroy()
    clearTimeout(this.data.timer)
  },
  onUnload() {
    this.data.playUrl.destroy()
    clearTimeout(this.data.timer)
  },
})