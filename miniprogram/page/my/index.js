const app = getApp()
const api = require('../../http/api.js')
const util = require('../../util/util')
Page({
  data: {
    addInfoShow: false,
    ossImg: app.globalData.ossImgUrl,
    userInfo: {},
    userName: '',
    age: '66',
    gender: '',
    statusBarHeight: 44,
    phone: '',
    passwordType: false, // 切换是否密码框
    show_pass: true, // 是否显示密码
    isShowModel: false,
    employeeId: null,
    account: '',
    password: '',
    //干预09，预约08，服务07
    orderList: [{
        imgUrl: app.globalData.ossImgUrl + 'order-bg1.png',
        type: 1,
        etype: 10,
        name: '待支付',
        url: '/packageHome/pages/meal/index',
      },
      {
        imgUrl: app.globalData.ossImgUrl + 'order-bg2.png',
        type: 2,
        etype: 10,
        name: '待使用',
        url: '/packageHome/pages/meal/index',
      },
      {
        imgUrl: app.globalData.ossImgUrl + 'order-bg3.png',
        type: 9,
        etype: 10,
        name: '服务中',
        url: '/packageHome/pages/meal/index',
      },
      {
        imgUrl: app.globalData.ossImgUrl + 'order-bg4.png',
        type: 3,
        etype: 10,
        name: '已完成',
        url: '/packageHome/pages/meal/index',
      },
      {
        imgUrl: app.globalData.ossImgUrl + 'order-bg5.png',
        type: 4,
        etype: 10,
        name: '退款',
        url: '/packageHome/pages/meal/index',
      }
    ],
    list: [{
        imgUrl: app.globalData.ossImgUrl + 'serve4.png',
        title: '优惠券',
        url: '/packageMy/pages/coupon/index',
        etype: '11'
      },
      {
        imgUrl: app.globalData.ossImgUrl + 'serve1.png',
        title: '干预记录',
        url: '/packageTrain/pages/record/index',
        etype: '8'
      },
      // {
      //   imgUrl: app.globalData.ossImgUrl + 'serve2.png',
      //   title: '预约订单',
      //   url: '/packageHome/pages/booking/index',
      //   type: '9'
      // },
      // {
      //   imgUrl: app.globalData.ossImgUrl + 'serve3.png',
      //   title: '服务订单',
      //   url: '/packageHome/pages/meal/index',
      //   type: '10'
      // },

    ],
    etype: ""
  },
  onLoad() {
    this.setData({
      statusBarHeight: wx.getSystemInfoSync().statusBarHeight
    })
  },
  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({
        selected: 4
      })
    }
    if (wx.getStorageSync("token") != '') {
      this.getUser()
      this.getUersfo()
    } else {
      this.setData({
        userInfo: '',
        userName: '',
        age: '',
        gender: '',
        phone: ''
      })
    }
  },
  //跳转系统设置
  sysTurn() {
    if (this.data.userName != '') {
      console.log('有username')
      wx.navigateTo({
        url: '/page/my/system/index?phone=' + this.data.phone
      })
    } else {
      console.log('没username')
      wx.navigateTo({
        url: '/page/login/start/index?pageUrl=/page/my/system/index'
      })
    }
  },
  goSystem() {
    if (wx.getStorageSync('token') != '') {
      wx.navigateTo({
        url: '/page/my/system/index?str=6',
      })
    } else {
      wx.navigateTo({
        url: '/page/login/start/index?str=6&pageUrl=/page/my/system/index',
      })
    }
  },
  //登录
  login() {
    if (wx.getStorageSync('token') != '') {
      wx.navigateTo({
        url: '/page/my/system/index?str=6',
      })
    } else {
      wx.navigateTo({
        url: '/page/login/start/index?str=6&pageUrl=/page/my/system/index',
      })
    }
  },
  //跳转服务
  turnTo(e) {
    let {
      item
    } = e.currentTarget.dataset
    if (wx.getStorageSync('token') != '') {
      api.getCheckArch({
        phone: wx.getStorageSync('phone')
      }).then((res) => {
        if (res.code == 200 && res.data != null) {
          wx.setStorageSync('archivesNo', res.data)
          console.log('ppp');
          wx.navigateTo({
            url: item.url + '?str=' + item.type
          })
        } else {
          if (item.url == '/packageMy/pages/coupon/index') {
            wx.navigateTo({
              url: item.url
            })
          } else {
            this.setData({
              addInfoShow: true,
              etype: item.etype,
              type: item.type
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/page/login/start/index?pageUrl=' + e.currentTarget.dataset.item.url + '&str=' + e.currentTarget.dataset.item.etype + '&type=' + e.currentTarget.dataset.item.type
      })
    }
  },
  // 建档
  toAddinfo() {
    this.setData({
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
  // 获取用户信息
  getUser() {
    api.getInfo({}).then((res) => {
      // console.log(res)
      if (res.code === 200) {
        this.setData({
          userInfo: res.data,
          userName: (res.data.healthRecordsDetailVO?.healthRecordsBase.name) ? (res.data.healthRecordsDetailVO?.healthRecordsBase.name) : (res.data.nickname),
          age: res.data.age,
          gender: res.data.gender,
          phone: (res.data.healthRecordsDetailVO?.healthRecordsBase.phone) ? (res.data.healthRecordsDetailVO?.healthRecordsBase.phone) : (res.data.phone)
        })
      }
    })
  },
  //编辑信息
  edit() {
    if (wx.getStorageSync('token') != '') {
      wx.navigateTo({
        url: '/page/my/infoEdit/index?str=6',
      })
    } else {
      wx.navigateTo({
        url: '/page/login/start/index?str=6&pageUrl=/page/my/infoEdit/index',
      })
    }
  },

  // 跳转营销
  goCaide() {
    // this.setData({
    //   distinguish: 12,
    //   addInfoShow: true
    // })
    app.globalData.which=1//从我的my跳到的cadie
    if (wx.getStorageSync('token') != '') {
      api.getCheckArch({
        phone: wx.getStorageSync('phone')
      }).then((res) => {
        if (res.code == 200) {
          if (res.data != null) {
            wx.setStorageSync('archivesNo', res.data)
            this.setData({
              distinguish: 12
            })  
            wx.navigateTo({
              url: '/packageHome/pages/cadie/index?str=' + this.data.distinguish
            })
          } else {
            this.setData({
              distinguish: 12,
              addInfoShow: true
            })
          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/page/login/start/index?pageUrl=' + '/packageHome/pages/cadie/index' + '&str=' + 12,
      })
    }
  },
  goEquity: util.debounce(function () {
    api.getBindAccount({}).then((res) => {
      if (res.code === 200) {
        console.log(res)
        if (res.data?.id) {
          wx.navigateTo({
            url: '/packageMy/pages/equityCenter/index'
          })
        } else {
          this.setData({
            employeeId: null
          })
          wx.showToast({
            icon: 'none',
            title: '您的账号未开通营销权限',
          })
        }
      }
    })
  }, 500),
  bindAccount(e) {
    this.setData({
      account: e.detail.value
    })
  },
  bindPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  // 员工授权
  commits: util.debounce(function () {
    let that = this
    if (!that.data.account) {
      wx.showToast({
        icon: 'none',
        title: '请输入授权账户',
        duration: 5000,
      });
      return
    } else if (!that.data.password) {
      wx.showToast({
        icon: 'none',
        title: '请输入授权密码',
        duration: 5000,
      });
      return
    } else if (!that.data.account && !that.data.password) {
      wx.showToast({
        icon: 'none',
        title: '请输入登录账户、请输入登录密码',
        duration: 5000,
      });
      return
    }
    // that.setData({
    //   show_pass: true
    // })
    api.bindAccount({
      account: that.data.account,
      password: that.data.password,
    }).then(res => {
      console.log(res)
      if (res.code === 200) {
        wx.setStorageSync('employeeId', res.data)
        that.setData({
          employeeId: res.data,
          isShowModel: false
        })
        wx.showToast({
          icon: 'none',
          title: res.msg,
          duration: 1000,
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg,
          duration: 1000,
        });
      }
    })
  }, 500),
  // 员工取消授权
  unCommits: util.debounce(function () {
    let that = this
    that.setData({
      show_pass: false
    })
    api.unBindAccount({}).then(res => {
      console.log(res)
      if (res.code === 200) {
        wx.removeStorage({
          key: 'employeeId',
        })
        that.setData({
          isShowModel: false,
          employeeId: '',
          account: '',
          password: ''
        })
        wx.showToast({
          icon: 'none',
          title: res.msg,
          duration: 1000,
        });
      } else {
        wx.showToast({
          icon: 'none',
          title: res.msg,
          duration: 1000,
        });
      }
    })
  }, 500),
  // 获取授权信息
  bindPerson() {
    this.setData({
      isShowModel: true,
      show_pass: false
    })
    this.getUersfo()
    // api.getCheckArch({
    //   phone: wx.getStorageSync('phone')
    // }).then((res) => {
    //   if (res.code == 200 && res.data != null) {
    //     wx.setStorageSync('archivesNo', res.data)
    //     wx.navigateTo({
    //       url: e.currentTarget.dataset.item.url
    //     })
    //   } else {
    //     if (e.currentTarget.dataset.item.url == '/packageMy/pages/coupon/index') {
    //       wx.navigateTo({
    //         url: e.currentTarget.dataset.item.url
    //       })
    //     } else {
    //       this.setData({
    //         addInfoShow: true,
    //         etype: e.currentTarget.dataset.item.type
    //       })
    //     }
    //   }
    // })
  },
  getUersfo() {
    api.getBindAccount({}).then((res) => {
      if (res.code === 200) {
        console.log(res, '这是获取绑定信息')
        if (res.data) {
          wx.setStorageSync('employeeId', res.data.id)
          this.setData({
            employeeId: res.data.id,
            account: res.data.account,
            password: '******'
          })
        } else {
          this.setData({
            employeeId: null
          })
        }
      }
    })
  },
  seeTap() {
    var that = this
    if (that.data.password != '******') {
      that.setData({
        show_pass: !that.data.show_pass, // 切换图标
        passwordType: !that.data.passwordType, // 切换是否密码框
      })
    } else {
      that.setData({
        show_pass: false, // 切换图标
      })
    }
  },
  close() {
    this.setData({
      account: '',
      password: '',
      isShowModel: false
    })
  }
})