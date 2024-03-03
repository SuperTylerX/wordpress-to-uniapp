<script setup lang="ts">
import { useConfigStore } from '@/store/config'
import { computed } from 'vue'
import { redirect } from '@/utils'

const configStore = useConfigStore()

const selected_nav = computed(() => configStore.config.expand.selected_nav)
</script>

<template>
  <!-- 顶部导航 -->
  <view class="nav-wrap">
    <view class="nav-title">
      <view class="left">精选栏目</view>
      <view class="right">滑动查看</view>
    </view>
    <scroll-view scroll-x="true">
      <view class="nav-content">
        <view
          v-for="(item, index) in selected_nav"
          :key="index"
          class="nav-item"
          @tap="redirect({ type: item.type, path: item.path, url: item.url })"
        >
          <image :src="item.image" mode="scaleToFill"></image>
          <text>{{ item.title }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<style scoped lang="scss">
// 顶部导航
.nav-wrap {
  // border-bottom: 20rpx solid #F5F7F7;

  .nav-title {
    display: flex;
    justify-content: space-between;
    margin: 30rpx 30rpx 0 30rpx;

    .left {
      display: flex;
      align-items: center;
      font-size: 30rpx;
    }

    .right {
      display: flex;
      align-items: center;
      font-size: 25rpx;
      color: #959595;
    }
  }

  .nav-content {
    display: flex;
    flex-wrap: nowrap;
    padding: 20rpx 0;

    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 140rpx;
      margin-right: 15rpx;

      image {
        width: 100rpx;
        height: 100rpx;
      }

      text {
        height: 50rpx;
        font-size: 25rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      // &:last-child {
      // 	margin-right: 0;
      // }
    }
  }
}
</style>
