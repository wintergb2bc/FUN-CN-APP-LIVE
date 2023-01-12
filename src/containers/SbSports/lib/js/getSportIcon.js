//體育id對應體育圖的x-y座標
//已按座標設置好文件名，選中加s  例：足球: 1-1.png 選中 1-1s.png
const sporticonMap = {
  NOTFOUND: '6-7', //找不到一律用 其他
  IM: {
    // 體育列表 參考lib/vendor/im/IMConsts.js
    S_1: '1-1', //   SOCCER: 1, //足球
    S_2: '1-2', //   BASKETBALL: 2, //篮球
    S_3: '1-3', //   TENNIS: 3, //网球
    S_6: '4-6', //   ATHLETICS: 6, //田径
    S_7: '2-3', //   BADMINTON: 7, //羽毛球
    S_8: '2-1', //   BASEBALL: 8, //棒球
    S_11: '2-5', //   BOXING: 11, //拳击
    S_13: '2-7', //   Cricket: 13, 板球(額外追加)
    S_15: '3-6', //   DARTS: 15,  //飞镖
    S_18: '1-7', //   LAWNHOCKEY: 18, //草地曲棍球
    S_19: '1-6', //   FOOTBALL: 19, //美式足球
    S_21: '7-7', //   GOLF: 21, //高尔夫球
    S_23: '3-1', //   HANDBALL: 23, //手球
    S_25: '1-7', //   ICEHOCKEY: 25, //冰上曲棍球
    S_29: '12-1', //   MOTOR: 29, //赛车运动
    S_31: '2-6', //   RUGBY: 31, //橄榄球
    S_32: '6-4', //   SAILING: 32, //帆船
    S_34: '2-4', //   SNOOKER: 34, //斯诺克 / 英式台球, 包括亚洲 9 球和台球
    S_36: '4-5', //   TABLETENNIS: 36, //乒乓球
    S_39: '7-1', //   VIRTUALSOCCER: 39, //虚拟足球
    S_40: '2-2', //   VOLLEYBALL: 40, //排球, 包括沙滩排球
    S_41: '3-7', //   WATERPOLO: 41, //水球
    S_43: '7-3', //   VIRTUALBASKETBALL: 43, //虚拟篮球
    S_44: '12-3', //   VIRTUALWORLDCUP: 44, //虚拟世界杯
    S_45: '17-4', //   ENTERTAINMENTBETTING: 45, //娱乐投注
    S_46: '12-5', //   VIRTUALNATIONALCUP: 46, //虚拟国家杯
    S_47: '14-6', //Virtual Soccer England League: 47, //虚拟足球英国联赛(額外追加)
    S_49: '14-7', //Virtual Soccer Spain Friendly: 49, //虚拟足球西班牙友谊赛(額外追加)
    //S_51: '', //Financial Bets: 51, //金融投注(額外追加) (找不到)
    S_52: '15-3', //Virtual Soccer Spain League: 52, //虚拟足球西班牙联赛(額外追加)
    S_53: '15-2', //Virtual Soccer Italy League: 53, //虚拟足球意大利联赛(額外追加)
    //   ALLEXCEPTSOCCER: -1, //所有非足球体育 (只应用于索取赛事信息)
    //   ALL: 98, //所有体育项目(只应用于Search,GetMArketEventCount)
  },
  BTI: {
    // 體育列表 參考lib/vendor/bti/BTIConsts.js
    S_1: '1-1', // SOCCER: 1, //足球
    S_2: '1-2', // BASKETBALL: 2, //篮球
    S_3: '1-6', // FOOTBALL: 3, //美式足球
    S_6: '1-3', // TENNIS: 6, //网球
    S_7: '2-1', // BASEBALL: 7, //棒球
    S_8: '1-7', // ICEHOCKEY: 8, //冰上曲棍球
    S_10: '3-1', // HANDBALL: 10, //手球
    S_11: '7-6', // RUGBYLEAGUE: 11, //橄榄球(聯盟式)
    S_12: '7-7', // GOLF: 12, //高尔夫球
    S_13: '2-4', // SNOOKER: 13, //斯诺克 / 英式台球, 包括亚洲 9 球和台球
    S_14: '12-1', // MOTOR: 14, //赛车运动
    S_15: '3-6', // DARTS: 15,  //飞镖
    S_16: '4-2', // CYCLING: 16, //不清楚(單車競速?)
    S_19: '2-2', // VOLLEYBALL: 19, //排球
    S_20: '2-5', // BOXING: 20, //拳击
    S_25: '1-1', // FUTSAL: 25, //5人制足球
    S_26: '4-5', // TABLETENNIS: 26, //乒乓球
    S_27: '8-4', // BOWLS: 27, //保齡球
    S_28: '8-5', // WINTERSPORTS: 28, //冬季運動
    S_29: '8-6', // HURLING: 29, //板棍球，又称爱尔兰式曲棍球
    S_31: '3-7', // WATERPOLO: 31, //水球
    S_32: '4-3', // BEACHVOLLEYBALL: 32, //沙滩排球
    S_33: '8-7', // BEACHSOCCER: 33, //沙灘足球
    S_34: '2-3', // BADMINTON: 34, //羽毛球
    S_35: '9-1', // RUGBYUNION: 35, //橄榄球(聯合式)
    S_37: '9-3', // CURLING: 37, //冰壺
    S_39: '9-4', // BANDY: 39, //班迪球
    S_41: '9-6', // AUSSIERULES: 41, //澳式足球
    S_43: '10-1', // MMA: 43, //綜合格鬥
    S_59: '2-7', // CRICKET: 59, //板球
    S_63: '11-1', // NETBALL: 63, //籃網球，英式籃球
    S_21: '4-6', // ATHLETICS: 21, //田径
    S_45: '5-6', // SWIMMING: 45, //游泳
    S_42: '9-7', // WINTEROLYMPIC: 42, //冬奧
    S_64: '11-2', // ESPORTS: 64, //電競?
  },
  SABA: {
    // 體育列表 參考lib/vendor/saba/SABAConsts.js
    S_1: '1-1', // SOCCER: 1, //足球
    S_2: '1-2', // BASKETBALL: 2, //篮球
    S_3: '1-6', // FOOTBALL: 3, //美式足球
    S_4: '1-7', // ICEHOCKEY: 4, //冰上曲棍球
    S_5: '1-3', // TENNIS: 5, //网球
    S_6: '2-2', // VOLLEYBALL: 6, //排球
    S_7: '3-5', // BILLIARDS: 7, //台球
    S_8: '2-1', // BASEBALL: 8, //棒球
    S_9: '2-3', // BADMINTON: 9, //羽毛球
    S_10: '7-7', // GOLF: 10, //高尔夫球
    S_11: '12-1', // MOTORSPORTS: 11, //赛车运动
    S_12: '5-6', // SWIMMING: 12, //游泳
    S_13: '15-1', // POLITICS: 13, //政治
    S_14: '3-7', // WATERPOLO: 14, //水球
    S_15: '10-5', // DIVING: 15, //潛水
    S_16: '2-5', // BOXING: 16, //拳击
    S_17: '4-7', // ARCHERY: 17, //射箭
    S_18: '4-5', // TABLETENNIS: 18, //乒乓球
    S_19: '5-1', // WEIGHTLIFTING: 19, //舉重
    S_20: '5-2', // CANOEING: 20, //皮划艇
    S_21: '5-3', // GYMNASTICS: 21, //體操
    S_22: '4-6', // ATHLETICS: 22, //田径
    S_23: '5-4', // EQUESTRIAN: 23, //馬術
    S_24: '3-1', // HANDBALL: 24, //手球
    S_25: '3-6', // DARTS: 25,  //飞镖
    S_26: '2-6', // RUGBY: 26, //英式橄榄球
    S_28: '1-7', // FIELDHOCKEY: 28, //曲棍球
    S_29: '8-5', // WINTERSPORT: 29, //冬季比賽
    S_30: '7-4', // SQUASH: 30, //壁球
    S_31: '17-4', // ENTERTAINMENT: 31, //娛樂
    S_32: '11-1', // NETBALL: 32, //籃網球，英式籃球
    S_33: '4-2', // CYCLING: 33, //自行車
    S_34: '5-7', // FENCING: 34, //击剑
    S_35: '6-1', // JUDO: 35, //柔道
    S_36: '6-2', // MPENTATHLON: 36, //现代五项比赛
    S_37: '6-3', // ROWING: 37, //赛艇
    S_38: '6-4', // SAILING: 38, //帆船
    S_39: '6-5', // SHOOTING: 39, //射擊
    S_40: '6-6', // TAEKWONDO: 40, //跆拳道
    S_41: '5-5', // TRIATHLON: 41, //铁人三项
    S_42: '10-3', // WRESTLING: 42, //摔跤
    S_43: '11-2', // ESPORTS: 43, //電競?
    S_44: '13-1', // MUAYTHAI: 44, //泰拳
    S_45: '4-3', // BEACHVOLLEYBALL: 45, //沙滩排球
    S_50: '2-7', // CRICKET: 50, //板球
    // FINANCE: 55, //商業 (找不到)
    S_56: '17-1', //56 樂透(列表上沒有，額外追加)
    // OTHERS: 99, //其他
  },
}

