import http from "../utils/http.js";

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
		wf_enterprise_minapp: "0"
	},
	mutations: {
		SET_HOME_CONFIG(state, payloads) {
			state.selected_nav = payloads.expand.selected_nav;
			state.swipe_nav = payloads.expand.swipe_nav;
			state.wf_enable_comment_option = payloads.wf_enable_comment_option;
			state.wf_enterprise_minapp = payloads.wf_enterprise_minapp;
		}
	},
	actions: {
		async GET_HOME_CONFIG({ commit }) {
			try {
				let config = await http.getHomeConfig().then(data => data.data);
				commit("SET_HOME_CONFIG", config);
			} catch (e) {
				console.log(e);
			}

		}
	}
});
