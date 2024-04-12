const app = getApp()
const api = require('../../http/api.js');
Page({
  data: {
    skip: '',
    show: false,
    indexId: '',
    ossImg: app.globalData.ossImgUrl,
    list: [{
      id: '1',
      imgUrl: app.globalData.ossImgUrl + 'homebg2.png'
    }],
    titleList: [{
        id: 0,
        imgUrl: app.globalData.ossImgUrl + 'report-answerbg.png',
        title: '报告查询',
        text: 'AI智能解读·个性认知报告',
        url: '/packageHome/pages/newReport/index?long=0',
        type: '2'
      },
      {
        id: 1,
        imgUrl: app.globalData.ossImgUrl + 'equity-activabg.png',
        title: '权益激活',
        text: '解锁尊享专属',
        url: '/packageHome/pages/interests/index',
        type: '1'
      },
    ],
    icoList: [{
        id: 0,
        imgUrl: app.globalData.ossImgUrl + 'service-prodbg.png',
        title: '健康商城',
        text: '智测脑健康',
        url: '/packageHome/pages/serve/index'
      },
      {
        id: 1,
        imgUrl: app.globalData.ossImgUrl + 'online-reserbg.png',
        title: '服务预约',
        text: '专业快捷体验',
        url: '/packageHome/pages/selective/index'
      },
      {
        id: 0,
        imgUrl: app.globalData.ossImgUrl + 'offline-institbg.png',
        title: '线下机构',
        text: '信息查询入口',
        url: '/packageHome/pages/organization/index'
      }
    ],
    artcileList: [],
    serveTypeList: [],
    serveTypeActive: 0,
    serveList: [{
        id: 0,
        imgUrl: app.globalData.ossImgUrl + 'handbg2.png',
        title: '认知功能评估（Moca-B）',
        text1: '足不出户预约',
        text2: '干预方案定定制化（月）',
        count: '199',
      },
      {
        id: 1,
        imgUrl: app.globalData.ossImgUrl + 'handbg2.png',
        title: '认知功能评估（Moca-B）',
        text1: '足不出户预约',
        text2: '干预方案定定制化（月）',
        count: '199',
      },
      {
        id: 2,
        imgUrl: app.globalData.ossImgUrl + 'handbg2.png',
        title: '认知功能评估（Moca-B）',
        text1: '足不出户预约',
        text2: '干预方案定定制化（月）',
        count: '199',
      }
    ],
    artcileTypeList: [],
    oneInfo: '',
    latitude: '', //经度
    longitude: '', //纬度
    addInfoShow: false, //建档弹框
    personList: '',
    recommended: false, //服务推荐隐藏
    distinguish: '', //区分:0线上,1权益, 2服务，3筛查报告
    isShowMarket: false,
  },
  onReady() {
    // 查看是否授权
    // let that = this
    // wx.getSetting({
    //   success(res) {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称
    //       wx.login({
    //         success(res) {
    //           console.log(res.code)
    //           that.bindGetUserInfo(res.code)
    //         }
    //       })
    //     }
    //   }
    // })
  },

  onLoad() {
    let that = this
    that.getServiceRecommend()
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        that.setData({
          latitude: res.latitude, //经度
          longitude: res.longitude, //纬度
        })
      }
    })
  },
  //静默授权
  bindGetUserInfo(val) {
    api.getUserInfo({
      code: val
    }).then((res) => {
      if (res.data.openId != null) {
        app.globalData.openId = res.data.openId
        wx.setStorageSync("openId", res.data.openId)
        console.log(app.globalData)
      }
      if (res.data.token != null) {
        wx.setStorageSync("token", res.data.token)
      }
      if (res.data.phone != null) {
        wx.setStorageSync('phone', res.data.phone)
      }
      // this.getArchivesNo()
    })
  },
  // 建档
  toAddinfo() {
    this.setData({
      addInfoShow: false
    })
    console.log(this.data.distinguish)
    wx.navigateTo({
      url: '/page/my/infoEdit/index?str=' + this.data.distinguish + '&latitude=' + this.data.latitude + '&longitude=' + this.data.longitude
    })
  },
  // 取消
  deleteinfo() {
    this.setData({
      addInfoShow: false
    })
  },
  // 跳转营销
  goMarket() {
    // this.setData({
    //   distinguish: 13,
    //   addInfoShow: true
    // })
    wx.navigateTo({
      url: '/packageHome/pages/marketing/index'
    })
  },
  //跳转
  turnTo(e) {
    console.log(e.currentTarget.dataset.item.title,'e.currentTarget.dataset.item.title');
    //0线上,1权益, 2服务，3筛查报告
    if (e.currentTarget.dataset.item.title == '权益激活') {
      this.setData({
        distinguish: 1
      })
    } else {
      console.log('2222');
      this.setData({
        distinguish: 11
      })
    }
    if (wx.getStorageSync('token') != '') {
      api.getCheckArch({
        phone: wx.getStorageSync('phone')
      }).then((res) => {
        if (res.code == 200) {
          if (res.data != null) {
            wx.setStorageSync('archivesNo', res.data)
            wx.navigateTo({
              url: e.currentTarget.dataset.item.url
            })
          } else {
            this.setData({
              addInfoShow: true,
              distinguish: 1, //筛查
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/page/login/start/index?pageUrl=' + e.currentTarget.dataset.item.url + '&str=' + this.data.distinguish,
      })
    }
  },
  onShow() {
    this.getCategory()
    this.getMarket()
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 0
      })
    }
  },
  //点击跳转
  click(e) {
    if (e.currentTarget.dataset.item.title == '健康商城') {
      wx.navigateTo({
        url: e.currentTarget.dataset.item.url + '?type=tc',
      })
    } else if (e.currentTarget.dataset.item.title == '线下机构') {
      wx.navigateTo({
        url: e.currentTarget.dataset.item.url + '?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude + '&url=list',
      })
    } else if (e.currentTarget.dataset.item.title == '服务预约') {
      if (wx.getStorageSync('token') != '') {
        api.getCheckArch({
          phone: wx.getStorageSync('phone')
        }).then((res) => {
          if (res.code == 200) {
            if (res.data != null) {
              wx.setStorageSync('archivesNo', res.data)
              wx.navigateTo({
                url: e.currentTarget.dataset.item.url + '?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude
              })
            } else {
              this.setData({
                addInfoShow: true,
                distinguish: 0 //线上
              })
            }
          }
        })
      } else {
        wx.navigateTo({
          url: '/page/login/start/index?pageUrl=' + e.currentTarget.dataset.item.url + '&latitude=' + this.data.latitude + '&longitude=' + this.data.longitude + '&str=0',
        })
      }
    }
  },
  // 获取营销活动是否启用
  getMarket() {
    api.getQueryStatus({
      activityId: 88,
    }).then((res) => {
      console.log(res)
      if (res.code === 200) {
        app.globalData.marketParams = res.data;
        console.log(app.globalData.marketParams)
        this.setData({
          isShowMarket: true
        })
      } else {
        this.setData({
          isShowMarket: false
        })
      }
    })
  },
  // 跳转商品详情
  goCommodityDetails(e) {
    wx.navigateTo({
      url: `../../packageMy/pages/detail/index?id=${e.currentTarget.dataset.id}`
    })
  },
  //  获取首页服务推荐
  getServiceRecommend() {
    api.homeServiceList({
      pageNum: 1,
      pageSize: 6,
    }).then(res => {
      if (res.data == null) {
        this.setData({
          show: false
        })
      } else if (res.data.data.length > 0) {
        this.setData({
          serveList: res.data.data,
          show: true
        })
      }
    })
  },
  // 获取文章分类
  getCategory() {
    api.homeArticleCategory({
      pageNum: 0,
      pageSize: 10,
      statusList: []
    }).then((res) => {
      if (res.code === 200) {
        this.setData({
          artcileTypeList: res.data.data
        })
        if (res.data.data.length > 0 || res.data.total > 0) {
          let that = this
          if (res.data.data.some(function (item, index) {
              return item.id == that.data.indexId
            })) {
            that.gethomeArticleList()
          } else {
            that.setData({
              indexId: res.data.data[0].id
            })
            that.gethomeArticleList()
          }
        }
      }
    })
  },
  // 获取文章列表
  gethomeArticleList() {
    api.homeArticleList({
      pageNum: 1,
      pageSize: 50,
      articleTypeList: [],
      recommend: 1,
    }).then(res => {
      if (res.code == 200) {
        if (res.data.data.length > 0) {
          this.setData({
            artcileList: res.data.data
          })
        } else {
          this.setData({
            oneInfo: '',
            artcileList: []
          })
        }
      }
    })
  },
  // 资讯科普切换tab
  change(e) {
    this.setData({
      indexId: e.currentTarget.dataset.id
    })
    this.gethomeArticleList()
  },

  onRouteDone() {
    app.globalData.sceneParams = {};
    console.log(app.globalData.sceneParams, '清空二维码参数')
  },
  //跳转文章详情页
  articleDetail(e) {
    if (e.currentTarget.dataset.id != undefined) {
      wx.navigateTo({
        url: '/packageHome/pages/article/index?id=' + e.currentTarget.dataset.id,
      })
    }
  },
})