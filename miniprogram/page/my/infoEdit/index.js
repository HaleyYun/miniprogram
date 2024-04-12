const app = getApp()
const api = require('../../../http/api.js')
Page({
  data: {
    maxDate: new Date().getTime(),
    avatarUrl: '',
    avatarIcon: app.globalData.ossImgUrl + 'unfold.png',
    nickname: '',
    username: '',
    date: '1953-01-01',
    endDate: '',
    gender: '',
    phone: '',
    skip: '',
    education: '0',
    sexList: [{
        name: '男',
        id: '1',
        checked: true
      },
      {
        name: '女',
        id: '2',
        checked: false
      }
    ],
    goodId: '',
    //学历
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    //  selectData:['1','2','3','4','5','6'],//下拉列表的数据
    index: 0, //选择的下拉列表下标
    // 性别数据
    genderList: [{
        id: '1',
        option: '男',
        url: app.globalData.ossImgUrl + 'male.png',
        activeUrl: app.globalData.ossImgUrl + 'male1.png'
      },
      {
        id: '2',
        option: '女',
        url: app.globalData.ossImgUrl + 'female.png',
        activeUrl: app.globalData.ossImgUrl + 'female1.png',
      }
    ],
    latitude: '', //经度
    longitude: '', //纬度
    statusBarHeight: 44,
    //请求数据
    capabilityLis: [],
    familyHistoryList: [],
    prevalenceList: [],
    sportsHobbiesList: [],
    relations: '',
    arthritis: '',
    diastolicPressure: '',
    gastrointestinalDisease: '',
    lipidStatus: '',
    osteoporosis: '',
    respiratoryDiseases: '',
    sleepDisorders: '',
    spondylopathy: '',
    systolicPressure: '',
    totalCholesterol: '',
    tumorDiseases: '',
    weeklyExerciseFrequency: '',
    prodCode: '',
    // 学历数据
    selectData: [{
        id: '0',
        option: '小学以下'
      },
      {
        id: '1',
        option: '小学'
      },
      {
        id: '2',
        option: '初中'
      },
      {
        id: '3',
        option: '高中'
      },
      {
        id: '4',
        option: '大专及以上'
      }
    ],
    getData: '',
    // 患病数据
    medicalList: [{
        id: 0,
        state: false,
        option: '高血压',
        url: app.globalData.ossImgUrl + 'filing1.png',
        activateUrl: app.globalData.ossImgUrl + 'filingActive1.png'
      },
      {
        id: 1,
        state: false,
        option: '高血脂',
        url: app.globalData.ossImgUrl + 'filing2.png',
        activateUrl: app.globalData.ossImgUrl + 'filingActive2.png'
      },
      {
        id: 2,
        state: false,
        option: '脑血管病',
        url: app.globalData.ossImgUrl + 'filing3.png',
        activateUrl: app.globalData.ossImgUrl + 'filingActive3.png'
      },
      {
        id: 3,
        state: false,
        option: '心脏病',
        url: app.globalData.ossImgUrl + 'filing4.png',
        activateUrl: app.globalData.ossImgUrl + 'filingActive4.png'
      },
      {
        id: 4,
        state: false,
        option: '记忆力差',
        url: app.globalData.ossImgUrl + 'filing5.png',
        activateUrl: app.globalData.ossImgUrl + 'filingActive5.png'
      },
      {
        id: 5,
        state: false,
        option: '抑郁症',
        url: app.globalData.ossImgUrl + 'filing6.png',
        activateUrl: app.globalData.ossImgUrl + 'filingActive6.png'
      },
      {
        id: 6,
        state: false,
        option: '糖尿病',
        url: app.globalData.ossImgUrl + 'filing7.png',
        activateUrl: app.globalData.ossImgUrl + 'filingActive7.png'
      },
      {
        id: 7,
        state: false,
        option: '基因风险',
        url: app.globalData.ossImgUrl + 'filing8.png',
        activateUrl: app.globalData.ossImgUrl + 'filingActive8.png'
      },
      {
        id: 8,
        state: false,
        option: '运动少',
        url: app.globalData.ossImgUrl + 'filing9.png',
        activateUrl: app.globalData.ossImgUrl + 'filingActive9.png'
      },
    ],
    path: '/packageHome/pages/cadie/index?isChange=0',
    type: 0,
  },
  checkboxChange: function (e) {
    console.log('checkbox发：', e)
  },
  // 患病
  medical(id) {
    this.setData({
      [`medicalList[${id.currentTarget.dataset.id}].state`]: !this.data.medicalList[id.currentTarget.dataset.id].state,
    })
  },
  // 性别
  gender(id) {
    this.setData({
      gender: id.currentTarget.dataset.id,
    })
  },
  // 点击下拉显示框
  selectTap() {
    this.setData({
      show: !this.data.show
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show,
      education: Index
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    console.log(options, 'options.str');
    let year = new Date().getFullYear()
    let month = new Date().getMonth() + 1
    let day = new Date().getDate()
    let date = `${year}-${month}-${day}`
    // let date = new Date();
    // let newDate = date.toLocaleDateString().replace(/\//g, "-");
    this.setData({
      skip: options?.str,
      latitude: options?.latitude,
      longitude: options?.longitude,
      goodId: options?.goodId,
      getData: date,
      prodCode: options?.prodCode,
      type: options?.type,
      // 跳转登陆时传过来的小程序上级页面路径
      pageUrl: options?.pageUrl
    })
    this.setData({
      statusBarHeight: wx.getSystemInfoSync().statusBarHeight
    })
  },
  // 切换头像
  changeAvatar() {
    var that = this;
    console.log(api.upLoad)
    wx.chooseImage({
      success(res) {
        const tempFilePaths = res.tempFilePaths
        wx.uploadFile({
          url: app.globalData.uploadUrl, //测试的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'token': wx.getStorageSync('token') ? wx.getStorageSync('token') : ''
          },
          formData: {
            'user': 'test'
          },
          success(res) {
            console.log(res.data)
            let data = JSON.parse(res.data)
            that.setData({
              avatarUrl: data.data.url
            })
          }
        })
      }
    })
  },
  //修改昵称
  changeName(e) {
    this.setData({
      username: e.detail.value
    })
  },

  // 校验输入的正则方法
  checkInputText: function (text) {
    var reg = /^(\.*)(\d+)(\.?)(\d{0,2}).*$/g; //校验正整数并最多带2位小数
    if (reg.test(text)) { //正则匹配通过，提取有效文本
      text = text.replace(reg, '$2$3$4');
    } else { //正则匹配不通过，直接清空
      text = '';
    }
    return text;
  }, //返回符合要求的文本（为数字且最多有带2位小数）
  //修改身高
  changeHeight(e) {
    let that = this
    let value = this.checkInputText(e.detail.value); //调用正则方法
    that.setData({
      height: value
    })
  },
  //修改体重
  changeWeight(e) {
    let that = this
    let val = this.checkInputText(e.detail.value); //调用正则方法
    that.setData({
      weight: val
    })
  },
  //修改性别
  chooseSex(e) {
    this.setData({
      gender: e.detail.value
    })
  },
  //修改生日
  bindDateChange(e) {
    // console.log(e.detail.value,'e')
    // if(e.detail.value < '1900-01-01' || e.detail.value < this.data.getData ){
    //   wx.showToast({
    //     icon: 'none',
    //     title: '出生日期有误，请重新选择。',
    //     duration: 3000,
    //   })
    // }
    this.setData({
      date: e.detail.value
    })
  },
  //保存
  save() {
    if (this.data.username === '' || this.data.gender === '' || this.data.weight === '' || this.data.height === '') {
      wx.showToast({
        icon: 'error',
        title: '请完善信息',
      })
      return
    }

    let parmas = {
      avatarUrl: this.data.avatarUrl,
      birthday: this.data.date,
      gender: this.data.gender,
      nickname: this.data.nickname,
      country: "",
      province: "",
      city: ""
    }
    api.editInfo(parmas).then((res) => {
      //后期优化去掉这个接口
    })

    api.updateArch({
      capabilityList: this.data.capabilityList ? this.data.capabilityList : [],
      familyHistoryList: this.data.familyHistoryList ? this.data.familyHistoryList : [],
      prevalenceList: this.data.prevalenceList ? this.data.prevalenceList : [],
      sportsHobbiesList: this.data.sportsHobbiesList ? this.data.sportsHobbiesList : [],
      recordsBaseRequest: {
        relations: this.data.relations ? this.data.relations : '',
        name: this.data.username ? this.data.username : '',
        sex: this.data.gender ? this.data.gender : '',
        education: this.data.education ? this.data.education : '0',
        birthday: this.data.date ? this.data.date : this.data.date,
      },
      recordsDetailRequest: {
        weight: this.data.weight ? this.data.weight : '',
        height: this.data.height ? this.data.height : '',
        arthritis: this.data.arthritis ? this.data.arthritis : '',
        diastolicPressure: this.data.diastolicPressure ? this.data.diastolicPressure : '',
        gastrointestinalDisease: this.data.gastrointestinalDisease ? this.data.gastrointestinalDisease : '',
        lipidStatus: this.data.lipidStatus ? this.data.lipidStatus : '',
        osteoporosis: this.data.osteoporosis ? this.data.osteoporosis : '',
        spondylopathy: this.data.spondylopathy ? this.data.spondylopathy : '',
        systolicPressure: this.data.systolicPressure ? this.data.systolicPressure : '',
        respiratoryDiseases: this.data.respiratoryDiseases ? this.data.respiratoryDiseases : '',
        sleepDisorders: this.data.sleepDisorders ? this.data.sleepDisorders : '',
        totalCholesterol: this.data.totalCholesterol ? this.data.totalCholesterol : '',
        tumorDiseases: this.data.tumorDiseases ? this.data.tumorDiseases : '',
        weeklyExerciseFrequency: this.data.tumorDiseases,
        bloodPressureSituation: this.data.medicalList[0].state == true ? '2' : '',
        lipidStatus: this.data.medicalList[1].state == true ? '2' : '',
        cerebrovascularDisease: this.data.medicalList[2].state == true ? '1' : '',
        heartDisease: this.data.medicalList[3].state == true ? '1' : '',
        memory: this.data.medicalList[4].state == true ? '1' : '',
        depressiveState: this.data.medicalList[5].state == true ? '1' : '',
        diabetes: this.data.medicalList[6].state == true ? '1' : '',
        carryApoe: this.data.medicalList[7].state == true ? '1' : '',
        littleExercise: this.data.medicalList[8].state == true ? '1' : '',
      },
    }).then(res => {
      console.log(this.data.skip ,'this.data.skip ');
      if (res.code == 200) {
        if (this.data.skip == '5') {
          wx.switchTab({
            url: '/page/brain/index'
          })
        }
        console.log(typeof this.data.skip)
        if (this.data.skip == '0') { //线上
          wx.redirectTo({
            url: '/packageHome/pages/selective/index?latitude=' + this.data.latitude + '&longitude=' + this.data.longitude
          })
        } else if (this.data.skip == '1') {
          if (app.globalData.sceneParams.userId && app.globalData.sceneParams.code) {
            wx.reLaunch({
              url: '/packageHome/pages/interests/index',
            })
          } else {
            wx.redirectTo({
              url: '/packageHome/pages/interests/index',
            })
          }
        } else if (this.data.skip == '2') {
          wx.redirectTo({
            url: '/packageHome/pages/serve/index?type=tc',
          })
        } else if (this.data.skip == '3') {
          app.globalData.gamesDatas.estimateOrderType = null;
          wx.navigateTo({
            url: '/packageHome/pages/gameSku/testHome/index',
          })
        } else if (this.data.skip == '4') {
          wx.redirectTo({
            url: '/packageHome/pages/confirmOrder/index?id=' + this.data.goodId +'&prodCode=' + this.data.prodCode,
          })
        } else if (this.data.skip == '6') {
          wx.switchTab({
            url: '/page/my/index',
          })
        } else if (this.data.skip == '7') {
          wx.redirectTo({
            url: '/packageHome/pages/interests/index',
          })
        } else if (this.data.skip == '8') {
          wx.redirectTo({
            url: '/packageTrain/pages/record/index',
          })
        } else if (this.data.skip == '9') {
          wx.redirectTo({
            url: '/packageHome/pages/booking/index',
          })
        } else if (this.data.skip == '10') {
          wx.redirectTo({
            url: '/packageHome/pages/meal/index?str=' + this.data.type
          })
        } else if (this.data.skip == '11') {
          console.log('111111');
          wx.redirectTo({
            url: '/packageHome/pages/newReport/index',
          })
        } else if (this.data.skip == '12') {
          // this.setData({
          //   path: '/packageHome/pages/cadie/index'
          // })
          wx.setStorageSync('isChange', 1)
          // wx.navigateBack({
          //   delta: 1,
          // })
          wx.redirectTo({
            url: '/packageHome/pages/cadie/index',
          })
        } else if (this.data.skip == '13') {
          wx.redirectTo({
            url: '/packageHome/pages/marketing/index',
          })
        } else if (this.data.pageUrl) {
          wx.redirectTo({
            url: this.data.pageUrl,
          })
        }
      }
    })
  },

  // weight:this.data.nickname,updateArch
  // 获取用户信息
  getUser() {
    api.getInfo({}).then((res) => {
      switch (res.data.healthRecordsDetailVO?.healthRecordsBase.education) {
        case '0':
          this.setData({
            index: 0
          })
          break
        case '1':
          this.setData({
            index: 1
          })
          break
        case '2':
          this.setData({
            index: 2
          })
          break
        case '3':
          this.setData({
            index: 3
          })
          break
        case '4':
          this.setData({
            index: 4
          })
          break
        default:
          this.setData({
            index: 0
          })
      }
      this.setData({
        avatarUrl: res.data.avatarUrl,
        nickname: res.data.nickname,
        phone: res.data.phone,
        gender: res.data.healthRecordsDetailVO?.healthRecordsBase?.sex ? res.data.healthRecordsDetailVO?.healthRecordsBase?.sex : '',
        date: res.data.healthRecordsDetailVO?.healthRecordsBase.birthday == null ? '1953-01-01' : res.data.healthRecordsDetailVO?.healthRecordsBase.birthday,
        height: res.data.healthRecordsDetailVO?.healthRecordsDetail.height ? res.data.healthRecordsDetailVO?.healthRecordsDetail.height : '', //身高
        weight: res.data.healthRecordsDetailVO?.healthRecordsDetail.weight ? res.data.healthRecordsDetailVO?.healthRecordsDetail.weight : '', //体重
        education: res.data.healthRecordsDetailVO?.healthRecordsBase.education, //学历
        ['medicalList[0].state']: res.data.healthRecordsDetailVO?.healthRecordsDetail.bloodPressureSituation == '2' ? true : false,
        ['medicalList[1].state']: res.data.healthRecordsDetailVO?.healthRecordsDetail.lipidStatus == '2' ? true : false,
        ['medicalList[2].state']: res.data.healthRecordsDetailVO?.healthRecordsDetail.cerebrovascularDisease == '1' ? true : false,
        ['medicalList[3].state']: res.data.healthRecordsDetailVO?.healthRecordsDetail.heartDisease == '1' ? true : false,
        ['medicalList[4].state']: res.data.healthRecordsDetailVO?.healthRecordsDetail.memory == '1' ? true : false,
        ['medicalList[5].state']: res.data.healthRecordsDetailVO?.healthRecordsDetail.depressiveState == '1' ? true : false,
        ['medicalList[6].state']: res.data.healthRecordsDetailVO?.healthRecordsDetail.diabetes == '1' ? true : false,
        ['medicalList[7].state']: res.data.healthRecordsDetailVO?.healthRecordsDetail.carryApoe == '1' ? true : false,
        ['medicalList[8].state']: res.data.healthRecordsDetailVO?.healthRecordsDetail.littleExercise == '1' ? true : false,
        capabilityList: res.data.healthRecordsDetailVO?.capabilityList,
        familyHistoryList: res.data.healthRecordsDetailVO?.familyHistoryList,
        prevalenceList: res.data.healthRecordsDetailVO?.prevalenceList,
        sportsHobbiesList: res.data.healthRecordsDetailVO?.sportsHobbiesList,
        username: res.data.healthRecordsDetailVO?.healthRecordsBase.name ? res.data.healthRecordsDetailVO?.healthRecordsBase.name : '',
        relations: res.data.healthRecordsDetailVO?.healthRecordsBase.relations,
        arthritis: res.data.healthRecordsDetailVO?.healthRecordsDetail.arthritis,
        diastolicPressure: res.data.healthRecordsDetailVO?.healthRecordsDetail.diastolicPressure,
        gastrointestinalDisease: res.data.healthRecordsDetailVO?.healthRecordsDetail.gastrointestinalDisease,
        lipidStatus: res.data.healthRecordsDetailVO?.healthRecordsDetail.lipidStatus,
        osteoporosis: res.data.healthRecordsDetailVO?.healthRecordsDetail.osteoporosis,
        respiratoryDiseases: res.data.healthRecordsDetailVO?.healthRecordsDetail.respiratoryDiseases,
        sleepDisorders: res.data.healthRecordsDetailVO?.healthRecordsDetail.sleepDisorders,
        spondylopathy: res.data.healthRecordsDetailVO?.healthRecordsDetail.spondylopathy,
        systolicPressure: res.data.healthRecordsDetailVO?.healthRecordsDetail.systolicPressure,
        totalCholesterol: res.data.healthRecordsDetailVO?.healthRecordsDetail.totalCholesterol,
        tumorDiseases: res.data.healthRecordsDetailVO?.healthRecordsDetail.tumorDiseases,
        weeklyExerciseFrequency: res.data.healthRecordsDetailVO?.healthRecordsDetail.weeklyExerciseFrequency,
      })
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
    this.getUser()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

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