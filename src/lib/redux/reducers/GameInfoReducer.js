import { getCurrentGameInfo, clearGameInfo, gameIsMaintain } from '../actions/GameInfoAction';

export const initialState = {
  result: {
    category: '',
    gameId: '',
    provider: '',
    GameOpenUrl: '',
    launchGameCode: '',
    gametype: ''
  },
  maintainStatus: {
    gameType: '',
    providers: '',
    gameName: '',
    isComingSoon: false,
    isNew: false,
  }
};

const GameInfoReducer = (state = initialState, action) => {
  switch (action.type) {
    case getCurrentGameInfo:
      return { ...state, result: action.payload };
    case gameIsMaintain:
      return { ...state, maintainStatus: action.payload };
    case clearGameInfo:
      return {...state, result: initialState.result};
    default:
      return state;
  }
};


export default GameInfoReducer;
