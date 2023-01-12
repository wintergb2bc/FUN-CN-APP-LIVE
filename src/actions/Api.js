window.openOrien = ""; //是否开启竖屏锁定
window.LiveChatX = ""; //克服
window.userNameDB = ""; //
window.lookBox = false; // 先去瞧瞧
window.memberCode = ""; //用戶memberCode
window.UpdateV = 5000;
window.Rb88Version = "1.0.7.0"; //版本號
window.SBTDomain;
window.SuccessURL = "f1p5native://"; // POST存款要帶
window.affCodeKex = ""; //代理號
window.rafCodeKex = ""; //推薦好友碼
window.isGameLock = false;
window.E2Backbox = "No dataBase"; // 黑盒子
window.Iovation = "No dataBase"; // 黑盒子
window.LiveChatOpen = false; //客服
window.LivechatDragType = false; // 客服懸浮球
window.DeviceInfoIos = true; //ios手机型号是没有指纹的
window.VPNCheck = false; //VPN是否打开
window.memberDataLogin = null; //从 api/Login拿到的member数据
window.Devicetoken = "";
window.userMAC = "";
window.UmPma = false; /// 給友盟推送近PMA 如未登錄 先登錄後跳進PMA by benji
window.IM_Token = "";
window.IM_MemberCode = "";
window.loginStatus = "";
window.VendorData = ""; //当前的Vendor，
window.lowerV = "IM"; //当前游戏
window.notificationInfo = ""; //游戏推送
window.notificationRecommend = ""; //消息推送
global.Toasts = "";
window.GameListNum = 0; //游戏个数
window.bonusState = false; //充值优惠申请是否成功
window.isMobileOpen = false; //是否mobile跳转过来，带token
window.GetE2 = false;
window.EuroCupLogin = false;
window.maintenanceLiveChatXT = ""; //维护客服
(window.MAIN = 0), (window.LoginPatternHeight = 0); //九宫格高度差
window.LoginTouchNum = 0; //指纹脸部错误次数，3次不能使用
window.LoginPatternNum = 0; //九宫格错误次数，3次不能使用
window.FastLoginErr = 0; //是否快速登陆
window.lockLogin = 0; //登陆错误锁定账号次数
window.getMiniGames = false;
window.DeviceSignatureBlackBox = ""; //otp验证设备参数
window.NAVBGColor = "#00aeef"; //导航栏背景颜色
window.isSTcommon_url = false;
window.BankCardPhoneVerify = false//判断姓名银行卡手机验证是否通过，通过未登出前就不需要再验证

//live的
window.CMS_token = '71b512d06e0ada5e23e7a0f287908ac1'
window.CMS_Domain = 'https://cache.f866u.com'

// ST
if (window.isStaging) {
  window.CMS_token = "71b512d06e0ada5e23e7a0f287908ac1";
  window.CMS_Domain = "https://f1-api-stage-web.fubnb.com";
  window.News_Domain = "https://www.tlc232.com";
  window.Euro_Domain = "https://shsbwkpf.funpo.com:2041/sports-data-gateway";
} else if (common_url === "https://gateway-idcslf5.gamealiyun.com") {
  // 灰度 SL
  window.CMS_token = "71b512d06e0ada5e23e7a0f287908ac1";
  window.CMS_Domain = "https://slapi.550fun.com";
  window.News_Domain = "https://www.tlc232.com";
  window.Euro_Domain = "https://shsbwkpf.funpo.com:2041/sports-data-gateway";
}
// else {
//   window.CMS_Domain = "https://f1-api-stage-web.fubnb.com";
// }

