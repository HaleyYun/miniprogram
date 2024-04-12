const app = getApp()
const api = require('../../../http/api.js')
const util = require('../../../util/util')
Page({
  data: {
    ossImg: app.globalData.ossImgUrl,
    order: {},
    steps: [],
    prodectCode: '', //产品预约单号
    types: '',
    stepsHeight: 0,
    isSupport: false,
  },
  onLoad(options) {
    if (options.backLose) {
      let that = this
      that.setData({
        isSupport: true,
        checkService: app.globalData.checkService
      })
      that.data.timer = setTimeout(function () {
        that.setData({
          isSupport: false,
        })
      }, 5000)
    }
    console.log(options, '2222');
    this.setData({
      prodectCode: options.code,
      types: options.type
    })

  },
  onShow() {
    this.getEquityDetail()
    this.getSteps()
  },
  //权益详情信息
  getEquityDetail() {
    api.equityDetail({
      code: this.data.prodectCode
    }).then(res => {
      this.setData({
        order: res.data
      })
    })
  },
  //获取服务记录
  getSteps() {
    api.orderLogs({
      ticketCode: this.data.prodectCode,
      ticketsTypeId: this.data.types,
      pageSize: 999
    }).then(res => {
      let num = 255;
      let data = res.data.data.filter(item => !item.remark)
      this.setData({
        steps: res.data.data,
        stepsHeight: (res.data.data.length * num) - (60 * data.length)
      })
    })
  },
  //电话咨询
  call(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  goEquiyDetails() {
    wx.navigateTo({
      url: '/packageMy/pages/detail/index?id=' + this.data.order.prodId
    })
  },
  // 立即使用
  goEquiyList: util.debounce(function (e) {
    let that = this
    api.checkInterTime({
      ticketCode: that.data.order.ticketsEquityCode
    }).then(res => {
      console.log(res)
      // return
      if (res.code === 200) {
        if (res.data.serviceComplete) {
          if (that.data.order.type === 1) {
            if (that.data.order.status === 0 || that.data.order.status === 1) {
              console.log(that.data.order.checkService, 'that.data.order.checkService');
              if (that.data.order.checkService) {
                console.log(that.data.order.checkService, 'ppppp');
                if (that.data.order.checkService === "EDB-AD-LIET") {
                  if (that.data.order.status == 0 || that.data.order.status == 1) {
                    app.globalData.eyeGamesData = that.data.order;
                    app.globalData.eyeGamesData.estimateOrderType = null;
                    wx.navigateTo({
                      url: '../../../eyesGema/pages/index/index',
                    })
                  } else {
                    wx.showToast({
                      icon: 'none',
                      title: '状态不可用',
                      duration: 3000,
                    });
                  }
                } else if (that.data.order.checkService === "SMALL-GAME") {
                  if (that.data.order.status == 0 || that.data.order.status == 1) {
                    app.globalData.gamesDatas = {
                      estimateServeCode: that.data.order.checkService,
                      estimateServeName: that.data.order.checkServiceName,
                      customPhone: that.data.order.phone,
                      customName: that.data.order.clientName,
                      orderNum: '',
                      ticketsEquityCode: that.data.order.ticketsBookingCode || that.data.order.ticketsEquityCode,
                    }
                    console.log(JSON.stringify({
                      estimateServeCode: that.data.order.checkService,
                      estimateServeName: that.data.order.checkServiceName,
                      customPhone: that.data.order.phone,
                      customName: that.data.order.clientName,
                      orderNum: '',
                      ticketsEquityCode: that.data.order.ticketsBookingCode || that.data.order.ticketsEquityCode,
                    }) + '缓存数据111')
                    wx.setStorageSync('ticketsEquityCode', that.data.order.ticketsBookingCode || that.data.order.ticketsEquityCode)
                    wx.setStorageSync('strCode', 'EquityCode')
                    app.globalData.gamesDatas.estimateOrderType = null;;
                    wx.navigateTo({
                      url: '/packageHome/pages/gameSku/testHome/index',
                    })
                  } else {
                    wx.showToast({
                      icon: 'none',
                      title: '状态不可用',
                      duration: 3000,
                    });
                  }
                } else if (that.data.order.checkService === "AD-8-LIET") {
                  console.log(that.data.order.status, 'item.status');
                  if (that.data.order.status == 0 || that.data.order.statuss == 1) {
                    // return false
                    // app.globalData.serverInfo = item;
                    app.globalData.serverInfo = {
                      ticketsBookingCode: that.data.order.ticketsBookingCode || that.data.order.ticketsEquityCode,
                      clientId: that.data.order.archivesNo,
                      clientName: that.data.order.clientName,
                      phone: that.data.order.phone,
                      estimateNum: '',
                      checkService: that.data.order.checkService,
                      status: '',
                    }
                    // navigateTo  redirectTo
                    wx.redirectTo({
                      // prodectCode types
                      url: '../../../packageScale/pages/ad8Index/index?outBack=2' + '&prodectCode=' + that.data.prodectCode + '&types=' + that.data.types,
                    })
                  } else {
                    wx.showToast({
                      icon: 'none',
                      title: '状态不可用',
                      duration: 3000,
                    });
                  }
                }
              } else {
                wx.navigateTo({
                  url: '/packageHome/pages/equityList/index?code=' + that.data.order.ticketsEquityCode + '&prodectCode' + that.data.prodectCode + '&types' + that.data.types,
                })
              }

            }
          } else {
            wx.showToast({
              icon: 'none',
              title: '线下权益不支持使用',
              duration: 3000,
            });
          }
        } else {
          wx.showToast({
            icon: 'none',
            title: res.msg,
            duration: 3000,
          });
        }
      } else if (res.code == 2049) {
        wx.showToast({
          icon: 'none',
          title: '请至少完成一次脑健康筛查后~',
          duration: 5000,
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg,
          duration: 3000,
        });
      }
    })
  }, 500),
})