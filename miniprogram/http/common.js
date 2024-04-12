module.exports = {
  //上传下载
  uploadFile: function (obj) {
    let tempFilePath = obj.filePath;
    let successCb = obj.success;
    let failCb = obj.fail;
    wx.getFileInfo({
      filePath: tempFilePath,
      success: res => {
        if (getApp().globalData.uploadOssStatus) {
          let size = res.size;
          let md5 = res.digest;
          let nameParts = tempFilePath.split('.');
          let suffix = nameParts[nameParts.length - 1];
          this.post({
            url: getApp().globalData.apiBaseUri + '/xilujob.common/params',
            data: {
              md5: md5,
              name: 'nouse.' + suffix
            },
            success: (ret, response) => {
              //拿到签名，直传alioss
              let key = ret.data.key; //存储路径
              wx.uploadFile({
                name: 'file',
                filePath: tempFilePath,
                formData: {
                  key: ret.data.key,
                  OSSAccessKeyId: ret.data.id,
                  success_action_status: 200,
                  policy: ret.data.policy,
                  signature: ret.data.signature
                },
                url: getApp().globalData.alioss.endpoint,
                success: res => {
                  if (res.statusCode !== 200) {
                    if (typeof failCb === 'function') {
                      res.data = {
                        code: 0,
                        msg: '上传阿里云OSS失败'
                      };
                      failCb(res.data, res);
                    } else {
                      wx.showToast({
                        'title': "上传阿里云OSS失败",
                        icon: "none"
                      })
                    }
                    return;
                  }
                  res.data = {
                    code: 1,
                    data: {
                      url: '/' + key
                    }
                  };
                  successCb(res.data, res);
                },
                fail: (res) => {
                  if (typeof failCb === 'function') {
                    res.data = {
                      code: 0,
                      msg: '上传阿里云OSS失败'
                    };
                    failCb(res.data, res);
                  } else {
                    wx.showToast({
                      'title': "上传阿里云OSS失败",
                      icon: "none"
                    })
                  }
                }
              });
            },
            fail: (ret, response) => {
              if (typeof failCb === 'function') {
                return failCb(ret, response);
              }
            }
          });
        } else {
          wx.uploadFile({
            name: 'file',
            filePath: tempFilePath,
            formData: {

            },
            url: getApp().globalData.apiBaseUri + '/common/upload',
            success: res => {
              if (res.statusCode !== 200) {
                if (typeof failCb === 'function') {
                  res.data = {
                    code: 0,
                    msg: '上传失败'
                  };
                  failCb(res.data, res);
                } else {
                  wx.showToast({
                    'title': "上传失败",
                    icon: "none"
                  })
                }
                return;
              }
              let data = JSON.parse(res.data)
              data = {
                code: 1,
                data: {
                  url: data.data.fullurl
                }
              };
              successCb(data, res);
            },
            fail: (res) => {
              if (typeof failCb === 'function') {
                res.data = {
                  code: 0,
                  msg: '上传失败'
                };
                failCb(res.data, res);
              } else {
                wx.showToast({
                  'title': "上传失败",
                  icon: "none"
                })
              }
            }
          });
        }
      }
    });
  },
  // 上传文件
  uploadFileEye: function (url, filePath, name = "file", header = {}, formData = {}) {
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: getApp().globalData.apiBaseUri + url,
        filePath,
        name,
        header,
        formData,
        timeout: 30000,
        success: (res) => {
          resolve(JSON.parse(res.data))
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  // 获取缓存数据
  getCache: function (key, defaultValue) {
    let timestampNow = +new Date() / 1e3,
      result = "";
    timestampNow = parseInt(timestampNow);
    try {
      (result = wx.getStorageSync(key + getApp().globalData.appid)).expire > timestampNow || 0 == result.expire ? result = result.value : (result = "",
        this.removeCache(key));
    } catch (e) {
      result = void 0 === defaultValue ? "" : defaultValue;
    }
    return result || defaultValue;
  },
  // 设置缓存数据
  setCache: function (key, value, expireInSeconds) {
    let timestampNow = +new Date() / 1e3,
      result = true,
      a = {
        expire: expireInSeconds ? timestampNow + parseInt(expireInSeconds) : 0,
        value: value
      };
    try {
      wx.setStorageSync(key + getApp().globalData.appid, a);
    } catch (e) {
      result = false;
    }
    return result;
  },
  // 移除缓存数据
  removeCache: function (key) {
    let result = true;
    try {
      wx.removeStorageSync(key + getApp().globalData.appid);
    } catch (e) {
      result = false;
    }
    return result;
  },
};