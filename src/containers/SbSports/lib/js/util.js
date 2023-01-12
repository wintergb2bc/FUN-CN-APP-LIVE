import { CLEAR_COOKIE_KEY } from './constantsData';
import {Decimal} from "decimal.js";
// import HostConfig from "$SBLIB/Host.config";
// import {IconFontClassNames,IconFontNumberNames} from "./iconfont";
import VendorBTI from '../vendor/bti/VendorBTI';
import VendorIM from '../vendor/im/VendorIM';
import VendorSABA from '../vendor/saba/VendorSABA';

class Util {
	constructor() {}
	hasClass(elem, cls) {
		cls = cls || '';
		if (cls.replace(/\s/g, '').length == 0) return false;
		return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
	}
	addClass(elem, cls) {
		if (!this.hasClass(elem, cls)) {
			ele.className = ele.className == '' ? cls : ele.className + ' ' + cls;
		}
	}
	removeClass(elem, cls) {
		if (this.hasClass(elem, cls)) {
			let newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
			while (newClass.indexOf(' ' + cls + ' ') >= 0) {
				newClass = newClass.replace(' ' + cls + ' ', ' ');
			}
			elem.className = newClass.replace(/^\s+|\s+$/g, '');
		}
	}
	parentsUtil(elem, cls) {
		if (elem) {
			while (elem && !this.hasClass(elem, cls)) {
				elem = elem.parentNode;
			}
			return elem;
		} else {
			return null;
		}
	}
}

export function getUrlVars() {
	var vars = {},
		hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		if (hash[1]) {
			// vars.push(hash[0]);
			vars[hash[0]] = hash[1].split('#')[0];
		}
	}
	return vars;
}

export function formatAmount(num) {
	if (!num) {
		return 0;
	}
	let numCount = num.toString().split('.');
	const numCountVal =
		(numCount[0] + '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, '$1,') +
		(numCount[1] ? '.' + numCount[1].toString().substr(0, 2) : '');
	return typeof num === 'number' && isNaN(num) ? 0 : numCountVal;
}

export function Cookie(name, value, options) {
	// 如果第二个参数存在
	if (typeof value !== 'undefined') {
		options = options || {};
		if (value === null) {
			// 设置失效时间
			options.expires = -1;
		}
		var expires = '';
		// 如果存在事件参数项，并且类型为 number，或者具体的时间，那么分别设置事件
		if (options.expires && (typeof options.expires == 'number' || options.expires.toUTCString)) {
			var date;
			if (typeof options.expires == 'number') {
				date = new Date();
				date.setTime(date.getTime() + options.expires * 60 * 1000);
			} else {
				date = options.expires;
			}
			expires = '; expires=' + date.toUTCString();
		}
		// var path = options.path ? '; path=' + options.path : '', // 设置路径
		var domain = options.domain ? '; domain=' + options.domain : '', // 设置域
			secure = options.secure ? '; secure' : ''; // 设置安全措施，为 true 则直接设置，否则为空

		// 如果第一个参数不存在则清空所有Cookie
		if (name === null) {
			const keys = document.cookie.match(/[^ =;]+(?=\=)/g);
			if (keys) {
				for (let i = keys.length; i--; ) {
					if (~CLEAR_COOKIE_KEY.indexOf(keys[i])) {
						document.cookie = [
							keys[i],
							'=',
							encodeURIComponent(value),
							expires,
							'; path=/',
							domain,
							secure
						].join('');
					}
				}
			}
		} else {
			// 把所有字符串信息都存入数组，然后调用 join() 方法转换为字符串，并写入 Cookie 信息
			document.cookie = [ name, '=', encodeURIComponent(value), expires, '; path=/', domain, secure ].join('');
		}
	} else {
		// 如果第二个参数不存在
		var CookieValue = null;
		if (document.cookie && document.cookie != '') {
			var Cookie = document.cookie.split(';');
			for (var i = 0; i < Cookie.length; i++) {
				var CookieIn = (Cookie[i] || '').replace(/^\s*|\s*$/g, '');

				if (CookieIn.substring(0, name.length + 1) == name + '=') {
					CookieValue = decodeURIComponent(CookieIn.substring(name.length + 1));
					break;
				}
			}
		}
		return CookieValue;
	}
}

export function formatSeconds(value) {
	function checkZero(str) {
		str = str.toString();
		return str.length === 1 ? '0' + str : str;
	}

	var seconds = parseInt(value); // 秒
	var minute = 0; // 分
	var hour = 0; // 小时

	if (seconds > 60) {
		minute = parseInt(seconds / 60);
		seconds = parseInt(seconds % 60);
		if (minute > 60) {
			hour = parseInt(minute / 60);
			minute = parseInt(minute % 60);
		}
	}
	var result = '' + checkZero(parseInt(seconds));
	if (minute > 0) {
		result = '' + checkZero(parseInt(minute)) + ':' + result;
	} else {
		result = '00:' + result;
	}
	if (hour > 0) {
		result = '' + checkZero(parseInt(hour)) + ':' + result;
	}
	return result;
}

// 获取本地格式化时间
export function dateFormat() {
	let date = new Date(Date.now() + 8 * 3600000);
	let str = date.toISOString().replace('T', ' ');
	return str.substr(0, str.lastIndexOf('.'));
}

// 浮点数计算
export function mul(a, b) {
	var c = 0,
		d = a.toString(),
		e = b.toString();
	try {
		c += d.split('.')[1].length;
	} catch (f) {}
	try {
		c += e.split('.')[1].length;
	} catch (f) {}
	return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c);
}
function div(a, b) {
	var c,
		d,
		e = 0,
		f = 0;
	try {
		e = a.toString().split('.')[1].length;
	} catch (g) {}
	try {
		f = b.toString().split('.')[1].length;
	} catch (g) {}
	return (
		(c = Number(a.toString().replace('.', ''))),
		(d = Number(b.toString().replace('.', ''))),
		mul(c / d, Math.pow(10, f - e))
	);
}
export function add(a, b) {
	var c, d, e;
	try {
		c = a.toString().split('.')[1].length;
	} catch (f) {
		c = 0;
	}
	try {
		d = b.toString().split('.')[1].length;
	} catch (f) {
		d = 0;
	}
	return (e = Math.pow(10, Math.max(c, d))), (mul(a, e) + mul(b, e)) / e;
}
export function sub(a, b) {
	var c, d, e;
	try {
		c = a.toString().split('.')[1].length;
	} catch (f) {
		c = 0;
	}
	try {
		d = b.toString().split('.')[1].length;
	} catch (f) {
		d = 0;
	}
	return (e = Math.pow(10, Math.max(c, d))), (mul(a, e) - mul(b, e)) / e;
}

