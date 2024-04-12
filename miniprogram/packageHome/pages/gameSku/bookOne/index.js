const app = getApp()
Page({
  data: {
    ossHttpUrl: app.globalData.ossGamesImgUrl,
    timer: null,
    playUrl: null
  },
  onLoad(options) {
    this.data.playUrl = wx.createInnerAudioContext();
    this.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/Test1/tts-BrainCA-LITE-Test1-0003.mp3"
    this.data.playUrl.play()
    this.timerFun()
  },
  timerFun() {
    var that = this
    that.data.timer = setTimeout(function () {
      wx.redirectTo({
        url: '/packageHome/pages/gameSku/photoOneFirst/index',
      })
    }, 12000)
  },
  onHide() {
    clearTimeout(this.data.timer)
    this.data.playUrl.destroy()
  },
  onUnload() {
    clearTimeout(this.data.timer)
    this.data.playUrl.destroy()
  },
})