const image = '../../../images/euroCup/'

export const Round = {
  "Group": '小组赛A',
  "round_of_16": '小组赛A',
  "quarterfinal": '小组赛A',
  "semifinal": '小组赛A',
  "final": '小组赛A',
  "eliminated": '小组赛A',
}

export const shareIcon = {
  white: require(`${image}/iconShareWhite.png`),
  blue: require(`${image}/iconShareBlue.png`)
}
export const countryData = {
  Austria: {
    flag: require(`${image}flag/Austria.png`),
    jersey: require(`${image}jersey/Austria.png`),
    bgColor: '#DA3339',
  },
  Belgium: {
    flag: require(`${image}flag/Belgium.png`),
    jersey: require(`${image}jersey/Belgium.png`),
    bgColor: '#C4272D',
  },
  Croatia: {
    flag: require(`${image}flag/Croatia.png`),
    jersey: require(`${image}jersey/Croatia.png`),
    bgColor: '#C32128',
  },
  'Czech-Republic': {
    flag: require(`${image}flag/Czech.png`),
    jersey: require(`${image}jersey/Czech.png`),
    bgColor: '#C82C31',
  },
  Denmark: {
    flag: require(`${image}flag/Denmark.png`),
    jersey: require(`${image}jersey/Denmark.png`),
    bgColor: '#7C0A20',
  },
  England: {
    flag: require(`${image}flag/England.png`),
    jersey: require(`${image}jersey/England.png`),
    bgColor: '#C31327',
  },
  Finland: {
    flag: require(`${image}flag/Finland.png`),
    jersey: require(`${image}jersey/Finland.png`),
    bgColor: '#1C4C92',
  },
  'France': {
    flag: require(`${image}flag/France.png`),
    jersey: require(`${image}jersey/France.png`),
    bgColor: '#08295B',
  },
  Germany: {
    flag: require(`${image}flag/Germany.png`),
    jersey: require(`${image}jersey/Germany.png`),
    bgColor: '#909090',
  },
  Hungary: {
    flag: require(`${image}flag/Hungary.png`),
    jersey: require(`${image}jersey/Hungary.png`),
    bgColor: '#BF262C',
  },
  Italy: {
    flag: require(`${image}flag/Italy.png`),
    jersey: require(`${image}jersey/Italy.png`),
    bgColor: '#1853B7',
  },
  Netherlands: {
    flag: require(`${image}flag/Netherlands.png`),
    jersey: require(`${image}jersey/Netherlands.png`),
    bgColor: '#EC7A11',
  },
  'North-Macedonia': {
    flag: require(`${image}flag/NorthMacedonia.png`),
    jersey: require(`${image}jersey/NorthMacedonia.png`),
    bgColor: '#C6353A',
  },
  Poland: {
    flag: require(`${image}flag/Poland.png`),
    jersey: require(`${image}jersey/Poland.png`),
    bgColor: '#CA3439',
  },
  Portugal: {
    flag: require(`${image}flag/Portugal.png`),
    jersey: require(`${image}jersey/Portugal.png`),
    bgColor: '#A42529',
  },
  Russia: {
    flag: require(`${image}flag/Russia.png`),
    jersey: require(`${image}jersey/Russia.png`),
    bgColor: '#C8262C',
  },
  Scotland: {
    flag: require(`${image}flag/Scotland.png`),
    jersey: require(`${image}jersey/Scotland.png`),
    bgColor: '#00265D',
  },
  'Slovakia': {
    flag: require(`${image}flag/Slovakia.png`),
    jersey: require(`${image}jersey/Slovakia.png`),
    bgColor: '#005AAB',
  },
  Spain: {
    flag: require(`${image}flag/Spain.png`),
    jersey: require(`${image}jersey/Spain.png`),
    bgColor: '#A9151A',
  },
  Sweden: {
    flag: require(`${image}flag/Sweden.png`),
    jersey: require(`${image}jersey/Sweden.png`),
    bgColor: '#FFD503',
  },
  Switzerland: {
    flag: require(`${image}flag/Switzerland.png`),
    jersey: require(`${image}jersey/Switzerland.png`),
    bgColor: '#BF2C31',
  },
  Turkey: {
    flag: require(`${image}flag/Turkey.png`),
    jersey: require(`${image}jersey/Turkey.png`),
    bgColor: '#CB2329',
  },
  Ukraine: {
    flag: require(`${image}flag/Ukraine.png`),
    jersey: require(`${image}jersey/Ukraine.png`),
    bgColor: '#F7D600',
  },
  Wales: {
    flag: require(`${image}flag/Wales.png`),
    jersey: require(`${image}jersey/Wales.png`),
    bgColor: '#C3253A',
  },
  'Ireland': {
    flag: require(`${image}flag/France.png`),
    jersey: require(`${image}jersey/France.png`),
    bgColor: '#EC7A11',
  },
}

