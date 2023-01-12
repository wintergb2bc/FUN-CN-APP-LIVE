import { combineReducers } from 'redux';

import ProfileReducer from './ProfileReducer';
import SceneReducer from './SceneReducer';
import GameReducer from './GameReducer';

import AuthReducer from './AuthReducer';
import UserInfoReducer from './UserInfoReducer';
import BetCartReducer from './BetCartReducer';
import MaintainStatus from './MaintainStatusReducer';
import RouterLogReducer from "./RouterLogReducer";
import UserSettingReducer from "./UserSettingReducer";
import AnnouncementReducer from "./AnnouncementReducer";
import CsCallReducer from './CsCallReducer';
import GameInfoReducer from './GameInfoReducer';
import EventReducer from './EventReducer';

const AppReducer = combineReducers({
  auth: AuthReducer,
  profile: ProfileReducer,
  scene: SceneReducer,
  game: GameReducer,
  userInfo: UserInfoReducer,
  betCartInfo: BetCartReducer,
  maintainStatus: MaintainStatus,
  routerLog: RouterLogReducer,
  userSetting: UserSettingReducer,
  announcement: AnnouncementReducer,
  csCall: CsCallReducer,
  gameInfo: GameInfoReducer,
  event: EventReducer
});

export default AppReducer;