window.ApiPort = {
  Token: null, // 用戶token
  ReToken: null, // 用戶REtoken
  X_Biff_key: "I8lVSVRQNUSGY8Tg1WoEzQ==",
  UserLogin: false, //用戶登錄狀態
  app: "/api/app?", //獲取app info
  login: "/api/Auth/Login?", //獲取登入地址  POST
  MemberRegister: "/api/Member/Register?", //註冊
  CallBack: "/api/Member/VIP/CallBack?", // vip cs call
  logout: "/api/Auth/Logout?", //登出    POST
  NotificationOne: "/api/Notification?", //POST 第一次開app 註冊友盟個推
  NotificationLogin: "/api/Notification?", //PATCH 第一次開app 註冊友盟個推
  LiveChat: "/api/LiveChat/Url?", //克服
  ForgetPasswordByEmail: "/api/Auth/ForgetPassword/Email?", //忘记密码
  ForgetUsernameByEmail: "/api/Auth/ForgetUsername/Email?", //忘记账户
  PhoneVerify: "/api/Verification/Phone?", //获取手机验证码
  PhoneTAC: "/api/Verification/Phone?", //验证手机
  EmailVerify: "/api/Verification/Email?", //获取邮箱验证码
  EmailTAC: "/api/Verification/Email?", //验证手机验证码
  ResendAttempt: "/api/Verification/ResendAttempts", //获取手机验证码到期时间
  VerificationAttempt: "/api/Verification/OTPAttempts", //邮箱电话获取剩余验证次数
  Balance: "/api/Balance?", //获取金额
  MemberDailyTurnoverByProductType: "/api/Member/MemberDailyTurnoverByProductType", //新投注記錄
  MemberTurnoverHistory: "/api/BI/MemberTurnoverHistory?", //  //新投注記錄 20210319
  MemberDailyTurnoverDetail: "/api/BI/MemberDailyTurnoverItem", //  //新投注記錄详情
  DailyTurnoverProductTypes: '/api/Games/DailyTurnover/ProductTypes?', // 獲取投注記錄分類
  UnreadMessage: "/api/PersonalMessage/UnreadCounts?", //获取未读消息
  ProductCategories: "/api/BI/ProductCategories?", //反水，投注记录筛选
  GetAnnouncements: "/api/Announcement/Announcements?",
  GetAnnouncementDetail: "/api/Announcement/AnnouncementIndividualDetail",
  GetMessages: "/api/PersonalMessage/InboxMessages",
  GetMessageDetail: "/api/PersonalMessage/InboxMessageIndividualDetail",
  UpdateMessage: "/api/PersonalMessage/ActionOnInboxMessage?",
  UpdateAnnouncement: "/api/Announcement/ActionOnAnnouncement?",
  GetMemberNotificationSetting: "/api/Vendor/NotificationSetting/SBS?",
  EditMemberNotificationSetting: "/api/Vendor/NotificationSetting/SBS?",
  Wallets: "/api/Transfer/Wallets?", //獲取目標帳戶
  Member: "/api/Member?", // 會員數據 Get
  Transfer: "/api/Transfer/Applications?", //轉帳
  POST_Transfer: "/api/Transfer/Application?",
  PaymentApplications: "/api/Payment/Application?", //付款
  GET_PaymentApplications: "/api/Application/Histories?", //付款
  GetCryptocurrencyInfo: "/api/Payment/Cryptocurrency/Details", //极速虚拟币支付
  GetProcessingDepositbyMethod:
    "/api/Payment/Transaction/ProcessingDepositbyMethod?", // new 极速虚拟币支付提交
  ProcessInvoiceAutCryptoDeposit:
    "/api/Payment/Cryptocurrency/ProcessInvoiceAutCryptoDeposit", //虛擬幣2成功充值
  POSTMemberCancelDeposit: "/api/Payment/Application/MemberCancelDeposit?", //取消交易
  Payment: "/api/Payment/Methods", //存款
  SuggestedAmount: "/api/Payment/SuggestedAmounts?", // 充值檢測SuggestedAmount
  PaymentDetails: "/api/Payment/Method/Details", //充值細節
  BonusCalculate: "/api/Bonus/Calculate?", //存款轉帳優惠 檢測
  Bonus: "/api/Bonus", // 存款主賬優惠
  ConfirmStep: "/api/Payment/Application/ConfirmStep?", //本銀 在線支付 完成請求
  GetIMToken: "/api/Vendor/IPSB/Token?",
  BonusApplications: "/api/Bonus/Application?",
  POST_BonusApplications: "/api/Bonus/Application?",
  GETSBTToken: "/api/Vendor/SBT/Token?", //BTI舊版
  GETBTIToken: "/api/Vendor/BTI/Token?", //BTI新版
  GETBalanceSB: "/api/Balance?wallet=SB&",
  BankCardVerification: '/api/Verification/Payment/BankCard?',//提交身份证银行卡姓名
  GetSelfExclusionRestriction: '/api/Member/GetSelfExclusionRestriction?',
  GetMemberBanks: "/api/Payment/MemberBanks?", //用戶銀行卡
  POST_MemberBanks: "/api/Payment/MemberBank?", //用戶銀行卡
  PATCHMemberBanksDefault: "/api/Payment/MemberBanks/",
  ClosestPrefixAmount: "/api/Payment/ClosestPrefixAmount?", //SR 快速提款建議金額

  GetProvidersMaintenanceStatus: "/api/Games/Providers/MaintenanceStatus?",
  Password: "/api/Auth/ChangePassword?oldPasswordRequired=false&",
  ChangePassword: "/api/Auth/ChangePassword?oldPasswordRequired=true&",
  NotifyBettingInfo: "/api/Vendor/NotifyBettingInfo/SBS?",
  CancelPaybnbDeposit:
    "/api/Payment/Applications/Transactions/CancelPaybnbDeposit?",
  Games: "/api/Games/Launch?",
  GetGame: "/api/Games?",
  GameProvidersDetails: "/api/Games/Providers/Details?",
  GameCategories: "/api/Games/Categories/Details?",
  GameMaintenanceStatus: '/api/Games/Navigation/MaintenanceStatus?',
  AccountHolderName: '/api/Verification/AccountHolderName?',//提款SNC0001 call，再去上传身份证

  // 欧洲杯
  getEuroTeamStat: "/api/v1.0/brands/FUN88/teams/stats?", // 球队数据
  getEuroGroupList: "/api/v1.0/brands/FUN88/groups?", // 球队排名
  getEuroPlayer: "/api/v1.0/brands/FUN88/players/stats/", // 球员数据

  /* 优惠 */
  GetPromotions: "/api/CMS/Promotions?",
  /* 申请优惠 */
  ApplicationsBonus: "/api/Promotion/ManualPromo?",
  /* 领取红利 */
  ClaimBonus: "/api/Bonus/Claim?",
  /* 取消优惠 */
  CancelPromotion: "/api/Bonus/CancelPromotion?",
  /* 每日好礼 */
  // DailyDealsPromotion: "/api/CMS/DailyDealsPromotion?",
  DailyDealsPromotion: "/api/Promotion/DailyDeals?",

  /* 获得城镇地址 */
  AddressTown: "/api/Promotion/Town?",
  /* 获得市区地址 */
  AddressDistrict: "/api/Promotion/District?",
  /* 获得省份地址 */
  AddressProvince: "/api/Promotion/Province?",
  /* 地址相关 */
  ShippingAddress: "/api/Promotion/ShippingAddress?",
  /* 删除地址 */
  DeleteShippingAddress: "/api/Promotion/ShippingAddress",
  /* 申请每日好礼 */
  ApplyDailyDeals: "/api/Promotion/DailyDeals?",
  /* 好礼记录 */
  DailyDealsHistory: "/api/CMS/DailyDealsHistory?",
  /* 取消存款 */
  MemberRequestDepositReject:
    "/api/Payment/Application/MemberRequestDepositReject?",

  GetProfileMasterData: "/api/Setting/MasterData/Nations?",

  BankingHistory: "/api/Payment/Application/BankingHistory?",
  CryptoExchangeRate: "/api/Payment/Cryptocurrency/ExchangeRate?", //加密貨幣匯率
  TransferApplicationsByDate: "/api/Transfer/Histories", //轉賬紀錄
  CryptoWallet: "/api/Payment/Cryptocurrency/WalletAddress", //加密貨幣錢包
  CryptoWalletSetDefault: "/api/Payment/Cryptocurrency/WalletAddress/Default?",
  SetDefault: "/api/Payment/MemberBank/SetDefault?", //預設銀行卡
  SendSmsOTP: "/api/Verification/Payment/Phone?",
  Register: "/api/Member?", //註冊   POST
  Banner: "/api/CMS/Banners?", //banner 數據 Get
  GetEmailVerifyCode: "/api/Verification/Email?",
  PostEmailVerifyTac: "/api/Verification/Email?",
  GetPhoneVerifyCode: "/api/Verification/Phone?",
  POSTNoCancellation: "/api/Payment/Application/Cancellation?", //提款記錄取消
  GetResubmitOnlineDepositDetails:
    "/api/Payment/Transaction/ResubmitDepositDetails?",
  PostPhoneVerifyCode: "/api/Verification/Phone?",
  CreateResubmitOnlineDeposit:
    "/api/Payment/Transaction/CreateResubmitOnlineDeposit?",
  GetTransactionHistory: "/api/Payment/Transaction/History?",
  UploadAttachment: "/api/Payment/Application/UploadAttachment?",
  GetSecretQuestions: "/api/Setting/MasterData/SecurityQuestions?",

  PhonePrefix: "/api/Setting/Phone/Prefix?",

  // sb CMS
  Sequence: "/api/Games/Providers/Sequence?",

  // Sequence: '/api/Games/Providers/Sequence?',
  // https://native-stgf1p5.gamealiyun.com/api/Games/Providers/Sequence?api-version=1.0&brand=FUN88&Platform=IOS
  // https://native-stgf1p5.gamealiyun.com/api/Games/Providers/Sequence?api-version=1.0&brand=FUN88&Platform=IOS
  CMS_Banner: "/zh-hans/api/v1/app/webbanners/position/home_main",
  CMS_BannerFeature: "/zh-hans/api/v1/app/webbanners/position/home_feature",
  CMS_BannerProfile: "/zh-hans/api/v1/app/webbanners/position/profile_feature",
  CMS_BannerDeposit: "/zh-hans/api/v1/app/webbanners/position/deposit",
  CMS_BannerWithdraw: "/zh-hans/api/v1/app/webbanners/position/withdraw",
  CMS_BannerWorldCupMain: "/zh-hans/api/v1/app/webbanners/position/worldcup_main",
  CMS_BannerWorldCupGame: "/zh-hans/api/v1/app/webbanners/position/worldcup_game",

  // 世界杯
  worldCupNews: "/zh-hans/api/v1/news",

  worldCupTeams: "/api/Setting/MasterData/TeamsWC22?",


  //帮助中心
  CMS_HelpCenter: "/zh-hans/api/v1/faq",
  getUsdtFaq: "/zh-hans/api/v1/app/usdt/faq", // usdt faq
  CMS_HelpCenterDetail: "/zh-hans/api/v1/app/faq/detail/",
  CMS_Gamefaq: "/zh-hans/api/v1/game/faq/",
  CMS_News: "/zh-hans/api/v1/news",
  CMS_Banner8featurebanner:
    "/zh-hans/api/v1/app/webbanners/position/8shop_featurebanner",
  CMS_Banner8widget: "/zh-hans/api/v1/app/webbanners/position/8shop_widget",
  CMS_Banner8charity: "/zh-hans/api/v1/app/webbanners/position/8charity_widget",
  CMS_PromotionCategory: "/zh-hans/api/v1/promotion/categories",
  CMS_RebateCategory: "/zh-hans/api/v1/promotion/categories?parentName=Rebate",
  CMS_Promotions: "/zh-hans/api/v1/app/promotions?",
  CMS_PromotionsHistory: "/api/v1/bonus/applied/history?",
  CMS_Promotion: "/zh-hans/api/v1/app/promotion",
  CMS_SubCategory: "/zh-hans/api/v1/game/subcategory",
  CMS_GameCategory: "/zh-hans/api/v1/app/game-category",
  CMS_RebateHistory: "/zh-hans/api/v1/rebate/history?",
  CMS_Rebate: "/zh-hans/api/v1/app/rebate?",
  DailyDeals: "/zh-hans/api/v1/promotion/dailydeals/history?",

  CMS_GameProviders: "/zh-hans/api/v1/app/game/provider",
  CMS_Game: "/zh-hans/api/v1/", //获取游戏列表api，需要加ios和android字段

  CMS_VIP: "/zh-hans/api/v1/app/webbanners/position/vip_normal", //vip图片
  CMS_VIP_Roller: "/zh-hans/api/v1/app/webbanners/position/vip_highRoller", //vip图片
  CMS_VIP_Detail: "/zh-hans/api/v1/app/webbanners/position/vip_detail", //vip图片
  CMS_Coin: "/zh-hans/api/v1/app/webbanners/position/coin", //同乐币图片
  CMS_About: "/zh-hans/api/v1/app/about/detail/all", //关于我们vip的内容
  CMS_AboutList: "/zh-hans/api/v1/app/about", //关于我们vip的内容
  CMS_VipList: "/zh-hans/api/v1/app/vip/faq", //关于我们vip的内容

  CMS_Sponsorship: "/zh-hans/api/v1/app/webbanners/position/sponsorship",

  CMS_BannerCategory: "/zh-hans/api/v1/app/webbanners/position",
  feedbackForm: "/api/LiveChat/USDT/Feedback", // 問題反饋

  SelfExclusions: "/api/Member/SelfExclusion?", //自我限制
  Generate: "/api/Auth/GeneratePasscode?", //获取安全码

  //推薦好友
  QueleaActiveCampaign: "/api/Quelea/ActiveCampaign?", //获取彩金信息
  QueleaReferrerInfo: "/api/Quelea/ReferrerInfo?",
  ReferrerEligible: "/api/Quelea/ReferrerEligible?",
  ReferrerSignUp: "/api/Quelea/ReferrerSignUp?",
  ReferrerActivity: "/api/Quelea/ReferrerActivity?",
  ReferrerRewardStatus: "/api/Quelea/ReferrerRewardStatus?",
  CMS_ReferBanner: "/zh-hans/api/v1/app/webbanners/position/referfriend",

  MemberDocuments: "/api/Verification/MemberDocuments?",
  PostVerification: "/api/Verification/MemberDocument/Upload?",
  WithdrawalNotification: "/api/Verification/WithdrawalNotification?",

  GameTypes: "/api/Games/GameTypes?",

  CustomFlag: '/api/Member/CustomFlag?',//判断是否需要验证手机和银行卡信息，是否可以修改号码
  TeamPreferences: '/api/Member/TeamPreferencesWC22?',//判断是否需要验证手机和银行卡信息，是否可以修改号码
  ConfirmWithdrawalComplete: '/api/Payment/Applications/ConfirmWithdrawalComplete?',

  MemberWithdrawalThreshold: '/api/Payment/Transaction/MemberWithdrawalThreshold?', // 獲取提款卡額度 detail
  GetWithdrawalThresholdLimit: '/api/Payment/Transaction/WithdrawalThresholdLimit?', // 更新提款卡限額信息
  GetWithdrawalThresholdHistory: '/api/Payment/Transaction/WithdrawalThresholdHistories?', // 更新提款卡限額信息

  // Mini game
  MiniGames: '/api/MiniGames?',
  MiniGamesBanners: '/api/MiniGames/Banners?',
  SnatchPrize: '/api/MiniGames/SnatchPrize?',
  PrizeHistory: '/api/MiniGames/PrizeHistory?',
  MiniGamesActiveGame: '/api/MiniGames/ActiveGame?',
  MemberProgress: '/api/MiniGames/MemberProgress?',
  AnnouncementPopup: '/api/Announcement/Popup?',//判断是否需要验证手机和银行卡信息，是否可以修改号码

};
