import {
  rpxToPx
} from "../../../util/px-rpx"
import {
  questionFind,
  saveScaleResult,
  addQuestionResult,
  getReport
} from "../../../http/api"
const app = getApp()
const api = require('../../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    outBtntop: 0,
    outBack: 0, //右上角返回跳哪个页面  0权益列表 1 权益多个列表 2权益详情 3 支付订单列表
    scaleData: {},
    scaleIndex: 0,
    estimateNum: "",
    maskStatus: "",
    loadingMaskStatus: false,
    str:'',
    isAuto:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  
    this.setData({
      outBack: options.outBack,
      ticketCode: options.code,
      prodectCode: options.prodectCode,
      types: options.types,
      str:options.str
    })
    this.data.estimateNum = options.estimateNum;
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    let outBtntop = menuButtonInfo.top + (menuButtonInfo.height - rpxToPx(40)) / 2;
    this.setData({
      outBtntop
    })
    this.getScaleList(app.globalData.serverInfo.checkService)
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    
  },
  getScaleList(code) {
    questionFind({
      estimateServerCode: code
    }).then(res => {
      console.log(res)
      if (res.code === 200) {
        let scaleData = res.data.map(item => {
          item.content = item.content.replace(/<br\/>/, "");
          return item
        })
        console.log(scaleData,'scaleData');
        this.setData({
          scaleData,
        })
      }
    })
  },
  selectScaleItem(e) {
    console.log(e)
    let {
      index,
      index_c
    } = e.currentTarget.dataset;
    console.log(index, index_c)
    this.setData({
      loadingMaskStatus: true,
     
    })
    let ItemData = [{
      answers: this.data.scaleData[index].children[index_c].content,
      content: this.data.scaleData[index].children[index_c].content,
      contentIndex: this.data.scaleData[index].children[index_c].contentIndex,
      estimateNum: this.data.estimateNum,
      imgUrl: "",
      isRight: 0,
      option: this.data.scaleData[index].children[index_c].option,
      photoUrl: null,
      playRecord: null,
      questionId: this.data.scaleData[index].id,
      remark: ""
    }]
    addQuestionResult(ItemData).then(res => {
      console.log(res)
      if (res.code === 200) {
        if (this.data.scaleIndex === this.data.scaleData.length - 1) {
          getReport({
            estimateNum: this.data.estimateNum
          }).then(res => {
            let data = {
              archNo: wx.getStorageSync('archivesNo'),
              estimateNum: this.data.estimateNum,
              riskLabel: res.data.classificationScoreResp.defaultLabel,
              isUnableAnswer: false,
              riskLabelDesc: ""
            }
            saveScaleResult(data).then(res => {
              console.log(res)
              let that = this
              if (res.code === 200) {
                that.getCodeStatus()
             
                console.log(this.data.scaleData[this.data.scaleIndex].appletVoicePath,'appletVoicePath');
                // this.data.scaleData[this.data.scaleIndex].appletVoicePath.stop(),
                wx.createVideoContext('myVideo').pause()
                this.setData({
                  loadingMaskStatus: false,
                })
              }
            })
          })


        } else {
          this.setData({
            scaleIndex: this.data.scaleIndex += 1,
            loadingMaskStatus: false
          })
        }
      }
    })

  },
  //判断是否为多量表
  getCodeStatus() {
    let ticketsEquityCode = '';
    ticketsEquityCode = app.globalData.serverInfo.ticketsBookingCode
    let parmas = {
      ticketCode: app.globalData.serverInfo.ticketsBookingCode,
    }
    console.log(parmas, 'parmas');
    api.queryIsMany(parmas).then(res => {
      if (res.code === 200) {
        console.log(res.data, 'res.data');
        if (res.data.many && res.data.over) {
          console.log('1111');
          this.setData({
            maskStatus: 'ok'
          })
        }else if(!res.data.many  && res.data.over){  
            this.setData({
              maskStatus: 'ok'
            })
        }else {
          console.log('进来了');
          // wx.redirectTo({
          //   url: '/packageHome/pages/equityList/index?code=' + ticketsEquityCode + '&back=1',
          // })
          this.skipLoseJump()
        }
      } else {
        wx.showToast({
          icon: 'error',
          title: res.msg,
        })
      }
    })
  },
  nextPage(e) {
    if (e.target.dataset.type == 1) {
      wx.switchTab({
        url: '../../../page/home/index',
      })
    } else if (e.target.dataset.type == 2) {
      wx.navigateTo({
        url: '../../../packageHome/pages/newReport/index',
      })
    } else if (e.target.dataset.type == 3) {
      this.setData({
        maskStatus: ''
      })
    } else if (e.target.dataset.type == 4) {
      console.log('0000000000');
      
      let data = {
        archNo: wx.getStorageSync('archivesNo'),
        estimateNum: this.data.estimateNum,
        riskLabel: 0,
        isUnableAnswer: true,
        riskLabelDesc: ""
      }
      saveScaleResult(data).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.getCodeStatus();
         
        }
      })
    } else if (e.target.dataset.type == 5) {
      console.log('0****');
    this.skipJump()
    } else {
      wx.redirectTo({
        url: '../../../packageHome/pages/newReport/index',
      })
    }
  },
  outPage() {
    wx.createVideoContext('myVideo').pause()
    this.setData({
      maskStatus: 'tip',
    })
    
    // wx.navigateBack()
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

  },
  // 跳转
  skipJump(){
    
  //右上角返回跳哪个页面  0权益列表 1 权益多个列表 2权益详情 3 支付订单列表
  if (this.data.outBack == 0) {
    wx.redirectTo({
      url: '/packageHome/pages/interests/index',
    })
  } else if (this.data.outBack == 1) {
    wx.redirectTo({
      url: '/packageHome/pages/equityList/index?code=' + this.data.ticketCode,
    })
  } else if (this.data.outBack == 2) {
    console.log('0000000000000');
    wx.redirectTo({
      url: '/packageHome/pages/equityDetails/index?type=' + this.data.types + '&code=' + this.data.prodectCode,
    })
  } else if (this.data.outBack == 3) {
    wx.redirectTo({
      url: '/packageHome/pages/meal/index?str=' + this.data.str,
    })
  }
  },
    // 无法做答跳转
    skipLoseJump(){
      //右上角返回跳哪个页面  0权益列表 1 权益多个列表 2权益详情 3 支付订单列表
      if (this.data.outBack == 0) {
        wx.redirectTo({
          url: '/packageHome/pages/interests/index?&backLose=1',
        })
      } else if (this.data.outBack == 1) {
        wx.redirectTo({
          url: '/packageHome/pages/equityList/index?code=' + this.data.ticketCode + '&backLose=1',
        })
      } else if (this.data.outBack == 2) {
        console.log('0000000000000');
        wx.redirectTo({
          url: '/packageHome/pages/equityDetails/index?type=' + this.data.types + '&code=' + this.data.prodectCode + '&backLose=1',
        })
      } else if (this.data.outBack == 3) {
        wx.redirectTo({
          url: '/packageHome/pages/meal/index?str=' + this.data.str + '&backLose=1',
        })
      }
      }

})