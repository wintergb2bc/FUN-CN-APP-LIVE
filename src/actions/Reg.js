// 密码正则
// export const passwordReg = /(?=.{6,16}$)(?=.*[0-9])(?=.*[a-zA-Z])(?=[\^#$@]*)([a-zA-Z0-9]([\^#$@]*))+$/;
export const passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z\^\#\$\@]{6,20}$/;

//用户名正则
export const nameReg = /^[a-zA-Z0-9]{6,16}$/;

// 手机号正则
export const phoneReg = /^(0|86)?(-)?(12[0-9]|13[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|14[0-9]|19[0-9])[0-9]{6,8}$/;

// 真实姓名正则
export const nameTest = /^[\u4e00-\u9fa5\u0E00-\u0E7F]{2,15}$/;
export const bankNameTest = /^[a-zA-Z0-9\s\u4e00-\u9fa5\u0E00-\u0E7F]{2,35}$/;


//銀行卡正則
export const bankTest = /^[0-9]{14,19}$/;

//表情
export const emojiReg = /(\ud83c[\udf00-\udfff])|(\ud83d[\udc00-\ude4f\ude80-\udeff])|[\u2600-\u2B55]/g;
//特殊字符
export const scReg = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/im;

// 邮箱正则
// export const emailReg =  /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
export const emailReg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]{1,}$/;
export const email_reg = /^[A-Za-z0-9_]+(?:\.[a-zA-Z0-9_\.\-]){0,}@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
export const email_reg_2 = /^[^_.-].*[^/_.-]$/; // 不能以_.-開頭結尾

//身份证正则
export const IdentityCardReg = /[0-9]{17}[0-9xX]$/i;

// 代理码正则
export const affReg = /[^\w\.\/]/ig;

// 邮箱遮挡
export function maskEmail(email) {
  let result;
  const emailPrefix = email.split("@")[0];
  const emailSuffix = email.split("@")[1];
  const elength = emailPrefix.length;
  const maskedPrefix = emailPrefix.replace(/./g, "*");
  const maskLength = Math.floor((elength / 3) * 2);
  result = '******' + emailPrefix.slice(-3) + '@' + emailSuffix
  // if (elength > 30) {
  //   result =
  //     emailPrefix.substr(0, 10) +
  //     maskedPrefix.substring(10, elength) +
  //     "@" +
  //     emailSuffix;
  // } else {
  //   result =
  //     emailPrefix.substr(0, elength - maskLength) +
  //     maskedPrefix.substring(elength - maskLength, elength) +
  //     "@" +
  //     emailSuffix;
  // }

  return result;
}

// 手机遮挡
export function maskPhone(phone) {
  // const result = phone.substring(0, 3) + "*******" + phone.substring(10, 14);
  const result = phone.slice(0, 3) + "****" + phone.slice(-4);
  return result
}

// 手机遮挡只显示后4位数
export function maskPhone4(phone) {
  if (!phone) {
    return ''
  }
  const result = "*******" + phone.slice(-4);
  return result
}

export function toThousands(num, type = '') { //每隔3位，用逗号隔开
  let str = num + ''
  if (num) {
    if (str.includes('.')) {
      let numStr = true ? str.substring(0, str.indexOf('.') + 3) : str
      let numArr = numStr.split('.')
      return numArr[0].replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,') + '.' + numArr[1] + ` ${type}`
    } else {
      return str.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,') + `.00 ${type}`
    }
  } else {
    return `0.00`
  }
}
