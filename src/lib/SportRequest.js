//用來模擬mobile代碼，這樣vendor版本升級，可以直接覆蓋，不用修改
export const fetchRequest = window.fetchRequest;

export const timeout_fetch = (fetch_promise, timeout = 600000) => {
	let timeout_fn = null;
	let timeout_promise = new Promise(function(resolve, reject) {
		timeout_fn = function() {
			reject('请求超时!!!');
		};
	});
	let abortable_promise = Promise.race([ fetch_promise, timeout_promise ]);
	setTimeout(function() {
		timeout_fn();
	}, timeout);

	return abortable_promise;
}