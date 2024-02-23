<template>
  <view>
    <view class="user-box" @tap="login">
      <view class="u-m-r-40">
        <view v-if="isLogin">
          <u-avatar :src="userInfo.avatar" size="60"></u-avatar>
        </view>
        <view v-else>
          <u-avatar :src="DEFAULT_AVATAR_URL" size="60"></u-avatar>
        </view>
      </view>
      <view class="right">
        <view>
          <view v-if="isLogin" class="name">{{ userInfo.nickname }}</view>
          <view v-else class="name">游客</view>

          <view v-if="isLogin" class="role">{{ userInfo.role }}</view>
          <view v-else class="role">登录</view>
        </view>
        <view v-if="isLogin" class="scan" @click.stop="scanQR">
          <u-icon name="scan" color="#aaaaaa" size="30"></u-icon>
        </view>
      </view>
    </view>

    <view class="menus">
      <u-cell-group>
        <u-cell
          class="menu-cell"
          icon="file-text-fill"
          title="阅读历史"
          :is-link="true"
          size="large"
          :clickable="true"
          @tap="goTo('history')"
        ></u-cell>
        <u-cell
          class="menu-cell"
          icon="star-fill"
          title="我的收藏"
          :is-link="true"
          size="large"
          :clickable="true"
          @tap="goTo('like')"
        >
        </u-cell>
        <u-cell
          class="menu-cell"
          icon="chat-fill"
          title="我的评论"
          :is-link="true"
          size="large"
          :clickable="true"
          @tap="goTo('comment')"
        ></u-cell>
        <u-cell
          class="menu-cell"
          :is-link="true"
          size="large"
          :clickable="true"
          icon="edit-pen-fill"
          title="我的资料"
          @tap="goTo('profile')"
        ></u-cell>
      </u-cell-group>
    </view>

    <view class="menus-2">
      <u-cell-group>
        <!-- <u-cell icon="setting-fill" title="关于我们"></u-cell> -->
        <u-cell
          class="menu-cell"
          icon="person-delete-fill"
          title="退出登录"
          :is-link="true"
          size="large"
          :clickable="true"
          @tap="logout"
        ></u-cell>
      </u-cell-group>
    </view>
  </view>
</template>

<script setup lang="ts">
import { DEFAULT_AVATAR_URL, WEBSITE_NAME } from '@/config'
import { scanCode } from '@/utils'
import { useUserStore } from '@/store/user'
import { computed } from 'vue'
import { onLoad, onShareAppMessage, onShareTimeline } from '@dcloudio/uni-app'
import { useConfigStore } from '@/store/config'

const userStore = useUserStore()
const userInfo = userStore.userInfo

const isLogin = computed(() => !!userStore.token)
const login = () => {
  uni.navigateTo({
    url: isLogin.value ? '/pages/my/center' : '/pages/login/login'
  })
}
const logout = () => {
  uni.showToast({
    title: '退出成功'
  })
  userStore.resetStore()
}

type redirectPageType = 'like' | 'comment' | 'profile' | 'history'
const goTo = (option: redirectPageType) => {
  if (option === 'history') {
    uni.navigateTo({
      url: '/pages/list/list?history=true'
    })
    return
  }

  if (!isLogin.value) {
    uni.navigateTo({
      url: '../login/login'
    })
    return
  }

  switch (option) {
    case 'like':
      uni.navigateTo({
        url: '/pages/list/list?like=true'
      })
      break
    case 'comment':
      uni.navigateTo({
        url: '/pages/my/comment'
      })
      break
    case 'profile':
      uni.navigateTo({
        url: '/pages/my/profile'
      })
      break
  }
}
const scanQR = async () => {
  try {
    const { result } = await scanCode({})
    const code = JSON.parse(result)
    if (!code.token) {
      throw new Error('无法识别的二维码')
    }

    const { token } = code
    uni.navigateTo({
      url: '/pages/my/confirm?token=' + token
    })
  } catch (e) {
    console.error(e)
    if ((e as { errMsg: string }).errMsg == 'scanCode:fail cancel') {
      return
    }
    uni.showToast({
      icon: 'error',
      title: '二维码未识别'
    })
  }
}

onLoad(() => {
  // #ifdef MP-QQ
  uni.showShareMenu({
    withShareTicket: true,
    showShareItems: ['qq', 'qzone', 'wechatFriends', 'wechatMoment']
  })
  // #endif
  // #ifdef MP-WEIXIN
  uni.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  })
  // #endif
})

const configStore = useConfigStore()

onShareAppMessage(() => {
  return {
    title: `分享「${WEBSITE_NAME}」小程序`,
    path: 'pages/index/index',
    imageUrl: configStore.config.shareImageUrl
  }
})

onShareTimeline(() => {
  return {
    title: `分享「${WEBSITE_NAME}」小程序`
  }
})
</script>

<style>
page {
  background-color: #f4f7f6;
}
</style>

<style scoped lang="scss">
.camera {
  width: 54px;
  height: 44px;

  &:active {
    background-color: #ededed;
  }
}

.user-box {
  background-color: #fff;
  display: flex;
  padding: 30rpx 30rpx 60rpx;
  gap: 50rpx;

  .right {
    flex: 1;
    position: relative;

    .name {
      font-size: 35rpx;
      font-weight: 600;
    }

    .role {
      font-size: 30rpx;
      margin-top: 20rpx;
      color: #b2b6b9;
    }

    .scan {
      position: absolute;
      top: 30rpx;
      right: 20rpx;
    }
  }
}

.menus {
  margin-top: 20rpx;
  background-color: #fff;
}

.menus-2 {
  margin-top: 20rpx;
  background-color: #fff;
}
</style>
