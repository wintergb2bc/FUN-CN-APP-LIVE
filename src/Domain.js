
window.common_url = "https://gateway-idcf5.gamealiyun.com";
window.SBTDomain = "https://www.cheer58.com"
// TODO 測試環境是true
window.isStaging = false;

CodePushKeyIOS = "dOpBmqieaJEw3pOGkCAEGORfHQyE4ksvOXqog";
CodePushKeyAndroid = "OwFaj8xcOf9rGIV2ji4w6tzi3YBD4ksvOXqog";

//要和codepush的appName對上，用來防止推錯，只有LIVE代碼需要配置
window.CodePushAppNameIOS = "F1M1-P5-ios";
window.CodePushAppNameAndroid = "F1-M1-P5-android";

/*
* ===============線上/灰度環境==================
*/

// LIVE
//window.common_url = "https://gateway-idcf5.gamealiyun.com";
// //灰度域名
// //window.common_url = "https://gateway-idcslf5.gamealiyun.com";
// // sb体育域名
window.common_url_sb = window.common_url;
// SBTDomain = "https://www.fun282.com";
// LIVEDomain = "https://www.fun88asia.com/CN";
//

window.appAndroidId = "com.F1M1P5.soexample";
window.appIOSId = "com.F1M1P5.LIVE";

// //-----體育配置----
// //线上
SportImageUrl= 'https://simg.leyouxi211.com'; //聯賽隊伍圖 線上域名
//SportImageUrl= 'https://simg.letiyu211.com'; //聯賽隊伍圖 線上備用域名
CacheApi= 'https://sapi.leyouxi211.com'; //緩存API 線上域名
//CacheApi= 'https://sapi.letiyu211.com'; //緩存API 線上備用域名
window.SmartCoachApi = 'https://api.live.smartcoach.club';	  //PRD线上情报分析
//
// //-----IM配置------
// //线上
window.IMAccessCode = '2cc03acc80b3693c'; //fun線上
window.IMApi = 'https://gatewayim.bbentropy.com/api/mobile/'; //fun線上  proxy
// //歐洲杯相關的聯賽ID
// window.EuroCup2021LeagueIds = [17796];
// //歐洲杯比賽時間
window.EuroCup2021FirstEventTime = '2021-06-11T15:00:00.0000000-04:00'; //第一場
window.EuroCup2021FinalEventTime = '2021-07-11T15:00:00.0000000-04:00'; //最後一場
EuroCup2021CountDownEndTime = '2021-06-12T00:00:00.0000000+08:00'; //12 June 2021 00:00:00 GMT +8

// world cup
window.WorldCup_Domain = "https://cache.funlove88.com";

//-----BTI配置-----
//线上
window.BTIAuthApiProxy ='https://leyouxi211.com/api/sportsdata/';   //線上域名
// BTIAuthApiProxy: 'https://letiyu211.com/api/sportsdata/'; //線上備用域名
window.BTIApi ='https://prod213.1x2aaa.com/api/sportsdata/'; //fun線上
window.BTIRougeApi = 'https://prod213.1x2aaa.com/api/rogue/'; //bti新版api(目前僅支持cashout)
window.BTIAnnouncements= 'https://gatewayim.bbentropy.com/json_announcements.aspx'; //fun線上 proxy服 用im的域名轉bti的公告
//
// //-----沙巴配置-----
// //线上
window.SABAAuthApi = 'https://sabaauth.leyouxi211.com/'; //只有login有cors限制，其他不用
// window.SABAApi = 'https://api.wx7777.com/'; //沙巴 全球線 備用
window.SABAApi = 'https://api.neo128.com/'; //沙巴 中國專用線
