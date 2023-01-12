import Types from "../actions/types";

export const getInitialState = () => ({
  worldCupTabOpen: false,
  duringTheWorldCup: false,
  worldCupIcon: false
});

const EventReducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case Types.ACTION_EVENT_UPDATE: //更新數據
      //console.log('===usersetting update to : ', action.payload);
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default EventReducer;
