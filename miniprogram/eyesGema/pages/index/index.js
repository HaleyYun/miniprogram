// eyesGema/index.js
import {
  rpxToPx,
  pxToRpx
} from "../../../util/px-rpx"
import {
  getEstimateNum,
  getEstimateProcess
} from "../../../http/api"
import {
  checkPermisson
} from "../../../util/getSetting"
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepData: {
      steps: []
    },
    imageRandom:0,//
    ossImg: app.globalData.ossImgUrl,
    videoCount: 0,
    // tipBoxShow: false,
    preloadList: [
      "https://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-app-test/img/eyesgema/i_bg.png",
      "https://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-app-test/img/eyesgema/flow-path-bj.png",
      "https://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-app-test/img/eyesgema/albumOne-bj.png",
      "https://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-app-test/img/eyesgema/albumtwo-bj.png",
      "https://neuroweave.oss-cn-hangzhou.aliyuncs.com/zskj-app-test/img/eyesgema/check-bj.png",
    ],
    preloadCount: 0,
    schedule: 0,
    errShow: false,
    reloadShow: false,
    reloadSwitch: true,
    isShowPlaybtn: true,
    isPlay: false,
    imgGif: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(app.globalData.eyeGamesData, 'eyeGamesData')
    checkPermisson('scope.camera').then(res => {
      this.getTemplate()
    }).catch(res => {
      wx.navigateBack()
    })
    checkPermisson('scope.record')
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.videoContext = wx.createVideoContext('myVideo', this);
    this.setData({
      isShowPlaybtn: false,
      imgGif: this.data.ossImg + 'audio-gif.gif'
    })
    this.videoContext.pause()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if (this.videoContext) {
      this.videoContext.seek(0)
      this.videoContext.play()
      this.setData({
        imgGif: this.data.ossImg + 'audio-gif.gif',
        isShowPlaybtn: false,
        isPlay: false
      })
    }
    // this.setData({
    //   isShowPlaybtn: false,
    //   imgGif: this.data.ossImg + 'audio-gif.gif'
    // })
  },

  handlePreload() {
    setTimeout(() => {
      if (this.data.reloadSwitch) {
        this.data.reloadSwitch = false;
        console.log("111111")
        this.setData({
          errShow: true
        })
      }
    }, 10000)
    let imgList = [];
    let videoList = [];
    for (let i = 0; i < this.data.preloadList.length; i++) {
      let type = this.data.preloadList[i].split(".").pop()
      switch (type) {
        case "png":
          imgList.push(this.data.preloadList[i]);
          break;
        case "mp4":
          videoList.push(this.data.preloadList[i]);
          break;
        case "mp3":

          break;
        default:
          break;
      }
    }
    console.log(imgList)
    this.imagePreload(imgList)
    // this.videoPreload(videoList)
    this.setData({
      preloadList: [...imgList]
      // preloadList: [...imgList, ...videoList]
    })
  },
  imagePreload(items) {
    for (let i = 0; i < items.length; i++) {
      wx.getImageInfo({
        src: items[i],
        success: () => {
          this.setData({
            preloadCount: this.data.preloadCount += 1,
            schedule: parseInt(this.data.preloadCount / this.data.preloadList.length * 100)
          }, () => {
            if (this.data.reloadSwitch) {
              if (this.data.preloadList.length === this.data.preloadCount) {
                this.data.reloadSwitch = false;
                this.videoContext.play()
              }
            }
          })
        },
        fail: (err) => {
          console.log(err)
          console.log("22222")
          this.setData({
            errShow: true
          })
        }
      })
    }
  },
  // videoPreload(items) {
  //   for (let i = 0; i < items.length; i++) {
  //     wx.getVideoInfo({
  //       src: items[i],
  //       success: (res) => {
  //         console(res)
  //         this.setData({
  //           preloadCount: this.data.preloadCount++
  //         })
  //       }
  //     })
  //   }
  // },
  videoEnded() {
    this.data.videoCount++
    this.setData({
      isPlay: true,
      imgGif: this.data.ossImg + 'audio-img.png'
    })
  },
  getTemplate() {
    getEstimateProcess({
      serviceCode: app.globalData.eyeGamesData.checkSerivce || app.globalData.eyeGamesData.checkService || app.globalData.eyeGamesData.estimateServeCode,
      phoneWidth: pxToRpx(wx.getSystemInfoSync().screenWidth),
      phoneHigh: pxToRpx(wx.getSystemInfoSync().screenHeight),
    }).then(res => {
      if (res.code === 200) {
        console.log(res)
        app.globalData.eyeGamesStepIndex = 0;
        app.globalData.eyeGamesStepData = res.data.template;
        this.data.preloadList = [...this.data.preloadList, ...res.data.files];
        this.handlePreload()
        this.setData({
          stepData: app.globalData.eyeGamesStepData[app.globalData.eyeGamesStepIndex],
          imageRandom:res.data.imageRandom
        }, () => {
          console.log(this.data.stepData)
        })
      }
    })
  },
  changeAnew() {
    wx.redirectTo({
      url: '../../../eyesGema/pages/index/index',
    })
    this.setData({
      errShow: false,
    }) 
  },
  changeErrShow() {
    wx.navigateBack()
    console.log("333333")
    this.setData({
      errShow: false,
    })
  },
  reload() {
    this.handlePreload()
  },
  nextPage(e) {
    // if (this.data.videoCount > 0 || e.target.dataset.status) {
    //   this.btnGetEstimateNum()
    // } else {
    //   wx.navigateTo({
    //     url: '../specification/index',
    //   })
    // }
    this.btnGetEstimateNum()
    this.videoContext.pause()
  },
  btnGetEstimateNum() {
    let requestData = {
      type: 3,
      estimateServeCode: app.globalData.eyeGamesData.checkSerivce || app.globalData.eyeGamesData.checkService || app.globalData.eyeGamesData.estimateServeCode,
      estimateServeName: app.globalData.eyeGamesData.checkName || app.globalData.eyeGamesData.estimateServeName,
      customPhone: app.globalData.eyeGamesData.phone || app.globalData.eyeGamesData.customPhone,
      customName: app.globalData.eyeGamesData.clientName || app.globalData.eyeGamesData.customName,
      orderNum: app.globalData.eyeGamesData.ticketsServiceCode || app.globalData.eyeGamesData.orderNum,
      deviceNum: wx.getSystemInfoSync().screenWidth + "_" + wx.getSystemInfoSync().screenHeight,
      deviceModel: wx.getSystemInfoSync().model,
      ticketsEquityCode: app.globalData.eyeGamesData.ticketsEquityCode || app.globalData.eyeGamesData.orderNum || app.globalData.eyeGamesData.ticketsBookingCode || app.globalData.eyeGamesData.ticketsCode,
      status: app.globalData.eyeGamesData.status == 4 || app.globalData.eyeGamesData.status == 9 ? app.globalData.eyeGamesData.status : null,
      estimateNum: app.globalData.eyeGamesData.status == 4 || app.globalData.eyeGamesData.status == 9 ? app.globalData.eyeGamesData.estimateNum : null,
      estimateOrderType: app.globalData.eyeGamesData.estimateOrderType ? app.globalData.eyeGamesData.estimateOrderType : null,
      imageRandom:this.data.imageRandom.toString()
    }
    getEstimateNum(requestData).then(res => {
      console.log(res)
      if (res.code === 200) {
        app.globalData.estimateNum = res.data;
        // app.globalData.eyeGamesStepIndex += 2;
        wx.redirectTo({
          url: '../specification/index',
        })
      }
    })
  },
  relook() {
    this.videoContext.play()
    this.setData({
      isPlay: false,
      imgGif: this.data.ossImg + 'audio-gif.gif'
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})