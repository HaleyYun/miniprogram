import {
  getStsToken
} from "../http/api"

import {
  base64Encode
} from "./base64"

const CryptoJS = require("../http/aes.js")

// 计算签名。
function computeSignature(accessKeySecret, canonicalString) {
  return CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA1(canonicalString, accessKeySecret));
}

// const policyText = {
//   expiration: date.toISOString(), // 设置policy过期时间。
//   conditions: [
//     // 限制上传大小。
//     ["content-length-range", 0, 1024 * 1024 * 1024],
//   ],
// };

function generateOSSPath(estimate, type, index) { // 生成oss上传路径
  let path = "zskj-object/edb-ad-liet/" + estimate + "/";
  let fileType = ".mp4"
  switch (type) {
    case 0:
      path = path + "correct/" + "correct_" + index + fileType
      break;
    case 1:
      path = path + "eye_move/" + index + "/" + "eye_move_" + index + fileType
      break;
    case 2:
      path = path + "image_memory/" + index + "/" + "image_memory_" + index + fileType
      break;
    default:
      break;
  }
  return path
}

export function upLoadOSS(filePath, estimate, type, index) {
  console.log(estimate,'这是上传upLoadOSS：estimate')
  return new Promise((resolve, reject) => {
    getStsToken().then(res => {
      console.log("res---------", res)
      if (res.code === 200) {

        // let policyObj = JSON.parse(res.data.policy);
        // policyObj.expiration = new Date(policyObj.expiration).toISOString()
        // const policy = base64Encode(JSON.stringify(policyObj))
        const policy = base64Encode(res.data.policy);
        const host = 'https://neuroweave.oss-cn-hangzhou.aliyuncs.com';
        const signature = computeSignature(res.data.accessKeySecret, policy);
        const ossAccessKeyId = res.data.accessKeyId;
        const key = generateOSSPath(estimate, type, index);
        console.log(key,'这是上传路径key包含estimate')
        const securityToken = res.data.securityToken;
        wx.uploadFile({
          url: host,
          filePath: filePath,
          name: 'file', // 必须填file。
          formData: {
            key,
            policy,
            OSSAccessKeyId: ossAccessKeyId,
            signature,
            'x-oss-security-token': securityToken // 使用STS签名时必传。
          },
          success: (res) => {
            console.log("oss上传", res)
            if (res.statusCode === 204) {
              console.log('上传成功');
              let data = {
                code: 200,
                data: "https://neuroweave.oss-cn-hangzhou.aliyuncs.com/" + key
              }
              console.log(data,'请求的data')
              resolve(data)
            }
          },
          fail: err => {
            console.log("oss", err);
            reject(err)
          }
        });
      }
    })
  })

}