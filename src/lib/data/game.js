// 游戏供应商介绍
export const gameList = {
  sportsbook: {
    title: "体育竞技",
    titleEn: "SPORT BETTING",
    subtitle:
      "提供最及时的体育资讯、最实用的赛事分析技巧以及最靠谱的体育平台。",
    colors: "#2994FF",
    topImgUrl: require("../../images/game_intro/sportsbook/sports.png"),
    icon1: require("../../images/game_intro/sportsbook/icon-stable.png"),
    icon2: require("../../images/game_intro/sportsbook/icon-trust.png"),
    gameCatCode: "Sportsbook",
  },
  esports: {
    title: "电子竞技",
    titleEn: "eSPORT BETTING",
    subtitle: "专业的电竞平台，为电竞玩家们带来各种多样化的游戏体验。",
    colors: "#00C853",
    topImgUrl: require("../../images/game_intro/esports/esport.png"),
    icon1: require("../../images/game_intro/esports/icon-stable.png"),
    icon2: require("../../images/game_intro/esports/icon-trust.png"),
    gameCatCode: "Esports",
  },

  casino: {
    title: "真人娱乐",
    titleEn: "LIVE CASINO",
    subtitle: "同乐城线上真人娱乐场，美女主播、性感荷官现场互动。",
    colors: "#E91E63",
    topImgUrl: require("../../images/game_intro/casino/live.png"),
    icon1: require("../../images/game_intro/casino/icon-stable.png"),
    icon2: require("../../images/game_intro/casino/icon-trust.png"),
  },

  p2p: {
    title: "棋牌游戏",
    titleEn: "P2P GAMES",
    subtitle: "玩家互动，真实对战，拥有多款火爆热门的棋牌游戏。",
    colors: "#99683D",
    topImgUrl: require("../../images/game_intro/p2p/p2p.png"),
    icon1: require("../../images/game_intro/p2p/icon-stable.png"),
    icon2: require("../../images/game_intro/p2p/icon-trust.png"),
  },

  slot: {
    title: "电子游戏",
    titleEn: "SLOT GAMES",
    subtitle: "最火热的电子游戏平台，提供超多款电子游戏类型，丰厚奖金池回馈。",
    colors: "#673AB7",
    topImgUrl: require("../../images/game_intro/slot/slot.png"),
    icon1: require("../../images/game_intro/slot/icon-stable.png"),
    icon2: require("../../images/game_intro/slot/icon-trust.png"),
  },

  lottery: {
    title: "彩票游戏",
    titleEn: "LOTTERY",
    subtitle: "玩法简单、赔率多元、公开公正。",
    colors: "#A633CC",
    topImgUrl: require("../../images/game_intro/lottery/lottery.png"),
    icon1: require("../../images/game_intro/lottery/icon-stable.png"),
    icon2: require("../../images/game_intro/lottery/icon-trust.png"),
  },
};
//对应的icon
export const walletIcon = {
  //体育
  AIS: require("../../images/posino/Sportsbook.png"),
  SB: require("../../images/posino/Sportsbook.png"),
  SP: require("../../images/posino/Sportsbook.png"),
  OWS: require("../../images/posino/Sportsbook.png"),
  SBT: require("../../images/posino/Sportsbook.png"),
  IPSB: require("../../images/posino/Sportsbook.png"),
  //电竞
  IPES: require("../../images/posino/Esports.png"),
  SPSB: require("../../images/posino/Esports.png"),
  TFG: require("../../images/posino/Esports.png"),
  //小遊戲
  SPR: require("../../images/promotion/icon-instantGames.png"),
  //真人
  LD: require("../../images/posino/LiveDealer.png"),
  EVO: require("../../images/posino/LiveDealer.png"),
  BGG: require("../../images/posino/LiveDealer.png"),
  GPI: require("../../images/posino/LiveDealer.png"),
  AGL: require("../../images/posino/LiveDealer.png"),
  GDL: require("../../images/posino/LiveDealer.png"),
  ABT: require("../../images/posino/LiveDealer.png"),
  NLE: require("../../images/posino/LiveDealer.png"),
  SAL: require("../../images/posino/LiveDealer.png"),
  //电子
  SLOT: require("../../images/posino/Slot.png"),
  SPG: require("../../images/posino/Slot.png"),
  TG: require("../../images/posino/Slot.png"),
  PT: require("../../images/posino/Slot.png"),
  MGSQF: require("../../images/posino/Slot.png"),
  DTG: require("../../images/posino/Slot.png"),
  CW: require("../../images/posino/Slot.png"),
  BSG: require("../../images/posino/Slot.png"),
  //捕鱼
  AG: require("../../images/posino/Fishing.png"),
  //棋牌
  P2P: require("../../images/posino/P2P.png"),
  KYG: require("../../images/posino/P2P.png"),
  BLE: require("../../images/posino/P2P.png"),
  //彩票
  KENO: require("../../images/posino/Keno.png"),
  BOY2: require("../../images/posino/Keno.png"),
  BOY: require("../../images/posino/Keno.png"),
  VLR: require("../../images/posino/Keno.png"),
  TCG: require("../../images/posino/Keno.png"),
};
//对应的中文
export const walletName = {
  MAIN: "主账户",
  PT: "PT 老虎机",
  YBP: "乐天堂棋牌",
  IMOPT: "PT 老虎机",
  SB: "体育/电竞",
  SP: "沙巴体育",
  AIS: "AI 体育",
  SBT: "BTi 体育",
  IPSB: "IM 体育",
  IPES: "乐天堂电竞",
  TFG: "TF 电竞",
  // SPSB: "沙巴电竞",
  OWS: "沙巴体育",
  LD: "真人娱乐",
  BGG: "BG 真人",
  BSG: "BS 老虎机",
  GPI: "GP 真人",
  AG: "AG 真人",
  P2P: "双赢棋牌",
  GDL: "GD 真人",
  KYG: "开元棋牌",
  ABT: "AB 真人",
  BLE: "双赢棋牌",
  NLE: "N2 真人",
  KENO: "双赢彩票",
  SAL: "SA 真人",
  BOY2: "BB 彩票",
  EVO: "EVO 真人",
  BOY: "BB 彩票",
  SLOT: "老虎机",
  VRL: "VR 彩票",
  SPG: "SP 电子",
  VLR: "VR 彩票",
  TG: "PP 老虎机",
  TG_SLOT: "PP 老虎机",
  MGSQF: "MG 老虎机",
  DTG: "DT 老虎机",
  CW: "TT 老虎机",
  TCG: "TC 彩票",
  LBK: "LB 快乐彩",
  YBK: "醉心彩票",
  YBF: "OB 捕鱼",
  PGS: "PG 老虎机",
  IMONET: "NET 老虎机",
  SWF: "SWF 老虎机",
  FISHING: "捕鱼",
  CQG: "CQG 老虎机",
  JBP: "JBP 老虎机",
  YBL: "YBL 真人",
  EBT: "EBT 真人",
  SGW: "双赢彩票"
};