/**
 * 无缝滚动
 * @param {string/boolean} target 祖先React节点  [boolean] 是否清除定时器
 * @param {number} [sp=18] 速度
 * @param {string top/right} 移动方位
 * @return 返回 定时器状态
 */
var timer = null,
	onlyTimer = null;
export function marqueeAnimate(target, direction, sp, call) {
	// 如果定时器已存在，则退出函数
	// if (timer !== null || onlyTimer !== null) {
	//     return false
	// }
	// 清除定时器
	if (typeof target === 'boolean' && target === true) {
		clearInterval(timer);
		clearTimeout(onlyTimer);
		return false;
	}
	var $container = target.childNodes[0],
		container = $container.childNodes[0],
		$marqueeItem = container.tagName === 'UL' ? container.childNodes : $container.childNodes,
		last = $marqueeItem[$marqueeItem.length - 1],
		speed = sp || 18,
		dir = direction || 'top';

	var rolling;
	if (dir == 'top') {
		$container.appendChild(container.cloneNode(true));
		const len = $marqueeItem.length - 1;
		let index = 0;
		let height = last.offsetTop + last.offsetHeight;

		rolling = function() {
			if (index === len) {
				index = 0;
			}
			if (target.scrollTop == height) {
				target.scrollTop = 0;
			} else {
				target.scrollTop++;
			}
			if (target.scrollTop % last.offsetHeight === 0) {
				clearInterval(timer);
				onlyTimer = setTimeout(() => {
					timer = setInterval(rolling, speed);
					call(index++);
				}, 1000);
			}
		};
	} else if (dir == 'right') {
		$container.appendChild(container.cloneNode(true));
		// 此处减去左边的图标显示所占的偏移值
		var width = last.offsetLeft + last.offsetWidth - $marqueeItem[0].offsetLeft;
		rolling = function() {
			if (target.scrollLeft == width) {
				target.scrollLeft = 0;
			} else {
				target.scrollLeft++;
			}
		};
	}

	timer = setInterval(rolling, speed); // 设置定时器
	container.addEventListener('mouseenter', function() {
		clearInterval(timer);
		clearTimeout(onlyTimer);
	});
	container.addEventListener('mouseleave', function() {
		onlyTimer = setTimeout(() => {
			// 鼠标移开时重设定时器
			timer = setInterval(rolling, speed);
		}, 1000);
	});

	return false;
}

