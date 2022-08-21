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
			
			// 获取设备信息
			this.$store.dispatch("systemStore/GET_SYSTEM_INFO");
		}
	};
</script>

<style lang="scss">
	@import "uview-ui/index.scss";
</style>
