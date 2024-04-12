const app = getApp()
Component({
  properties: {
    // defaultData（父页面传递的数据-就是引用组件的页面）
    title: String,
    path: String
  },
  options: {
    multipleSlots: true
  },
  data: {
    ossImg: app.globalData.ossImgUrl,
    navBarHeight: 0,
    menuRight: 0,
    menuBotton: 0,
    menuHeight: 0,
    isShow:false
  },
  attached: function () {
    const systemInfo = wx.getSystemInfoSync();
    // 胶囊按钮位置信息
    const menuButtonInfo = wx.getMenuButtonBoundingClientRect();
    // 导航栏高度 = 状态栏高度 + 44
    this.setData({
      navBarHeight: systemInfo.statusBarHeight + 44,
      menuRight: systemInfo.screenWidth - menuButtonInfo.right,
      menuBotton: menuButtonInfo.top - systemInfo.statusBarHeight,
      menuHeight: menuButtonInfo.height,
    })
  },
 
  methods: {
  
    goReport() {
      if (this.properties.path == '/page/home/index') {
        wx.switchTab({
          url: '/page/home/index',
        })
      } else if(this.properties.path == '/pages/newReport/index'){
        wx.redirectTo({
          url: '/packageHome/pages/newReport/index',
        })
      }else if(this.properties.path == '/pages/interests/index'){
        if(app.globalData.isShow){
          console.log('做完');
          wx.navigateBack({
            delta: 1,
          })
        }else{
          console.log('没做完');
           this.setData({
            isShow:!app.globalData.isShow
          })
          // app.globalData.isShowModel=true
        }
        
      }else {
       if(app.globalData.which==1){
        wx.switchTab({
          url: '/page/my/index',
        })
       }else{
        wx.redirectTo({
          url: '/packageHome/pages/newReport/index',
        })
       }
       
      }
    },
    confimTrue(){
     
      
      this.setData({
        isShow:false
      })
    },
    commits(){
      wx.navigateBack({
        delta: 1,
      })
    },
  },
})