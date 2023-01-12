import Types from "../actions/types";

export const initialState = {
  optionType: "",
  announcementPopup: false,
  announcementData: {
    content: "",
    topic: "",
    updatedAt: ""
  },
  gameData: {
    gameId: 0,
  },
};

const AnnouncementReducer = (state = initialState, action) => {
  switch (action.type) {
    case Types.ACTION_ANNOUNCEMENT_UPDATE: //更新數據
      return { ...state, ...action.payload };
    case Types.ACTION_ANNOUNCEMENT_CLEAR: //清空數據
      return { ...initialState };
    default:
      return state;
  }
};

export default AnnouncementReducer;
