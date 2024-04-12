const app = getApp()
const api = require('../../../http/api.js');
Page({
  data: {
    ossImg: app.globalData.ossImgUrl,
    outTradeNo: '',
    orderData: {},
    isShowModel: false,
    isShowCoupon: false,
    isShowSuccess: false,
    isShowfail: false,
    amountPrice: 0,
    fullPrice: 0,
    timer: null,
    countdown: {
      hours: 0,
      minutes: 0,
      seconds: 0
    }
  },
  onLoad(options) {
    console.log(options.outTradeNo)
    console.log(app.globalData.gamesDatas)
    this.setData({
      outTradeNo: options.outTradeNo
    })
  },
  getOrderInfo() {
    let data = {
      activityId: 88,
      activityMarketingId: app.globalData.marketParams.activityMarketingId,
    }
    api.getMarketingConfirm(data).then((res) => {
      console.log(res)
      if (res.code === 200) {
        let amout = 0;
        let amountPrice = 0;
        let fullPrice = 0;
        if (!res.data.prepayId) {
          // prepayId=false没有进行预支付
          if (res.data.discountPayUse === 0) {
            // iscountPayUse=0没有分享过
            if (res.data.shareTimes === 3) {
              amout = 30;
              fullPrice = 30;
              this.setData({
                isShowModel: true,
                isShowCoupon: true,
                isShowfail: false,
                isShowSuccess: false,
              })
              console.log(amountPrice)
              amountPrice = Number(res.data.activityPrice - amout).toFixed(2)
            } else {
              amountPrice = Number(res.data.activityPrice)
              fullPrice = 0;
              this.setData({
                isShowModel: false,
              })
            }
            console.log(amountPrice)
          } else {
            fullPrice = 0;
            amountPrice = Number(res.data.money)
            this.setData({
              isShowModel: false,
              isShowCoupon: false,
              isShowfail: false,
              isShowSuccess: false,
            })
          }
        } else {
          amountPrice = Number(res.data.money)
          fullPrice = res.data.discount;
          this.setData({
            isShowModel: false,
            isShowCoupon: false,
            isShowfail: false,
            isShowSuccess: false,
          })
        }
        console.log(amountPrice, '这是合计价格')
        console.log(fullPrice, '这是优惠价格')
        this.setData({
          orderData: res.data,
          closeTimeMills: res.data.closeTimeMills * 1000,
          amountPrice: amountPrice,
          prepayId: res.data.prepayId,
          outTradeNo: res.data.outTradeNo,
          fullPrice: fullPrice
        }, () => {
          if (this.data.closeTimeMills) {
            const currentTime = new Date().getTime();
            const remainingTime = this.data.closeTimeMills - currentTime;
            if (remainingTime <= 0) {
              clearInterval(this.timer);
              this.setData({
                isShowModel: true,
                isShowfail: true,
                isShowCoupon: false,
                isShowSuccess: false,
              })
              return;
            }
            // 更新倒计时显示
            this.updateCountdown(this.data.closeTimeMills);
            this.timer = setInterval(() => {
              this.updateCountdown(this.data.closeTimeMills);
            }, 1000);
          }
        })
      }
    })
  },
  updateCountdown(orderTimestamp) {
    const currentTime = new Date().getTime();
    const remainingTime = orderTimestamp - currentTime;
    if (remainingTime <= 0) {
      clearInterval(this.timer);
      console.log('倒计时结束！');
      this.setData({
        isShowModel: true,
        isShowfail: true
      })
      return;
    }
    const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    this.setData({
      countdown: {
        hours: this.formatTime(hours),
        minutes: this.formatTime(minutes),
        seconds: this.formatTime(seconds)
      }
    });
  },
  formatTime(time) {
    return time < 10 ? '0' + time : time;
  },
  shareBtn() {
    let that = this
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline'],
      success(res) {
        // 分享成功
        console.log('分享成功:showShareMenu');
        console.log(res);
        that.setShareNum()
      },
      fail(e) {
        // 分享失败
        console.log(res)
      }
    })
  },
  setShareNum() {
    let data = {
      activityId: 88,
      activityMarketingId: app.globalData.marketParams.activityMarketingId,
      id: this.data.sceneId ? this.data.sceneId : null,
    }
    api.getRecordingShares(data).then((res) => {
      console.log(res)
      if (res.code === 200) {

      }
    })
  },
  payOrder() {
    let that = this
    if (!that.data.orderData.shareTimes) {
      wx.showModal({
        title: '确认支付提示：',
        content: '🌟 恭喜您！获得好友分享福利！🎉 现在只需轻松分享给3位好友，即可享受立减30元的超值优惠！✨',
        confirmText: '我要优惠',
        cancelText: '原价购买',
        success(res) {
          // 我要优惠-停留在本页面
          if (res.confirm) {
            // 我要优惠-停留在本页面
          } else if (res.cancel) {
            // 原价购买-调起支付
            that.getPay()
          }
        }
      })
    } else {
      that.getPay()
    }
  },
  getPay() {
    let that = this
    console.log(app.globalData.gamesDatas)
    let prePrice = null;
    if (!that.data.orderData.discountPayUse) {
      // discountPayUse=0没有分享过
      if (that.data.prepayId) {
        // 生成过工单
        prePrice = 0;
      } else {
        prePrice = that.data.orderData.shareTimes === 3 ? 30 : 0;
      }
    } else {
      prePrice = 0;
    }
    console.log(prePrice)
    console.log(that.data.orderData.activityPrice)
    console.log(that.data.orderData.activityPrice - Number(prePrice))
    let parmas = {
      clientResource: 1,
      activityId: 88,
      discount: prePrice ? prePrice : null,
      activityChannel: app.globalData.marketParams.activityChannel ? app.globalData.marketParams.activityChannel : 'null',
      activityMarketingId: app.globalData.gamesDatas.activityMarketingId ? app.globalData.gamesDatas.activityMarketingId : app.globalData.marketParams.activityMarketingId,
      estimateNum: app.globalData.estimateNum ? app.globalData.estimateNum : null,
      price: Number(that.data.orderData.activityPrice), //原价
      describe: app.globalData.gamesDatas.describe ? app.globalData.gamesDatas.describe : that.data.orderData.product.prodDescribe, //描述不能太长，否则报错
      money: Number(that.data.orderData.activityPrice - prePrice).toFixed(2), //优惠后的价格
      openId: app.globalData.openId ? app.globalData.openId : wx.getStorageSync('openId'),
      payWay: 2,
      purchaserPhone: app.globalData.gamesDatas.customPhone ? app.globalData.gamesDatas.customPhone : wx.getStorageSync('phone'),
      servName: app.globalData.gamesDatas.servName ? app.globalData.gamesDatas.servName : that.data.orderData.product.prodName,
      serviceProductId: app.globalData.gamesDatas.serviceProductId ? app.globalData.gamesDatas.serviceProductId : that.data.orderData.product.id,
      totalFee: Number(that.data.orderData.activityPrice - prePrice).toFixed(2), //优惠后的价格
      purchaser: app.globalData.gamesDatas.customName ? app.globalData.gamesDatas.customName : '小游戏',
      outTradeNo: that.data.outTradeNo ? that.data.outTradeNo : app.globalData.marketParams.outTradeNo,
      step: 1,
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
            console.log(that.data)
            that.setData({
              isShowModel: true,
              isShowSuccess: true,
              isShowCoupon: false,
              isShowfail: false
            })
            console.log(that.data)
          },
          fail(msg) {
            wx.showToast({
              icon: 'error',
              title: '支付失败！',
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
  },
  onReady() {

  },
  onShow() {
    this.getOrderInfo()
  },
  // 优惠券到账模态框图片显示
  closeModel() {
    this.setData({
      isShowModel: false,
      isShowCoupon: false
    })
  },
  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/page/home/index',
    })
  },
  // 查看报告
  goReportInfo() {
    wx.reLaunch({
      url: '/packageHome/pages/newReport/index',
    })
  },
  // 重新测试
  goRetest() {
    wx.redirectTo({
      url: '/packageHome/pages/marketing/index',
    })
  },
  onUnload() {
    clearInterval(this.timer);
  },
  onShareAppMessage() {
    //自定义信息
    return {
      title: '和我比比谁的大脑更健康',
      path: '/packageHome/pages/marketing/index',
      imageUrl: app.globalData.ossImgUrl + "share-bg.png",
      success(res) {
        console.log("分享success()");
        console.log("onShareAppMessage()==>>转发成功", res);
        //分享的是群还是个人
      },
      fail: (res) => {
        console.log("onShareAppMessage()==>>转发失败", res);
      }
    }
  },
})