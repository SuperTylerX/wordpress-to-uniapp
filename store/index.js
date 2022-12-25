import configStore from "./configStore.js";
import authStore from "./authStore.js";
import systemStore from "./systemStore.js";

export default {
	modules: {
		configStore,
		authStore,
		systemStore
	},
	getters: {
		isCommentEnabled: (state) => {
			// #ifdef MP-QQ
			return state.configStore.wf_enable_qq_comment_option == "1";
			// #endif
			// #ifdef MP-WEIXIN
			return state.configStore.wf_enable_comment_option == "1";
			// #endif
			// #ifdef MP-TOUTIAO
			return state.configStore.uni_enable_bytedance_comment_option;
			// #endif
			// #ifdef MP-BAIDU
			return state.configStore.uni_enable_baidu_comment_option;
			// #endif
			// #ifdef H5
			return state.configStore.uni_enable_h5_comment_option;
			// #endif
			// #ifndef MP || H5
			return true;
			// #endif
		}
	},
};
