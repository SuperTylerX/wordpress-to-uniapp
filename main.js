import Vue from "vue";
import App from "./App";

// 引入Vuex
import Vuex from "vuex";
import storeConfig from "./store";
Vue.use(Vuex);
const store = new Vuex.Store(storeConfig);

Vue.config.productionTip = false;
App.mpType = "app";

// 引入uView UI
import uView from "uview-ui";
Vue.use(uView);

import { navigateTo } from "@/utils/uniPromisify.js";

Vue.mixin({
	methods: {
		// 页面跳转
		async redirect({ type, path, url }) {
			switch (type) {
				case "apppage":
					await navigateTo({
						url: path,
					});
					break;
				case "webpage":
					await navigateTo({
						url: "/pages/webpage/webpage" + "?url=" + url,
					});
					break;
			}
		}
	}
});
const app = new Vue({
	...App,
	//挂载
	store
});
app.$mount();