//預先require上面配置的圖片
const sporticons = {
  "img_6-7":{
    img: require('../../images/betting/sporticons/6-7.png'),
    simg: require('../../images/betting/sporticons/6-7s.png'),
  },
  "img_1-1":{
    img: require('../../images/betting/sporticons/1-1.png'),
    simg: require('../../images/betting/sporticons/1-1s.png'),
  },
  "img_1-2":{
    img: require('../../images/betting/sporticons/1-2.png'),
    simg: require('../../images/betting/sporticons/1-2s.png'),
  },
  "img_1-3":{
    img: require('../../images/betting/sporticons/1-3.png'),
    simg: require('../../images/betting/sporticons/1-3s.png'),
  },
  "img_4-6":{
    img: require('../../images/betting/sporticons/4-6.png'),
    simg: require('../../images/betting/sporticons/4-6s.png'),
  },
  "img_2-3":{
    img: require('../../images/betting/sporticons/2-3.png'),
    simg: require('../../images/betting/sporticons/2-3s.png'),
  },
  "img_2-1":{
    img: require('../../images/betting/sporticons/2-1.png'),
    simg: require('../../images/betting/sporticons/2-1s.png'),
  },
  "img_2-5":{
    img: require('../../images/betting/sporticons/2-5.png'),
    simg: require('../../images/betting/sporticons/2-5s.png'),
  },
  "img_3-6":{
    img: require('../../images/betting/sporticons/3-6.png'),
    simg: require('../../images/betting/sporticons/3-6s.png'),
  },
  "img_1-7":{
    img: require('../../images/betting/sporticons/1-7.png'),
    simg: require('../../images/betting/sporticons/1-7s.png'),
  },
  "img_1-6":{
    img: require('../../images/betting/sporticons/1-6.png'),
    simg: require('../../images/betting/sporticons/1-6s.png'),
  },
  "img_7-7":{
    img: require('../../images/betting/sporticons/7-7.png'),
    simg: require('../../images/betting/sporticons/7-7s.png'),
  },
  "img_3-1":{
    img: require('../../images/betting/sporticons/3-1.png'),
    simg: require('../../images/betting/sporticons/3-1s.png'),
  },
  "img_1-4":{
    img: require('../../images/betting/sporticons/1-4.png'),
    simg: require('../../images/betting/sporticons/1-4s.png'),
  },
  "img_2-6":{
    img: require('../../images/betting/sporticons/2-6.png'),
    simg: require('../../images/betting/sporticons/2-6s.png'),
  },
  "img_6-4":{
    img: require('../../images/betting/sporticons/6-4.png'),
    simg: require('../../images/betting/sporticons/6-4s.png'),
  },
  "img_2-4":{
    img: require('../../images/betting/sporticons/2-4.png'),
    simg: require('../../images/betting/sporticons/2-4s.png'),
  },
  "img_4-5":{
    img: require('../../images/betting/sporticons/4-5.png'),
    simg: require('../../images/betting/sporticons/4-5s.png'),
  },
  "img_7-1":{
    img: require('../../images/betting/sporticons/7-1.png'),
    simg: require('../../images/betting/sporticons/7-1s.png'),
  },
  "img_2-2":{
    img: require('../../images/betting/sporticons/2-2.png'),
    simg: require('../../images/betting/sporticons/2-2s.png'),
  },
  "img_3-7":{
    img: require('../../images/betting/sporticons/3-7.png'),
    simg: require('../../images/betting/sporticons/3-7s.png'),
  },
  "img_7-3":{
    img: require('../../images/betting/sporticons/7-3.png'),
    simg: require('../../images/betting/sporticons/7-3s.png'),
  },
  "img_12-3":{
    img: require('../../images/betting/sporticons/12-3.png'),
    simg: require('../../images/betting/sporticons/12-3s.png'),
  },
  "img_17-4":{
    img: require('../../images/betting/sporticons/17-4.png'),
    simg: require('../../images/betting/sporticons/17-4s.png'),
  },
  "img_12-5":{
    img: require('../../images/betting/sporticons/12-5.png'),
    simg: require('../../images/betting/sporticons/12-5s.png'),
  },
  "img_7-6":{
    img: require('../../images/betting/sporticons/7-6.png'),
    simg: require('../../images/betting/sporticons/7-6s.png'),
  },
  "img_4-2":{
    img: require('../../images/betting/sporticons/4-2.png'),
    simg: require('../../images/betting/sporticons/4-2s.png'),
  },
  "img_8-4":{
    img: require('../../images/betting/sporticons/8-4.png'),
    simg: require('../../images/betting/sporticons/8-4s.png'),
  },
  "img_8-5":{
    img: require('../../images/betting/sporticons/8-5.png'),
    simg: require('../../images/betting/sporticons/8-5s.png'),
  },
  "img_8-6":{
    img: require('../../images/betting/sporticons/8-6.png'),
    simg: require('../../images/betting/sporticons/8-6s.png'),
  },
  "img_4-3":{
    img: require('../../images/betting/sporticons/4-3.png'),
    simg: require('../../images/betting/sporticons/4-3s.png'),
  },
  "img_8-7":{
    img: require('../../images/betting/sporticons/8-7.png'),
    simg: require('../../images/betting/sporticons/8-7s.png'),
  },
  "img_9-1":{
    img: require('../../images/betting/sporticons/9-1.png'),
    simg: require('../../images/betting/sporticons/9-1s.png'),
  },
  "img_9-3":{
    img: require('../../images/betting/sporticons/9-3.png'),
    simg: require('../../images/betting/sporticons/9-3s.png'),
  },
  "img_9-4":{
    img: require('../../images/betting/sporticons/9-4.png'),
    simg: require('../../images/betting/sporticons/9-4s.png'),
  },
  "img_9-6":{
    img: require('../../images/betting/sporticons/9-6.png'),
    simg: require('../../images/betting/sporticons/9-6s.png'),
  },
  "img_10-1":{
    img: require('../../images/betting/sporticons/10-1.png'),
    simg: require('../../images/betting/sporticons/10-1s.png'),
  },
  "img_2-7":{
    img: require('../../images/betting/sporticons/2-7.png'),
    simg: require('../../images/betting/sporticons/2-7s.png'),
  },
  "img_11-1":{
    img: require('../../images/betting/sporticons/11-1.png'),
    simg: require('../../images/betting/sporticons/11-1s.png'),
  },
  "img_5-6":{
    img: require('../../images/betting/sporticons/5-6.png'),
    simg: require('../../images/betting/sporticons/5-6s.png'),
  },
  "img_9-7":{
    img: require('../../images/betting/sporticons/9-7.png'),
    simg: require('../../images/betting/sporticons/9-7s.png'),
  },
  "img_11-2":{
    img: require('../../images/betting/sporticons/11-2.png'),
    simg: require('../../images/betting/sporticons/11-2s.png'),
  },
  "img_3-5":{
    img: require('../../images/betting/sporticons/3-5.png'),
    simg: require('../../images/betting/sporticons/3-5s.png'),
  },
  "img_12-1":{
    img: require('../../images/betting/sporticons/12-1.png'),
    simg: require('../../images/betting/sporticons/12-1s.png'),
  },
  "img_15-1":{
    img: require('../../images/betting/sporticons/15-1.png'),
    simg: require('../../images/betting/sporticons/15-1s.png'),
  },
  "img_10-5":{
    img: require('../../images/betting/sporticons/10-5.png'),
    simg: require('../../images/betting/sporticons/10-5s.png'),
  },
  "img_4-7":{
    img: require('../../images/betting/sporticons/4-7.png'),
    simg: require('../../images/betting/sporticons/4-7s.png'),
  },
  "img_5-1":{
    img: require('../../images/betting/sporticons/5-1.png'),
    simg: require('../../images/betting/sporticons/5-1s.png'),
  },
  "img_5-2":{
    img: require('../../images/betting/sporticons/5-2.png'),
    simg: require('../../images/betting/sporticons/5-2s.png'),
  },
  "img_5-3":{
    img: require('../../images/betting/sporticons/5-3.png'),
    simg: require('../../images/betting/sporticons/5-3s.png'),
  },
  "img_5-4":{
    img: require('../../images/betting/sporticons/5-4.png'),
    simg: require('../../images/betting/sporticons/5-4s.png'),
  },
  "img_7-4":{
    img: require('../../images/betting/sporticons/7-4.png'),
    simg: require('../../images/betting/sporticons/7-4s.png'),
  },
  "img_5-7":{
    img: require('../../images/betting/sporticons/5-7.png'),
    simg: require('../../images/betting/sporticons/5-7s.png'),
  },
  "img_6-1":{
    img: require('../../images/betting/sporticons/6-1.png'),
    simg: require('../../images/betting/sporticons/6-1s.png'),
  },
  "img_6-2":{
    img: require('../../images/betting/sporticons/6-2.png'),
    simg: require('../../images/betting/sporticons/6-2s.png'),
  },
  "img_6-3":{
    img: require('../../images/betting/sporticons/6-3.png'),
    simg: require('../../images/betting/sporticons/6-3s.png'),
  },
  "img_6-5":{
    img: require('../../images/betting/sporticons/6-5.png'),
    simg: require('../../images/betting/sporticons/6-5s.png'),
  },
  "img_6-6":{
    img: require('../../images/betting/sporticons/6-6.png'),
    simg: require('../../images/betting/sporticons/6-6s.png'),
  },
  "img_5-5":{
    img: require('../../images/betting/sporticons/5-5.png'),
    simg: require('../../images/betting/sporticons/5-5s.png'),
  },
  "img_10-3":{
    img: require('../../images/betting/sporticons/10-3.png'),
    simg: require('../../images/betting/sporticons/10-3s.png'),
  },
  "img_13-1":{
    img: require('../../images/betting/sporticons/13-1.png'),
    simg: require('../../images/betting/sporticons/13-1s.png'),
  },
  "img_17-1":{
    img: require('../../images/betting/sporticons/17-1.png'),
    simg: require('../../images/betting/sporticons/17-1s.png'),
  },
  "img_14-6":{
    img: require('../../images/betting/sporticons/14-6.png'),
    simg: require('../../images/betting/sporticons/14-6s.png'),
  },
  "img_14-7":{
    img: require('../../images/betting/sporticons/14-7.png'),
    simg: require('../../images/betting/sporticons/14-7s.png'),
  },
  "img_15-3":{
    img: require('../../images/betting/sporticons/15-3.png'),
    simg: require('../../images/betting/sporticons/15-3s.png'),
  },
  "img_15-2":{
    img: require('../../images/betting/sporticons/15-2.png'),
    simg: require('../../images/betting/sporticons/15-2s.png'),
  },
}

const getSportIcon = (vendorName, sportId, isSelected) => {
  //獲取圖片
  let targetIcon = null;
  const vendorMap = sporticonMap[vendorName];
  if (vendorMap) {
    let imgName = vendorMap['S_' + sportId];
    if (imgName) {
      targetIcon = sporticons['img_' + imgName]
    }
  }

  if (!targetIcon) {
    targetIcon = sporticons['img_' + sporticonMap.NOTFOUND];
  }

  if (isSelected) {
    return targetIcon.simg;
  } else {
    return targetIcon.img;
  }
}

export default getSportIcon;
