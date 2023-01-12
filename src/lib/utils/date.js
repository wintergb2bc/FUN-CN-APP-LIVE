// 存放有关时间的公共方法

/**
 *获取当前日期前后N天的日期
 *
 * @export
 * @param {int 正负整数} AddDayCount   10,-10等
 * @returns
 */
export function GetDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m =
    dd.getMonth() + 1 < 10 ? "0" + (dd.getMonth() + 1) : dd.getMonth() + 1; //获取当前月份的日期，不足10补0
  var d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate(); //获取当前几号，不足10补0
  return y + "/" + m + "/" + d;
}
