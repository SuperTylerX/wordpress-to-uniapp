import { getSystemInfo } from "@/utils/uniPromisify.js";

export default ({
	namespaced: true,
	state: {
		systemInfo: {}
	},
	mutations: {
		SET_SYSTEM_INFO(state, systemInfo) {
			state.systemInfo = systemInfo;
		}
	},
	actions: {
		async GET_SYSTEM_INFO({ commit }) {
			const systemInfo = await getSystemInfo();
			commit("SET_SYSTEM_INFO", systemInfo);
		}
	}
});
