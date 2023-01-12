import { PROFILE_UPDATED } from "../actions/ProfileAction";

export const getInitialState = () => ({
  profile: {
    name: "",
    mobile: "",
    gender: "",
  },
});

const ProfileReducer = (state = getInitialState(), action) => {
  switch (action.type) {
    case PROFILE_UPDATED:
      return { ...state, profile: action.payload };
    default:
      return state;
  }
};

export default ProfileReducer;
