const app = getApp()
const api = require('../../../http/api.js')
const amapFile = require('../../../libs/amap-wx')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    textVal: '点击使用',
    emptyTime: false, //服务时间可能为空
    conutAll: '',
    discount: '',
    showPrice: false,
    ischeckId: '',
    checkId: 0,
    productCode: '',
    sealPrice: '', //优惠价格
    prodCode: '',
    serveList: [],
    optionList: ['所有', '选项1', '选项2'],
    value: '所有',
    hideFlag: true, //true-隐藏  false-显示
    methodList: [{
      id: 0,
      option: '微信支付',
      iconUrl: app.globalData.ossImgUrl + 'wx.png',
      state: true
    }, ],
    method: '微信支付',
    ossImg: app.globalData.ossImgUrl,
    weekList: [],
    amTime: '',
    pmTime: '',
    mapImg: '',
    latitude: '', //经纬度
    longitude: '', //经纬度
    personShow: true, //成员
    instituShow: false, //机构
    serveShow: false, //服务

    userInfo: '', //成员信息
    avatarUrl: '', //成员头像
    organData: '', //机构信息
    serveData: '', //服务信息
    workDay: '', //机构工作日
    amCheck: false, //上午不可预约
    pmCheck: false, //下午不可预约
    isShowCheck: false,
    first: true,
    amFirstCheck: false, //上午不可预约
    pmFirstCheck: false, //下午不可预约
    checkDate: '',
    checkWeek: '',
    checkTime: '',
    checkAfter: '',
    organNum: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      latitude: options.latitude, //经纬度
      longitude: options.longitude, //经纬度
      productCode: options.productCode,
      organNum: options.organNum
    })
  
    if (options.organNum) {
      wx.setStorageSync("organNum", options.organNum)
    }
    if (options.id) {
      wx.setStorageSync("serveId", options.id)
    }


    var myAmapFun = new amapFile.AMapWX({
      key: "f1a3848eacc8539de58f533070ad7496"
    });
    this.getCodeServe()
  //获取预约机构信息
   this.getJgou()
    let that = this;
    myAmapFun.getRegeo({
      success: (data) => {
        //保存位置的描述信息（ longitude经度 latitude纬度 和位置信息 ）
        let textData = {};
        textData.name = data[0].name;
        textData.desc = data[0].desc
        //将获取的信息保存
        that.setData({
          isShowCheck: true,
          textData: textData,
          longitude: data[0].longitude,
          latitude: data[0].latitude,
          // 给该经度纬度加上icon做标记，并调节大小
          markers: [{
            latitude: data[0].latitude,
            longitude: data[0].longitude,
            height: 30,
            width: 35,
            iconPath: '../../imgs/locationIcon/site1.png'
          }]
        })
      },
      fail: function (info) {
        // console.log("get Location fail");
      }
    });
 
  },

  //获取预约成员信息
  getPerson() {
    api.detailInfo({}).then(res => {
      if (res.data.healthRecordsBase != null) {
        // console.log(res)
        this.setData({
          personShow: true, //成员
          userInfo: res.data?.healthRecordsBase,
          avatarUrl: res.data.avatarUrl
        })
      }
    })


  },
  //获取预约机构信息
  getJgou() {
    let parmas = {
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      organNum: getCurrentPages()[1].organNum ? getCurrentPages()[1].organNum : this.data.organNum
    }
    api.mechanismDetail(parmas).then(res => {
      if (res.code === 200) {
        // console.log(res)
        let workArr = []
        res.data.dayTimes.forEach(item => {
          if (item == '1') {
            workArr.push('星期一')
          } else if (item == '2') {
            workArr.push('星期二')
          } else if (item == '3') {
            workArr.push('星期三')
          } else if (item == '4') {
            workArr.push('星期四')
          } else if (item == '5') {
            workArr.push('星期五')
          } else if (item == '6') {
            workArr.push('星期六')
          } else if (item == '7') {
            workArr.push('星期日')
          }
        })
        console.log(workArr, '星期几')
        this.setData({
          instituShow: true, //机构
          organData: res.data,
          workDay: workArr,
          amTime: res.data.amTime,
          pmTime: res.data.pmTime,
        })
        if (res.data.amTime == '' || res.data.pmTime == '') {
          this.setData({
            emptyTime: false,
          })
        } else {
          this.setData({
            emptyTime: true,
          })
        }
        // 获取当前日期时分秒
        const newWeek = []
        const currentDate = new Date();
        var currentHour = currentDate.getHours();
        var currentMinute = currentDate.getMinutes();
        // 确定上午或下午
        var meridiem = currentHour >= 12 ? "pmTime" : "amTime";
        console.log(meridiem + '/' + currentHour + ':' + currentMinute)
        console.log(meridiem, '当前时间')
        //上午时间
        let amStartHour = res.data.amTime.substring(0, 2)
        console.log(amStartHour + '上午开始小时')
        let amStartMinute = res.data.amTime.substring(3, 5)
        console.log(amStartMinute + '上午开始分钟')
        let amEndHour = res.data.amTime.substring(6, 8)
        console.log(amEndHour + '上午结束小时')
        let amEndMinute = res.data.amTime.substring(9, 11)
        console.log(amEndMinute + '上午结束分钟')

        //判断上午是否可预约
        if (meridiem == 'amTime') {
          if (amStartHour == '00') {
            amStartHour = 0
          }
          if (amEndMinute == '00') {
            amEndMinute = 0
          }
          if (amStartHour == '00') {
            amStartHour = 0
          }
          console.log(currentHour, '当前的小时');
          console.log(amStartHour, '开始的小时');
          console.log(amEndHour, '结束的小时');
          console.log(currentMinute, '当前的分钟');
          console.log(amStartMinute, '开始的分钟');
          console.log(amEndMinute, '结束的分钟');
          if (
            //之前的
            // (currentHour > amStartHour && currentHour < amEndHour) ||
            // (currentHour === amStartHour && currentMinute >= amStartMinute) ||
            // (currentHour === amEndHour && currentMinute <=  amEndMinute)
            (currentHour >= amStartHour) && (currentHour >= 0 || currentHour <= amEndHour) &&
            (currentMinute >= amStartMinute) && (currentMinute >= 0 || currentMinute <= amEndMinute)
          ) {
            this.setData({
              amCheck: true, //上午可预约
              amFirstCheck: true, //上午可预约
            })
          }
        }
        //下午时间
        let pmStartHour = res.data.pmTime.substring(0, 2)
        console.log(pmStartHour + '下午开始小时')
        let pmStartMinute = res.data.pmTime.substring(3, 5)
        console.log(pmStartMinute + '下午开始分钟')
        let pmEndHour = res.data.pmTime.substring(6, 8)
        console.log(pmEndHour + '下午结束小时')
        let pmEndMinute = res.data.pmTime.substring(9, 11)
        console.log(pmEndMinute + '下午结束分钟')
        //判断下午是否可预约
        console.log('qwewqeqwe');

        if (meridiem == 'pmTime') {
          if (pmStartMinute == '00') {
            pmStartMinute = 0
          }
          if (pmEndMinute == '00') {
            pmEndMinute = 0
          }


          if (
            //之前的
            // (currentHour > pmStartHour && currentHour < pmEndHour) ||
            // (currentHour === pmStartHour && currentMinute >= pmStartMinute) ||
            // (currentHour === pmEndHour && currentMinute <=  pmEndMinute)
            (currentHour >= pmStartHour) && (currentHour >= 0 || currentHour <= pmEndHour) &&
            (currentMinute >= pmStartMinute) && (currentMinute >= 0 || currentMinute <= pmEndMinute)
          ) {
            this.setData({
              pmCheck: true, //下午可预约
              pmFirstCheck: true, //下午可预约
            })
          }
        }

        // 循环获取未来七天的日期信息
        for (let i = 0; i < 7; i++) {
          const futureDate = new Date();
          futureDate.setDate(currentDate.getDate() + i);
          const month = futureDate.getMonth() + 1; // 月份从0开始，所以需要加1
          const day = futureDate.getDate();
          const weekDay = futureDate.getDay()
          // const weekDay = futureDate.toLocaleDateString('zh-CN', { weekday: 'long' });
          if (weekDay == 0) {
            newWeek.push({
              id: i,
              week: '周日',
              date: `${month}-${day}`,
              check: '',
            })
          }
          if (weekDay == 1) {
            newWeek.push({
              id: i,
              week: '周一',
              date: `${month}-${day}`,
              check: '',
            })
          }
          if (weekDay == 2) {
            newWeek.push({
              id: i,
              week: '周二',
              date: `${month}-${day}`,
              check: '',
            })
          }
          if (weekDay == 3) {
            newWeek.push({
              id: i,
              week: '周三',
              date: `${month}-${day}`,
              check: '',
            })
          }
          if (weekDay == 4) {
            newWeek.push({
              id: i,
              week: '周四',
              date: `${month}-${day}`,
              check: '',
            })
          }
          if (weekDay == 5) {
            newWeek.push({
              id: i,
              week: '周五',
              date: `${month}-${day}`,
              check: '',
            })
          }
          if (weekDay == 6) {
            newWeek.push({
              id: i,
              week: '周六',
              date: `${month}-${day}`,
              check: '',
            })
          }
        }
        // console.log(newWeek, '1')
        // if (wx.getStorageSync('checkDate')) {
        //   let data = wx.getStorageSync('checkDate');
        //   this.setData({
        //     weekList: newWeek,
        //     checkDate: data
        //   })
        // } else {
          this.setData({
            weekList: newWeek,
            checkDate: newWeek[0].date,
          })
        // }
        //获取工作日列表
        if (this.data.workDay != '') {
          this.data.weekList.forEach(item => {
            this.data.workDay.forEach(el => {
              if (item.week == el) {
                item.check = true
              }
            })
          })
        }
        this.setData({
          weekList: this.data.weekList
        })
        // console.log(JSON.stringify(this.data.weekList) + '0000000000')
      }
    })

  },

  //获取预约服务信息白
  getServe() {
    if (getCurrentPages()[1].id) {
      api.commodityDetailPage({
        id: getCurrentPages()[1].id ? getCurrentPages()[1].id : ''
      }).then(res => {
        if (res.code === 200) {
          // console.log(res)
          this.setData({
            serveShow: true, //服务
            serveData: res.data,
            prodCode: res.data.prodCode
          })
        }
      })
    }
  },
  //用code获取预约服务信息
  getCodeServe() {
    console.log('baiyun');
    api.commodityCodePage({
      code: this.data.productCode
    }).then(res => {
      if (res.code === 200) {
        // console.log(res)
        this.setData({
          serveShow: true, //服务
          serveData: res.data,
          conutAll: res.data.prodPrice,
          prodCode: res.data.prodCode
        })
      }
    })
  },



  //切换周几
  change(e) {
    // console.log(e.currentTarget.dataset.id);
    this.setData({
      checkId: e.currentTarget.dataset.id.id,
      checkDate: e.currentTarget.dataset.id.date,
      checkWeek: e.currentTarget.dataset.id.week
    })
    // if(e.currentTarget.dataset.id.check=''){
    //   this.setData({
    //     amCheck:false,
    //     pmCheck:false,
    //   })
    // }else{
    if (e.currentTarget.dataset.id.id != 0 && this.data.emptyTime) {
      this.setData({
        first: false,
        amCheck: true,
        pmCheck: true,
      })
    } else {
      this.setData({
        first: true,
      })
    }
    // }
  },
  //上午预约
  amMake(e) {
    if (this.data.amCheck || this.data.amFirstCheck) {
      this.setData({
        checkTime: e.currentTarget.dataset.time,
        checkAfter: e.currentTarget.dataset.date,
      })
    } else {
      wx.showToast({
        icon: 'error',
        title: '当前时间不可预约',
      })
    }
  },
  //下午预约
  pmMake(e) {
    if (this.data.pmCheck || this.data.pmFirstCheck) {
      this.setData({
        checkTime: e.currentTarget.dataset.time,
        checkAfter: e.currentTarget.dataset.date,
      })
    } else {
      wx.showToast({
        icon: 'error',
        title: '当前时间不可预约',
      })
    }
  },

  //电话咨询
  call(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //下单支付
  pay() {
    if (this.data.checkTime == '') {
      wx.showToast({
        icon: 'error',
        title: '请选择预约时间',
      })
      return
    } else {
      wx.setStorageSync('checkDate', this.data.checkDate)
      wx.setStorageSync('checkAfter', this.data.checkAfter)
      wx.setStorageSync('checkTime', this.data.checkTime)
    }
    let now = new Date();
    let year = now.getFullYear();
    let parmas = {
      clientResource: 1,
      discount: this.data.sealPrice,
      couponCode: this.data.ischeckId,
      price: this.data.serveData.prodPrice,
      bookingTime: year + '-' + this.data.checkDate + ' ' + this.data.checkWeek + ' ' + this.data.checkAfter + ' ' + this.data.checkTime,
      clientResource: 1,
      describe: this.data.serveData.prodDescribe,
      institutionAddress: this.data.organData.address,
      institutionId: this.data.organData.organNum,
      institutionName: this.data.organData.organName,
      institutionPhone: this.data.organData.phone,
      money: this.data.conutAll,
      openId: app.globalData.openId ? app.globalData.openId : wx.getStorageSync('openId'),
      payWay: 1,
      servName: this.data.serveData.prodName,
      serviceProductId: this.data.serveData.id,
      totalFee: this.data.serveData.prodPrice,
    }
    api.BookingOrder(parmas).then(res => {
      if (res.code === 200) {
        wx.removeStorageSync("organNum")
        wx.removeStorageSync("serveId")
        wx.requestPayment({
          appId: res.data.appid,
          timeStamp: res.data.timeStamp,
          nonceStr: res.data.nonceStr,
          package: res.data.packageWx,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success(msg) {
            wx.navigateTo({
              url: '/packageHome/pages/success/index?outTradeNo=' + res.data.outTradeNo + '&type=appointmen'
            })
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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
    that.getCoupon()
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
  onShow() {
    //获取预约成员信息
    this.getPerson()
    //获取预约服务信息
    this.getServe()


    this.getCoupon()
    // this.setData({
    //   checkDate: wx.getStorageSync('checkDate'),
    //   checkAfter: wx.getStorageSync('checkAfter'),
    //   checkTime: wx.getStorageSync('checkTime'),
    // })
  },

  //获取优惠券列表this.data.prodCode
  getCoupon() {
    api.couponApp({
      pageNum: 1,
      pageSize: 999,
      productCode: this.data.productCode,
      organNum: this.data.organNum,
      serviceType: 'book',
      status: 0
    }).then(res => {
      if (res.code == 200) {
        // console.log(res);
        this.setData({
          serveList: res.data.data
        })
      }
    })
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
    wx.removeStorage('checkDate')
    wx.removeStorage('checkAfter')
    wx.removeStorage('checkTime')
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

  }
})