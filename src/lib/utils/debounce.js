// debounce.js  防抖封装

let timeout = null;
const debounce = (fn, delay = 500) => {
  if (timeout !== null) clearTimeout(timeout);
  timeout = setTimeout(() => {
    timeout = null;
    fn && fn();
  }, delay);
};
module.exports = debounce;
