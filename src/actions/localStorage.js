//用來模擬mobile代碼，這樣vendor版本升級，可以直接覆蓋，
if (global._innerLocalStorage === undefined) {
  global._innerLocalStorage = {};
  global._innerLocalStorage._innerKeys = [];
}

const mockLocalStorage = {
  getItem: (key) => {
    let data = global._innerLocalStorage[key];
    //console.log('====mockLocalStorage getItem',key,JSON.stringify(data));
    if (!data || data == undefined || data.length == 0){
      return null; //找不到 要返回null 不然接JSON.parse會報錯
    }
    return data;
  },
  setItem: (key, value) => {
    //console.log('====mockLocalStorage setItem',key,JSON.stringify(value));
    global._innerLocalStorage._innerKeys.push(key);
    global._innerLocalStorage[key] = value;
  },
  removeItem: (key) => {
    //console.log('====mockLocalStorage removeItem',key);
    global._innerLocalStorage._innerKeys = global._innerLocalStorage._innerKeys.filter(k => k !== key);
    delete global._innerLocalStorage[key];
  },
  length: () => {
    return global._innerLocalStorage._innerKeys.length;
  },
  key: (index) => {
    return global._innerLocalStorage._innerKeys[index];
  },
};

// 全局变量
global.localStorage = mockLocalStorage;
