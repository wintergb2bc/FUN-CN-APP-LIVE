export const getCurrentGameInfo = 'GETCURRENTGAMEINFO';
export const clearGameInfo = 'CLEARGAMEINFO';
export const gameIsMaintain = 'GAMEISMAINTAIN';

export const ACTION_GetCurrentGameInfo = (payload) => {

  return (dispatch) => {
    dispatch({
      type: getCurrentGameInfo,
      payload: payload
    });
  };

}

export const ACTION_InitialGameInfo = (payload) => {

  return (dispatch) => {
    dispatch({
      type: clearGameInfo,
      payload: payload
    });
  };

}

export const ACTION_GameIsMaintain = (payload) => {

  return (dispatch) => {
    dispatch({
      type: gameIsMaintain,
      payload: payload
    });
  };

}