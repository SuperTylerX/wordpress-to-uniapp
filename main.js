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

Vue.mixin({
	methods: {
		// 页面跳转
		redirect(data) {
			switch (data.type) {
				case "apppage":
					uni.navigateTo({
						url: data.path,
						fail: (e) => {
							console.log(e);
						}
					});
					break;
				case "webpage":
					uni.navigateTo({
						url: "/pages/webpage/webpage" + "?url=" + data.url,
						fail: (e) => {
							console.log(e);
						}
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
