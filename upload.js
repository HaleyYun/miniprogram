const ci = require('miniprogram-ci');
// const fs = require('fs');
/* 项目配置 */
const projectConfig = require('./project.config.json'); // 就是小程序的配置文件
const versionConfig = require('./version.config.json');
// new ci实例
const project = new ci.Project({
  appid: projectConfig.appid,
  type: 'miniProgram',
  projectPath: projectConfig.miniprogramRoot,
  privateKeyPath: './ci-private.key',
  ignores: ['node_modules/**/*'],
});
/** 上传 */
async function upload({
  version = '0.0.0',
  versionDesc = 'test'
}) {
  await ci.upload({
    project,
    version,
    desc: versionDesc,
    setting: {
      es7: true,
      minify: true,
      autoPrefixWXSS: true
    },
    onProgressUpdate: console.log,
  })
}
/** 入口函数 */
async function init() {
  // const warning = await ci.packNpm(project, {
  //   ignores: ['pack_npm_ignore_list'],
  //   reporter: (infos) => {
  //     console.log(infos)
  //   }
  // })
  // console.warn(warning)
  // 上传
  await upload(versionConfig);
}
init();