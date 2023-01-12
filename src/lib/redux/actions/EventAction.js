
import Types from "./types";

// 世界杯tab
export const ACTION_WorldCupTab = (flag) => {
  const action = {
    type: Types.ACTION_EVENT_UPDATE,
    payload: {
      worldCupTabOpen: flag
    },
  };

  return action;
};

// 世界杯期間
export const ACTION_DuringTheWorldCup = (flag) => {
  const action = {
    type: Types.ACTION_EVENT_UPDATE,
    payload: {
      duringTheWorldCup: flag,
      worldCupIcon: flag
    },
  };

  return action;
};

// 世界杯icon
export const ACTION_WorldCupIcon = (flag) => {
  const action = {
    type: Types.ACTION_EVENT_UPDATE,
    payload: {
      worldCupIcon: flag
    },
  };

  return action;
};
