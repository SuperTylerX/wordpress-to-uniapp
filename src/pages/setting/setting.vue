<template>
  <u-gap :height="10" bg-color="#f4f7f6"></u-gap>
  <view class="cell-wrap">
    <u-cell-group>
      <u-cell
        class="menu-cell"
        :is-link="true"
        size="large"
        :clickable="true"
        title="资料设置"
        @click="redirectTo('profile')"
      ></u-cell>

      <!-- 微信小程序、QQ小程序、百度小程序、快手小程序、京东小程序、360小程序支持openSetting -->
      <!-- #ifdef MP-WEIXIN || MP-QQ || MP-BAIDU -->
      <button open-type="openSetting" class="custom-btn">
        <u-cell class="menu-cell" title="授权设置" :is-link="true" size="large" :clickable="true">
        </u-cell>
      </button>
      <!-- #endif -->
    </u-cell-group>
  </view>

  <u-gap :height="10" bg-color="#f4f7f6"></u-gap>

  <view class="cell-wrap">
    <u-cell-group>
      <u-cell
        class="menu-cell"
        title="清除缓存"
        :is-link="true"
        size="large"
        :clickable="true"
        @click="clearCache"
      ></u-cell>
    </u-cell-group>
  </view>

  <u-gap :height="10" bg-color="#f4f7f6"></u-gap>

  <view v-if="isLogin" class="cell-wrap">
    <button class="logout-btn" @tap="logout">退出登录</button>
  </view>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash-es'
import { computed } from 'vue'

import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const isLogin = computed(() => !!userStore.token)

type RedirectType = 'agreement' | 'privacy' | 'profile'

const redirectTo = (type: RedirectType) => {
  switch (type) {
    case 'agreement':
      uni.navigateTo({
        url: '/pages/policy/policy?type=agreement'
      })
      return
    case 'privacy':
      uni.navigateTo({
        url: '/pages/policy/policy?type=privacy'
      })
      return
  }

  if (!isLogin.value) {
    uni.navigateTo({
      url: '/pages/login/login'
    })
    return
  }
  switch (type) {
    case 'profile':
      uni.navigateTo({
        url: '/pages/my/profile'
      })
      break
  }
}

const clearCache = () => {
  const user = cloneDeep(uni.getStorageSync('user'))
  uni.clearStorageSync()
  uni.setStorageSync('user', user)
  uni.showToast({
    title: '清除成功',
    icon: 'success'
  })
}

const logout = () => {
  uni.showToast({
    title: '退出成功'
  })
  userStore.resetStore()
  uni.switchTab({
    url: '/pages/my/my'
  })
}
</script>

<style>
page {
  background-color: #f4f7f6;
}
</style>

<style scoped lang="scss">
.cell-wrap {
  background-color: #ffffff;
}
.custom-btn {
  background-color: #fff;
  width: 100%;
  text-align: left;
  position: relative;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding-left: 0;
  padding-right: 0;
  box-sizing: border-box;
  font-size: 16px;
  text-decoration: none;
  line-height: 2.55555556;
  border-radius: 5px;
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;
  color: #000000;
  cursor: pointer;

  &::after {
    border: none;
  }
}

.logout-btn {
  background-color: #fff;
  width: 100%;
  text-align: center;
  position: relative;
  display: block;
  margin-left: auto;
  margin-right: auto;
  padding-left: 0;
  padding-right: 0;
  box-sizing: border-box;
  font-size: 16px;
  text-decoration: none;
  line-height: 2.55555556;
  border-radius: 5px;
  -webkit-tap-highlight-color: transparent;
  overflow: hidden;
  color: #e64340;
  cursor: pointer;
}
</style>
