// eyesGema/pages/underAnalysis/index.js
const app = getApp()
const api = require('../../../http/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMany: false, //判断是否多个筛查
    isManyOver: false, //判断多个筛查是否全部做完
    stepData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getCodeStatus()
    this.setData({
      stepData: app.globalData.eyeGamesStepData[app.globalData.eyeGamesStepIndex]
    }, () => {
      this.innerAudioContext = wx.createInnerAudioContext({
        useWebAudioImplement: false
      });

      this.innerAudioContext.src = this.data.stepData.steps[0].elements[1].content;
      this.innerAudioContext.loop = false;
      this.innerAudioContext.play();
      this.innerAudioContext.onEnded(() => {
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
        console.log('CCCCCC',app.globalData.eyeGamesType);
        console.log('DDDDDD',app.globalData.eyeGamesData);
        if (app.globalData.eyeGamesData.estimateOrderType === 1) {
          this.setOrder()
        } else {



          if (this.data.isMany && this.data.isManyOver) {
            wx.redirectTo({
              url: '../procedureEnd/index',
            })

          } else if (!this.data.isMany && this.data.isManyOver) {
            if(app.globalData.eyeGamesType){
              console.log('jinlai');
              wx.redirectTo({
                url: '/packageHome/pages/newReport/index',
              })
              app.globalData.eyeGamesType=null
            }else{
            wx.redirectTo({
              url: '/packageHome/pages/interests/index?back=0',
            })
          }
          } else {
;
              wx.redirectTo({
                url: '/packageHome/pages/equityList/index?code=' + (ticketsEquityCode || ticketsServiceCode) + '&back=1',
              })
            
          }

        }
      })
      this.InnerAudioContext.onError(() => {
        if (app.globalData.eyeGamesData.estimateOrderType === 1) {
          this.setOrder()
        } else {
          if (this.data.isMany && this.data.isManyOver) {
            wx.redirectTo({
              url: '../procedureEnd/index',
            })

          } else if (!this.data.isMany && this.data.isManyOver) {
            if(app.globalData.eyeGamesType){
              console.log('PPPPPPPPPPPP');
              wx.redirectTo({
                url: '/packageHome/pages/newReport/index',
              })
              app.globalData.eyeGamesType=null
            }else{
            wx.redirectTo({
              url: '/packageHome/pages/interests/index?back=0',
            })
          }
          } else {
       
              wx.redirectTo({
                url: '/packageHome/pages/equityList/index?code=' + (ticketsEquityCode || ticketsServiceCode) + '&back=1',
              })
            
            
          }
        }
      })
    })
    wx.hideShareMenu({
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  setOrder() {
    console.log(app.globalData.eyeGamesData)
    let parmas = {
      clientResource: 1,
      activityId: 88,
      activityChannel: app.globalData.marketParams.activityChannel,
      activityMarketingId: app.globalData.eyeGamesData.activityMarketingId,
      estimateNum: app.globalData.estimateNum,
      price: app.globalData.eyeGamesData.price,
      describe: app.globalData.eyeGamesData.describe,
      money: app.globalData.eyeGamesData.price,
      openId: app.globalData.openId ? app.globalData.openId : wx.getStorageSync('openId'),
      payWay: 2,
      purchaserPhone: app.globalData.eyeGamesData.customPhone,
      servName: app.globalData.eyeGamesData.servName,
      serviceProductId: app.globalData.eyeGamesData.serviceProductId,
      totalFee: app.globalData.eyeGamesData.price,
      purchaser: app.globalData.eyeGamesData.customName,
      step: 1,
    }
    api.ServiceOrder(parmas).then(res => {
      console.log(res, '生成订单接口')
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    console.log(this.data.stepData)
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
        console.log(res.data, 'res.data');
        this.setData({
          isMany: res.data.many,
          isManyOver: res.data.over
        })
      } else {
        wx.showToast({
          icon: 'error',
          title: res.msg,
        })
      }
    })
  },
})