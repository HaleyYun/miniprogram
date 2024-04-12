// eyesGema/pages/albumMemory/index.js
import {
  handleEstimateVideo
} from "../../../http/api"
import {
  rpxToPx,
} from "../../../util/px-rpx"
import {
  upLoadOSS
} from "../../../util/upLoadOSS"
let app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    stepNum: 1,
    stepData: {},
    images: [],
    imagesIndex: 0,
    uploadVideoUrl: "",
    questionText: {
      els: [],
      model_type: "",
      device_type: "phone",
      width: 0,
      height: 0,
    },
    startVideoTimeStamp: 0,
    endVideoTimeStamp: 0,
    width: wx.getSystemInfoSync().screenWidth,
    height: wx.getSystemInfoSync().screenHeight,
    frameSize: "",
    cameraCount: 0,
    jumpSwitch: true,
  },
  // width: wx.getSystemInfoSync().screenWidth,
  //   height: wx.getSystemInfoSync().screenHeight,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.questionText.width = wx.getSystemInfoSync().screenWidth;
    this.data.questionText.height = wx.getSystemInfoSync().screenHeight;
    this.setData({
      stepData: app.globalData.eyeGamesStepData[app.globalData.eyeGamesStepIndex],
      frameSize: wx.getSystemInfoSync().screenWidth + "," + wx.getSystemInfoSync().screenHeight,
    }, () => {
      this.setData({
        images: this.handleData(this.data.stepData)
      })
    })
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async onReady() {
    // 获取摄像头上下文
    this.data.cameraContext = await wx.createCameraContext()
    console.log("this.data.cameraContext", this.data.cameraContext)
    this.changeStep()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log(this.data.stepData)
  },
  handleData(val) {
    let arr = []
    let images = val.steps[0].images1;
    for (let i = 0; i < images.length; i++) {
      images[i].memoryImages[0].x = val.steps[0].commonPx;
      images[i].memoryImages[0].y = val.steps[0].px1;
      images[i].memoryImages[1].x = val.steps[0].commonPx;
      images[i].memoryImages[1].y = val.steps[0].px2;
      arr.push(images[i].memoryImages)
    }
    return arr
  },
  changeStep() {
    this.setData({
      stepNum: 1
    }, () => {
      setTimeout(() => {
        this.setData({
          stepNum: 2
        }, () => {
          this.startRecord()
          setTimeout(() => {
            let els = []
            for (let i = 0; i < this.data.images[this.data.imagesIndex].length; i++) {
              let item = {
                pic: this.handlePath(this.data.images[this.data.imagesIndex][i].content),
                position: i % 2,
                select: this.data.images[this.data.imagesIndex][i].select,
                x: Math.ceil(rpxToPx(this.data.images[this.data.imagesIndex][i].x)),
                y: Math.ceil(rpxToPx(this.data.images[this.data.imagesIndex][i].y))
              }
              els.push(item)
            }
            this.data.questionText.els = els;
            // 结束录像上传
            this.stopRecord()
            this.setData({
              stepNum: 3
            })
          }, this.data.images[this.data.imagesIndex][0].imageTime)
        })
      }, 1000)
    })
  },
  handlePath(str) {
    return "/" + str.split("/").pop()
  },
  startRecord: function () {
    // 开始录制
    this.data.cameraContext.startRecord({
      timeout: 200000,
      selfieMirror: false,
      success: () => {
        this.data.cameraCount = 0;
        this.data.startVideoTimeStamp = new Date().getTime();
      },
      fail: (err) => {
        console.log("打开摄像头失败", err)
        this.data.cameraCount += 1;
        if (this.data.cameraCount <= 3) {
          this.startRecord()
        } else {
          wx.showModal({
            title: "提示",
            content: "微信小程序底层接口不兼容",
            showCancel: false,
            confirmText: "返回列表",
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateBack()
              }
            }
          })
        }
      }
    })
  },

  stopRecord: function () {
    // 停止录制
    this.data.cameraContext.stopRecord({
      success: async (res) => {
        console.log(res)
        this.data.endVideoTimeStamp = new Date().getTime();
        this.data.cameraCount = 0;
        console.log(app.globalData.estimateNum, '这时停止录制estimateNum')
        this.upLoadVideo(res.tempVideoPath, app.globalData.estimateNum, this.data.imagesIndex + 1);
      },
      fail: (err) => {
        console.log("关闭摄像头失败", err)
        this.data.cameraCount += 1;
        if (this.data.cameraCount <= 3) {
          this.stopRecord()
        } else {
          wx.showModal({
            title: "提示",
            content: "微信小程序底层接口不兼容",
            showCancel: false,
            confirmText: "返回列表",
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                wx.navigateBack()
              }
            }
          })
        }
      }
    })
  },
  upLoadVideo(tempVideoPath, estimateNum, imagesIndex) {
    console.log(estimateNum, '这是estimateNum')
    upLoadOSS(tempVideoPath, estimateNum, 2, imagesIndex).then(res => {
      console.log(res)
      if (res.code === 200) {
        console.log(res.data, '这是生成的视频地址路径')
        this.data.uploadVideoUrl = res.data;
        this.setEyeData()
      }
    }).catch(err => {
      this.upLoadVideo(tempVideoPath, estimateNum, imagesIndex)
    })
  },
  setEyeData() {
    let data = {
      serviceCode: app.globalData.eyeGamesData.checkSerivce || app.globalData.eyeGamesData.checkService || app.globalData.eyeGamesData.estimateServeCode,
      deviceType: "phone",
      phoneWidth: wx.getSystemInfoSync().screenWidth,
      phoneHigh: wx.getSystemInfoSync().screenHeight,
      taskType: 3,
      type: 2,
      index: this.data.imagesIndex + 1,
      videoPath: this.data.uploadVideoUrl,
      startVideoTimeStamp: this.data.startVideoTimeStamp,
      endVideoTimeStamp: this.data.endVideoTimeStamp,
      estimateNum: app.globalData.estimateNum,
      questionText: JSON.stringify(this.data.questionText),
      failEstimateNum: app.globalData.eyeGamesData.status == 4 || app.globalData.eyeGamesData.status == 9 ? app.globalData.eyeGamesData.estimateNum : null
    }
    console.log(data, '这是上传视频的接口参数')
    handleEstimateVideo(data).then(res => {
      console.log(res)
      if (res.code === 200) {
        if (this.data.imagesIndex === this.data.images.length - 1) {
          app.globalData.eyeGamesStepIndex++;
          this.data.jumpSwitch = false;
          wx.redirectTo({
            url: '../underAnalysis/index',
          })
        } else {
          this.setData({
            imagesIndex: this.data.imagesIndex += 1
          }, () => {
            this.changeStep()
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    if (this.data.jumpSwitch) {
      wx.navigateBack()
    }
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