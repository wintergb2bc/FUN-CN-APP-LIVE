import { isVIP, showCsCallPopup } from '../actions/CsCallAction';

export const csCallStatus = {
  isVip: false,
  showCsCallPopup: false,
};

const CsCallReducer = (state = csCallStatus, action) => {
  switch (action.type) {
    case isVIP:
      return { ...state, isVip: action.payload };
    case showCsCallPopup:
      return { ...state, showCsCallPopup: action.payload };
    default:
      return state;
  }
};

export default CsCallReducer;