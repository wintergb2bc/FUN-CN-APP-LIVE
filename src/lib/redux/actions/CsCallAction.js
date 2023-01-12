export const isVIP = 'ISVIP';
export const showCsCallPopup = 'SHOWCSCALLPOPUP';

export const ACTION_CheckIsVIP = (payload) => {

  return (dispatch) => {
    dispatch({
      type: isVIP,
      payload: payload
    });
  };

}

export const ACTION_ShowCsCallPopupHandler = (payload) => {

  return (dispatch) => {
    dispatch({
      type: showCsCallPopup,
      payload: payload
    });
  };

}