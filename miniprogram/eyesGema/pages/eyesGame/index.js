// eyesGema/pages/eyesGame/index.js
import {
  handleEstimateVideo
} from "../../../http/api"
import {
  upLoadOSS
} from "../../../util/upLoadOSS"
import {
  rpxToPx,
} from "../../../util/px-rpx"
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timerStr:'',
    dropTimeStampOne:'',
    stepNum: 1,
    systemInfo: {},
    stepData: {},
    stepDataIndex: 0,
    uploadVideoUrl: "",
    startVideoTimeStamp: 0,
    startVideoTimeStampCode: 0,
    endVideoTimeStamp: 0,
    endVideoTimeStampCode: 0,
    questionText: {
      data: [],
      model_type: "",
      device_type: "phone",
      width: 0,
      height: 0,
    },
    width: wx.getSystemInfoSync().screenWidth,
    height: wx.getSystemInfoSync().screenHeight,
    frameSize: "",
    cameraCount: 0,
    jumpSwitch: true,


    endVideoTimeStampNew:'',//十字出现的时间
    endVideoTimeStampCodeNew:'',//眼跳出现的时间
  },
  // width: wx.getSystemInfoSync().screenWidth,
  // height: wx.getSystemInfoSync().screenHeight,
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    this.data.questionText.width = wx.getSystemInfoSync().screenWidth;
    this.data.questionText.height = wx.getSystemInfoSync().screenHeight;
    this.setData({
      stepData: app.globalData.eyeGamesStepData[app.globalData.eyeGamesStepIndex].steps[0].eyeActions,
      frameSize: wx.getSystemInfoSync().screenWidth + "," + wx.getSystemInfoSync().screenHeight,
    })
    let res = await wx.getSystemInfo()
    this.setData({
      systemInfo: res
    })
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
    this.clock()
  },



  changeStepNew(e){
    console.log(e +'开始0000000')
    let timeTmp = ''
    const context = wx.createCameraContext()
    const listener = context.onCameraFrame((frame) => {
    // console.log(frame.data instanceof ArrayBuffer, frame.width, frame.height)
    if(timeTmp=='' && this.data.startVideoTimeStamp != 0){
      timeTmp = new Date().getTime()
      this.data.startVideoTimeStamp = timeTmp
      console.log(timeTmp +'当前时间')
    }
  })
  listener.start()
  }, 

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  async onReady() {
    // 获取摄像头上下文
    this.data.cameraContext = await wx.createCameraContext()
    console.log("this.data.cameraContext", this.data.cameraContext)
    this.changeStep(this.data.stepData[this.data.stepDataIndex])
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
  },

  changeStep(val) {
    this.setData({
      stepNum: 1
    }, () => {
      this.data.startVideoTimeStampCode = new Date().getTime();
      this.startRecord()
      setTimeout(() => {
        this.setData({
          stepNum: 2
        }, () => {
          let time_0 = new Date().getTime();
          this.setData({
            endVideoTimeStampNew:new Date().getTime()//十字出现的时间
          })
          let dataItem = {
            time: 0,
            dropTimeStamp: new Date().getTime(),
            els: [{
              x: Math.ceil(rpxToPx(this.data.stepData[this.data.stepDataIndex].center.x) - rpxToPx(this.data.stepData[this.data.stepDataIndex].center.size) / 2),
              y: Math.ceil(rpxToPx(this.data.stepData[this.data.stepDataIndex].center.y) - rpxToPx(this.data.stepData[this.data.stepDataIndex].center.size) / 2),
              pic: this.handlePath(this.data.stepData[this.data.stepDataIndex].center.content)
            }]
          }
          this.data.questionText.data.push(dataItem)
          setTimeout(() => {
            this.setData({
              stepNum: 0
            })
            let dataItem = {
              time: new Date().getTime() - time_0,
              dropTimeStamp: new Date().getTime(),
              els: []
            }
            this.data.questionText.data.push(dataItem);
            setTimeout(() => {
              this.setData({
                stepNum: 3
              }, () => {
                this.setData({
                  endVideoTimeStampCodeNew:new Date().getTime() //眼跳出现的时间
                })
                let dataItem2 = {
                  time: new Date().getTime() - time_0,
                  dropTimeStamp: new Date().getTime(),
                  els: [{
                    x: Math.ceil(rpxToPx(this.data.stepData[this.data.stepDataIndex].pointAction.brownPoint.x) - rpxToPx(this.data.stepData[this.data.stepDataIndex].pointAction.brownPoint.pointSize) / 2),
                    y: Math.ceil(rpxToPx(this.data.stepData[this.data.stepDataIndex].pointAction.brownPoint.y) - rpxToPx(this.data.stepData[this.data.stepDataIndex].pointAction.brownPoint.pointSize) / 2),
                    pic: this.handlePath(this.data.stepData[this.data.stepDataIndex].pointAction.brownPoint.content)
                  }, {
                    x: Math.ceil(rpxToPx(this.data.stepData[this.data.stepDataIndex].pointAction.redPoint.x) - rpxToPx(this.data.stepData[this.data.stepDataIndex].pointAction.redPoint.pointSize) / 2),
                    y: Math.ceil(rpxToPx(this.data.stepData[this.data.stepDataIndex].pointAction.redPoint.y) - rpxToPx(this.data.stepData[this.data.stepDataIndex].pointAction.redPoint.pointSize) / 2),
                    pic: this.handlePath(this.data.stepData[this.data.stepDataIndex].pointAction.redPoint.content)
                  }]
                }
                this.data.questionText.data.push(dataItem2);
                setTimeout(() => {
                  this.setData({
                    stepNum: 4
                  }, () => {
                    this.data.endVideoTimeStampCode = new Date().getTime();
                    this.stopRecord()
                  })
                  // 结束录像上传
                  let dataItem3 = {
                    time: new Date().getTime() - time_0,
                    els: [],
                    dropTimeStamp: new Date().getTime(),
                  }
                  this.data.questionText.data.push(dataItem3);
                }, val.pointAction.pointTime)
              })
            }, 200)
          }, val.center.wait)
        })
      }, 1000)
    })
  },
  handlePath(str) {
    return "/" + str.split("/").pop()
  },
  startRecord () {
    // 开始录制
    this.data.cameraContext.startRecord({
      timeout: 30,
      selfieMirror: false,
      success: () => {
        this.data.cameraCount = 0;
        this.setData({
          startVideoTimeStamp:new Date().getTime()
        })
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

  stopRecord () {
    // 停止录制
    this.data.cameraContext.stopRecord({
      success: (res) => {
        console.log(res)
        this.data.endVideoTimeStamp = new Date().getTime();
        this.data.cameraCount = 0;
        console.log(app.globalData.estimateNum,'这时停止录制estimateNum')
        this.upLoadVideo(res.tempVideoPath, app.globalData.estimateNum, this.data.stepDataIndex + 1)
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
  upLoadVideo(tempVideoPath, estimateNum, stepDataIndex) {
    console.log(estimateNum,'这是estimateNum')
    upLoadOSS(tempVideoPath, estimateNum, 1, stepDataIndex).then(res => {
      console.log(res)
      if (res.code === 200) {
        this.data.uploadVideoUrl = res.data;
        this.setEyeData()
      }
    }).catch(err => {
      this.upLoadVideo(tempVideoPath, estimateNum, stepDataIndex)
    })
  },
  setEyeData() {
    this.data.questionText.startVideoTimeStamp = this.data.startVideoTimeStamp;
    this.data.questionText.startVideoTimeStampCode = this.data.startVideoTimeStampCode;
    this.data.questionText.endVideoTimeStamp = this.data.endVideoTimeStamp;
    this.data.questionText.endVideoTimeStampCode = this.data.endVideoTimeStampCode;
    let data = {
      serviceCode: app.globalData.eyeGamesData.checkSerivce || app.globalData.eyeGamesData.checkService || app.globalData.eyeGamesData.estimateServeCode,
      deviceType: "phone",
      phoneWidth: wx.getSystemInfoSync().screenWidth,
      phoneHigh: wx.getSystemInfoSync().screenHeight,
      taskType: 3,
      type: 1,
      index: this.data.stepDataIndex + 1,
      videoPath: this.data.uploadVideoUrl,
      startVideoTimeStamp: this.data.startVideoTimeStamp,
      endVideoTimeStamp: this.data.endVideoTimeStampNew,
      endVideoTimeStampCode:this.data.endVideoTimeStampCodeNew,

      firstPhotoChangeTimes: this.data.endVideoTimeStampNew,
      secondPhotoChangeTimes:this.data.endVideoTimeStampCodeNew,

      estimateNum: app.globalData.estimateNum,
      questionText: JSON.stringify(this.data.questionText),
      failEstimateNum: app.globalData.eyeGamesData.status == 4 || app.globalData.eyeGamesData.status == 9 ? app.globalData.eyeGamesData.estimateNum : null
    }
    handleEstimateVideo(data).then(res => {
      console.log(res)
      if (res.code === 200) {
        this.data.questionText.data = [];
        if (this.data.stepData.length - 1 === this.data.stepDataIndex) {
          app.globalData.eyeGamesStepIndex++;
          this.data.jumpSwitch = false;
          wx.redirectTo({
            url: '../memoryGuide/index',
          })
        } else {
          this.setData({
            stepDataIndex: this.data.stepDataIndex += 1
          }, () => {
            this.changeStep(this.data.stepData[this.data.stepDataIndex])
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