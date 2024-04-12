const app = getApp()
const api = require('../../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    isShow: true,
    send: true,
    vCodeValue: '',
    isVFocus: false,
    phoneNum: '', //手机号码

    //路由入参
    latitude: '',
    longitude: '',
    url: '',
    type: '',
    str: '',
    id: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options);
    this.setData({
      pageUrl: options.pageUrl,
      latitude: options.latitude,
      longitude: options.longitude,
      url: options.url,
      type: options.type,
      str: options.str,
      id: options.id,
      phone: '',
      prodCode: options.prodCode
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  //输入手机号
  phoneInt(e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  //获取验证码
  sendMessage() {
    if (this.data.phoneNum == '') {
      wx.showToast({
        icon: 'error',
        title: '请输入验证码',
      })
      return;
    } else {
      var re = /^1[3,4,5,6,7,8,9][0-9]{9}$/;
      var result = re.test(this.data.phoneNum);
      if (!result) {
        wx.showToast({
          icon: 'error',
          title: '请输入正确手机号码！',
        })
        return;
      }
    }
    api.getCode({
      phone: this.data.phoneNum
    }).then((res) => {
      console.log(res)
      if (res.code == 200) {
        wx.showToast({
          icon: 'success',
          title: '发送成功!',
        })
        this.setData({
          show: true,
          send: false
        })
      } else {
        wx.showToast({
          icon: 'error',
          title: res.msg,
        })
      }
    })
  },
  password() {
    this.setData({
      show: true,
      isShow: false
    })
  },

  showVCode(e) {
    var that = this
    that.setData({
      vCodeValue: e.detail.value,
    });
    if (e.detail.value.toString().length == 6) {
      api.getPhone({
        code: e.detail.value,
        openId: app.globalData.openId ? app.globalData.openId : wx.getStorageSync('openId'),
        phone: that.data.phoneNum,
        type: 2
      }).then((res) => {
        console.log(res)
        if (res.code === 200) {
          wx.setStorageSync("token", res.data.token)
          wx.setStorageSync('phone', res.data.phone)
          that.setData({
            phone: res.data.phone
          })
          if (wx.getStorageSync('jlqy') == 'jlqy') {
            wx.removeStorageSync('jlqy')
            wx.reLaunch({
              url: '/packageHome/pages/interests/index',
            })
          }
          if (that.data.pageUrl=='undefined' && that.data.str=='undefined' && that.data.type=='undefined') {
            wx.switchTab({
              url: '/page/home/index',
            })
          } else {
            if (
              that.data.pageUrl == '/packageHome/pages/newReport/index' ||
              that.data.pageUrl == '/packageHome/pages/order/index' ||
              that.data.pageUrl == '/packageHome/pages/interests/index' ||
              that.data.pageUrl == '/packageTrain/pages/record/index' ||
              that.data.pageUrl == '/packageHome/pages/booking/index' ||
              that.data.pageUrl == '/packageHome/pages/confirmOrder/index' ||
              that.data.pageUrl == '/packageHome/pages/meal/index' ||
              that.data.pageUrl == '/packageHome/pages/cadie/index' ||
              that.data.pageUrl == '/packageHome/pages/selective/index' ||
              that.data.pageUrl == '/packageHome/pages/marketing/index') {
              //获取档案编号
              api.getCheckArch({
                phone: wx.getStorageSync('phone')
              }).then((res) => {
                if (res.code == 200) {
                  if (res.data != null) {
                    console.log('登录有档案')
                    wx.setStorageSync('archivesNo', res.data)
                    console.log(that.data.pageUrl,'aaaaaaaaaaaaaaaaaaa')
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
                      url: that.data.pageUrl + '?latitude=' + that.data.latitude + '&longitude=' + that.data.longitude + '&url=' + that.data.url + '&type=' + that.data.type + '&phone=' + that.data.phone + '&id=' + that.data.id + '&prodCode=' + that.data.prodCode + '&str=' + that.data.type,
                    })
                  } else {
                    console.log('登录成功没有档案')
                    console.log(that.data.str)
                    wx.redirectTo({
                      url: '/page/my/infoEdit/index?str=' + that.data.str + '&pageUrl='+ that.data.pageUrl + '&latitude=' + that.data.latitude + '&longitude=' + that.data.longitude + '&goodId=' + that.data.id + '&prodCode=' + that.data.prodCode + '&type=' + that.data.type,
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
                      url: '/page/my/infoEdit/index?str=' + that.data.str +  '&pageUrl=' + that.data.pageUrl + '&latitude=' + that.data.latitude + '&longitude=' + that.data.longitude + '&prodCode=' + this.data.prodCode,
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
        } else {
          wx.showToast({
            icon: 'error',
            title: res.msg,
          })
        }
      })
    }
  },
  tapFn(e) {
    const that = this;
    that.setData({
      isVFocus: true,
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },
})