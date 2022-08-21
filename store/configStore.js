import * as http from "../utils/http.js";

export default ({
	namespaced: true,
	state: {
		businessDomain: [],
		downloadfileDomain: [],
		selected_nav: [],
		swipe_nav: [],
		logoImageurl: "",
		zanImageurl: "",
		wf_enable_comment_option: "0",
		wf_enable_qq_comment_option: "0",
		uni_enable_h5_comment_option: false,
		uni_enable_toutiao_comment_option: false,
		wf_weixin_enterprise_minapp: "0",
		wf_qq_enterprise_minapp: "0",
		posterImageUrl: "",
		shareImageUrl: "",
		is_user_registration_enable: "0"
	},
	mutations: {
		SET_HOME_CONFIG(state, payloads) {
			state.selected_nav = payloads.expand.selected_nav;
			state.swipe_nav = payloads.expand.swipe_nav;
			state.wf_enable_comment_option = payloads.wf_enable_comment_option;
			state.wf_enable_qq_comment_option = payloads.wf_enable_qq_comment_option;
			state.uni_enable_h5_comment_option = payloads.uni_enable_h5_comment_option;
			state.uni_enable_toutiao_comment_option = payloads.uni_enable_toutiao_comment_option;
			state.wf_weixin_enterprise_minapp = payloads.wf_weixin_enterprise_minapp;
			state.wf_qq_enterprise_minapp = payloads.wf_qq_enterprise_minapp;
			state.posterImageUrl = payloads.posterImageUrl;
			state.shareImageUrl = payloads.shareImageUrl ||
				"https://tva1.sinaimg.cn/large/006RKGBpgy1gsqxssh3dyj60cs08hmxf02.jpg";
			state.is_user_registration_enable = payloads.is_user_registration_enable;
		}
	},
	actions: {
		async GET_HOME_CONFIG({
			commit
		}) {
			try {
				let config = await http.getHomeConfig().then(data => data.data);
				commit("SET_HOME_CONFIG", config);
			} catch (e) {
				console.error(e);
			}

		}
	}
});