export function resetRemSize(fixedWidth) {
	const width = document.documentElement.offsetWidth || document.body.offsetWidth,
		height = document.documentElement.offsetHeight || document.body.offsetHeight;

	if (width < height && !global.documentWidth) {
		(global.documentWidth = width), (global.documentHeight = height);
		resetRemSize(width);
	}

	let htmlWidth =
		fixedWidth ||
		(global.documentWidth
			? Math.min(680, global.documentWidth, global.documentHeight)
			: Math.min(680, Math.min(width, height)));
	let htmlDom = document.getElementsByTagName('html')[0];
	htmlDom.style.fontSize = htmlWidth / 10 + 'px';
}

export function _extends() {
	_extends =
		Object.assign ||
		function(target) {
			for (var i = 1; i < arguments.length; i++) {
				var source = arguments[i];
				for (var key in source) {
					if (Object.prototype.hasOwnProperty.call(source, key)) {
						target[key] = source[key];
					}
				}
			}
			return target;
		};
	return _extends.apply(this, arguments);
}

//獲取帶membercode的localstorage配置名稱 格式 {key}-{membercode}
export function getMemberStorageKey(key) {
	let memberCode = null;
	if (localStorage.getItem('loginStatus') == 1) {
		memberCode = localStorage.getItem('memberCode');
		if (memberCode) {
			memberCode = JSON.parse(memberCode); //處理一下，把雙引號去掉
		}
	}
	//  格式 {key}-{membercode}
	return key + (memberCode ? '-' + memberCode : '');
}

//逗號分隔，支持小數點
export function numberWithCommas(x, precision = 2) {
	if (!x) {
		return 0;
	}

	var parts = new Decimal(x).toFixed(precision).toString().split(".");
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	return parts.join(".");

	//不能用這個 ios會報錯
	//return x ? new Decimal(x).toFixed(precision).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : 0;
}

//超過限制長度變成...
export function cutTail(x, maxlength = 10) {
	return x ? (x.length > maxlength ? (x.substr(0,maxlength) + '...') : x ) : x
}



// const getRandomClassName = (num) => {
// 	const intNum = parseInt(num);

// 	const randomClassIndex = Math.floor((Math.random()*10));
// 	const randomNameIndex = Math.floor((Math.random()*10));

// 	return IconFontClassNames[intNum][randomClassIndex] + '-' + IconFontNumberNames[intNum][randomNameIndex];
// }


/* 数字替换成SVG */
// export function ChangeSvg(num) {
// 	if (num && num != null && num.length != 0) {
// 		var strnumber = num.toString(),
// 			str = '';
// 		for (var i = 0; i < strnumber.length; i++) {
// 			let number = strnumber.charAt(i) || -1;
// 			if (['0','1','2','3','4','5','6','7','8','9'].indexOf(number) !== -1) {
// 				const thisClassName =  getRandomClassName(number);
// 				str +=  '<span class="' + thisClassName + '"></span>';
// 			} else {
// 				if (number === '.') {
// 					str += '<span class="icon-spot">.</span>';
// 				} else if (number === '-') {
// 					str += '<span class="icon-minus">-</span>';
// 				} else {
// 					str += '<span class="icon-undefined">' + number + '</span>';
// 				}
// 			}
// 		}

// 		//除錯用
// 		if (!HostConfig.Config.isLIVE) {
// 			str += '<span style="display: none;">' + num + '</span>'
// 		}

// 		return str;
// 	}
// 	return '';
// }

