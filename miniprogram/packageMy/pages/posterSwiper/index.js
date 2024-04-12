const app = getApp()
const api = require('../../../http/api.js')
const util = require('../../../util/util')
Page({
  data: {
    ossImg: app.globalData.ossImgUrl,
    imgArr: [],
    currentIndex: 0,
    index: 0,
    flag: true,
    equityId: 0,
    postTempleteUrl: '',
    employeeId: 0,
    imgs: '',
    noSwiper: false
  },
  onLoad(options) {
    this.setData({
      equityId: Number(options.equityId),
      employeeId: wx.getStorageSync('employeeId')
    })
    this.getImgList()
  },
  changeIndex(e) {
    // console.log("e.detail.current", e);
    // console.log("e.detail.current", e.detail.current);
    // if (e.detail.source == "touch") {
    //   console.log('aaaaaaaa')
    //   this.setData({
    //     index: e.detail.current,
    //     currentIndex: e.detail.current
    //   })
    // }
    this.setData({
      current: e.detail.current //更新当前swiper的索引值
    })
  },

  // 上一页
  prevSwiper() {
    if (this.data.currentIndex) {
      const index = this.data.currentIndex - 1 < 0 ? this.data.imgArr.length - 1 : this.data.currentIndex - 1;
      this.setData({
        currentIndex: index,
      });
    }
  },
  // 下一页
  nextSwiper() {
    const index = this.data.currentIndex + 1 > this.data.imgArr.length - 1 ? 0 : this.data.currentIndex + 1;
    this.setData({
      currentIndex: index,
    });
  },
  // 点击轮播图 预览大图
  // (1) 给轮播图绑定事件
  // (2) 调用 previewviewImage
  handlePrevewImage(event) {
    const current = event.currentTarget.dataset.url; // urls 第一张图
    // 1. 先构造要预览的图片数组
    const urls = this.data.imgArr.map(v => v); // 是一个数组，预览时可左右翻页
    wx.previewImage({
      current,
      urls,
    })
  },
  stopTouchMove() {
    return false;
  },
  saveImage() {
    this.download()
    // api.getCreatePoster({
    //   code: this.data.equityId,
    //   postTempleteUrl: this.data.imgArr[this.data.currentIndex],
    //   userId: this.data.employeeId,
    // }).then((res) => {
    //   console.log(res)
    //   this.setData({
    //     imgs: res.data
    //   })
    //   this.download()
    // })
  },
  base64ImageHandle(base64) {
    // 指定图片的临时路径
    const path = `${wx.env.USER_DATA_PATH}/image.png`
    // 获取小程序的文件系统
    const fsm = wx.getFileSystemManager()
    // 把arraybuffer数据写入到临时目录中
    fsm.writeFile({
      filePath: path,
      data: base64.replace(/^data:image\/\w+;base64,/, ''),
      encoding: 'base64',
      success: () => {
        wx.showModal({
          title: '保存图片',
          content: '保存图片到手机相册？',
          confirmColor: '#be3a34',
          success: (result) => {
            if (result.confirm) {
              // 把临时路径下的图片，保存至相册
              wx.saveImageToPhotosAlbum({
                filePath: path,
                success: () => {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success'
                  })
                },
                fail: (res) => {
                  console.log(res)
                }
              })
            }
          }
        })
      },
      fail(e) {
        console.log('保存本地图片失败')
      }
    })
  },
  base64src(base64data, fun) {
    const base64 = base64data; //base64格式图片
    const time = new Date().getTime();
    const imgPath = wx.env.USER_DATA_PATH + "/poster" + time + "share" + ".png";
    //如果图片字符串不含要清空的前缀,可以不执行下行代码.
    // const imageData = base64.replace(/^data:image\/\w+;base64,/, "");
    const file = wx.getFileSystemManager();
    file.writeFileSync(imgPath, imageData, "base64");
    fun(imgPath);
    return 
  },



  download() {
    var that = this
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.writePhotosAlbum']) {
          // 已经获得授权，直接存储
          that.base64ImageHandle(that.data.imgArr[that.data.currentIndex])
        } else if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
          // 第一次运行，授权未定义，可以直接保存，系统会一次性询问用户权限
          that.base64ImageHandle(that.data.imgArr[that.data.currentIndex])
        } else {
          // 用户拒绝授权后，打开设置页可以看到授权提示开关
          wx.openSetting({
            success(res) { // 用户授权
              if (res.authSetting['scope.writePhotosAlbum']) {
                that.base64ImageHandle(that.data.imgArr[that.data.currentIndex])
              } else { // 用户拒绝授权
                wx.showToast({
                  title: '权限不足',
                })
              }
            },
            fail(res) {
              wx.showToast({
                title: '设置失败',
              })
            }
          })
        }
      },
      fail(res) {
        console.log(res)
        wx.showToast({
          title: '设置失败',
        })
      }
    })
  },
  getImgList() {
    api.getPosterList({
      employeeId: this.data.employeeId,
      equityId: this.data.equityId
    }).then((res) => {
      if (res.code === 200) {
        let state = res.data.length > 0
        this.setData({
          imgArr: res.data,
          noSwiper: state
        })
      }
    })
  }
})