import { LOGIN, LOGOUT } from "../actions/AuthAction";
export const getInitialState = () => ({
  authToken: "",
  email: "",
});
const AuthReducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, ...action.payload };
    case LOGOUT:
      return { ...state, ...getInitialState() };
    default:
      return state;
  }
};
export default AuthReducer;
