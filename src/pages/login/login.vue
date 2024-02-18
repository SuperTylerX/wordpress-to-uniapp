<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useUserStore } from '@/store/user'
import { login as uniLogin } from '@/utils/promisify'

const loginInput = reactive({
  username: '',
  password: ''
})

const isPassFocus = ref(false)

const userStore = useUserStore()

const loginHandler = async () => {
  if (loginInput.username === '') {
    uni.showToast({
      title: '用户名为空',
      icon: 'none'
    })
    return
  }
  if (loginInput.password === '') {
    uni.showToast({
      title: '密码为空',
      icon: 'none'
    })
    return
  }

  try {
    uni.showLoading({
      title: '登录中',
      mask: true
    })
    await userStore.login(loginInput.username, loginInput.password)

    // 验证通过，获取用户信息
    await userStore.getUserMetaInfo()

    // 登录成功，返回上一页
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    uni.hideLoading()
    uni.navigateBack()
  } catch (e) {
    uni.hideLoading()
    uni.showToast({
      title: '用户名或密码错误',
      icon: 'none'
    })
  }
}

const wxMiniAppLoginHandler = async () => {
  try {
    uni.showLoading({
      title: '登录中',
      mask: true
    })

    const res = await uniLogin({})

    await userStore.wxMiniAppLogin(res.code)

    // 验证通过，获取用户信息
    await userStore.getUserMetaInfo()

    // 登录成功，返回上一页
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    uni.hideLoading()
    uni.navigateBack()
  } catch (e) {
    console.error(e)
  }
}

const qqLoginHandler = () => {
  console.error('qqlogin')
}

const bdMiniAppLoginHandler = () => {
  console.error('baiduAppLogin')
}

const forgetPassOrRegister = (type: number) => {
  console.error('forgetPassOrRegister', type)
}
</script>

<template>
  <view class="wrap">
    <view class="top">
      <view class="header">登录</view>

      <form @submit="loginHandler">
        <view class="input-wrap">
          <view class="username input-item">
            <u-icon class="icon" size="22" name="account"></u-icon>
            <input
              v-model="loginInput.username"
              class="input"
              type="text"
              confirm-type="next"
              placeholder="请输入用户名/邮箱"
              name="username"
              @confirm="isPassFocus = true"
            />
          </view>
          <view class="password input-item">
            <u-icon class="icon" size="22" name="lock"></u-icon>
            <input
              v-model="loginInput.password"
              class="input"
              type="password"
              confirm-type="done"
              placeholder="请输入密码"
              :focus="isPassFocus"
              name="password"
              @blur="isPassFocus = false"
              @confirm="loginHandler"
            />
          </view>
        </view>

        <view class="more-options">
          <view class="forgot-pass"
            ><text class="color" @tap="forgetPassOrRegister(1)">忘记密码</text></view
          >
          <view class="register">
            没有账号？
            <text class="color" @tap="forgetPassOrRegister(2)">注册</text>
          </view>
        </view>

        <button class="button" type="primary" form-type="submit">登录</button>
      </form>

      <!-- #ifdef MP-WEIXIN-->
      <view class="thrid-login" @tap="wxMiniAppLoginHandler">
        <u-icon class="icon" size="60" name="weixin-fill" color="#62b900"></u-icon>
        <text class="disc">微信登录</text>
      </view>
      <!-- #endif -->

      <!-- #ifdef MP-QQ || H5 || APP-PLUS -->
      <view class="thrid-login" @tap="qqLoginHandler">
        <u-icon class="icon" size="30" name="qq-fill" color="#4BC1E8"></u-icon>
        <text class="disc">QQ登录</text>
      </view>
      <!-- #endif -->

      <!-- #ifdef MP-TOUTIAO -->
      <view type="default" plain="true" class="thrid-login" @tap="wxMiniAppLoginHandler">
        <u-icon class="icon" size="30" name="/static/icon-toutiao.png" color="#4BC1E8"></u-icon>
        <text class="disc">快捷登录</text>
      </view>
      <!-- #endif -->

      <!-- #ifdef MP-BAIDU -->
      <view type="default" plain="true" class="thrid-login" @tap="bdMiniAppLoginHandler">
        <u-icon class="icon" size="30" name="/static/icon-baidu.png" color="#4BC1E8"></u-icon>
        <text class="disc">快捷登录</text>
      </view>
      <!-- #endif -->
    </view>

    <view class="footer">
      <app-footer></app-footer>
    </view>
  </view>
</template>

<style lang="scss" scoped>
page {
  height: 100%;
  background-color: #ffffff;
}

.wrap {
  margin: 0 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 100%;

  .header {
    padding-top: 30rpx;
    font-size: 50rpx;
    font-weight: bold;
  }

  .input-wrap {
    margin-top: 80rpx;

    .input-item {
      display: flex;
      padding: 20rpx;
      border-bottom: 1px solid #eee;
      flex-direction: row;

      .icon {
        width: 70rpx;
      }

      .input {
        flex: 1;
      }

      &.password {
        margin-top: 40rpx;
      }
    }
  }

  .more-options {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-top: 30rpx;

    .register {
      flex-direction: row;
    }

    .color {
      color: #007aff;
    }
  }

  .button {
    margin-top: 100rpx;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 45rpx;
    background-color: #007aff;
  }

  .thrid-login {
    margin-top: 80rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .icon {
      border: 1px solid #e2e3e3;
      padding: 15rpx;
      border-radius: 50%;
    }

    .disc {
      margin-top: 10rpx;
      color: #bcbcbc;
      font-size: 28rpx;
    }
  }

  button.thrid-login {
    border: transparent;
  }

  .footer {
    margin-top: 30rpx;
  }
}
</style>
