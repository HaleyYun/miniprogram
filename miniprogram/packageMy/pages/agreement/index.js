const api = require('../../../http/api.js')
Page({
  data: {
    name: '',
    conment: '',
  },
  onLoad(options) {
    this.setData({
      name: options.name
    })
    wx.setNavigationBarTitle({
      title: options.name
    })
    this.getAgreement()
  },
  // 获取协议内容
  getAgreement() {
    api.agreement({
      channelSource: 1
    }).then((res) => {
      console.log(res)
      if (res.code === 200) {
        let data = res.data.filter(item => item.agreementName === this.data.name)
        console.log(data)
        this.setData({
          conment: data[0].serviceAgreement
        })
      }
    })
  },
  goBack(){
    wx.navigateBack({
      url: '/page/my/system/index'
    })
  },
})