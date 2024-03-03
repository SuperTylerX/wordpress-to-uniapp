<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useUserStore } from '@/store/user'
import { onLoad } from '@dcloudio/uni-app'
import { useConfigStore } from '@/store/config'
import { DEFAULT_AVATAR_URL } from '@/config'
import { getLoginCode } from '@/utils'

interface GetUserInfo {
  type: string
  timeStamp: number
  detail: Detail
}

interface Detail {
  errMsg: string
  rawData: string
  userInfo: UserInfo
  signature: string
  encryptedData: string
  iv: string
}

interface UserInfo {
  avatarUrl: string
  nickName: string
}

const loginInput = reactive({
  username: '',
  password: ''
})

const isPassFocus = ref(false)

const userStore = useUserStore()
const configStore = useConfigStore()

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

    uni.hideLoading()

    // 登录成功，返回上一页
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

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

    const res = await uni.login()

    await userStore.wxMiniAppLogin(res.code)

    // 验证通过，获取用户信息
    await userStore.getUserMetaInfo()

    uni.hideLoading()

    // 登录成功，返回上一页
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    uni.navigateBack()
  } catch (e) {
    console.error(e)
  }
}

const qqMinAppLoginHandler = async (res: GetUserInfo) => {
  const { avatarUrl, nickName } = res.detail.userInfo
  try {
    uni.showLoading({
      title: '登录中',
      mask: true
    })

    const res = await uni.login()

    await userStore.qqMiniAppLogin(res.code, nickName, avatarUrl)

    // 验证通过，获取用户信息
    await userStore.getUserMetaInfo()

    uni.hideLoading()

    // 登录成功，返回上一页
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    uni.navigateBack()
  } catch (e) {
    console.error(e)
  }
}

const qqAppLoginHandler = async () => {
  try {
    const res1 = await uni.login({
      provider: 'qq'
    })
    const res2 = await uni.getUserInfo({
      provider: 'qq'
    })

    const access_token = (res1.authResult as unknown as AnyObject).access_token
    const { avatarUrl, nickName } = res2.userInfo

    uni.showLoading({
      title: '登录中',
      mask: true
    })

    await userStore.qqAppLogin(access_token, nickName, avatarUrl)

    // 验证通过，获取用户信息
    await userStore.getUserMetaInfo()

    uni.hideLoading()

    // 登录成功，返回上一页
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    uni.navigateBack()
  } catch (e) {
    console.error(e)
  }
}

const qqH5LoginHandler = async () => {
  // QQ H5登录
  const clientId = configStore.config.uni_h5_qq_client_id
  const redirectUri = configStore.config.uni_h5_qq_callback_url
  const scope = 'get_user_info' // 权限范围，根据需要修改

  const authUrl = 'https://graph.qq.com/oauth2.0/authorize'
  const responseType = 'token'

  // 构造授权链接
  window.location.href = `${authUrl}?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scope}`
}

