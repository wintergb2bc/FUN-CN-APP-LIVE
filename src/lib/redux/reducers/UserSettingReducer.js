import Types from "../actions/types";

//用戶設置 全域數據
export const getInitialState = () => ({
  //盘口显示方式
  ListDisplayType: 1, //1纵向(默認) 2横向
  phonePrefix: {}, //手機號前綴
  selfExclusions: {
    selfExcludeSetDate: "",
    selfExcludeDuration: 0,
    disableDeposit: false,
    disableFundIn: false,
    disableBetting: false,
    transferLimit: 0,
  },
  sbTransferPopup: false
});

const UserSettingReducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case Types.ACTION_USERSETTING_UPDATE: //更新數據
      //console.log('===usersetting update to : ', action.payload);
      return {...state, ...action.payload};
    default:
      return state;
  }
};

export default UserSettingReducer;