export const RoundName = {
  "Group A": '小组赛 A',
  "Group B": '小组赛 B',
  "Group C": '小组赛 C',
  "Group D": '小组赛 D',
  "Group E": '小组赛 E',
  "Group F": '小组赛 F',
  "Group A eliminated": '小组赛 A 淘汰',
  "Group B eliminated": '小组赛 B 淘汰',
  "Group C eliminated": '小组赛 C 淘汰',
  "Group D eliminated": '小组赛 D 淘汰',
  "Group E eliminated": '小组赛 E 淘汰',
  "Group F eliminated": '小组赛 F 淘汰',
  "round_of_16": '16强',
  "round_of_16 eliminated": '16强 淘汰',
  "quarterfinal": '四分之一决赛',
  "quarterfinal eliminated": '四分之一决赛 淘汰',
  "semifinal": '半决赛',
  "semifinal eliminated": '半决赛 淘汰',
  "final": '决赛',
  "final eliminated": '决赛 淘汰',
  "Runner-up": '亚军',
  "champion": '冠军',
}
//歐洲杯隊伍UI相關配置

export const euro2021Teams = [
  {key: 'Turkey' , note:'土耳其', group: 'A' },
  {key: 'Italy' , note:'意大利', group: 'A' },
  {key: 'Wales' , note:'威尔士', group: 'A' },
  {key: 'Switzerland' , note:'瑞士', group: 'A' },
  {key: 'Denmark' , note:'丹麦', group: 'B' },
  {key: 'Finland' , note:'芬兰', group: 'B' },
  {key: 'Belgium' , note:'比利时', group: 'B' },
  {key: 'Russia' , note:'俄罗斯', group: 'B' },
  {key: 'Netherlands' , note:'荷兰', group: 'C' },
  {key: 'Ukraine' , note:'乌克兰', group: 'C' },
  {key: 'Austria' , note:'奥地利', group: 'C' },
  {key: 'North-Macedonia' , note:'北马其顿', group: 'C' },
  {key: 'England' , note:'英格兰', group: 'D' },
  {key: 'Croatia' , note:'克罗地亚', group: 'D' },
  {key: 'Scotland' , note:'苏格兰', group: 'D' },
  {key: 'Czech-Republic' , note:'捷克', group: 'D' },
  {key: 'Spain' , note:'西班牙', group: 'E' },
  {key: 'Sweden' , note:'瑞典', group: 'E' },
  {key: 'Poland' , note:'波兰', group: 'E' },
  {key: 'Slovakia' , note:'斯洛伐克', group: 'E' },
  {key: 'Hungary' , note:'匈牙利', group: 'F' },
  {key: 'Portugal' , note:'葡萄牙', group: 'F' },
  {key: 'France' , note:'法国', group: 'F' },
  {key: 'Germany' , note:'德国', group: 'F' },
]

//隊伍狀態名 和排序
export const latestRoundMap = {
  'final': { name:'决赛', sortId: 99},
  'semifinal': { name:'半决赛', sortId: 90},
  'quarterfinal': { name:'四分之一决赛', sortId: 80},
  'round_of_16': { name:'16强', sortId: 70},
  'Group A': { name:'小组赛 A', sortId: 65},
  'Group B': { name:'小组赛 B', sortId: 64},
  'Group C': { name:'小组赛 C', sortId: 63},
  'Group D': { name:'小组赛 D', sortId: 62},
  'Group E': { name:'小组赛 E', sortId: 61},
  'Group F': { name:'小组赛 F', sortId: 60},
  'eliminated': { name:'淘汰', sortId: 0, isout: true},
  'final eliminated': { name:'决赛 淘汰', sortId: 0, isout: true},
  'semifinal eliminated': { name:'半决赛 淘汰', sortId: 0, isout: true},
  'quarterfinal eliminated': { name:'四分之一决赛 淘汰', sortId: 0, isout: true},
  'round_of_16 eliminated': { name:'16强 淘汰', sortId: 0, isout: true},
  'Group A eliminated': { name:'小组赛 A 淘汰', sortId: 0, isout: true},
  'Group B eliminated': { name:'小组赛 B 淘汰', sortId: 0, isout: true},
  'Group C eliminated': { name:'小组赛 C 淘汰', sortId: 0, isout: true},
  'Group D eliminated': { name:'小组赛 D 淘汰', sortId: 0, isout: true},
  'Group E eliminated': { name:'小组赛 E 淘汰', sortId: 0, isout: true},
  'Group F eliminated': { name:'小组赛 F 淘汰', sortId: 0, isout: true},
}

//位置分類 1前鋒 2中場 3後衛 4守門員
export const positionToTypeMap = {
  'central_defender': 3, //'中后卫',
  'central_midfielder': 2, //'中场',
  'defender': 3, //'后卫',
  'forward': 1, //'前锋',
  'goalkeeper': 4, //'守门员',
  'left_back': 3, //'左后卫',
  'left_winger': 2, //'左翼',
  'midfielder': 2, //'中场',
  'right_back':3, //'右后卫',
  'right_winger': 2, //'右翼',
  'striker':1, //'前锋',
}

//位置 轉中文
export const positionMap = {
  'central_defender': '中后卫',
  'central_midfielder': '中场',
  'defender':'后卫',
  'forward':'前锋',
  'goalkeeper':'守门员',
  'left_back':'左后卫',
  'left_winger':'左翼',
  'midfielder':'中场',
  'right_back':'右后卫',
  'right_winger':'右翼',
  'striker':'前锋',
}