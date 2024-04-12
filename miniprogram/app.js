const config = require('./config')
const themeListeners = []
global.isDemo = true
App({
  //全局变量
  globalData: {
    appid: "wx8e2f798e37243e6d",
    theme: wx.getSystemInfoSync().theme,
    openId: null,
    eyeGamesStepData: [],
    eyeGamesStepIndex: 0,
    eyeGamesData: {},
    eyeGameEstimateNum: "",
    gamesDatas: {},
    sceneParams: {},
    marketParams: {},
    serverInfo: {},
    checkService:'',
    isShowModel:false,
    isShow:false,
    select:'',//选中
    which:'',//判断CNIDE是从哪里跳转的
    eyeGamesType:null
  },
  onLaunch(opts, data) {
    console.log('App Launch', opts)
    if (data && data.path) {
      wx.navigateTo({
        url: data.path,
      })
    }
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: config.envId,
        traceUser: true,
      })
    }
  },
  onShow(opts) {
    wx.setInnerAudioOption({
      mixWithOther: false,
      obeyMuteSwitch: false
    })
    console.log('App Show', opts)
    console.log(wx.getAccountInfoSync())
    const env = wx.getAccountInfoSync().miniProgram.envVersion
    console.log(env)
    wx.setKeepScreenOn({
      keepScreenOn: true,
      fail() { //如果失败 再进行调用
        wx.setKeepScreenOn({
          keepScreenOn: true
        });
      }
    });
    //开发环境
    if (env == 'develop') {
      const config = require('./config.test')
      this.globalData.taber = config.taber
      this.globalData.apiBaseUri = config.apiBaseUri
      this.globalData.ossImgUrl = config.ossImgUrl //测试oss地址
      this.globalData.ossGamesImgUrl = config.ossGamesImgUrl //测试oss地址
      this.globalData.brainApiUrl = config.brainApiUrl //脑吾脑游戏测试地址
      this.globalData.gameUrl = config.gameUrl //图片识别游戏测试地址
      this.globalData.uploadUrl = config.uploadUrl //上传头像测试地址
      this.globalData.reportUrl = config.reportUrl //报告整合系统测试地址
      this.globalData.orderCode = config.orderCode //报告整合系统测试地址
    }
    //体验环境
    if (env == 'trial') {
      const config = require('./config.test')
      this.globalData.taber = config.taber
      this.globalData.apiBaseUri = config.apiBaseUri
      this.globalData.ossImgUrl = config.ossImgUrl //测试oss地址
      this.globalData.ossGamesImgUrl = config.ossGamesImgUrl //测试oss地址
      this.globalData.brainApiUrl = config.brainApiUrl //脑吾脑游戏测试地址
      this.globalData.gameUrl = config.gameUrl //图片识别游戏测试地址
      this.globalData.uploadUrl = config.uploadUrl //上传头像测试地址
      this.globalData.reportUrl = config.reportUrl //报告整合系统测试地址
    }
    //正式环境
    if (env == 'release') {
      const config = require('./config.production')
      this.globalData.taber = config.taber
      this.globalData.apiBaseUri = config.apiBaseUri
      this.globalData.ossImgUrl = config.ossImgUrl //正式oss地址
      this.globalData.ossGamesImgUrl = config.ossGamesImgUrl //正式oss地址
      this.globalData.brainApiUrl = config.brainApiUrl //脑吾脑游戏正式地址
      this.globalData.gameUrl = config.gameUrl //图片识别游戏正式地址
      this.globalData.uploadUrl = config.uploadUrl //上传头像正式地址
      this.globalData.reportUrl = config.reportUrl //报告整合系统正式地址
    }
    this.wxLogin()
  },
  onHide() {
    console.log('App Hide')
  },
  onThemeChange({
    theme
  }) {
    this.globalData.theme = theme
    themeListeners.forEach((listener) => {
      listener(theme)
    })
  },
  watchThemeChange(listener) {
    if (themeListeners.indexOf(listener) < 0) {
      themeListeners.push(listener)
    }
  },
  unWatchThemeChange(listener) {
    const index = themeListeners.indexOf(listener)
    if (index > -1) {
      themeListeners.splice(index, 1)
    }
  },
  // lazy loading openid
  getUserOpenId(callback) {
    const self = this
    if (self.globalData.openid) {
      callback(null, self.globalData.openid)
    } else {
      wx.login({
        success(data) {
          wx.cloud.callFunction({
            name: 'login',
            data: {
              action: 'openid'
            },
            success: res => {
              console.log('拉取openid成功', res)
              self.globalData.openid = res.result.openid
              callback(null, self.globalData.openid)
            },
            fail: err => {
              console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
              callback(res)
            }
          })
        },
        fail(err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          callback(err)
        }
      })
    }
  },
  // 通过云函数获取用户 openid，支持回调或 Promise
  getUserOpenIdViaCloud() {
    return wx.cloud.callFunction({
      name: 'wxContext',
      data: {}
    }).then(res => {
      this.globalData.openid = res.result.openid
      return res.result.openid
    })
  },

  // 静默获取openid, 然后从服务器拉取wx_account信息
  wxLogin() {
    const self = this
    wx.login({
      success(wxres) {
        let code = wxres.code;
        wx.request({
          url: self.globalData.apiBaseUri + '/app/wechat/getUserInfo',
          method: 'POST',
          data: {
            code: code
          },
          timeout: 6000,
          header: {
            'content-type': 'application/json', // 默认值
            'token': wx.getStorageSync('token') ? wx.getStorageSync('token') : '',
          },
          success: (res) => {
            console.log(res)
            if (res.data.data.openId) {
              self.globalData.openId = res.data.data.openId
              wx.setStorageSync("openId", res.data.data.openId)
              wx.setStorageSync("token", res.data.data.token != null ? res.data.data.token : wx.getStorageSync('token'))
              wx.setStorageSync('phone', res.data.data.phone != null ? res.data.data.phone : wx.getStorageSync('phone'))
            }
          },
          fail: (err) => {
            reject(err)
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      },
    });
  },
  getIsIPhoneX: function () {
    let isIPhoneX = this.globalData.isIPhoneX;
    return new Promise((resolve, reject) => {
      if (isIPhoneX !== null) {
        resolve(isIPhoneX);
      } else {
        wx.getSystemInfo({
          success: ({
            model,
            screenHeight
          }) => {
            const iphoneX = /iphone x/i.test(model);
            const iphoneNew = /iPhone11/i.test(model);
            isIPhoneX = iphoneX || iphoneNew;
            resolve(isIPhoneX);
          },
          fail: reject
        });
      }
    });
  },


})