// #ifdef H5
onLoad(async () => {
  const hash = window.location.hash.replace(/^#\/[^#]*#/, '')
  const hashParams = new Map<string, string>()
  const params = hash.split('&')

  for (let i = 0; i < params.length; i++) {
    const param = params[i].split('=')
    const key = decodeURIComponent(param[0])
    const value = decodeURIComponent(param[1])
    hashParams.set(key, value)
  }

  if (hashParams.has('access_token')) {
    const access_token = hashParams.get('access_token') as string

    uni.showLoading({
      title: '登录中',
      mask: true
    })

    await userStore.qqWebLogin(access_token)

    // 验证通过，获取用户信息
    await userStore.getUserMetaInfo()

    uni.hideLoading()

    // 登录成功，返回上一页
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    uni.switchTab({
      url: '/pages/index/index'
    })
  }
})
// #endif

const bdMiniAppLoginHandler = async (res: GetUserInfo) => {
  const { avatarUrl, nickName } = res.detail.userInfo
  try {
    uni.showLoading({
      title: '登录中',
      mask: true
    })

    const res = await getLoginCode({})

    await userStore.baiduMiniAppLogin(res.code, nickName, avatarUrl)

    // 验证通过，获取用户信息
    await userStore.getUserMetaInfo()

    uni.hideLoading()

    // 登录成功，返回上一页
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    uni.navigateBack()
  } catch (e) {
    console.error(e)
  }
}

const ttMiniAppLoginHandler = async (res: GetUserInfo) => {
  const { avatarUrl, nickName } = res.detail.userInfo
  try {
    uni.showLoading({
      title: '登录中',
      mask: true
    })

    const res = await uni.login()

    await userStore.bytedanceMiniAppLogin(res.code, nickName, avatarUrl)

    // 验证通过，获取用户信息
    await userStore.getUserMetaInfo()

    uni.hideLoading()

    // 登录成功，返回上一页
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    uni.navigateBack()
  } catch (e) {
    console.error(e)
  }
}

const aliMiniAppLoginHandler = async (res: {
  detail: { code: string; avatar: string; nickName: string }
}) => {
  const { code } = res.detail
  let { avatar, nickName } = res.detail

  if (code !== '10000') {
    // 个人小程序无法获取到用户信息, 使用默认头像和昵称
    avatar = DEFAULT_AVATAR_URL
    nickName = '支付宝用户'
  }

  try {
    uni.showLoading({
      title: '登录中',
      mask: true
    })

    // @ts-expect-error my is not defined
    const { authCode } = await my.getAuthCode({
      scopes: 'auth_user'
    })

    await userStore.alipayMiniAppLogin(authCode, nickName, avatar)

    // 验证通过，获取用户信息
    await userStore.getUserMetaInfo()

    uni.hideLoading()

    // 登录成功，返回上一页
    uni.showToast({
      title: '登录成功',
      icon: 'success'
    })

    uni.navigateBack()
  } catch (e) {
    console.error(e)
  }
}

const forgetPassOrRegister = (type: 1 | 2) => {
  switch (type) {
    case 1:
      uni.navigateTo({
        url: '/pages/login/register'
      })
      break
    case 2:
      uni.navigateTo({
        url: '/pages/login/reset'
      })
      break
  }
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
              :password="true"
              type="safe-password	"
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
            ><text class="color" @tap="forgetPassOrRegister(2)">忘记密码</text></view
          >
          <view class="register">
            没有账号？
            <text class="color" @tap="forgetPassOrRegister(1)">注册</text>
          </view>
        </view>

        <button class="button" type="primary" form-type="submit">登录</button>
      </form>

      <!-- #ifdef MP-WEIXIN-->
      <view class="third-login" @tap="wxMiniAppLoginHandler">
        <u-icon class="icon" size="60" name="weixin-fill" color="#62b900"></u-icon>
        <text class="disc">微信登录</text>
      </view>
      <!-- #endif -->

      <!-- #ifdef MP-QQ -->
      <button class="third-login" open-type="getUserInfo" @getuserinfo="qqMinAppLoginHandler">
        <u-icon class="icon" size="30" name="qq-fill" color="#4BC1E8"></u-icon>
        <text class="disc">QQ登录</text>
      </button>
      <!-- #endif -->

      <!-- #ifdef APP-PLUS -->
      <view class="third-login" @tap="qqAppLoginHandler">
        <u-icon class="icon" size="30" name="qq-fill" color="#4BC1E8"></u-icon>
        <text class="disc">QQ登录</text>
      </view>
      <!-- #endif -->

      <!-- #ifdef H5 -->
      <view class="third-login" @tap="qqH5LoginHandler">
        <u-icon class="icon" size="30" name="qq-fill" color="#4BC1E8"></u-icon>
        <text class="disc">QQ登录</text>
      </view>
      <!-- #endif -->

      <!-- #ifdef MP-TOUTIAO -->
      <button
        type="default"
        plain="true"
        class="third-login"
        open-type="getUserInfo"
        @getuserinfo="ttMiniAppLoginHandler"
      >
        <u-icon class="icon" size="30" name="/static/icon-toutiao.png" color="#4BC1E8"></u-icon>
        <text class="disc">快捷登录</text>
      </button>
      <!-- #endif -->

      <!-- #ifdef MP-BAIDU -->
      <button
        type="default"
        plain="true"
        class="third-login"
        open-type="getUserInfo"
        @getuserinfo="bdMiniAppLoginHandler"
      >
        <u-icon class="icon" size="30" name="/static/icon-baidu.png" color="#4BC1E8"></u-icon>
        <text class="disc">快捷登录</text>
      </button>
      <!-- #endif -->

      <!-- #ifdef MP-ALIPAY -->
      <button
        type="default"
        plain="true"
        class="third-login"
        open-type="getAuthorize"
        scope="userInfo"
        style="height: 150rpx"
        @getUserInfo="aliMiniAppLoginHandler"
      >
        <u-icon class="icon" size="30" name="zhifubao" color="#1977FD"></u-icon>
        <text class="disc">快捷登录</text>
      </button>
      <!-- #endif -->
    </view>

    <view class="footer">
      <app-footer></app-footer>
    </view>
  </view>
</template>

<style>
page {
  height: 100vh;
  background-color: #ffffff;
}
</style>

<style lang="scss" scoped>
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

  .third-login {
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

  button.third-login {
    border: transparent;
    background: transparent;

    &::after {
      border: transparent;
    }
  }

  .footer {
    margin-top: 30rpx;
  }
}
</style>
