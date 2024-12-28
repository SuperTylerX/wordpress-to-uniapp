<template>
  <view class="wrap">
    <mp-html :content="htmlText" :selectable="true" :tag-style="style"></mp-html>
  </view>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { agreement } from '@/pages/policy/agreement'
import { privacy } from '@/pages/policy/privacy'

export default defineComponent({
  data() {
    return {
      htmlText: '',
      style: {
        img: 'margin-bottom: 30rpx',
        p: `font-size: 28rpx;
					  margin-bottom: 10rpx;
					  line-height: 2em;
				`,
        li: `font-size: 28rpx;
					list-style-type: none;
					margin: 0;
					padding: 0;
					line-height: 2em;
				`,
        h1: `margin-bottom: 20rpx;
					font-size: 40rpx;
					text-align: center
					`,
        h2: `margin-bottom: 20rpx;
					font-size: 34rpx;
					`,
        h3: `margin-bottom: 20rpx;
						font-size: 30rpx;
						`,
        h4: `margin-bottom: 20rpx;
						font-size: 26rpx;
						`
      }
    }
  },
  async onLoad(options) {
    if (!options) {
      return
    }
    if (options.type === 'agreement') {
      this.htmlText = agreement
    } else if (options.type === 'privacy') {
      this.htmlText = privacy
    }
  }
})
</script>

<style scoped lang="scss">
.wrap {
  padding: 40rpx;
}
</style>
