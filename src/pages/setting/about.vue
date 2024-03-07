<template>
  <view class="wrap">
    <view>
      <!--    放logo -->
      <view class="logo-wrap">
        <image src="/static/logo.png" class="logo" />
        <view class="version">v1.0.0</view>
      </view>

      <u-gap :height="10" bg-color="#f4f7f6"></u-gap>

      <!-- #ifdef APP-PLUS -->
      <view class="cell-wrap">
        <u-cell-group>
          <u-cell
            class="menu-cell"
            title="检查更新"
            :is-link="true"
            size="large"
            :clickable="true"
            @click="checkUpdateHandler"
          ></u-cell>
        </u-cell-group>
      </view>
      <u-gap :height="10" bg-color="#f4f7f6"></u-gap>
      <!-- #endif -->

      <!-- 微信小程序、QQ小程序、百度小程序、快手小程序、京东小程序、360小程序支持openSetting -->

      <view class="cell-wrap">
        <u-cell-group>
          <!-- #ifdef APP-PLUS || MP-WEIXIN || MP-QQ -->
          <button open-type="feedback" class="custom-btn">
            <u-cell
              class="menu-cell"
              title="意见反馈"
              :is-link="true"
              size="large"
              :clickable="true"
            >
            </u-cell>
          </button>
          <!-- #endif -->

          <!-- 微信小程序、百度小程序、快手小程序、抖音小程序 -->
          <!-- #ifdef MP-WEIXIN || MP-BAIDU || MP-TOUTIAO -->
          <button open-type="contact" class="custom-btn">
            <u-cell
              class="menu-cell"
              title="联系客服"
              :is-link="true"
              size="large"
              :clickable="true"
            >
            </u-cell>
          </button>
          <!-- #endif -->
        </u-cell-group>
      </view>
      <u-gap :height="10" bg-color="#f4f7f6"></u-gap>

      <!-- #ifdef MP-QQ -->
      <view class="cell-wrap">
        <u-cell-group>
          <button open-type="openGroupProfile" group-id="144945542" class="custom-btn">
            <u-cell
              class="menu-cell"
              title="加入QQ群"
              :is-link="true"
              size="large"
              :clickable="true"
            >
            </u-cell>
          </button>
          <button open-type="addGroupApp" class="custom-btn">
            <u-cell
              class="menu-cell"
              title="添加到群应用"
              :is-link="true"
              size="large"
              :clickable="true"
            >
            </u-cell>
          </button>
        </u-cell-group>
      </view>
      <u-gap :height="10" bg-color="#f4f7f6"></u-gap>

      <!-- #endif -->

      <view class="cell-wrap">
        <u-cell-group>
          <u-cell
            class="menu-cell"
            title="用户协议"
            :is-link="true"
            size="large"
            :clickable="true"
            @click="redirectTo('agreement')"
          ></u-cell>
          <u-cell
            class="menu-cell"
            title="隐私政策"
            :is-link="true"
            size="large"
            :clickable="true"
            @click="redirectTo('privacy')"
          ></u-cell>
        </u-cell-group>
      </view>
    </view>

    <app-footer></app-footer>
  </view>
</template>

<script setup lang="ts">
import { checkUpdate } from '@/pages/app-update/app-update-check'

type RedirectType = 'agreement' | 'privacy'
const redirectTo = (type: RedirectType) => {
  switch (type) {
    case 'agreement':
      uni.navigateTo({
        url: '/pages/policy/policy?type=agreement'
      })
      break
    case 'privacy':
      uni.navigateTo({
        url: '/pages/policy/policy?type=privacy'
      })
      break
    default:
      break
  }
}

const checkUpdateHandler = async () => {
  const needUpdate = await checkUpdate()
  if (!needUpdate) {
    uni.showModal({
      title: '提示',
      content: '当前已是最新版本'
    })
  }
}
</script>

<style>
page {
  background-color: #f4f7f6;
}
</style>

<style scoped lang="scss">
.wrap {
  min-height: calc(100vh - 45px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.cell-wrap {
  background-color: #ffffff;
}

.logo-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 40rpx;

  .logo {
    width: 200rpx;
    height: 200rpx;
  }
  .version {
    font-size: 28rpx;
    color: #999;
    margin-top: 20rpx;
  }
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
</style>
