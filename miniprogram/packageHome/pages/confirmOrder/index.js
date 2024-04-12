const app = getApp()
const api = require('../../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textVal: '点击使用',
    discount: '',
    showPrice: false,
    ischeckId: '',
    sealPrice: '', //优惠价格
    prodCode: '',
    optionList: ['所有', '选项1', '选项2'],
    value: '所有',
    hideFlag: true, //true-隐藏  false-显示
    animationData: {},
    serveList: [],
    ossImg: app.globalData.ossImgUrl,
    purchaser: '',
    phone: '',
    methodList: [{
      id: 0,
      option: '微信支付',
      iconUrl: app.globalData.ossImgUrl + 'wx.png',
      state: true
    }, ],
    method: '微信支付',
    userInfo: '',
    serveData: '',
    conutAll: '',
    personShow: false, //成员
  },
  // 切换支付
  // method(id){
  //   this.setData({
  //     method:this.data.methodList[id.currentTarget.dataset.id].option
  //   })
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log('qewqweqw', options.prodCode);
    if (options.prodCode) {
      this.setData({
        prodCode: options.prodCode,
      })

    }

    if (options.archivesNo) {
      wx.setStorageSync("archivesNo", options.archivesNo)
    }
    if (options.id) {
      wx.setStorageSync("prodectId", options.id)
    }
    //获取详情
    if (wx.getStorageSync('prodectId') != undefined) {
      this.getCommodityDetail()
    }
    //获取预约成员信息
    if (wx.getStorageSync('archivesNo') != undefined) {
      this.getPerson()
    }

  },

  //获取详情
  getCommodityDetail(){
    console.log(wx.getStorageSync('prodectId'))
    console.log(wx.getStorageSync('prodectId') ? wx.getStorageSync('prodectId') : '')
    api.commodityDetailPage({
      id: wx.getStorageSync('prodectId') ? wx.getStorageSync('prodectId') : ''
    }).then(res => {
      this.setData({
        serveData:res.data,
        conutAll:res.data.prodPrice,
      })
    })
  },
  //获取个人信息
  getPerson(){
    api.detailInfo({}).then(res=>{
      if(res.code===200){
        console.log(res)
        if (res.data.healthRecordsBase != null) {
          console.log(res)
          this.setData({
            personShow: true, //成员
            userInfo: res.data.healthRecordsBase
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  inputChange(e) {
    console.log(e.detail.value)
    this.setData({
      'userInfo.name': e.detail.value
    })
  },
  inputChange(e) {
    console.log(e.detail.value)
    this.setData({
      'userInfo.name': e.detail.value
    })
  },
  ////下单用券
  favorable(e) {
    console.log(e, 'ppp')
  },
  //下单支付
  pay() {
    let that = this

    // 验证手机号
    // if (!(/^1[3,4,5,6,7,8,9][0-9]{9}$/.test(this.data.phone))) {
    //   wx.showToast({
    //     title: '手机号格式有误',
    //     duration: 1000,
    //     icon:'none'
    //     });
    // }else
    console.log(that.data.userInfo.name, 'sdsdsd')
    if (that.data.userInfo.name == '') {
      wx.showToast({
        title: '购买人不能为空',
        duration: 1000,
        icon: 'none'
      });
    } else {
      let parmas = {
        clientResource: 1,
        couponCode: that.data.ischeckId,
        discount: that.data.sealPrice,
        price: that.data.serveData.prodPrice,
        describe: that.data.serveData.prodDescribe,
        money: that.data.conutAll,
        openId: app.globalData.openId ? app.globalData.openId : wx.getStorageSync('openId'),
        payWay: 2,
        purchaserPhone: that.data.userInfo.phone,
        servName: that.data.serveData.prodName,
        serviceProductId: that.data.serveData.id,
        totalFee: that.data.conutAll,
        purchaser:that.data.userInfo.name,
      }
      api.ServiceOrder(parmas).then(res => {
        if (res.code === 200) {
          wx.removeStorageSync("prodectId")
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
              that.setData({
                conutAll: that.data.serveData.prodPrice,
                sealPrice:'',
                ischeckId:'',
                showPrice:false
              })
              that.getCoupon()
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

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getCoupon()
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
  //获取优惠券列表
  getCoupon() {
    api.couponApp({
      pageNum: 1,
      pageSize: 999,
      productCode: this.data.prodCode,
      serviceType: 'tc',
      status: 0
    }).then(res => {
      if (res.code == 200) {
        console.log(res);
        this.setData({
          serveList: res.data.data
        })
      }
    })
  },

  // 点击
  choose(e) {
    this.setData({
      conutAll: this.data.serveData.prodPrice,
    })
    if (e.currentTarget.dataset.item.couponType == 1) {
      //折扣
      this.setData({
        conutAll: (this.data.conutAll * Number(e.currentTarget.dataset.item.discount / 10)).toFixed(2),
        sealPrice: (this.data.conutAll - (this.data.conutAll * Number(e.currentTarget.dataset.item.discount / 10))).toFixed(2),
      })
    } else {
      //满减
      this.setData({
        conutAll: (this.data.conutAll - Number(e.currentTarget.dataset.item.discount)).toFixed(2),
        sealPrice: (this.data.conutAll - (this.data.conutAll - Number(e.currentTarget.dataset.item.discount))).toFixed(2),


      })
    }
    this.setData({
      ischeckId: e.currentTarget.dataset.item.couponCode,
      discount: e.currentTarget.dataset.item.discount,
      showPrice: true
    })
    var that = this;
    that.hideModal();
  },
  //取消
  mCancel() {
    this.setData({
      discount: '',
      ischeckId: '',
      showPrice: false,
      conutAll: this.data.serveData.prodPrice,
    })
    var that = this;

    that.hideModal();
  },

  // ----------------------------------------------------------------------modal
  // 显示遮罩层
  showModal() {
    var that = this;
    that.setData({
      hideFlag: false
    })

    // 创建动画实例
    var animation = wx.createAnimation({
      duration: 100, //动画的持续时间
      timingFunction: 'ease', //动画的效果 默认值是linear->匀速，ease->动画以低速开始，然后加快，在结束前变慢
    })
    this.animation = animation; //将animation变量赋值给当前动画
    var time1 = setTimeout(function () {
      that.slideIn(); //调用动画--滑入
      clearTimeout(time1);
      time1 = null;
    }, 100)
  },

  // 隐藏遮罩层
  hideModal() {
    var that = this;
    var animation = wx.createAnimation({
      duration: 100, //动画的持续时间 默认400ms
      timingFunction: 'ease', //动画的效果 默认值是linear
    })
    this.animation = animation
    that.slideDown(); //调用动画--滑出
    var time1 = setTimeout(function () {
      that.setData({
        hideFlag: true
      })
      clearTimeout(time1);
      time1 = null;
    }, 100) //先执行下滑动画，再隐藏模块

  },
  //动画 -- 滑入
  slideIn() {
    this.animation.translateY(0).step() // 在y轴偏移，然后用step()完成一个动画
    this.setData({
      //动画实例的export方法导出动画数据传递给组件的animation属性
      animationData: this.animation.export()
    })
  },
  //动画 -- 滑出
  slideDown() {
    this.animation.translateY(300).step()
    this.setData({
      animationData: this.animation.export(),
    })
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

  }
})