const app = getApp()
Page({
  data: {
    ossHttpUrl: app.globalData.ossGamesImgUrl,
    anmiationLeft: false,
    anmiationRight: false,
    yespulse: '',
    nopulse: '',
    text: '还记得刚才我们在相册里认识过的照片吗？它们现在又和其他照片混在一起了。这次我们一张一张来看如果这张照片，你在刚才的两本相册里有看到过，就点“是”；如果没有，就点“否” ',
    allPicArr: [...wx.getStorageSync('setPicRemberNoThree')],
    nowShowPicSort: 0,
    correctNum: 0,
    wrongNum: 0,
    countNum: {
      correctNum: 0,
      wrongNum: 0
    },
    showPicArr: {},
    show: true,
    showBtn: true,
    disabled: true,
    timer: null,
    playUrl: null
  },
  onLoad(options) {
    let that = this
    wx.setStorageSync('secoundStartTime', Date.now())
    console.log(wx.getStorageSync('secoundStartTime') + '24张图片记忆开始时间')
    let setPicRemberNoThree = wx.getStorageSync('setPicRemberNoThree')
    // this.setData({
    //   allPicArr: [...setPicRemberNoThree],
    // }, () => {
    //   let showPicArr = this.data.showPicArr
    //   showPicArr = this.data.allPicArr[this.data.nowShowPicSort]
    //   this.setData({
    //     showPicArr: showPicArr
    //   })
    // })
    that.setData({
      showPicArr: that.data.allPicArr[that.data.nowShowPicSort]
    })
    that.data.playUrl = wx.createInnerAudioContext();
    that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/Test3/tts-BrainCA-LITE-Test3-0001.mp3"
    that.data.playUrl.play()
    that.data.timer = setTimeout(function () {
      that.setData({
        disabled: false
      })
    }, 19000)
  },
  checkBtn(data) {
    let that = this
    this.data.playUrl.stop()
    this.setData({
      disabled: false
    })
    let e = data.currentTarget.dataset.check
    let nowShowPicSort = that.data.nowShowPicSort
    nowShowPicSort++
    that.setData({
      nowShowPicSort: nowShowPicSort
    })
    that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/soundfx/photo_swipe.mp3"
    that.data.playUrl.play()
    if (e == 'yes') {
      that.setData({
        anmiationLeft: true,
        anmiationRight: false,
        yespulse: 'pulse'
      })
      if (that.data.showPicArr.choose === 1) {
        let correctNum = that.data.countNum.correctNum
        correctNum++
        that.setData({
          'countNum.correctNum': correctNum
        })
        console.log(that.data.countNum)
      } else {
        let wrongNum = that.data.countNum.wrongNum
        wrongNum++
        that.setData({
          'countNum.wrongNum': wrongNum
        })
      }
      that.setData({
        showPicArr: that.data.allPicArr[that.data.nowShowPicSort]
      })
      that.data.timer = setTimeout(function () {
        that.setData({
          anmiationLeft: false,
          yespulse: ""
        })
      }, 500)
    }
    if (e == 'no') {
      that.setData({
        anmiationLeft: false,
        anmiationRight: true,
        nopulse: 'pulse'
      })
      if (that.data.showPicArr.choose === 0) {
        let wrongNum = that.data.countNum.correctNum
        wrongNum++
        that.setData({
          'countNum.correctNum': wrongNum
        })
        console.log(that.data.countNum)
      } else {
        let wrongNum = that.data.countNum.wrongNum
        wrongNum++
        that.setData({
          'countNum.wrongNum': wrongNum
        })
        console.log(that.data.countNum)
      }
      that.data.timer = setTimeout(function () {
        that.setData({
          anmiationRight: false,
          nopulse: ""
        })
      }, 500)
      that.setData({
        showPicArr: that.data.allPicArr[that.data.nowShowPicSort]
      })
    }
    console.log(that.data.countNum)
    if (that.data.nowShowPicSort >= 24) {
    wx.setStorageSync('questionOneRight', that.data.countNum)
    console.log(that.data.countNum)
      that.setData({
        showPicArr: {},
        showBtn: false,
        text: '恭喜您又完成一个测试，就剩最后一个小测试了，准备好了吗？'
      })
      that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/Test3/tts-BrainCA-LITE-Test3-0006.mp3"
      that.data.playUrl.play()
      wx.setStorageSync('secoundEndTime', Date.now())
      console.log(wx.getStorageSync('secoundEndTime') + '24张图片记忆开始时间')
      that.toNext()
    }
  },
  toNext() {
    let that = this
    that.data.timer = setTimeout(() => {
      wx.redirectTo({
        url: '/packageHome/pages/gameSku/stepFour/index',
      })
    }, 8000)
  },
  touch() {
    // this.setData({
    //   show: false
    // })
    // this.butClick()
  },
  butClick() {
    // this.data.playUrl.stop()
    // this.setData({
    //   disabled: false
    // })
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