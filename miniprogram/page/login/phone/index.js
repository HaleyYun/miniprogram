const app = getApp()
const api = require('../../../http/api')
Page({
  data: {
    ossImg: app.globalData.ossImgUrl,
    show: true,
    checked: false,
    conment: [],
    commList: [],
    serve: false,
    base: false,
    //路由入参
    pageUrl: '',
    latitude: '',
    longitude: '',
    url: '',
    type: '',
    str: '',
    phone: '',
    id: '',
    richContent: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    this.setData({
      pageUrl: options?.pageUrl,
      latitude: options?.latitude,
      longitude: options?.longitude,
      url: options?.url,
      type: options?.type,
      str: options?.str,
      id: options?.id,
      prodCode: options?.prodCode
    })
    console.log(options)
    this.getAgreement()
    console.log(this.data.pageUrl, this.data.str, this.data.type);
  },

  // 获取协议内容
  getAgreement() {
    api.agreement({
      channelSource: 1
    }).then((res) => {
      console.log(res)
      if (res.code === 200) {
        let data = res.data.filter((item) => {
          if (item.serviceAgreement.length > 0) {
            return item.agreementName
          }
        })
        console.log(data)
        this.setData({
          conment: data,
          commList: res.data
        })
      }
    })
  },

  //用户协议
  serve(e) {
    let {
      id
    } = e.currentTarget.dataset
    // this.setData({
    //   show: false,
    //   richContent: this.data.commList[id].serviceAgreement
    // })
    wx.navigateTo({
      url: '/packageMy/pages/agreement/index?name=' + this.data.commList[id].agreementName,
    })
  },
  //隐私协议
  base() {
    this.setData({
      show: false,
      serve: false,
      base: true,
      order: false
    })
  },
  close() {
    this.setData({
      show: true
    })
  },
  phonePage() {
    if (this.data.checked == false) {
      wx.showToast({
        title: '请勾选',
      })
      return;
    }
    wx.redirectTo({
      url: '/page/login/message/index?pageUrl=' + this.data.pageUrl + '&str=' + this.data.str + '&latitude=' + this.data.latitude + '&longitude=' + this.data.longitude + '&type=' + this.data.type + '&id=' + this.data.id + '&prodCode=' + this.data.prodCode,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    // let that = this
    // wx.enableAlertBeforeUnload({
    //   message: "确认返回首页吗",
    //   success: function (res) {
    //     if (wx.getStorageSync('isScan') === 1 && that.data.pageUrl == '/packageHome/pages/interests/index') {
    //       wx.removeStorageSync('isScan')
    //       that.setData({
    //         pageUrl: '',
    //         str: ''
    //       })
    //       wx.reLaunch({
    //         url: '/page/home/index',
    //       })
    //       return
    //     }
    //   },
    //   fail: function (err) {
    //     console.log("失败：", err);
    //   },
    // });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // wx.hideHomeButton();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },
  change() {
    this.setData({
      checked: !this.data.checked
    })
  },
  getPhoneNumber: function (e) {
    console.log(e)
    var that = this;
    if (that.data.checked == false) {
      wx.showToast({
        title: '请勾选',
      })
      return;
    }
    console.log(e.detail.errMsg == "getPhoneNumber:ok");
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      api.getPhone({
        code: e.detail.code,
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv,
        openId: app.globalData.openId ? app.globalData.openId : wx.getStorageSync('openId'),
        phone: "",
        type: 1
      }).then((res) => {
        console.log(res)
        wx.setStorageSync("token", res.data.token)
        wx.setStorageSync('phone', res.data.phone)
        if (res.code === 200) {
          that.setData({
            phone: res.data.phone
          })

          console.log(typeof that.data.pageUrl,'aaaaaaaaaaaaaaaaaaaa')
          if (that.data.pageUrl==undefined && that.data.str==undefined && that.data.type==undefined) {
            wx.switchTab({
              url: '/page/home/index',
            })
          } else {
            if (
              that.data.pageUrl == '/packageHome/pages/newReport/index' ||
              that.data.pageUrl == '/packageHome/pages/order/index' ||
              that.data.pageUrl == '/packageHome/pages/selective/index' ||
              that.data.pageUrl == '/packageHome/pages/interests/index' ||
              that.data.pageUrl == '/packageTrain/pages/record/index' ||
              that.data.pageUrl == '/packageHome/pages/booking/index' ||
              that.data.pageUrl == '/packageHome/pages/confirmOrder/index' ||
              that.data.pageUrl == '/packageHome/pages/cadie/index' ||
              that.data.pageUrl == '/packageHome/pages/meal/index' ||
              that.data.pageUrl == '/packageHome/pages/marketing/index') {
              //获取档案编号
              api.getCheckArch({
                phone: wx.getStorageSync('phone')
              }).then((res) => {
                if (res.code == 200) {
                  if (res.data != null) {
                    wx.setStorageSync('archivesNo', res.data)
                    if (that.data.pageUrl == '/packageHome/pages/interests/index') {
                      if (app.globalData.sceneParams.userId && app.globalData.sceneParams.code) {
                        wx.reLaunch({
                          url: that.data.pageUrl + '?latitude=' + that.data.latitude + '&longitude=' + that.data.longitude + '&url=' + that.data.url + '&type=' + that.data.type + '&phone=' + that.data.phone + '&id=' + that.data.id + '&prodCode=' + that.data.prodCode + '&str=' + that.data.type,
                        })
                      } else {
                        wx.redirectTo({
                          url: that.data.pageUrl + '?latitude=' + that.data.latitude + '&longitude=' + that.data.longitude + '&url=' + that.data.url + '&type=' + that.data.type + '&phone=' + that.data.phone + '&id=' + that.data.id + '&prodCode=' + that.data.prodCode + '&str=' + that.data.type,
                        })
                      }
                      return
                    }
                    wx.redirectTo({
                      url: that.data.pageUrl + '?latitude=' + that.data.latitude + '&longitude=' + that.data.longitude + '&url=' + that.data.url + '&type=' + that.data.type + '&phome=' + that.data.phone + '&id=' + that.data.id + '&prodCode=' + that.data.prodCode + '&str=' + that.data.type,
                    })
                  } else {
                    console.log('bbbbbbbbbbbbbbbbbbbbbbbbbb')
                    wx.redirectTo({
                      url: '/page/my/infoEdit/index?str=' + that.data.str + '&latitude=' + that.data.latitude + '&longitude=' + that.data.longitude + '&goodId=' + that.data.id + '&prodCode=' + this.data.prodCode + '&type=' + that.data.type,
                    })
                  }
                }
              })
            } else {
              if (that.data.pageUrl == '/page/my/index') {
                wx.switchTab({
                  url: that.data.pageUrl,
                })
              } else if (that.data.pageUrl == '/page/brain/index') {
                api.getCheckArch({
                  phone: wx.getStorageSync('phone')
                }).then(res => {
                  if (res.code == 200 && res.data != null) {
                    wx.setStorageSync('archivesNo', res.data)
                    wx.switchTab({
                      url: that.data.pageUrl,
                    })
                  } else {
                    wx.redirectTo({
                      url: '/page/my/infoEdit/index?str=' + that.data.str + '&latitude=' + that.data.latitude + '&longitude=' + that.data.longitude + '&prodCode=' + that.data.prodCode + '&type=' + that.data.type,
                    })
                  }
                })
              } else if (!that.data.pageUrl && !that.data.str) {
                console.log(that.data.pageUrl)
                console.log(that.data.str)
                console.log('重复登录同一个账号，第一次登录的手机,再去登录的时候不跳转的判断')
                wx.switchTab({
                  url: '/page/home/index',
                })
              } else {
                wx.redirectTo({
                  url: that.data.pageUrl + '?latitude=' + that.data.latitude + '&longitude=' + that.data.longitude +
                    '&url=' + that.data.url + '&type=' + that.data.type + '&str=' + that.data.str + '&goodId=' + that.data.id + '&prodCode=' + this.data.prodCode,
                })
              }
            }
          }
          // if (!that.data.pageUrl && !that.data.str) {
          //   console.log('aaaaaaaaaaaa')
          //   console.log(that.data.pageUrl)
          //   console.log(that.data.str)
          //   console.log('重复登录同一个账号，第一次登录的手机,再去登录的时候不跳转的判断')
          //   wx.switchTab({
          //     url: '/page/home/index',
          //   })
          // }
        }
      })
    } else {
      wx.showToast({
        title: '请授权手机号!',
        icon: 'error',
        duration: 2000
      })
    }
  },
})