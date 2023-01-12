import { PiwikData } from "../data/piwikData"

// Piwik發送
export default class PiwikAction {
  /**
   * @param key 對應PiwikData key
   * @returns {void|*}
   */
  static SendPiwik = (key) => {
    console.log('piwik key ',key)
    // 找出指定piwik
    const piwikCheck = PiwikData[key];
    console.log('PiwikData ',piwikCheck)
    
    if (piwikCheck) {
      try {
        PiwikEvent(piwikCheck[0], piwikCheck[1], piwikCheck[2]);
      }catch (e){
        console.log(`SendPiwik Error ${e}`);
      }
    } else {
      console.log(`${key} piwik not found`);
    }
  };

  /**
   * 傳參直接發送
   * @param track
   * @param action
   * @param name
   * @returns {void|*}
   */
  static SendDynamicPiwik = (track="", action="", name="") => {
    try {
      PiwikEvent(track, action, name);
    }catch (e){
      console.log(`SendPiwik Error ${e}`);
    }
  };
}

