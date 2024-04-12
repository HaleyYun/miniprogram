const app = getApp()
const api = require('../../../http/api.js')
const amapFile = require('../../../libs/amap-wx')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    checkId:0,
    ossImg:app.globalData.ossImgUrl,
    weekList:[],
    amTime:'',
    pmTime:'',
    mapImg:'',
    latitude:'',//经纬度
    longitude:'',//经纬度
    personShow:true,//成员
    instituShow:false,//机构
    serveShow:false,//服务

    userInfo:'',//成员信息
    avatarUrl:'',//成员头像
    organData:'',//机构信息
    serveData:'',//服务信息
    workDay:'',//机构工作日
    amCheck:false,//上午不可预约
    pmCheck:false,//下午不可预约

    first:true,
    amFirstCheck:false,//上午不可预约
    pmFirstCheck:false,//下午不可预约
    checkDate:'',
    checkWeek:'',
    checkTime:'',
    checkAfter:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      latitude:options.latitude,//经纬度
      longitude:options.longitude,//经纬度
    })
    if(options.organNum){
      wx.setStorageSync("organNum",options.organNum)
    }
    if(options.id){
      wx.setStorageSync("serveId",options.id)
    }
    var myAmapFun = new amapFile.AMapWX({key:"f1a3848eacc8539de58f533070ad7496"});
    let that = this;
    myAmapFun.getRegeo({
      success: (data) => {
          //保存位置的描述信息（ longitude经度 latitude纬度 和位置信息 ）
          let textData = {};
          textData.name = data[0].name;
          textData.desc = data[0].desc
          //将获取的信息保存
          that.setData({
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
        fail: function(info){
          console.log("get Location fail");
        }    
      });
  },

  //获取预约成员信息
  getPerson(){
      api.detailInfo({}).then(res=>{
        if(res.data.healthRecordsBase!=null){
          console.log(res)
          this.setData({
            personShow:true,//成员
            userInfo:res.data?.healthRecordsBase,
            avatarUrl:res.data.avatarUrl
          })
        }
      })
  },
  //获取预约机构信息
  getJgou(){
    if(getCurrentPages()[1].organNum){
      let parmas = {
        latitude:this.data.latitude,
        longitude:this.data.longitude,
        organNum:getCurrentPages()[1].organNum ? getCurrentPages()[1].organNum  : ''
      }
      api.mechanismDetail(parmas).then(res=>{
        if(res.code===200){
          console.log(res)
          let workArr = []
          res.data.dayTimes.forEach(item=>{
              if(item=='1'){
                workArr.push('星期一')
              }else if(item=='2'){
                workArr.push('星期二')
              }else if(item=='3'){
                workArr.push('星期三')
              }else if(item=='4'){
                workArr.push('星期四')
              }else if(item=='5'){
                workArr.push('星期五')
              }else if(item=='6'){
                workArr.push('星期六')
              }else if(item=='7'){
                workArr.push('星期日')
              }
          })
          console.log(workArr)
          this.setData({
            instituShow:true,//机构
            organData:res.data,
            workDay:workArr,
            amTime:res.data.amTime,
            pmTime:res.data.pmTime,
          })

          // 获取当前日期时分秒
          const newWeek = []
          const currentDate = new Date();
          var currentHour = currentDate.getHours();
          var currentMinute = currentDate.getMinutes();
          // 确定上午或下午
          var meridiem = currentHour >= 12 ? "pmTime" : "amTime";
          console.log(meridiem+'/'+currentHour+':'+currentMinute)
          //上午时间
          let amStartHour = res.data.amTime.substring(0, 2)
          console.log(amStartHour +'上午开始小时')
          let amStartMinute = res.data.amTime.substring(3, 6)
          console.log(amStartMinute +'上午开始分钟')
          let amEndHour = res.data.amTime.substring(6, 8)
          console.log(amEndHour +'上午结束小时')
          let amEndMinute = res.data.amTime.substring(9, 11)
          console.log(amEndMinute +'上午结束分钟')
          
          //判断上午是否可预约
          if(meridiem=='amTime'){
            if (
              (currentHour > amStartHour && currentHour < amEndHour) ||
              (currentHour === amStartHour && currentMinute >= amStartMinute) ||
              (currentHour === amEndHour && currentMinute <=  amEndMinute)
            ) {
              this.setData({
                amCheck:true,//上午可预约
                amFirstCheck:true,//上午可预约
              })
            }
          }
          //下午时间
          let pmStartHour = res.data.pmTime.substring(0, 2)
          console.log(pmStartHour +'下午开始小时')
          let pmStartMinute = res.data.pmTime.substring(3, 6)
          console.log(pmStartMinute +'下午开始分钟')
          let pmEndHour = res.data.pmTime.substring(6, 8)
          console.log(pmEndHour +'下午结束小时')
          let pmEndMinute = res.data.pmTime.substring(9, 11)
          console.log(pmEndMinute +'下午结束分钟')
          //判断下午是否可预约
          if(meridiem=='pmTime'){
            if (
              (currentHour > pmStartHour && currentHour < pmEndHour) ||
              (currentHour === pmStartHour && currentMinute >= pmStartMinute) ||
              (currentHour === pmEndHour && currentMinute <=  pmEndMinute)
            ) {
              this.setData({
                pmCheck:true,//下午可预约
                pmFirstCheck:true,//下午可预约
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
            if(weekDay==0){
              newWeek.push({
                id:i,
                week:'周日',
                date:`${month}-${day}`,
                check:'',
              })
            }
            if(weekDay==1){
              newWeek.push({
                id:i,
                week:'周一',
                date:`${month}-${day}`,
                check:'',
              })
            }
            if(weekDay==2){
              newWeek.push({
                id:i,
                week:'周二',
                date:`${month}-${day}`,
                check:'',
              })
            }
            if(weekDay==3){
              newWeek.push({
                id:i,
                week:'周三',
                date:`${month}-${day}`,
                check:'',
              })
            }
            if(weekDay==4){
              newWeek.push({
                id:i,
                week:'周四',
                date:`${month}-${day}`,
                check:'',
              })
            }
            if(weekDay==5){
              newWeek.push({
                id:i,
                week:'周五',
                date:`${month}-${day}`,
                check:'',
              })
            }
            if(weekDay==6){
              newWeek.push({
                id:i,
                week:'周六',
                date:`${month}-${day}`,
                check:'',
              })
            }
          }
          console.log(newWeek,'1')
          this.setData({
            weekList:newWeek,
            checkDate:newWeek[0].date,
          })
          //获取工作日列表
          if(this.data.workDay!=''){
            this.data.weekList.forEach(item=>{
              this.data.workDay.forEach(el=>{
                if(item.week==el){
                  item.check = true
                }
              })
            })
          }
          this.setData({
            weekList:this.data.weekList
          })
          console.log(JSON.stringify(this.data.weekList) + '0000000000')
        }
      })
    }
  },

  //获取预约服务信息
  getServe(){
    if(getCurrentPages()[1].id){
      api.commodityDetailPage({id:getCurrentPages()[1].id ? getCurrentPages()[1].id  : ''}).then(res=>{
        if(res.code===200){
          console.log(res)
          this.setData({
            serveShow:true,//服务
            serveData:res.data
          })
        }
      })
    }
  },
  


  //切换周几
  change(e){
    this.setData({
      checkId:e.currentTarget.dataset.id.id,
      checkDate:e.currentTarget.dataset.id.date,
      checkWeek:e.currentTarget.dataset.id.week
    })
    if(e.currentTarget.dataset.id.check==""){
      this.setData({
        amCheck:false,
        pmCheck:false,
      })
    }else{
      if(e.currentTarget.dataset.id.id!=0){
        this.setData({
          first:false,
          amCheck:true,
          pmCheck:true,
        })
      }else{
        this.setData({
          first:true
        })
      }
    }
  },
  //上午预约
  amMake(e){
    if(this.data.amCheck || this.data.amFirstCheck){
      this.setData({
        checkTime:e.currentTarget.dataset.time,
        checkAfter:e.currentTarget.dataset.date,
      })
    }else{
      wx.showToast({
        icon:'error',
        title: '当前时间不可预约',
      })
    }
  },
  //下午预约
  pmMake(e){
    if(this.data.pmCheck || this.data.pmFirstCheck){
      this.setData({
        checkTime:e.currentTarget.dataset.time,
        checkAfter:e.currentTarget.dataset.date,
      })
    }else{
      wx.showToast({
        icon:'error',
        title: '当前时间不可预约',
      })
    }
  },

  //电话咨询
  call(e){
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phone
    })
  },
  //下单支付
  pay(){
    if(this.data.checkTime==''){
      wx.showToast({
        icon:'error',
        title: '请选择预约时间',
      })
      return
    }
    let now = new Date();
    let year = now.getFullYear();
    let parmas = {
      bookingTime: year + '-' + this.data.checkDate + ' ' +this.data.checkWeek + ' ' + this.data.checkAfter + ' '+ this.data.checkTime,
      clientResource: 1,
      describe: this.data.serveData.prodDescribe,
      institutionAddress: this.data.organData.address,
      institutionId: this.data.organData.organNum,
      institutionName: this.data.organData.organName,
      institutionPhone: this.data.organData.phone,
      money: this.data.serveData.prodPrice,
      openId: app.globalData.openId?app.globalData.openId:wx.getStorageSync('openId'),
      payWay: 1,
      servName: this.data.serveData.prodName,
      serviceProductId: this.data.serveData.id,
      totalFee: this.data.serveData.prodPrice,
    }
    api.BookingOrder(parmas).then(res=>{
      if(res.code===200){
        wx.removeStorageSync("organNum")
        wx.removeStorageSync("serveId")
        wx.requestPayment({
          appId:res.data.appid,
          timeStamp: res.data.timeStamp, 
          nonceStr: res.data.nonceStr,
          package: res.data.packageWx,
          signType: res.data.signType,
          paySign: res.data.paySign,
          success (msg) { 
            wx.navigateTo({
              url:'/packageHome/pages/success/index?outTradeNo='+res.data.outTradeNo + '&type=appointmen'
            })
          },
          fail (msg) { 
            wx.showToast({
              icon:'error',
              title: '支付失败！',
            })
          }
        })
      }else{
        wx.showToast({
          icon:'error',
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



  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    //获取预约成员信息
    this.getPerson()
    //获取预约服务信息
    this.getServe()
    //获取预约机构信息
    this.getJgou()
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

  }
})