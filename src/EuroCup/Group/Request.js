
// // GET 请求
// export const funpoGet = (url) => axiosRequest(VERB.GET, url);
// // POST 请求
// export const funpoPOST = (url, data) => axiosRequest(VERB.POST, url, data);


import md5 from "crypto-js/md5";
import aes from 'crypto-js/aes';
import pkcs7 from 'crypto-js/pad-pkcs7';
import base64 from 'crypto-js/enc-base64';
import hex from 'crypto-js/enc-hex';
import utf8 from 'crypto-js/enc-utf8';

//放布丁用的AES加解密

export const funConfig = {
  key: "funpodiumgogogo!",
  iv: "funpodiumgogo!!!",
  salt: "funpodiumgo!!!!!",
}

export const aesEnc = (text, key, iv) => {
  const cipher = aes.encrypt(utf8.parse(text), utf8.parse(key), {
    padding: pkcs7,
    iv: utf8.parse(iv),
  });
  // 将加密后的数据转换成 hex
  const hexCipher = cipher.ciphertext.toString(hex);
  return hexCipher;
}

export const aesDec = (encText, key, iv) => {
  const hexEncWords = hex.parse(encText); //原本是16進位編碼
  const base64EncText = base64.stringify(hexEncWords); //需要轉base64才放入解密
  const decrypted = aes.decrypt(base64EncText, utf8.parse(key), {
    padding: pkcs7,
    iv: utf8.parse(iv),
  });
  const decryptedStr = decrypted.toString(utf8);
  return decryptedStr;
}

export const getRequestBody = (method = 'GET', params = {},) => {
  const encryptJson = aesEnc(JSON.stringify(params), funConfig.key, funConfig.iv);
  const now = new Date().getTime();
  return {
    v: method,
    p: encryptJson,
    t: now,
    h: md5(method + encryptJson + now + funConfig.salt).toString()
  }
}

export const postRequestBody = (APIName, params = {}) => {
  const header = {
    'Content-Type': 'application/json; charset=utf-8',
    'Culture': 'zh',
  };
  // params.seasonId = HostConfig.Config.StatAPISeasonId;
  // params.platform = 'WEB';
  // let apiUrl = HostConfig.Config.StatAPIUrl + APIName;
  let apiUrl = APIName;
  // console.log('===stat_fetchV2', APIName, JSON.parse(JSON.stringify(params)));
  const fetchData = {
    method: 'POST',
    headers: header,
    body: JSON.stringify(getRequestBody('POST', params)),
  }
  return fetch(apiUrl, fetchData)
    .then((response) => response.json())
    .then(jsonData => {
      // console.log('jsonData', jsonData)
      if (jsonData.d) {
        const decryptedJSON = aesDec(jsonData.d, funConfig.key, funConfig.iv);
        let decryptedObject = null
        try {
          decryptedObject = JSON.parse(decryptedJSON);
        } catch (e) { }
        if (decryptedObject) {
          if (decryptedObject.data) {
            return decryptedObject.data;
          } else {
            return decryptedObject;
          }
        }
      }
      return null;
    });
}