const CryptoJS = require("./aes.js") //引用AES源码js 
// 加密
const encrypt =(content)=> {
  let key = CryptoJS.enc.Base64.parse('1b6d64ea3375754cd67209bf501ad03a');
  let encryptResult = CryptoJS.AES.encrypt(content, key, {
      iv: key,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
  });
  return encryptResult.ciphertext.toString();
}

// const  encrypt = (word)=> {
//   let key = CryptoJS.enc.Utf8.parse('1b6d64ea3375754cd67209bf501ad03a');
//   let iv = CryptoJS.enc.Utf8.parse('');
//   let srcs = CryptoJS.enc.Utf8.parse(word);
//   let encrypted = CryptoJS.AES.encrypt(srcs, key, {
//     iv,
//     mode: CryptoJS.mode.CBC,
//     padding: CryptoJS.pad.ZeroPadding
//   });
//   return encrypted.toString();
// };
// 解密
const decrypt =(word)=> {
  var key = CryptoJS.enc.Utf8.parse('1b6d64ea3375754cd67209bf501ad03a');
  let iv = CryptoJS.enc.Utf8.parse('');
  var decrypt = CryptoJS.AES.decrypt(word, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.ZeroPadding
  });
  return decrypt.toString(CryptoJS.enc.Utf8);
};


module.exports = {
  encrypt,
  decrypt,
};

