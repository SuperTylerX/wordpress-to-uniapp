export function getPlatform() {

	// #ifdef APP-PLUS || APP-PLUS-NVUE || APP-NVUE
	return "APP";
	// #endif

	// #ifdef H5
	return "H5";
	// #endif

	// #ifdef MP-WEIXIN
	return "MP-WEIXIN";
	// #endif

	// #ifdef MP-ALIPAY
	return "MP-ALIPAY";
	// #endif	

	// #ifdef MP-BAIDU
	return "MP-BAIDU";
	// #endif

	// #ifdef MP-QQ
	return "MP-QQ";
	// #endif

	// #ifdef MP-TOUTIAO
	return "MP-TOUTIAO";
	// #endif

	// #ifdef MP-LARK	
	return "MP-LARK";
	// #endif

	// #ifdef MP-KUAISHOU	
	return "MP-KUAISHOU";
	// #endif

	// #ifdef MP-JD
	return "MP-JD";
	// #endif

	// #ifdef MP-360
	return "MP-360";
	// #endif

	// #ifdef QUICKAPP-WEBVIEW || QUICKAPP-WEBVIEW-UNION || QUICKAPP-WEBVIEW-HUAWEI
	return "QUICKAPP";
	// #endif

}
