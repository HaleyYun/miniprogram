const app = getApp()
const api = require('../../../http/api.js');
Page({
  data: {
    ossImg: app.globalData.ossImgUrl,
    addInfoShow: false, //建档弹框
    sceneId: null,
    isShowMarket: false,
    msg: ''
  },
  onLoad(options) {
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      let sceneParams = {};
      sceneParams = this.parseScene(scene);
      app.globalData.sceneParams.sceneId = sceneParams.id
      console.log(sceneParams)
      this.setData({
        sceneId: sceneParams.id
      })
    }
    if (this.data.sceneId) {
      let data = {
        id: this.data.sceneId
      }
      this.getMarket(data)
    } else {
      let data = {
        activityId: 88,
      }
      this.getMarket(data)
    }
  },
  onShow() {
    this.getAddNumber()
    console.log(this.data.sceneId)
    // if (!this.data.sceneId) {
    //   let data = {
    //     activityId: 88,
    //   }
    //   this.getMarket(data)
    // }
  },
  goDetail() {
    if (wx.getStorageSync('token') != '') {
      api.getCheckArch({
        phone: wx.getStorageSync('phone')
      }).then((res) => {
        if (res.code == 200) {
          if (res.data != null) {
            this.getcheck()
          } else {
            this.setData({
              distinguish: 14,
              addInfoShow: true
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/page/login/start/index?pageUrl=' + '/packageHome/pages/marketing/index&str=' + 13,
      })
    }
  },
  // 获取营销活动是否启用
  getMarket(data) {
    console.log('第一次进来')
    api.getQueryStatus(data).then((res) => {
      console.log(res)
      if (res.code === 200) {
        app.globalData.marketParams = res.data;
        this.setData({
          isShowMarket: true
        })
      } else {
        this.setData({
          isShowMarket: false,
          msg: res.msg
        })
        wx.showToast({
          icon: 'error',
          title: res.msg,
        })
      }
    })
  },
  // 增加人数接口
  getAddNumber() {
    api.getPeopleNumber({
      id: 88
    }).then((res) => {
      if (res.code === 200) {
        console.log('成功')
      }
    })
  },
  getcheck() {
    if (this.data.isShowMarket) {
      let data = {
        activityId: 88,
        activityMarketingId: app.globalData.marketParams.activityMarketingId,
        id: this.data.sceneId ? this.data.sceneId : null,
      }
      api.getQueryWaitPay(data).then((res) => {
        console.log(res)
        if (res.code === 200) {
          if (res.data) {
            console.log(app.globalData.marketParams)
            //data=true说明存在待支付订单，跳转到订单支付页面
            wx.navigateTo({
              url: '/packageHome/pages/reportOrders/index',
            })
          } else {
            //data=false说明未存在待支付订单，跳转到眼动或者小游戏
            this.getPardata(data)
          }
        } else {
          wx.showToast({
            title: res.msg,
          })
        }
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: this.data.msg,
      })
    }
  },
  getPardata(data) {
    api.getActParms(data).then((res) => {
      if (res.code === 200) {
        console.log(res)
        if (res.data.estimateServeCode === 'EDB-AD-LIET') {
          app.globalData.eyeGamesData = res.data;
          app.globalData.eyeGamesData.estimateOrderType = 1;
          // 跳转眼动
          wx.navigateTo({
            url: '../../../eyesGema/pages/index/index'
          })
        } else {
          app.globalData.gamesDatas = res.data;
          app.globalData.gamesDatas.estimateOrderType = 1;
          // 跳转小游戏
          wx.navigateTo({
            url: '/packageHome/pages/gameSku/testHome/index'
          })
        }
      }
    })
  },
  // 建档
  toAddinfo() {
    this.setData({
      distinguish: 13,
      addInfoShow: false
    })
    wx.navigateTo({
      url: '/page/my/infoEdit/index?str=' + this.data.distinguish
    })
  },
  // 取消
  deleteinfo() {
    this.setData({
      addInfoShow: false
    })
  },
  parseScene(scene) {
    const sceneParams = {};
    scene.split('&').forEach(param => {
      const [key, value] = param.split('=');
      sceneParams[key] = Number(value);
    });
    console.log(sceneParams.id, '二维码参数解析权益id');
    return sceneParams
  }
})