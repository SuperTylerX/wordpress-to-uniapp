<template>
	<web-view :src="url"></web-view>
</template>

<script>
	import config from "../../utils/config.js";
	
	export default {
		data() {
			return {
				url: null,
			};
		},

		onLoad: function(options) {
			if (options.url != null) {
				let url = decodeURIComponent(options.url);
				if (url.indexOf("*") != -1) {
					url = url.replace("*", "?");
				}
				this.url = url;
			} else {
				this.url = "https://" + config.HOST_DOMAIN;
			}
		}
	};
</script>
<style>
</style>
