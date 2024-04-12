const app = getApp()
const { relativeTimeThreshold } = require('moment');
const api = require('../../../http/api.js')
const util = require('../../../util/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowicon: false,
    isFailure: false, //生成失败展示
    isSuccessful: false, //生成成功展示
    indexId: 1, //默认
    prodCode: '',
    id: 0,
    ticketType: 0,
    page: 1,
    isSupport:false,
    switch: false,
    timer: null,
    popup: false, //退款弹框
    currentItem: {}, //退款数据
    status: true, //触底加载状态
    doctor: false, //列表无数据
    loadStatus: '', //loading-加载中,noData-无数据,failure-加载失败,
    schedule: 0, //加载中进
    countdown: {
      hours: 0,
      minutes: 0,
      seconds: 0
    },

    ossImg: app.globalData.ossImgUrl,
    artcileTypeList: [{
        categoryName: "待支付",
        status: 1,
      },
      {
        categoryName: "待使用",
        status: 2,
      },
      {
        categoryName: "服务中",
        status: 9,
      },
      {
        categoryName: "已完成",
        status: 3,
      },
      {
        categoryName: "退款",
        status: 4,
      },

    ], //分类
    // statusList: [
    //   { statusName: "待支付", value: 1,url:app.globalData.ossImgUrl+'paymentX.png' },
    //   { statusName: "待使用", value: 2,url:app.globalData.ossImgUrl+'waitingX.png'},
    //   { statusName: "已完成", value: 3,url:app.globalData.ossImgUrl+'completeX.png'},
    //   { statusName: "待退款", value: 4,url:app.globalData.ossImgUrl+'refundX.png'},
    //   { statusName: "已退款", value: 5,url:app.globalData.ossImgUrl+'refundX.png'},
    //   { statusName: "订单已关闭", value: 6,url:app.globalData.ossImgUrl+'cancelX.png' },
    //   { statusName: "使用中", value: 9,url:app.globalData.ossImgUrl+'serveX.png'},
    //   { statusName: "退款失败", value: 10,url:app.globalData.ossImgUrl+'refundX.png'},
    // ], //状态分类
    artcileList: [], //列表


  },
  onLoad(options) {
    if(options.backLose){
      let that = this
      that.setData({
        isSupport: true,
        checkService:app.globalData.checkService
      })
      that.data.timer = setTimeout(function () {
        that.setData({
          isSupport: false,
        })
      }, 5000)
    }
    console.log(options.str, 'options.str');
    if (options.str) {
      this.setData({
        indexId: Number(options.str),
      })
    }


  },
  onReady() {

  },
  onShow() {
    this.setData({
      page: 1,
      artcileList: []
    })
    this.gethomeArticleList()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  // 获取列表
  gethomeArticleList() {
    api.ticketsNumber({
      pageNum: this.data.page,
      pageSize: 10,
      status: this.data.indexId
    }).then(res => {
      if (res.code == 200) {
        if (res.data.data.length > 0) {
          if (res.data.data.length < 10) {
            this.setData({
              switch: false,
            })
          } else {
            this.setData({
              switch: true,
            })
          }
          let arr = this.data.artcileList.concat(res.data.data)
          this.setData({
            artcileList: arr,
          })
          let that = this
          that.setData({
            artcileList: arr,
          }, () => {
            if (this.data.indexId == 1) {
              that.data.timer = setInterval(() => {
                that.updateCountdown();
              }, 1000);
            }
          })

        } else {
          this.setData({
            oneInfo: '',
            artcileList: [],
          })

        }
      }
    })
  },
  updateCountdown() {
    // console.log(111111111)
    const artcileList = this.data.artcileList;
    artcileList.forEach((item, index) => {
      const currentTime = new Date().getTime();
      const remainingTime = item.closeTimeMills * 1000 - currentTime;
      const minutes = Math.floor(remainingTime / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);

      // 更新页面数据 

      item.newData = {
        minutes: this.formatTime(minutes),
        seconds: this.formatTime(seconds),
      };
      // console.log(remainingTime, 'remainingTime');
      // 如果倒计时为零，可以在这里执行相应的操作，例如取消订单或提醒用户
      if (remainingTime <= 0) {
        clearInterval(this.data.timer);
        // console.log('倒计时结束！');
        return;
      }
      // 更新页面数据
      this.setData({
        artcileList: artcileList
      });
      // console.log(this.data.artcileList)
    })
  },
  formatTime(time) {
    return time < 10 ? '0' + time : time;
  },
  // 切换tab
  change(e) {
    console.log(e, 'change');
    this.setData({
      indexId: e.currentTarget.dataset.id,
      page: 1,
      artcileList: []
    })
    this.gethomeArticleList()
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
    console.log('触底');
    if (this.data.switch) {

      this.setData({
        page: this.data.page + 1
      })
      console.log(this.data.page, 'ppppp');
      this.gethomeArticleList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
  //跳转详情页

  detail(e) {
    console.log(e.currentTarget.dataset.item.ticketsCode, 'e')
    if (e.currentTarget.dataset.item.ticketsType == 1) {
      wx.navigateTo({
        url: '/packageHome/pages/orderDetails/index?code=' + e.currentTarget.dataset.item.ticketsCode + '&type=1',
      })
    } else {
      wx.navigateTo({
        url: '/packageHome/pages/orderDetails/index?code=' + e.currentTarget.dataset.item.ticketsCode + '&type=2',
      })
    }

  },
  // 使用
  use(e) {
    let item = e.currentTarget.dataset.item
    console.log("item", item)

    //isOnlyIntervention  true是纯干预//纯干预
    //serviceComplete     true可以做筛查// 筛查间隔时间

    let useData = {
      prodId: item.serviceProductId,
      ticketsServiceCode: item.ticketsCode,
      ticketsEquityCode: item.ticketsCode
    }
    api.checkAgeRefund(useData).then(res => {
      let that = this
      if (res.code === 200) {
        that.getRefundStatus(item)

        // console.log(item, 'item.estimateServeCode');
        // if (item.estimateServeCode === "EDB-AD-LIET") {
        //   app.globalData.eyeGamesData = item;
        //   if(item.activityId){
        //     app.globalData.eyeGamesData.estimateOrderType = 1;
        //   }else{
        //     app.globalData.eyeGamesData.estimateOrderType = null;
        //   }
        // console.log(app.globalData.eyeGamesData,'app.globalData.eyeGamesData');
        //   wx.navigateTo({
        //     url: '../../../eyesGema/pages/index/index',
        //   })
        //   return
        // }
        // console.log(item.estimateServeCode, 'item.estimateServeCode');
        // if (item.estimateServeCode === "SMALL-GAME") {
        //   if(item.activityId){
        //     app.globalData.gamesDatas.estimateOrderType = 1;
        //   }else{
        //     app.globalData.gamesDatas.estimateOrderType = null;
        //   }
        //   app.globalData.gamesDatas = {
        //     estimateServeCode: item.estimateServeCode,
        //     estimateServeName: item.checkName,
        //     customPhone: item.phone,
        //     customName: item.clientName,
        //     orderNum: item.ticketsCode,
        //     ticketsServiceCode: item.ticketsCode,
        //   }
        //   wx.setStorageSync('ticketsServiceCode', item.ticketsCode)
        //   wx.setStorageSync('ticketsEquityCode', item.ticketsCode)
        //   wx.setStorageSync('strCode', 'ServiceCode')
        //   console.log(app.globalData.gamesDatas,'app.globalData.gamesDatas');
        //   wx.navigateTo({
        //     url: '/packageHome/pages/gameSku/testHome/index',
        //   })
        //   return
        // }
      } else {
        wx.showToast({
          icon: 'error',
          title: res.msg,
        })
      }
    })
  },
  //退款ticketsType
  refund(e) {
    console.log(e.currentTarget.dataset.item.ticketsType, 'e');
    this.setData({
      currentItem: e.currentTarget.dataset.item,
      popup: true,
      ticketType: e.currentTarget.dataset.item.ticketsType
    })
  },
  //电话咨询
  call(e) {
    wx.makePhoneCall({
      phoneNumber: '400-1852-5658'
    })
  },
  //去支付
  payment(e) {
    let {item} = e.currentTarget.dataset
    console.log(item.product, 'lll')
    this.setData({
      prodCode: item.product.prodCode,
      id: item.serviceProductId,
    })
    // 这是营销的 else 其他的
    if(item.activityId!= null){
      app.globalData.marketParams = item;
      wx.navigateTo({
        url: '/packageHome/pages/reportOrders/index',
      })
    }
    else{
      //调起支付
      let parmas = {
        totalFee: item.money,
        servName: item.product.prodName,
        describe: item.product.prodDescribe,
        clientResource: 1,
        outTradeNo:item.outTradeNo,
      }
      api.ServiceOrder(parmas).then(res => {
        if (res.code === 200) {
          wx.requestPayment({
            appId: res.data.appid,
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.packageWx,
            signType: res.data.signType,
            paySign: res.data.paySign,
            success(msg) {
              wx.navigateTo({
                url: '/packageHome/pages/success/index?outTradeNo=' + res.data.outTradeNo + '&type=serve'
              })
            },
            fail(msg) {
              wx.showToast({
                icon: 'none',
                title: '确定取消支付?订单30分钟内未支付将被取消。',
              })
            }
          })
        } else {
          wx.showToast({
            icon: 'error',
            title: res.msg,
          })
        }
      })



    }
  },
  // 取消
  cancel() {
    this.setData({
      popup: false
    })
  },
  // 确认
  verify: util.debounce(function () {
    this.setData({
      popup: false,
    })
    let data = {
      money: this.data.currentItem.money,
      outTradeNo: this.data.currentItem.outTradeNo,
      reason: '',
      refundMoney: this.data.currentItem.money,
      ticketId: this.data.currentItem.ticketsCode,
      ticketType: this.data.ticketType,
    }
    api.createRefund(data).then(res => {
      if (res.code === 200) {
        wx.showToast({
          icon: 'success',
          title: '申请退款成功',
        })
        this.setData({
          page: 1
        })
        this.gethomeArticleList()
      } else {
        wx.showToast({
          icon: 'error',
          title: res.msg,
        })
      }
    })
  }, 500),
  //使用
  getRefundStatus(e) {
    // console.log(e.currentTarget.dataset,'e.currentTarget.dataset.item');
    //isOnlyIntervention  true是纯干预//纯干预
    //serviceComplete     true可以做筛查// 筛查间隔时间
    console.log(e, 'eeee')
    let item = e;
    console.log(item, 'item');
    console.log(item.ticketsBookingCode, 'item.ticketsBookingCode');
    api.checkInterTime({
      ticketCode: item.ticketsCode
    }).then(res => {
      console.log(res)
      this.setData({
        isShowicon: true,
      })
      if (res.code === 200) {
        this.setData({
          isShowicon: false,
        })
        // 干预是否生成报告
        if (res.data.isOnlyIntervention) {
          let that = this;
          that.setData({
            isSuccessful: true,
          })
          // wx.showModal({
          //   title: '提示',
          //   content: '当前已为您生成干预方案，干预周期为：' + res.data.interventionBeginTime + "至" + res.data.interventionEndTime,
          //   cancelText: '去训练',
          //   success(res) {
          //     if (res.confirm) {
          //       console.log('用户点击确定')
          //       that.setData({
          //         pageNum: 1,
          //         tab: 3,
          //         setMeal: [],
          //         equity: '',
          //       })
          //       that.getPageQuery()
          //     } else if (res.cancel) {
          //       wx.switchTab({
          //         url: '/page/brain/index'
          //       })
          //     }
          //   }
          // })
        }
        if (res.data.serviceComplete) {
          if (item.status === 2 || item.status === 9) {
            if (item.estimateServeCode) {
              console.log(e, '8333')
              if (item.estimateServeCode === "EDB-AD-LIET") {
                if (item.activityId) {
                  app.globalData.eyeGamesData.estimateOrderType = 1;
                } else {
                  app.globalData.eyeGamesData.estimateOrderType = null;
                }
                if (item.status == 2 || item.status == 9) {
                  app.globalData.eyeGamesData = item;
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
              } else if (item.estimateServeCode === "SMALL-GAME") {
                if (item.activityId) {
                  app.globalData.gamesDatas.estimateOrderType = 1;
                } else {
                  app.globalData.gamesDatas.estimateOrderType = null;
                }
                if (item.status == 2 || item.status == 9) {
                  app.globalData.gamesDatas = {
                    estimateServeCode: item.checkService,
                    estimateServeName: item.checkServiceName,
                    customPhone: item.phone,
                    customName: item.clientName,
                    orderNum: '',
                    ticketsServiceCode: item.ticketsBookingCode,
                  }
                  console.log(JSON.stringify({
                    estimateServeCode: item.checkService,
                    estimateServeName: item.checkServiceName,
                    customPhone: item.phone,
                    customName: item.clientName,
                    orderNum: '',
                    ticketsServiceCode: item.ticketsBookingCode,
                  }) + '缓存数据111')
                  wx.setStorageSync('ticketsEquityCode', item.ticketsBookingCode)
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
              } else if (item.estimateServeCode == "AD-8-LIET") {
                if (item.status == 2 || item.status == 9) {
                  app.globalData.serverInfo = {
                    ticketsBookingCode: item.ticketsCode,
                    clientId:item.archivesNo,
                    clientName:item.clientName,
                    phone:item.phone,
                    estimateNum:'',
                    checkService:item.estimateServeCode,
                    status:'',
                  }
                  wx.redirectTo({
                    url: '../../../packageScale/pages/ad8Index/index?outBack=3&str=' + this.data.indexId,
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
                url: '/packageHome/pages/equityList/index?code=' + item.ticketsCode,
              })
            }

          } else {
            //详情
            wx.navigateTo({
              url: '/packageHome/pages/equityDetails/index?code=' + item.ticketsCode + '&type=3',
            })
          }
        } else {
          if (!res.data.isOnlyIntervention) {
            wx.showToast({
              icon: 'none',
              title: '筛查间隔不足',
              duration: 3000,
            });
          }
        }
      } else if (res.code == 2049) {
        // wx.showToast({
        //   icon: 'none',
        //   title: '请至少完成一次脑健康筛查后~',
        //   duration: 5000,
        // });
        this.setData({
          isFailure: true,
          isShowicon:false
        })
      } else {
        // wx.showToast({
        //   icon: 'none',
        //   title: res.msg,
        //   duration: 3000,
        // });
         this.setData({
              isFailure: true,
              isShowicon:false
            })
      }
    })
  },
  changePage() {
    this.setData({
      isFailure: false,
    })
  },
  nextPage(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  confirm() {
    this.setData({
      isSuccessful: false,
      page: 1,
      indexId: 2,
      artcileList: [],
      equity: '',
    })
    this.gethomeArticleList()
  },
  cancel() {
    wx.switchTab({
      url: '/page/brain/index'
    })
  },
})