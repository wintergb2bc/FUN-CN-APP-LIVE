export const Advantage = [
  {
    title: "匿名买卖",
    icon: require("../../../images/usdtInfo/anonymous.png"),
  },
  {
    title: "24小时",
    icon: require("../../../images/usdtInfo/hoursAll.png"),
  },
  {
    title: "价格稳定",
    icon: require("../../../images/usdtInfo/price.png"),
  },
  {
    title: "快速到账",
    icon: require("../../../images/usdtInfo/speedUp.png"),
  },
  {
    title: "不受银行监管",
    icon: require("../../../images/usdtInfo/supervision.png"),
  },
  {
    title: "额度无上限",
    icon: require("../../../images/usdtInfo/quota.png"),
  },
];

export const prompt = [
  {
    title: "安全有保障",
    description:
      "与银行卡等传统支付方式相比，玩家不需要给出自己的姓名或卡号即可完成加密货币交易，避免了敏感信息泄漏。",
    icon: require("../../../images/usdtInfo/icon1.png"),
  },
  {
    title: "交易速度快",
    description:
      "加密货币所采用的区块链技术具有去中心化特点，不需要清算中心机构来处理数据，交易时间将被缩短。",
    icon: require("../../../images/usdtInfo/icon2.png"),
  },
  {
    title: "高度匿名性",
    description:
      "不由央行或当局发行，不受银行监管，玩家可以随心所欲地使用存放在自己加密钱包里的资金。",
    icon: require("../../../images/usdtInfo/icon3.png"),
  },
];

export const tableHeader = [
  "三种USDT",
  "OMNI",
  "ERC20协议",
  "TRC20协议",
];

export const tableData = [
  {
    type: `地址样式${"\n"}（谨防充错）`,
    first: "数字1或3开头,例如183hmJGRu",
    second: "数字0或小写x开头，例如 0xbd7e4b",
    third: "大写字母T开头，例如： T9zp14nm",
  },
  {
    type: "使用情况",
    first: "比特币网络",
    second: "以太坊网络",
    third: "波场网络",
  },
  {
    type: "网络拥堵情况",
    first: "偶尔拥堵",
    second: "经常拥堵",
    third: "基本不拥堵",
  },
  {
    type: "日常转账速度",
    first: "慢 (0.6-2小时 不等）",
    second: "中等 （几分钟到十几分钟不等）",
    third: "快 （几秒钟到几 分钟不等）",
  },
  { type: "手续费", first: "最高 转账手续费和BTC一致，平台提现一般收2-20USDT不等", second: "一般 钱包转账手续费与ETH一致，平台提现一般收1-5USDT 不等", third: "无 钱包转账0手续费，平台提现时有可能收取少量手续费" },
  { type: "安全性", first: "最高", second: "高", third: "低于前两者" },
  {
    type: "使用建议",
    first: "大额低频走比特币网络",
    second: "中等额度走 ETC网络",
    third: "小额高频走 波场网络",
  },
];