// 小標籤
export const labelText = {
  MGSQF: { text: "MG", bgColor: "#2CCB8E", color: "#fff" },
  IMOPT: { text: "PT", bgColor: "#00A6FF", color: "#fff" },
  TG_SLOT: { text: "PP", bgColor: "#F49239", color: "#fff" },
  IMONET: { text: "NET", bgColor: "#78BD1F", color: "#fff" },
  SWF: { text: "SW", bgColor: "#6978DF", color: "#fff" },
  FISHING: { text: "SWF", bgColor: "#6978DF", color: "#fff" },
  CQG: { text: "CQ9", bgColor: "#fff", color: "#FF7700" },
  BSG: { text: "BSG", bgColor: "#000", color: "#fff" },
  YBP: { text: "ANG", bgColor: "#00A6FF", color: "#fff" },
  JBP: { text: "JBP", bgColor: "#D1941B", color: "#fff" },
  KYG: { text: "KYG", bgColor: "#E96450", color: "#fff" },
  SPG: { text: "SPG", bgColor: "#F30000", color: "#fff" },
  PGS: { text: "PG", bgColor: "#12B2A1", color: "#fff" },
  YBF: { text: "ZUI", bgColor: "#B14221", color: "#fff" },

  // 真人
  YBL: { text: "ZUI", bgColor: "#B14221", color: "#fff" },
  EVO: { text: "EVO", bgColor: "#679DB9", color: "#fff" },
  BGG: { text: "BG", bgColor: "#2424B4", color: "#fff" },
  AG: { text: "AG", bgColor: "#F98436", color: "#fff" },
  GPI: { text: "FUN", bgColor: "#00A6FF", color: "#fff" },
  NLE: { text: "N2", bgColor: "#EA177A", color: "#fff" },
  EBT: { text: "EBT", bgColor: "#2E67B1", color: "#fff" },
  ABT: { text: "ABT", bgColor: "#B18F21", color: "#fff" },

  // 體育
  VTG: { text: "V2G", bgColor: "#009A23", color: "#fff" },

  // 小遊戲
  SPR: { text: "SPR", bgColor: "#CF5EEA", color: "#fff" },

};

// 有列表页面的游戏
export const gameHaveList = ["casino", "p2p", "slot"];

// 需另開視窗的遊戲
// 兩個都另開
export const openNewWindowList = [];
// IOS另開
export const openNewWindowListIOS = [];
// Android另開
export const openNewWindowListAndroid = [];
// 體育遊戲
export const sportsName = ["IPSB", "OWS", "SBT"];

export const categoryAnn = {
  esports: "IMSportsbook",
  sportsbook: "Sportsbook",
  lottery: "Keno",
  slot: "Slot",
  casino: "Casino",
  p2p: "Poker"
};

export const piwikNameMap = {
  p2p: "P2P",
  livecasino: "LiveDealer",
  slot: "Slots",
  instantgames: 'SPR',
};

export const gameCatIdMap = [
  {
    id: 123,
    games: ['OWS', 'IPSB', 'SBT', 'VTG'],
  },
  {
    id: 41,
    games: ['TFG', 'IPES'],
  },
  {
    id: 45,
    games: ['LBK', 'YBK', 'SGW'],
  },
  {
    id: 43,
    games: ["PGS", "MGSQF", "IMOPT", "BSG", "TG_SLOT", "SPG", "CQG", "IMONET", "SWF", "FISHING"],
  },
  {
    id: 42,
    games: ['KYG', 'YBP', 'JBP'],
  }
]

// 用於比對flash和fp的兩方api的categoryCode
export const FP_FlashcategoryCodeMap = [
  {
    flashCode: "Sportsbook",
    fpCode: "Sportsbook",
  },
  {
    flashCode: "ESports",
    fpCode: "Esports",
  },
  {
    flashCode: "LiveCasino",
    fpCode: "Casino",
  },
  {
    flashCode: "P2P",
    fpCode: "P2P",
  },
  {
    flashCode: "Slot",
    fpCode: "Slot",
  },
  {
    flashCode: "KenoLottery",
    fpCode: "Lottery",
  },
];

export const gameCategoryT = {
  Slot: "老虎机",
  Keno: "彩票",
  Poker: "棋牌",
  Casino: "真人",
  IMSportsbook: "电竞",
  Sportsbook: "体育"
}
