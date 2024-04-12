// packageHealth/pages/dishesDetails/index.js
const app = getApp()
const api = require('../../../http/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ossImg:app.globalData.ossImgUrl,
    labelList:[],
    materialList:[],
    nourishmentList:[
      {id:1,name:'热量',quantity:'0',url:app.globalData.ossImgUrl+'nutrition4.png',units:'千卡/毫克'},
      {id:2,name:'蛋白质',quantity:'0',url:app.globalData.ossImgUrl+'nutrition5.png',units:'克'},
      {id:3,name:'碳水化合物',quantity:'0',url:app.globalData.ossImgUrl+'nutrition6.png',units:'克'},
      {id:4,name:'脂肪',quantity:'0',url:app.globalData.ossImgUrl+'nutrition7.png',units:'克'},
      {id:5,name:'胆固醇',quantity:'0',url:app.globalData.ossImgUrl+'nutrition1.png',units:'毫克'},
      {id:6,name:'膳食纤维',quantity:'0',url:app.globalData.ossImgUrl+'nutrition2.png',units:'千卡'},
      {id:7,name:'锌',quantity:'0',url:app.globalData.ossImgUrl+'nutrition9.png',units:'毫克'},
      {id:8,name:'胡罗卜素',quantity:'0',url:app.globalData.ossImgUrl+'nutrition3.png',units:'微克'},
      {id:9,name:'磷',quantity:'0',url:app.globalData.ossImgUrl+'nutrition9.png',units:'毫克'},
      {id:10,name:'硫胺素',quantity:'0',url:app.globalData.ossImgUrl+'nutrition8.png',units:'毫克'},
      {id:11,name:'铁',quantity:'0',url:app.globalData.ossImgUrl+'nutrition9.png',units:'毫克'},
      {id:12,name:'维生素C',quantity:'0',url:app.globalData.ossImgUrl+'nutrition8.png',units:'克'},
      {id:13,name:'钙',quantity:'0',url:app.globalData.ossImgUrl+'nutrition9.png',units:'毫克'},
      {id:14,name:'核黄素',quantity:'0',url:app.globalData.ossImgUrl+'nutrition8.png',units:'毫克'},
      {id:15,name:'镁',quantity:'0',url:app.globalData.ossImgUrl+'nutrition9.png',units:'毫克'},
      {id:16,name:'烟酸',quantity:'0',url:app.globalData.ossImgUrl+'nutrition8.png',units:'毫克'},
      {id:17,name:'锰',quantity:'0',url:app.globalData.ossImgUrl+'nutrition9.png',units:'毫克'},
      {id:18,name:'维生素E',quantity:'0',url:app.globalData.ossImgUrl+'nutrition8.png',units:'克'},
      {id:19,name:'铜',quantity:'0',url:app.globalData.ossImgUrl+'nutrition9.png',units:'毫克'},
      {id:20,name:'维生素A',quantity:'0',url:app.globalData.ossImgUrl+'nutrition8.png',units:'毫克'},
      {id:21,name:'钾',quantity:'0',url:app.globalData.ossImgUrl+'nutrition9.png',units:'毫克'},
      {id:22,name:'视黄醇当量',quantity:'0',url:app.globalData.ossImgUrl+'nutrition8.png',units:'微克'},
      {id:23,name:'硒',quantity:'0',url:app.globalData.ossImgUrl+'nutrition9.png',units:'微克'},
      {id:24,name:'钠',quantity:'0',url:app.globalData.ossImgUrl+'nutrition9.png',units:'毫克'},
    ],
    events:false,
    procedureList:[],
    id:0,
    res:{},
  },
  events(){
    this.setData({
      events:!this.data.events
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id:options.id
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
    api.recipeDetails({
      id:Number(this.data.id)
    }).then(res=>{
      let arr = res.data.stepsList
      let arrLabel = ['一','二','三','四','五','六','七','八','九','十',
                      '十一','十二','十三','十四','十五','十六','十七','十八','十九','二十',
                      '二十一','二十二','二十三','二十四','二十五','二十六','二十七','二十八','二十九','三十',
                      '三十一','三十二','三十三','三十四','三十五','三十六','三十七','三十八','三十九','四十',
                      '四十一','四十二','四十三','四十四','四十五','四十六','四十七','四十八','四十九','五十']
      arr.forEach((item,index)=>{item.id='步骤'+arrLabel[index]})
      this.setData({
        res:res.data,
        labelList:res.data.labelList,
        materialList:res.data.materialList,
        procedureList:arr,
        ['nourishmentList[0].quantity']:res.data.heat,
        ['nourishmentList[1].quantity']:res.data.protein,
        ['nourishmentList[2].quantity']:res.data.carbohydrates,
        ['nourishmentList[3].quantity']:res.data.fat,
        ['nourishmentList[4].quantity']:res.data.cholesterol,
        ['nourishmentList[5].quantity']:res.data.dietaryFiber, 
        ['nourishmentList[6].quantity']:res.data.zinc,
        ['nourishmentList[7].quantity']:res.data.carotene,
        ['nourishmentList[8].quantity']:res.data.phosphorus,
        ['nourishmentList[9].quantity']:res.data.thiamine,
        ['nourishmentList[10].quantity']:res.data.iron,
        ['nourishmentList[11].quantity']:res.data.vitaminC,
        ['nourishmentList[12].quantity']:res.data.calcium,
        ['nourishmentList[13].quantity']:res.data.riboflavin,
        ['nourishmentList[14].quantity']:res.data.magnesium,
        ['nourishmentList[15].quantity']:res.data.niacin,
        ['nourishmentList[16].quantity']:res.data.manganese,
        ['nourishmentList[17].quantity']:res.data.vitaminE,
        ['nourishmentList[18].quantity']:res.data.copper,
        ['nourishmentList[19].quantity']:res.data.vitaminA,
        ['nourishmentList[20].quantity']:res.data.potassium,
        ['nourishmentList[21].quantity']:res.data.retinolEquivalent,
        ['nourishmentList[22].quantity']:res.data.selenium,
        ['nourishmentList[23].quantity']:res.data.sodium,
      })
      let array=this.data.nourishmentList
      array=array.filter(item=>{return item.quantity!=0})
      this.setData({
        nourishmentList:array
      })
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