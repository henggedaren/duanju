/*开发环境 */
// 测试网
const dev_home = {
  BASE_API: 'http://www.duanju.cc/api/',
}

/*外网*/
const prod = {
  BASE_API: 'https://ai-img.ycubbs.cn/api/',
}

// 小程序id
// #ifdef MP-WEIXIN
const VIDEO_AD_ID = '';
// #endif

// #ifndef MP-WEIXIN
const VIDEO_AD_ID = '';
// #endif
/*
=================注意根据需要改变环境================
 */
//const environment = dev_home;
const environment = prod;

export default {
  BASE_API: environment.BASE_API,
  VIDEO_AD_ID: VIDEO_AD_ID,
}