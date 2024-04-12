const app = getApp()
Page({
  data: {
    ossHttpUrl: app.globalData.ossGamesImgUrl,
    isNextPicCheck: true,
    errClickImgArr: [], // 错误图片总数
    rightClickImgArr: [], // 点对图片总数
    picArr: [],
    trueImgIndex: null,
    isChooseTypeTure: false,
    currentIndex: null,
    clickCountIndex: 0, // 点击的次数
    havenPicArr: [], // 已经出现过的图片
    timer: null,
    playUrl: null
  },
  onLoad(options) {
    this.data.playUrl = wx.createInnerAudioContext();
    this.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/Test1/tts-BrainCA-LITE-Test1-0013.mp3"
    this.data.playUrl.play()
    this.filterNowType()
    this.playTime()
  },
  playTime() {
    let that = this
    let time = 7
    that.data.timer = setInterval(function () {
      time--
      if (time <= 0) {
        clearInterval(that.data.timer)
        that.data.playUrl.pause()
      }
    }, 1000)
  },
  chooseTureType(e) {
    let that = this
    let isClickTure = false
    let getClickIndex = e.currentTarget.dataset.index // 当前点击的类型的索引
    that.data.picArr.forEach((item, index) => {
      if (item.choose === 1) {
        that.setData({
          trueImgIndex: index
        })
      }
      if (getClickIndex === index && item.choose === 1) { // 点击正确时
        isClickTure = true
        var rightClickImgArr = that.data.rightClickImgArr
        rightClickImgArr.push(that.data.clickCountIndex)
        that.setData({
          rightClickImgArr: rightClickImgArr,
          clickCountIndex: that.data.clickCountIndex + 1,
          currentIndex: index,
          isChooseTypeTure: true
        })
        console.log(JSON.stringify(that.data.rightClickImgArr))
        that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/soundfx/button_Right.mp3"
        that.data.playUrl.play()
      } else if (getClickIndex === index && item.choose !== 1) { // 点击错误时
        that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/soundfx/button_Wrong.mp3"
        that.data.playUrl.play()
        var errClickImgArr = that.data.errClickImgArr
        errClickImgArr.push(that.data.clickCountIndex)
        isClickTure = false
        that.setData({
          isNextPicCheck: false,
          trueImgIndex: null,
          currentIndex: index,
          isChooseTypeTure: false,
          errClickImgArr: errClickImgArr
        })
        console.log(JSON.stringify(that.data.errClickImgArr))
      }
    })
    if (that.data.clickCountIndex >= 6 && that.data.isChooseTypeTure) {
      const newWrong = [...(new Set(that.data.errClickImgArr))]
      console.log(that.data.rightClickImgArr + '点击对类型')
      console.log(newWrong + '点击错误')
      for (var i = 0; i < that.data.rightClickImgArr.length; i++) {
        for (var j = 0; j < newWrong.length; j++) {
          if (that.data.rightClickImgArr[i] == newWrong[j]) {
            var clickImgArr = that.data.rightClickImgArr;
            clickImgArr.splice(i, 1);
            that.setData({
              rightClickImgArr: clickImgArr
            })
          }
        }
      }
      wx.setStorageSync('rememberPicTwoErrNumber', that.data.rightClickImgArr.length)
      console.log(wx.getStorageSync('rememberPicTwoErrNumber'))
      wx.redirectTo({
        url: '/packageHome/pages/gameSku/photoTwoThird/index',
      })
      return
    }
    clearTimeout(that.data.timer)
    that.data.timer = setTimeout(function () {
      if (isClickTure) {
        that.setData({
          isNextPicCheck: true
        })
        that.filterNowType()
      }
      that.setData({
        trueImgIndex: null,
        currentIndex: null,
        isChooseTypeTure: null,
      })
    }, 100)
  },
  filterNowType() {
    let getPci = wx.getStorageSync('setPicRemberNoTwo')
    if (this.data.clickCountIndex < 6) {
      this.setData({
        picArr: getPci[this.data.clickCountIndex].choose
      })
      this.data.picArr.forEach((item, index) => {
        if (item.choose === 1) {
          this.setData({
            trueImgIndex: index
          })
        }
      })
    }
    return
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