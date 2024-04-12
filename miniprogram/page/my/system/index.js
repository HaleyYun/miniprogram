const app = getApp()
const api = require('../../../http/api.js')
const util = require('../../../util/util')
Page({
  data: {
    ossImg: app.globalData.ossImgUrl,
    accountInfo: wx.getAccountInfoSync(),
    model: wx.getSystemInfoSync().model,
    isShowModel: false,
    agrList: []
  },
  onLoad(options) {
    console.log(options)
    console.log(this.data.accountInfo)
    console.log(this.data.accountInfo.miniProgram.envVersion)
    console.log(this.data.accountInfo.miniProgram.version)
  },
  onShow() {
    this.getAgreement()
  },
  goDetail(e) {
    const {
      item,
      index
    } = e.currentTarget.dataset
    if (index === 0) {
      this.setData({
        isShowModel: true,
        show_pass: false
      })
      this.getUersfo()
    } else {
      wx.navigateTo({
        url: '/packageMy/pages/agreement/index?name=' + item.name,
      })
    }
  },
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
        }
      }
    })
  },
  // 获取协议内容
  getAgreement() {
    api.agreement({
      channelSource: 1
    }).then((res) => {
      console.log(res)
      if (res.code === 200) {
        let data = res.data;
        let newData = [{
          name: '员工认证',
          img: app.globalData.ossImgUrl + 'agreement-bg1.png',
        }];
        for (let i = 0; i < data.length; i++) {
          const item = data[i];
          let num = i + 2;
          if (item.serviceAgreement.length > 0) {
            newData.push({
              name: item.agreementName,
              serviceAgreement: item.serviceAgreement,
              img: app.globalData.ossImgUrl + 'agreement-bg' + num + '.png',
            })
          }
        }
        this.setData({
          agrList: newData
        })
      }
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
  close() {
    this.setData({
      account: '',
      password: '',
      isShowModel: false
    })
  },
  //退出登录
  logout() {
    api.logout({}).then((res) => {
      console.log(res)
      if (res.code === 200) {
        wx.clearStorage()
        wx.navigateBack()
      }
    })
  },
})