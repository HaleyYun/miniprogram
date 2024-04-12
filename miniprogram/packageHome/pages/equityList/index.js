const app = getApp()
const api = require('../../../http/api.js')

Page({
  data: {
    ossImg: app.globalData.ossImgUrl,
    ticketCode: '',
    data: [],
    loadStatus: '',
    isShowModel:app.globalData.isShowModel,
    isShow:false,
    isSupport:false,
    schedule: 0, //加载中进度
    timer: null,
    checkService:null,
  },
  onLoad(options) {
    console.log(options,'options');

    if(options.back){
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
    // app.globalData.isShowModel=true
    console.log(options,'llll');
    console.log(app.globalData.isShow,' app.globalData.isShow');
    console.log(options.code,'options.code');
    this.setData({
      ticketCode: options.code,
    })
    this.getlist()
  },
  getlist() {
    api.equityList({
      ticketCode: this.data.ticketCode
    }).then(res => {
      console.log(res)
      if (res.code === 200) {

        app.globalData.isShow=Boolean(res.data.checkOver)//是否全部做完
        if (!res.data.checkService.length) {
          this.setData({
            loadStatus: 'noData',
          })
        }
        this.setData({
          data: res.data.checkService
        })
      } else {
        this.setData({
          loadStatus: 'failure',
          data: []
        })
      }
    })
  },
  goGame(e) {
    let item = e.currentTarget.dataset.id;
    console.log(e.currentTarget.dataset);
    console.log(e,'8')
    app.globalData.checkService=item.checkService
    console.log(app.globalData.checkService,'lll');
    if (item.checkService === "EDB-AD-LIET") {
      wx.setStorageSync('ticketsEquityCode', e.currentTarget.dataset.id.ticketsBookingCode)
      console.log(e.currentTarget.dataset.id,'e.currentTarget.dataset.id');
      wx.setStorageSync('strCode', 'EquityCode')
      if (item.status == 1 || item.status == 4) {
        app.globalData.eyeGamesData = item;
        app.globalData.eyeGamesData.estimateOrderType = null;
        wx.redirectTo({
          url: '../../../eyesGema/pages/index/index',
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '状态不可用',
          duration: 3000,
        });
      }
    }else if (item.checkService === "AD-8-LIET") {
      if (item.status == 0 || item.status == 1) {
        app.globalData.serverInfo = item;
        wx.redirectTo({
          url: '../../../packageScale/pages/ad8Index/index?outBack=1' + '&ticketCode=' + this.data.ticketCode,
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '状态不可用',
          duration: 3000,
        });
      }
    }else {
      if (item.status == 1 || item.status == 4) {
        app.globalData.gamesDatas = {
          estimateServeCode: item.checkService,
          estimateServeName: item.checkServiceName,
          customPhone: item.phone,
          customName: item.clientName,
          orderNum: '',
          ticketsEquityCode: item.ticketsBookingCode,
        }
        console.log(JSON.stringify({
          estimateServeCode: item.checkService,
          estimateServeName: item.checkServiceName,
          customPhone: item.phone,
          customName: item.clientName,
          orderNum: '',
          ticketsEquityCode: item.ticketsBookingCode,
        })   + '缓存数据111')
        wx.setStorageSync('ticketsEquityCode', e.currentTarget.dataset.id.ticketsBookingCode)
        wx.setStorageSync('strCode', 'EquityCode')
        app.globalData.gamesDatas.estimateOrderType = null;
        wx.redirectTo({
          url: '/packageHome/pages/gameSku/testHome/index',
        })
      } else {
        wx.showToast({
          icon: 'none',
          title: '状态不可用',
          duration: 3000,
        });
      }
    }
  },
  onHide() {
    clearTimeout(this.data.timer)
  },
  onUnload() {
    clearTimeout(this.data.timer)

  },
})