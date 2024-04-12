const app = getApp()
const api = require('../../../../http/api')
Page({
  data: {
    ossHttpUrl: app.globalData.ossGamesImgUrl,
    bookOneSrc: app.globalData.ossGamesImgUrl + 'images/book1.png',
    bookTwoSrc: app.globalData.ossGamesImgUrl + 'images/book2.png',
    anmiationLeft: false,
    anmiationRight: false,
    isMany:false,//判断是否多个筛查
    isManyOver:false,//判断多个筛查是否全部做完
    showText: "这张照片还有印象吗？它是第一本相册里的，还是第二本相册里的如果你记得这张照片是在第一本相册里的，就点相册一。如果是在第二本相册里的，就点相册二",
    allPicArr: [...wx.getStorageSync('setPicRemberNoOne'), ...wx.getStorageSync('setPicRemberNoTwo')],
    countNum: {
      correctNum: 0,
      wrongNum: 0
    },
    showPicArr: {},
    show: true,
    showBtn: true,
    disabled: true,
    timer: null,
    playUrl: null,
    isModel: false,
    checkService:''
  },
  onLoad(options) {
    let that = this
    wx.setStorageSync('thirdStartTime', Date.now())
    console.log(wx.getStorageSync('thirdStartTime') + '2个相册记忆开始时间')
    // let allPicArr = that.data.allPicArr
    // allPicArr = [...wx.getStorageSync('setPicRemberNoOne'), ...wx.getStorageSync('setPicRemberNoTwo')]
    // let showPicArr = that.data.showPicArr
    // showPicArr = allPicArr[0]
    that.setData({
      showPicArr: that.data.allPicArr[0],
    })
    let allPicArr = that.data.allPicArr;
    allPicArr.splice(0, 1)
    console.log(allPicArr)
    that.setData({
      allPicArr: allPicArr
    })
    that.shuffle(that.data.allPicArr)
    that.data.playUrl = wx.createInnerAudioContext();
    that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/Test4/tts-BrainCA-LITE-Test4-0001.mp3"
    that.data.playUrl.play()
    that.data.timer = setTimeout(function () {
      that.setData({
        disabled: false
      })
    }, 19000)
  },
  shuffle(arr) { // 洗牌算法，打乱数组最佳方式
    let allPicArr = this.data.allPicArr;
    let i = allPicArr.length;
    while (i) {
      let j = Math.floor(Math.random() * i--);
      [allPicArr[j], allPicArr[i]] = [allPicArr[i], allPicArr[j]];
    }
    this.setData({
      allPicArr: allPicArr
    })
  },
  openBook(data) {
    let that = this
    let e = data.currentTarget.dataset.check
    that.data.playUrl.src = app.globalData.ossGamesImgUrl + "audio/soundfx/photo_swipe.mp3"
    that.data.playUrl.play()
    if (e == 1) {
      that.setData({
        anmiationLeft: true,
        anmiationRight: false,
        bookOneSrc: app.globalData.ossGamesImgUrl + 'images/open1.png'
      })
      that.data.timer = setTimeout(function () {
        that.setData({
          anmiationLeft: false,
          bookOneSrc: app.globalData.ossGamesImgUrl + 'images/book1.png'
        })
      }, 500)
    }
    if (e == 2) {
      that.setData({
        anmiationLeft: false,
        anmiationRight: true,
        bookTwoSrc: app.globalData.ossGamesImgUrl + 'images/open2.png',
      })
      that.data.timer = setTimeout(function () {
        that.setData({
          anmiationRight: false,
          bookTwoSrc: app.globalData.ossGamesImgUrl + 'images/book2.png'
        })
      }, 500)
    }
    if (that.data.showPicArr.type) {
      if (e == that.data.showPicArr.type) {
        let correctNum = that.data.countNum.correctNum
        correctNum++
        that.setData({
          'countNum.correctNum': correctNum
        })
      } else {
        let wrongNum = that.data.countNum.wrongNum
        wrongNum++
        that.setData({
          'countNum.wrongNum': wrongNum
        })
      }
    }
    wx.setStorageSync('questionTwoRight', that.data.countNum)
    if (that.data.allPicArr.length == 0) {
      that.setData({
        showPicArr: {},
        showBtn: false,
        showText: "太棒了！你完成了所有的测试，快来看看你的结果报告吧。"
      })
      that.data.playUrl.src = app.globalData.ossGamesImgUrl + 'audio/Test4/tts-BrainCA-LITE-Test4-0005.mp3';
      that.data.playUrl.play()
      that.getResult()
    }
    that.chooseOnePic()
    wx.setStorageSync('thirdEndTime', Date.now()) //当前时间戳
    console.log(wx.getStorageSync('thirdEndTime') + '2个相册记忆结束时间')
  },
  getResult() {
    let strCode = wx.getStorageSync('strCode')
    let ticketsEquityCode = '';
    let ticketsServiceCode = '';
    if (strCode == 'ServiceCode') {
      ticketsEquityCode = '';
      ticketsServiceCode = wx.getStorageSync('ticketsServiceCode')
    } else {
      ticketsEquityCode = wx.getStorageSync('ticketsEquityCode')
      ticketsServiceCode = '';
    }
    let data = {
      imageRecognitionNum: wx.getStorageSync('trueClickCountOneRP') + wx.getStorageSync('trueClickCountTwoRP'), //第一本相册识别正确数量
      imageRecognitionDuration: parseInt((wx.getStorageSync('oneEndTime') - wx.getStorageSync('oneStartTime')) / 1000), //第一本相册识别 时长 单位秒
      immediateMemoryNum: wx.getStorageSync('rememberPicOneErrNumber') + wx.getStorageSync('rememberPicTwoErrNumber'), //第二本相册识别正确数量
      immediateMemoryDuration: parseInt((wx.getStorageSync('twoEndTime') - wx.getStorageSync('twoStartTime')) / 1000), //第二本相册识别 时长 单位秒
      digitalClick2Duration: parseInt(JSON.parse(wx.getStorageSync('clickGameVal2')).getTime / 1000), //数字点击2时长
      digitalClick3Duration: parseInt(JSON.parse(wx.getStorageSync('clickGameVal3')).getTime / 1000), //数字点击3时长
      photoMemoriesNum: wx.getStorageSync('questionOneRight').correctNum, //24张回忆数量
      photoMemoriesDuration: parseInt((wx.getStorageSync('secoundEndTime') - wx.getStorageSync('secoundStartTime')) / 1000), //24张回忆时长
      photoClassificationNum: wx.getStorageSync('questionTwoRight').correctNum, //2本相册数量
      photoClassificationDuration: parseInt((wx.getStorageSync('thirdEndTime') - wx.getStorageSync('thirdStartTime')) / 1000),
      ticketsEquityCode: ticketsEquityCode,
      ticketsServiceCode: ticketsServiceCode,
      estimateNum: app.globalData.estimateNum
    }

    console.log(data)
    api.submitInfo(data).then(res => {
      console.log(res);
      if (res.code === 200) {
      
        let that = this
        that.setData({
          checkService:app.globalData.checkService.item
        })
        console.log(that.data.checkService,'that.data.checkService');
        that.getCodeStatus()
        that.data.timer = setTimeout(function () {
          if (app.globalData.gamesDatas.estimateOrderType === 1) {
            // 判断是营销活动estimateOrderType=1
            that.setOrder()
          } else {
            if(that.data.isMany && that.data.isManyOver){
              that.setData({
                isModel: true
              })
            
            }else if(!that.data.isMany && that.data.isManyOver){
              
              wx.redirectTo({
                url: '/packageHome/pages/interests/index?back=0',
              })
            }else{
              wx.redirectTo({
                url: '/packageHome/pages/equityList/index?code=' + (ticketsEquityCode || ticketsServiceCode) + '&back=1',
              })
            }
          }
        }, 5000)
      }
    });
  },
  setOrder() {
    console.log(app.globalData.gamesDatas)
    let parmas = {
      clientResource: 1,
      activityId: 88,
      activityChannel: app.globalData.marketParams.activityChannel,
      activityMarketingId: app.globalData.gamesDatas.activityMarketingId,
      estimateNum: app.globalData.estimateNum,
      price: app.globalData.gamesDatas.price,
      describe: app.globalData.gamesDatas.describe,
      money: app.globalData.gamesDatas.price,
      openId: app.globalData.openId ? app.globalData.openId : wx.getStorageSync('openId'),
      payWay: 2,
      purchaserPhone: app.globalData.gamesDatas.customPhone,
      servName: app.globalData.gamesDatas.servName,
      serviceProductId: app.globalData.gamesDatas.serviceProductId,
      totalFee: app.globalData.gamesDatas.price,
      purchaser: app.globalData.gamesDatas.customName,
      step: 1,
    }
    api.ServiceOrder(parmas).then(res => {
      if (res.code === 200) {
        wx.redirectTo({
          url: '/packageHome/pages/reportOrders/index?outTradeNo=' + res.data.outTradeNo,
        })
      } else {
        wx.showToast({
          icon: 'error',
          title: res.msg,
        })
      }
    })
  },
  //判断是否为多量表
  getCodeStatus() {
    let strCode = wx.getStorageSync('strCode')
    let ticketsEquityCode = '';
    let ticketsServiceCode = '';
    if (strCode == 'ServiceCode') {
      ticketsEquityCode = '';
      ticketsServiceCode = wx.getStorageSync('ticketsServiceCode')
    } else {
      ticketsEquityCode = wx.getStorageSync('ticketsEquityCode')
      ticketsServiceCode = '';
    }
    console.log(app.globalData.gamesDatas)
    let parmas = {
      ticketCode: ticketsEquityCode || ticketsServiceCode,
    }
    api.queryIsMany(parmas).then(res => {
      if (res.code === 200) {
        console.log(res.data,'res.data');
        this.setData({
          isMany: res.data.many,
          isManyOver:res.data.over
        })
      } else {
        wx.showToast({
          icon: 'error',
          title: res.msg,
        })
      }
    })
  },
  chooseOnePic() {
    let getNeedPic = this.data.allPicArr.splice(0, 1)
    this.setData({
      showPicArr: getNeedPic[0]
    })
  },
  nextPage(e) {
    if (e.target.dataset.type == 1) {
      wx.switchTab({
        url: '/page/home/index',
      })
    } else {
      wx.redirectTo({
        url: '/packageHome/pages/newReport/index',
      })
    }
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