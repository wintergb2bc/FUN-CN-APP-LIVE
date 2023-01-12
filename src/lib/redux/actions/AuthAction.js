import { Actions, ActionConst } from "react-native-router-flux";
import { PROFILE_UPDATED } from "./ProfileAction";
export const LOGIN = "LOGIN";
export const LOGOUT = "LOGOUT";
/**
 * This Action Creator can be used without `redux-thunk` middleware
 * Note that it accepts `dispatch` arguments
 */
export const login = (dispatch, loginDetails) => {
  //const url = 'http://192.168.43.147/login.json';

  console.log(loginDetails);
  const payload = {
    authToken: "111111111",
    email: loginDetails.email,
  };
  let action = {
    type: LOGIN,
    payload,
  };
  dispatch(action);

  // change scene
  action = {};
  action.type = ActionConst.FOCUS;
  action.payload = "drawer";
  dispatch(action);
  // set profile
  action = {};
  action.type = PROFILE_UPDATED;
  action.payload = "2222";
  dispatch(action);
};
export const logout = (dispatch) => {
  const payload = {
    authToken: "",
    email: "",
  };
  let action = {
    type: LOGOUT,
    payload,
  };
  dispatch(action);

  // change scene
  action = {};
  action.type = ActionConst.FOCUS;
  action.payload = "login";
  dispatch(action);

  // set profile
  action = {};
  action.type = PROFILE_UPDATED;
  action.payload = "";
  dispatch(action);
};