//比較兩個object，指定要比較的prop
export function dataIsEqual(left, right, selectedProps = [], log= false, name = '') {
	let isEqual = true;

	if (left === right) {
		return true;
	}

	if (
		typeof left !== 'object' ||
		left === null ||
		typeof right !== 'object' ||
		right === null
	) {
		if (log) {
			if (typeof left !== 'object' ||
				left === null) {
				console.log('===', name, '=== is not equal by left', left);
			}
			if (typeof right !== 'object' ||
				right === null) {
				console.log('===', name, '=== is not equal by right', right);
			}
		}

		return false;
	}

	for(let prop of selectedProps) {
		const r = (left[prop] === right[prop]);
		if (!r) {
			if (log) {
				console.log('===',name,'=>',prop,'=== is not equal',left[prop],' vs ',right[prop]);
			}
			isEqual = false;
			break;
		}
	}
	return isEqual;
}

//異步獲取VendorToken，可選擇是否強制刷新(forceRefresh=true)
export const getVendorToken = async (vendorName, forceRefresh = false) => {

	const current_token = localStorage.getItem(`${vendorName.toUpperCase()}_Token`);
	const exp = localStorage.getItem(`${vendorName.toUpperCase()}_Token_ExpireTime`);
	let needNewToken = false;
	if (!current_token || !exp || forceRefresh) {
		needNewToken = true;
	} else {
		const nowTime = (new Date().getTime());
		if (nowTime >= exp) { //超過有效期
			console.log('=== getVendorToken:',vendorName,',token expired:',nowTime,'>=',exp);
			needNewToken = true;
		} else {
			console.log('=== getVendorToken:',vendorName,',token not expired:',nowTime,'<',exp);
		}
	}

	if (!needNewToken) { //可以用舊的
		console.log('=== getVendorToken:',vendorName,',useCurrentToken:',current_token);
		return new Promise(resolve => resolve(current_token));
	} else {
		console.log('=== getVendorToken:',vendorName,',NEED GET NEW TOKEN:',current_token,exp);
	}

	if (vendorName === 'im') {
		//IM登入

		//如果登入中，則返回登入中的promise
		if (VendorIM.loginPromise) {
			return VendorIM.loginPromise;
		}

		return VendorIM.getTokenFromGateway()
			.then((token) => {
				global.maintainStatus_noTokenIM(false);
			})
			.catch((e) => {
				global.maintainStatus_noTokenIM(true);
				console.log('im login failed', e);
			});
	}

	if (vendorName === 'bti') {
		//BTI登入

		//如果登入中，則返回登入中的promise
		if (VendorBTI.loginPromise) {
			return VendorBTI.loginPromise;
		}

		return VendorBTI.getTokenFromGateway()
			.then((token) => {
				global.maintainStatus_noTokenBTI(false);
			})
			.catch((e) => {
				global.maintainStatus_noTokenBTI(true);
				console.log('bti login failed', e);
			});
	}

	if (vendorName === 'saba') {
		//SABA登入

		//如果登入中，則返回登入中的promise
		if (VendorSABA.loginPromise) {
			return VendorSABA.loginPromise;
		}

		return VendorSABA.getTokenFromGateway()
			// .then(token => {
			// 	global.maintainStatus_noTokenSABA(false);
			// })
			//沙巴特殊，不需要處理noToken 但還是要處理catch 避免獲取失敗 在登入頁卡住
			.catch((e) => {
				//  global.maintainStatus_noTokenSABA(true);
				console.log('saba login failed', e);
			});
	}
}

//異步獲取全部token，不強制刷新
export const getAllVendorToken = async () => {
	//IM登入
	const IMloginPromise = getVendorToken('im');
	//BTI登入
	const BTIloginPromise = getVendorToken('bti');
	//SABA登入
	const SABAloginPromise = getVendorToken('saba');

	//等待異步查詢完成
	return Promise.all([ IMloginPromise, BTIloginPromise, SABAloginPromise ]);
};

//刪除token數據
//開啟官方網頁版時，現有token會被刷掉不能用，需要清理
export const removeVendorToken = (vendorName) => {
	localStorage.removeItem(`${vendorName.toUpperCase()}_Token`);
	localStorage.removeItem(`${vendorName.toUpperCase()}_Token_ExpireTime`);
}

export default Util;
