import { ActionConst } from 'react-native-router-flux';

export const getInitialState = () => ({
  scene: 'login'
});

const SceneReducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case ActionConst.FOCUS:
      return { ...state, scene: action.payload };
    default:
      return state;
  }
};

export default SceneReducer;
