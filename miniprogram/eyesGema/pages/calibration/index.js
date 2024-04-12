// eyesGema/pages/calibration/index.js
import {
  handleEstimateCheckVideo
} from "../../../http/api"
import {
  rpxToPx
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
    text: '',
    animationIndex: 1,
    stepIndex: 1,
    timingText: 3,
    stepData: {},
    checkPoints: [],
    checkPointsIndex: 0,
    uploadVideoUrl: "",
    loadingShow: false,
    jumpSwitch: true,
    timeKey: null,
    questionTxt: {
      data: [],
      resolution_x: 0,
      resolution_y: 0
    },
    questionTxtItem: {
      position: 0,
      x: 0,
      y: 0,
      stimulateStartTime: 0,
      stimulateEndTime: 0,
      size: 0
    },
    startVideoTimeStamp: 0,
    endVideoTimeStamp: 0,
    fistCheckPointTimeStamp: 0,
    width: wx.getSystemInfoSync().screenWidth,
    height: wx.getSystemInfoSync().screenHeight,
    frameSize: "",
    cameraCount: 0,
    jumpSwitch: true,
    countdownStatus: false,
  },
  // width: wx.getSystemInfoSync().screenWidth,
  // height: wx.getSystemInfoSync().screenHeight,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.data.questionTxt.resolution_x = wx.getSystemInfoSync().screenWidth;
    this.data.questionTxt.resolution_y = wx.getSystemInfoSync().screenHeight;
    this.setData({
      stepData: app.globalData.eyeGamesStepData[app.globalData.eyeGamesStepIndex],
      frameSize: wx.getSystemInfoSync().screenWidth + "," + wx.getSystemInfoSync().screenHeight,
    }, () => {
      let checkPoints = [];
      for (let i = 0; i < this.data.stepData.steps[0].checkPoints.length; i++) {
        this.data.stepData.steps[0].checkPoints[i].animationLeft = null;
        this.data.stepData.steps[0].checkPoints[i].animationTop = null;
        checkPoints.push(this.data.stepData.steps[0].checkPoints[i]);
      }
      this.setData({
        text: this.data.stepData.steps[0].elements[0].content,
        checkPoints: checkPoints,
      })
    })
    this.playAudio(this.data.stepData.steps[0].elements[1].content)
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
  },

  changeStep(e){
    console.log(e +'开始0000000')
    let timeTmp = ''
    const context = wx.createCameraContext()
    const listener = context.onCameraFrame((frame) => {
    // console.log(frame.data instanceof ArrayBuffer, frame.width, frame.height)
    if(timeTmp=='' && this.data.startVideoTimeStamp != 0){
      timeTmp = new Date().getTime()
      console.log(timeTmp +'当前时间')
    }
  })
  listener.start()
  },  

  handleRecordStart(){

    console.log(e +'开始11111')
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  start(e){
    debugger
    console.log(e)
  },
  playAudio(url, index = 1, cb = () => {}) {
    this.innerAudioContext = wx.createInnerAudioContext({
      useWebAudioImplement: false
    });
    this.innerAudioContext.src = url;
    this.innerAudioContext.loop = false;
    this.innerAudioContext.play();
    this.innerAudioContext.onEnded(() => {
      if (index === 1) {
        this.setData({
          text: this.data.stepData.steps[0].elements[2].content
        })
        this.playAudio(this.data.stepData.steps[0].elements[3].content, 2, () => {
          this.innerAudioContext.stop();
          this.setData({
            stepIndex: 2
          }, () => {
            this.startRecord()
            this.changeAnimationIndex()
          })
        })
      } else {
        cb()
      }
    })
  },
  changeAnimationIndex() {
    this.setData({
      animationIndex: 1,
    }, () => {
      this.data.questionTxtItem.position = this.data.checkPoints[this.data.checkPointsIndex].position;
      this.data.questionTxtItem.x = Math.ceil(rpxToPx(this.data.checkPoints[this.data.checkPointsIndex].x));
      this.data.questionTxtItem.y = Math.ceil(rpxToPx(this.data.checkPoints[this.data.checkPointsIndex].y));
      this.data.questionTxtItem.size = Math.ceil(rpxToPx(this.data.checkPoints[this.data.checkPointsIndex].size));
      this.data.questionTxtItem.stimulateStartTime = new Date().getTime();

      // if (this.data.checkPointsIndex > 0) {
      //   this.data.questionTxtItem.position = this.data.checkPoints[this.data.checkPointsIndex].position;
      //   this.data.questionTxtItem.x = Math.ceil(rpxToPx(this.data.checkPoints[this.data.checkPointsIndex].x));
      //   this.data.questionTxtItem.y = Math.ceil(rpxToPx(this.data.checkPoints[this.data.checkPointsIndex].y));
      //   this.data.questionTxtItem.size = Math.ceil(rpxToPx(this.data.checkPoints[this.data.checkPointsIndex].size));
      //   this.data.questionTxtItem.stimulateStartTime = new Date().getTime();
      // }
      wx.nextTick(() => {
        this.setData({
          ['checkPoints[' + this.data.checkPointsIndex + '].animationLeft']: this.data.checkPoints[this.data.checkPointsIndex].x,
          ['checkPoints[' + this.data.checkPointsIndex + '].animationTop']: this.data.checkPoints[this.data.checkPointsIndex].y,
        }, () => {
          setTimeout(() => {
            this.setData({
              animationIndex: this.data.animationIndex += 1
            }, () => {
              setTimeout(() => {
                this.setData({
                  animationIndex: this.data.animationIndex += 1
                }, () => {
                  setTimeout(() => {
                    this.setData({
                      animationIndex: this.data.animationIndex += 1,
                    }, () => {
                      setTimeout(() => {
                        if (this.data.checkPointsIndex === 0) {
                          this.data.fistCheckPointTimeStamp = new Date().getTime()
                          // this.startRecord()
                        }
                        // if (this.data.checkPointsIndex > 0) {
                        //   this.data.questionTxtItem.stimulateEndTime = new Date().getTime();
                        //   this.data.questionTxt.data.push(this.data.questionTxtItem);
                        //   this.data.questionTxtItem = {
                        //     position: 0,
                        //     x: 0,
                        //     y: 0,
                        //     stimulateStartTime: 0,
                        //     stimulateEndTime: 0,
                        //     size: 0
                        //   }
                        // }

                        this.data.questionTxtItem.stimulateEndTime = new Date().getTime();
                        this.data.questionTxt.data.push(this.data.questionTxtItem);
                        this.data.questionTxtItem = {
                          position: 0,
                          x: 0,
                          y: 0,
                          stimulateStartTime: 0,
                          stimulateEndTime: 0,
                          size: 0
                        }

                        if (this.data.checkPointsIndex < this.data.checkPoints.length - 1) {
                          this.setData({
                            checkPointsIndex: this.data.checkPointsIndex += 1,
                          }, () => {
                            wx.nextTick(() => {
                              this.changeAnimationIndex()
                            })
                          })
                        } else {
                          this.setData({
                            loadingShow: true
                          })
                          this.stopRecord()
                        }
                      }, this.data.checkPoints[this.data.checkPointsIndex].boomTime)
                    })
                  }, this.data.checkPoints[this.data.checkPointsIndex].crossTime)
                })
              }, this.data.checkPoints[this.data.checkPointsIndex].pointTime)
            })
          }, 100)
        })
      })
    })

  },
  countdownJump() {
    let time = 10;
    let timeKey = setInterval(() => {
      if (time == 0) {
        clearInterval(this.data.timeKey)
        clearInterval(timeKey)
        if (!this.data.jumpSwitch) return;
        this.data.jumpSwitch = false;
        this.setData({
          stepIndex: 3,
          loadingShow: false
        }, () => {
          this.countdown(3)
        })
      }
      time--;
    }, 1000)
  },
  countdown(time) {
    this.playAudio(this.data.stepData.steps[0].elements[5].content, 2, () => {
      this.setData({
        timingText: time,
        countdownStatus: true,
      })
      let timeKey = setInterval(() => {
        if (this.data.timingText === 1) {
          clearInterval(timeKey)
          app.globalData.eyeGamesStepIndex += 1;
          this.data.jumpSwitch = false;
          wx.redirectTo({
            url: '../memoryImageGuide/index',
          })
        }
        this.setData({
          timingText: this.data.timingText -= 1
        })
      }, 1000)
    })
  },
  recalibration() {
    app.globalData.eyeGamesStepIndex -= 1;
    this.data.jumpSwitch = false;
    wx.redirectTo({
      url: '../peopleCorrect/index',
    })
  },

  startRecord() {
    // 开始录制
    this.data.cameraContext.startRecord({
      timeout: 30,
      selfieMirror: false,
      success: () => {
        this.data.cameraCount = 0;
        this.data.startVideoTimeStamp = new Date().getTime();
        console.log('开始录制时间' +this.data.startVideoTimeStamp)
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

  stopRecord () {
    // 停止录制
    this.data.cameraContext.stopRecord({
      success: async (res) => {
        console.log(res)
        this.data.endVideoTimeStamp = new Date().getTime();
        this.data.cameraCount = 0;
        this.upLoadVideo(res.tempVideoPath, app.globalData.estimateNum);
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
  upLoadVideo(tempVideoPath, estimateNum) {
    upLoadOSS(tempVideoPath, estimateNum, 0, 0).then(res => {
      console.log(res)
      if (res.code === 200) {
        this.data.uploadVideoUrl = res.data;
        this.setVideoData()
      }
    }).catch(err => {
      this.upLoadVideo(tempVideoPath, estimateNum)
    })
  },
  setVideoData() {
    let timeNum = 0
    for (let i = 0; i < this.data.questionTxt.data.length; i++) {
      if (i === 0) {
        timeNum = this.data.questionTxt.data[i].stimulateStartTime
        this.data.questionTxt.data[0].stimulateStartTime = this.data.questionTxt.data[0].stimulateStartTime - this.data.startVideoTimeStamp
      } else {
        this.data.questionTxt.data[i].stimulateStartTime = this.data.questionTxt.data[i].stimulateStartTime - timeNum;
      }
      this.data.questionTxt.data[i].stimulateEndTime = this.data.questionTxt.data[i].stimulateEndTime - timeNum;
    }
    let data = {
      taskType: 3,
      type: 0,
      index: 0,
      videoPath: this.data.uploadVideoUrl,
      startVideoTimeStamp: this.data.startVideoTimeStamp,
      endVideoTimeStamp: this.data.endVideoTimeStamp,
      estimateNum: app.globalData.estimateNum,
      fistCheckPointTimeStamp: this.data.fistCheckPointTimeStamp,
      questionText: JSON.stringify(this.data.questionTxt),
      deviceType: "phone",
      phoneWidth: wx.getSystemInfoSync().screenWidth,
      phoneHigh: wx.getSystemInfoSync().screenHeight,
    }
    this.countdownJump()
    handleEstimateCheckVideo(data).then(res => {
      if (!this.data.jumpSwitch) return;
      this.data.jumpSwitch = false;
      console.log(res)
      this.setData({
        loadingShow: false
      })
      if (res.code === 200) {
        this.setData({
          stepIndex: 3
        }, () => {
          clearInterval(this.data.timeKey)
          this.countdown(3)
        })
      } else {
        this.setData({
          stepIndex: 4
        }, () => {
          this.playAudio(this.data.stepData.steps[0].elements[7].content, 2)
        })
      }
    }).catch((err) => {
      console.log(err)
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
    this.innerAudioContext.stop();
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