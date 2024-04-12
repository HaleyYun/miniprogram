const app = getApp()
const api = require('../../../../http/api')
const util = require('../../../../util/util')
Page({
  data: {
    ossHttpUrl: app.globalData.ossGamesImgUrl,
    count: 5,
    text: '现在来试试看吧！',
    show: true,
    doctorShow: true,
    videoShow: true,
    numberClickErr10: 0,
    numberClickErr20: 0,
    initNumber: 0, // 初始化点击事件数字
    useNumberArr: [],
    getGameCount: 0, // 游戏轮数
    setHideIndex: [], // 设置隐藏元素索引
    getIntoTime: null, // 获取当前开始游戏时间 
    getEndGameTime: null, // 获取游戏结束时间
    errorNumberClickCount2: 0, // 第2轮点击错误的题目数量
    timer: null,
    preVideo: null,
    playUrl: null
  },
  onLoad(options) {
    var that = this
    that.data.timer = setTimeout(function () {
      that.data.preVideo = wx.createVideoContext('videoNumber')
      that.data.preVideo.stop(
        that.setData({
          videoShow: false
        }), that.data.playUrl = wx.createInnerAudioContext({
          useWebAudioImplement: true
        }),
        that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/Test2/tts-BrainCA-LITE-Test2-0003.mp3",
        that.data.playUrl.play()
      )
    }, 14000)
  },
  ready(e) {
    /**
     * 三轮游戏说明
     * 缓存 gameCount 为三轮游戏数
     * 第三轮结束后将恢复游戏轮数为1
     */
    let getStorage = e
    if (getStorage === 1) { // 没有的话即是第一轮
      var numberArr = Array.from(new Array(5).keys());
      var useNumberArr = numberArr.concat(Array(40 - numberArr.length).fill('')) // 生成45个空字符串
      this.setData({
        getGameCount: 1,
        useNumberArr: useNumberArr
      })
      this.shuffle(useNumberArr)
    }
    if (getStorage === 2) { // 第2轮游戏
      var numberArr = Array.from(new Array(10).keys());
      var useNumberArr = numberArr.concat(Array(40 - numberArr.length).fill('')) // 生成40个空字符串
      this.setData({
        getGameCount: 2,
        useNumberArr: useNumberArr
      })
      this.shuffle(useNumberArr)
    }
    if (getStorage === 3) { // 第3轮游戏
      var numberArr = Array.from(new Array(20).keys());
      var useNumberArr = numberArr.concat(Array(40 - numberArr.length).fill('')) // 生成40个空字符串
      this.setData({
        getGameCount: 3,
        useNumberArr: useNumberArr
      })
      this.shuffle(this.data.useNumberArr)
    }
    this.setData({
      getIntoTime: new Date()
    })
  },
  shuffle(arr) {
    let arrList = this.data.useNumberArr;
    let i = arrList.length;
    while (i) {
      let j = Math.floor(Math.random() * i--);
      [arrList[j], arrList[i]] = [arrList[i], arrList[j]];
    }
    this.setData({
      useNumberArr: arrList
    })
  },
  countClick() {
    this.data.playUrl.stop()
    this.setData({
      show: false
    })
    if (this.data.count === 5) {
      this.ready(1)
      this.setData({
        text: '很好！你已经清楚这个测试的规则了，那我们就正式开始了',
        doctorShow: false
      })
    }
    if (this.data.count === 10) {
      this.ready(2)
      this.setData({
        text: '再试试一个更难的',
        doctorShow: false,
      })
    }
    if (this.data.count === 20) {
      this.ready(3)
      this.setData({
        doctorShow: false,
      })
    }
  },
  clickNumberBtn: util.throttle(function (e) {
    var that = this
    that.data.playUrl = wx.createInnerAudioContext({
      useWebAudioImplement: true
    })
    that.data.playUrl.stop()
    let getVal = e.currentTarget.dataset.item + 1
    let initNumber = that.data.initNumber
    initNumber += 1
    that.setData({
      initNumber: initNumber
    })
    that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/soundfx/pop.mp3"
    that.data.playUrl.play()
    // state.initNumber += 1 // 每次点击递增1
    // state.clickAudioUrl = require('../../static/audio/soundfx/pop.mp3')
    // state.audioElement = document.getElementById("clickAudio")
    // state.audioElement.load(); //加载音频
    // state.audioElement.play(); // 播放音频
    if (that.data.initNumber !== getVal) { // 处理点击错误情况
      let initNumber = that.data.initNumber
      initNumber -= 1
      that.setData({
        initNumber: initNumber,
        clickAudioUrl: '',
      })
      that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/soundfx/pop.mp3"
      that.data.playUrl.play()
      // state.initNumber -= 1 // 点击错误恢复上一级数字 errorNumberClickCount2
      // state.clickAudioUrl = ''
      // state.audioElement = document.getElementById("clickAudio")
      // state.audioElement.load(); //加载音频
      // state.audioElement.play(); // 播放音频
      if (that.data.getGameCount === 2) {
        // state.numberClickErr10++
        let numberClickErr10 = that.data.numberClickErr10
        numberClickErr10++
        that.setData({
          numberClickErr10: numberClickErr10
        })
      }
      if (that.data.getGameCount === 3) {
        // state.numberClickErr20++
        let numberClickErr20 = that.data.numberClickErr20
        numberClickErr20++
        that.setData({
          numberClickErr20: numberClickErr20
        })
      }
      return
    }
    that.data.useNumberArr.forEach((val, index) => {
      if (val === getVal - 1) {
        // state.useNumberArr[index] = ''
        var list = that.data.useNumberArr
        list[index] = ''
        that.setData({
          useNumberArr: list
        })
      }
    })
    if (that.data.getGameCount === 1) { // 第一轮游戏判断
      if (that.data.initNumber === 5) {
        that.data.getEndGameTime = new Date()
        let obj = {}
        let getTime = that.data.getEndGameTime - that.data.getIntoTime
        obj.getTime = getTime
        obj.gameCount = 1
        // that.data.initNumber = 0
        that.setData({
          initNumber: 0
        })
        that.data.timer = setTimeout(function () {
          // that.data.show = true
          // that.data.doctorShow = true
          // that.data.count = 10
          that.setData({
            show: true,
            doctorShow: true,
            count: 10
          })
          that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/Test2/tts-BrainCA-LITE-Test2-0004.mp3"
          that.data.playUrl.play()
        }, 1000)
      }
    }
    if (that.data.getGameCount === 2) { // 第2轮轮游成判断
      if (that.data.initNumber === 10) {
        // state.getEndGameTime = new Date()
        that.setData({
          getEndGameTime: new Date()
        })
        let obj = {}
        let getTime = that.data.getEndGameTime - that.data.getIntoTime
        obj.getTime = getTime
        obj.gameCount = 2
        console.log(obj, '第2轮')
        wx.setStorageSync('clickGameVal2', JSON.stringify(obj))
        that.setData({
          initNumber: 0
        })
        that.data.timer = setTimeout(function () {
          that.setData({
            show: true,
            doctorShow: true,
            count: 20
          })
          that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/Test2/tts-BrainCA-LITE-Test2-0005.mp3"
          that.data.playUrl.play()
        }, 1000)
      }
    }
    if (that.data.getGameCount === 3) { // 第3轮轮游戏判断
      if (that.data.initNumber === 20) {
        that.setData({
          getEndGameTime: new Date()
        })
        let obj = {}
        let getTime = that.data.getEndGameTime - that.data.getIntoTime
        obj.getTime = getTime
        obj.gameCount = 3
        console.log(obj, '第3轮')
        wx.setStorageSync('clickGameVal3', JSON.stringify(obj))
        that.data.timer = setTimeout(function () {
          that.setData({
            doctorShow: true,
            text: '真棒！下面我们将再次回忆照片了，请准备好'
          })
          that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/Test2/tts-BrainCA-LITE-Test2-0006.mp3"
          that.data.playUrl.play()
        }, 1000)
        that.toNext()
      }
    }
  }, 400),
  toNext() {
    var that = this
    that.data.timer = setTimeout(() => {
      wx.redirectTo({
        url: '/packageHome/pages/gameSku/stepThree/index',
      })
    }, 8000)
  },
  onShow() {
    console.log('show')
    this.data.playUrl = wx.createInnerAudioContext({
      useWebAudioImplement: true
    })
  },
  onHide() {
    let that = this
    clearTimeout(that.data.timer)
    that.data.timer = setTimeout(function () {
      that.data.preVideo = wx.createVideoContext('videoNumber')
      that.data.preVideo.stop(
        that.setData({
          videoShow: false
        })
      )
    }, 14000)
    that.data.playUrl = wx.createInnerAudioContext({
      useWebAudioImplement: true
    })
  },
  onUnload() {
    clearTimeout(this.data.timer)
    this.data.playUrl.destroy()
  },
})