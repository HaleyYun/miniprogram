const app = getApp()
const api = require('../../../../http/api')
const playUrl = wx.createInnerAudioContext();
Page({
  data: {
    ossHttpUrl: app.globalData.ossGamesImgUrl,
    errClickImgArr: [], // 错误图片总数
    rightClickImgArr: [], // 点对图片总数
    isCheckedTure: false,
    showQuestion: '哪张是水果?', // 显示的问题文字
    isChooseTypeTure: false, // 当前点击的类型
    currentIndex: null, // 当前点击的索引
    picArr: [],
    questionArr: [{
        type: 'fruits',
        question: '哪张是水果?',
        audioSrc: app.globalData.ossGamesImgUrl + 'audio/Test1/tts-BrainCA-LITE-Test1-0007.mp3'
      },
      {
        type: 'vehicle',
        question: '哪张是交通工具?',
        audioSrc: app.globalData.ossGamesImgUrl + 'audio/Test1/tts-BrainCA-LITE-Test1-0010.mp3'
      },
      {
        type: 'kitchenware',
        question: '哪张是厨具?',
        audioSrc: app.globalData.ossGamesImgUrl + 'audio/Test1/tts-BrainCA-LITE-Test1-0008.mp3'
      },
      {
        type: 'vegetables',
        question: '哪张是蔬菜?',
        audioSrc: app.globalData.ossGamesImgUrl + 'audio/Test1/tts-BrainCA-LITE-Test1-0009.mp3'
      },
      {
        type: 'animal',
        question: '哪张是动物?',
        audioSrc: app.globalData.ossGamesImgUrl + 'audio/Test1/tts-BrainCA-LITE-Test1-0005.mp3'
      },
      {
        type: 'clothes',
        question: '哪张是衣服?',
        audioSrc: app.globalData.ossGamesImgUrl + 'audio/Test1/tts-BrainCA-LITE-Test1-0006.mp3'
      }
    ],
    timer: null,
    playUrl: null
  },
  onLoad(options) {
    let that = this
    var timestamp = new Date().getTime(); //当前时间戳
    wx.setStorageSync('oneStartTime', timestamp)
    console.log(timestamp + '第一本相册开始时间')
    that.data.timer = setTimeout(function () {
      that.data.playUrl = wx.createInnerAudioContext({
        useWebAudioImplement: true
      });
      that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/Test1/tts-BrainCA-LITE-Test1-0007.mp3"
      that.data.playUrl.play()
    }, 1000)
    this.getAllPicList()
  },
  // 获取相册照片接口
  getAllPicList() {
    api.getPhoto().then(res => {
      console.log("成功", res)
      if (res.code === 200) {
        this.setData({
          picArr: res.data.show[0]
        })
        wx.setStorageSync('setPicRemberNoOne', res.data.show[0])
        wx.setStorageSync('setPicRemberNoTwo', res.data.show[1])
        wx.setStorageSync('setPicRemberNoThree', res.data.all)
      }
    })
  },
  chooseTureType(e) {
    let that = this
    let getType = e.currentTarget.dataset.item.val // 获取点击类型
    let getIndex = e.currentTarget.dataset.index // 当前点击的类型的索引
    that.data.picArr.forEach((item, index) => { // 循环判断是否点击了当前元素
      if (index === getIndex) {
        if (that.data.questionArr.length > 0) {
          if (getType.split('_')[0] === that.data.questionArr[0].type) { // 判断是否为点击的正确图片
            clearTimeout(that.data.timer)
            that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/soundfx/button_Right.mp3"
            that.data.playUrl.play()
            var rightClickImgArr = that.data.rightClickImgArr
            rightClickImgArr.push(getType)
            that.setData({
              isCheckedTure: true,
              isChooseTypeTure: true,
              currentIndex: index,
              rightClickImgArr: rightClickImgArr
            })
          } else {
            clearTimeout(that.data.timer)
            that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/soundfx/button_Wrong.mp3";
            that.data.playUrl.play()
            var dataList = that.data.errClickImgArr
            dataList.push(that.data.questionArr[0].type)
            that.setData({
              isCheckedTure: false,
              currentIndex: index,
              isChooseTypeTure: false,
              errClickImgArr: dataList
            })
          }
        }
        clearTimeout(that.data.timer)
        that.data.timer = setTimeout(function () {
          if (that.data.isCheckedTure) {
            var questionArr = that.data.questionArr.filter((item, index) => index > 0)
            that.setData({
              questionArr: questionArr
            })
          }
          if (that.data.questionArr.length === 0) {
            const newArr = []
            that.data.rightClickImgArr.forEach(el => {
              newArr.push(el.split('_')[0])
            })
            const newWrong = [...(new Set(that.data.errClickImgArr))]
            console.log(JSON.stringify(newArr) + '点击对类型')
            console.log(JSON.stringify(newWrong) + '点击错误')
            for (var i = 0; i < newArr.length; i++) {
              for (var j = 0; j < newWrong.length; j++) {
                if (newArr[i] == newWrong[j]) {
                  newArr.splice(i, 1);
                }
              }
            }
            console.log(JSON.stringify(newArr))
            wx.setStorageSync('trueClickCountOneRP', newArr.length)
            wx.redirectTo({
              url: '/packageHome/pages/gameSku/photoOneSecond/index',
            })
          } else {
            that.data.playUrl.src = that.data.questionArr[0].audioSrc
            that.data.playUrl.play()
            that.setData({
              showQuestion: that.data.questionArr[0].question
            })
          }
          that.setData({
            currentIndex: null
          })
        }, 100)
      }
    })
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