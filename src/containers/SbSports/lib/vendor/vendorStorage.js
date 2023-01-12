/*
* vendor模塊專用Storage，用來適配各端不同的本地存儲
*
* 在各端重寫實現，分 sync同步 和 async異步 兩種函數
*  - token和登入態直接使用 sync同步函數
*  - 關注比賽的存儲 使用 async異步 相關函數，用於適配 RN 的存儲，並相容之後可能改為調用API 存服務器 的狀況
*/

//在mobile 只需要轉一下 給localSotage就行
export const vendorStorage = {
  //同步函數
  getItem: (key) => {
    return localStorage.getItem(key)
  },
  setItem: (key, value) => {
    return localStorage.setItem(key,value);
  },
  removeItem: (key) => {
    return localStorage.removeItem(key);
  },
  length: () => {
    return localStorage.length;
  },
  key: (index) => {
    return localStorage.key(index);
  },

  //異步函數
  getItemAsync: (key) => {
    return new Promise(resolve => resolve(localStorage.getItem(key)));
  },
  setItemAsync: (key, value) => {
    return new Promise(resolve => resolve(localStorage.setItem(key,value)));
  },
  removeItemAsync: (key) => {
    return new Promise(resolve => resolve(localStorage.removeItem(key)));
  },
}
