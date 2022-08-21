const isHttpSuccess = (status) => status >= 200 && status < 300 || status === 304;

export const request = (args = {}) => new Promise((resolve, reject) => {
	uni.request({
		...args,
		success: (res) => {
			if (isHttpSuccess(res.statusCode)) {
				resolve(res.data);
			} else {
				reject(res);
			}
		},
		fail: reject,
	});
});
