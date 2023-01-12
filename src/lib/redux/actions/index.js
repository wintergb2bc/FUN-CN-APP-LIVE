import {
  ACTION_UserInfo_updateBalance,
  ACTION_UserInfo_logout,
  ACTION_UserInfo_login,
  ACTION_UserInfo_getBalanceAll,
  ACTION_UserInfo_updateMemberInfo,
} from "./UserInfoAction";
import {
  ACTION_UserSetting_ToggleListDisplayType,
  ACTION_UserSetting_Update,
  ACTION_SelfExclusionsAction,
  ACTION_SelfExclusionsPopup,
  ACTION_ClearSelfExclusions,
  ACTION_SBTransferPopup
} from "./UserSettingAction";
import {
  ACTION_MaintainStatus_NoTokenBTI,
  ACTION_MaintainStatus_NoTokenIM,
  ACTION_MaintainStatus_NoTokenOW,
  ACTION_MaintainStatus_SetBTI,
  ACTION_MaintainStatus_SetIM,
  ACTION_MaintainStatus_SetOW,
} from "./MaintainStatusAction";

import { ACTION_PhoneSetting_Update } from "./UserSettingAction";

import {
  ACTION_PlayGame,
  ACTION_ClearGameInfo,
  ACTION_OpenSport,
  ACTION_ClearOpenSport,
  ACTION_GameType,
  ACTION_AviatorGameData
} from "./GameAction";

import {
  ACTION_GetAnnouncement,
  ACTION_OpenAnnouncementPopup,
  ACTION_CloseAnnouncementPopup,
  ACTION_ClearAnnouncement,
} from "./AnnouncementAction";

import {
  ACTION_CheckIsVIP,
  ACTION_ShowCsCallPopupHandler,
} from './CsCallAction'

import {
  ACTION_GetCurrentGameInfo,
  ACTION_InitialGameInfo,
  ACTION_GameIsMaintain,
} from './GameInfoAction'

import {
  ACTION_WorldCupTab,
  ACTION_DuringTheWorldCup,
  ACTION_WorldCupIcon
} from "./EventAction";

export default {
  ACTION_UserInfo_updateBalance,
  ACTION_UserInfo_updateMemberInfo,
  ACTION_UserInfo_logout,
  ACTION_UserInfo_login,
  ACTION_UserSetting_ToggleListDisplayType,
  ACTION_SelfExclusionsAction,
  ACTION_UserSetting_Update,
  ACTION_UserInfo_getBalanceAll,
  ACTION_MaintainStatus_NoTokenBTI,
  ACTION_MaintainStatus_NoTokenIM,
  ACTION_MaintainStatus_NoTokenOW,
  ACTION_MaintainStatus_SetBTI,
  ACTION_MaintainStatus_SetIM,
  ACTION_MaintainStatus_SetOW,
  ACTION_PhoneSetting_Update,
  ACTION_ClearGameInfo,
  ACTION_OpenSport,
  ACTION_ClearOpenSport,
  ACTION_PlayGame,
  ACTION_GameType,
  ACTION_SelfExclusionsPopup,
  ACTION_OpenAnnouncementPopup,
  ACTION_CloseAnnouncementPopup,
  ACTION_GetAnnouncement,
  ACTION_ClearAnnouncement,
  ACTION_ClearSelfExclusions,
  ACTION_CheckIsVIP,
  ACTION_ShowCsCallPopupHandler,
  ACTION_GetCurrentGameInfo,
  ACTION_InitialGameInfo,
  ACTION_GameIsMaintain,
  ACTION_WorldCupTab,
  ACTION_DuringTheWorldCup,
  ACTION_WorldCupIcon,
  ACTION_SBTransferPopup,
  ACTION_AviatorGameData,
};
