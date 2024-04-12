import * as echarts from '../../ec-canvas/echarts';
const app = getApp()
const api = require('../../http/api')
function setOption(chart,option) {
  chart.setOption(option);
}
Page({
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.ecComponent = this.selectComponent('#mychart-dom-gauge');
  },
  /**
   * 页面的初始数据
   */
  data: {
    ec: {
      lazyLoad: true
    },
    ossImg:app.globalData.ossImgUrl,
    mildImg:app.globalData.ossImgUrl + 'mild.png',
    normalImg:app.globalData.ossImgUrl + 'normal.png',
    situation:[],
    legType:'diet',
    optionList:[
      {id:'diet',title:'膳食营养'},
      {id:'sports',title:'运动健康'},
      {id:'game',title:'认知激活'}
    ],
    weekList:[],
    weekSequence:1,//选中周
    weekName:"",
    startTime:'',
    endTime:'',
    cognition:{
      value: 50,
      gradientColor: {
        '0%': '#C2F65A',
        '50%': '#33E742',
      },
    },
    state:'',
    menuList:[],
    interventionOrderNumber:'',
    page:0,
    switch:true,
    doctor:false,//列表无数据
    loadStatus:'', //loading-加载中,noData-无数据,failure-加载失败,
    schedule:0, //加载中进度
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getLis()
  },
  //展开
  unfold(e){
    let arr = this.data.situation
    arr.forEach((item)=>{item['turnUp']=false})
    this.setData({
      situation:arr,
      interventionOrderNumber:e.currentTarget.dataset.id,
      [`situation[${e.currentTarget.dataset.index}].turnUp`]:true,
    })
    api.queryWeekList({
      interventionOrderNumber:e.currentTarget.dataset.id
    }).then(res=>{
      this.setData({
        weekName:res.data[0].weekName,
        weekList:res.data,
      })
    })
    this.getPlanDetail()
  },
  //收起
  packUp(e){
    this.setData({
      [`situation[${e.currentTarget.dataset.index}].turnUp`]:false
    })
  },
  //获取列表
  getLis(){
    this.setData({
      page:this.data.page+1
    })
    api.planList({
      pageNum: this.data.page,
      pageSize: 10
    }).then((res) => {
      if (res.code===200) {
        if (res.data.total==0) {
          this.setData({
            loadStatus:'noData',
            situation:[]
          })
        } else {
          if (res.data.data.length<10) {
            this.setData({
              switch:false
            })
          } else {
            this.setData({
              switch:true
            })
          }
          res.data.data.forEach((item)=>{
            item['turnUp']=false;
            let optionList = [];
            console.log(item.interveneType)
            if (0b010 == (item.interveneType & 0b010)){
              optionList.push({id:'diet',title:'膳食营养'})
            }
            if (0b001 == (item.interveneType & 0b001)){
              optionList.push({id:'sports',title:'运动健康'})
            }
            if (0b100 == (item.interveneType & 0b100)){
              optionList.push({id:'game',title:'认知激活'});
            }
            item['optionList'] = optionList;
        })
          let arr = this.data.situation.concat(res.data.data)
          this.setData({
            situation:arr,
          })
        }
      } else {
        this.setData({
          loadStatus:'failure',
          situation:[]
        })
      }
	  })
  },
  
  //获取详情信息
  getPlanDetail(){
    api.planDetail({
      interventionOrderNumber:this.data.interventionOrderNumber,
      knowledgeType: this.data.legType,
      weekSequence: this.data.weekSequence,
    }).then(res => {
      this.setData({
        ['cognition.value']:res.data.completePercent>1?50:Math.round(res.data.completePercent*50),
        state:res.data.interventionPlanStatusName,
        startTime:res.data.interventionStart,
        endTime:res.data.interventionEnd,
        comboName:res.data.comboName,
        menuList:res.data.baseInfoList
      })
      this.init()
	  })
  },
  

  //分类切换
  TabsChange(e){
    if(e.detail.title =='膳食营养'){
      this.setData({
        legType:'diet',
      })
    }
    if(e.detail.title =='运动健康'){
      this.setData({
        legType:'sports',
      })
    }
    if(e.detail.title =='认知激活'){
      this.setData({
        legType:'game',
      })
    }
    this.getPlanDetail()
  },
  //周选择
  bindDateChange: function(e) {
    this.setData({
      weekSequence: Number(e.detail.value)+1,
      weekName:this.data.weekList[e.detail.value].weekName
    })
    this.getPlanDetail()
  },
  init() {
    this.ecComponent.init((canvas, width, height, dpr) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height,
        devicePixelRatio: dpr // new
      });
      const option = {
        angleAxis: {
          // 起始角度，180 也可以是 225
          startAngle: 180,
          max: 360,
          clockwise: true, // 逆时针
          // 隐藏刻度线
          show: false
        },
        radiusAxis: {
          type: 'category',
          show: true,
          axisLabel: {
            show: false
          },
          axisLine: {
            show: false
       
          },
          axisTick: {
            show: false
          }
        },
        polar: {
          center: ['50%', '50%'],
          radius: '180%', //图形大小
        },
        series: [
          {
            type: 'bar',
            z: 2,
            // 数值
            // data: [this.data.three.gameNum / this.data.three.gameTotalNum * 230],
            // data: [this.data.cognition.value * 230],
            data: [0.5 * 180],
            showBackground: true,
            backgroundStyle: {
              color: 'transparent'
            },
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 10,
            barGap: '-100%',
            itemStyle: {
              normal: {
                opacity: 1,
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0,
                    color: '#3E76F5'
                  }, {
                    offset: 1,
                    color: '#3E76F5'
                  }]),
                // shadowBlur: 5,
                // shadowColor: '#2A95F9'
              }
            }
          },
          {
            type: 'bar',
            z: 1,
            // 需要的圆环跨度大小，可以是180,270等
            data: [180],
            coordinateSystem: 'polar',
            roundCap: true,
            barWidth: 10,
            barGap: '-100%',
            itemStyle: {
              normal: {
                opacity: 1,
                color: '#F5F6FA'
              }
            }
          },
        ],
       
      };
      setOption(chart,option);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
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
    if (this.data.switch) {
      this.getLis()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})