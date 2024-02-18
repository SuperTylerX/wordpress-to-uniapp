<script setup lang="ts">
import { DOMAIN, WEBSITE_NAME, WEBSITE_SINCE } from '@/config'
</script>

<template>
  <view class="copyright">
    <view>
      © {{ WEBSITE_SINCE }} - {{ new Date().getFullYear() }} {{ WEBSITE_NAME }} {{ DOMAIN }}
    </view>
  </view>
</template>

<style scoped>
.copyright {
  font-size: 26rpx;
  line-height: 1.6;
  font-weight: 400;
  text-align: center;
  color: #c4c4c4;
  margin-top: 48rpx;
  padding-bottom: 60rpx;
}
</style>
