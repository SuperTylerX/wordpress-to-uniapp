<script>
	export default {
		onLaunch: function() {
			// 获取APP通用设置
			this.$store.dispatch("configStore/GET_HOME_CONFIG");

			// 读取登录信息
			const login_type = uni.getStorageSync("login_type");

			const token = uni.getStorageSync("token");
			if (token) {
				this.$store.commit("authStore/update_token", {
					token
				});
				this.$store.dispatch("authStore/validateToken", { login_type });
			}
		},
		onShow: function() {
			console.log("App Show");
		},
		onHide: function() {
			console.log("App Hide");
		}
	};
</script>

<style lang="scss">
	@import "./static/icon.css";
	@import "uview-ui/index.scss";
</style>
