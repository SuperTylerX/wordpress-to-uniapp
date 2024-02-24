<template>
  <view class="wrap">
    <view class="top">
      <view class="header">忘记密码</view>

      <form @submit="reset">
        <view class="input-wrap">
          <view class="email input-item">
            <u-icon class="icon" size="22" name="email"></u-icon>
            <input
              v-model="form.email"
              class="input"
              type="text"
              confirm-type="next"
              placeholder="请输入邮箱"
              name="email"
            />
          </view>
          <view class="password input-item">
            <u-icon class="icon" size="22" name="lock"></u-icon>
            <input
              v-model="form.password"
              class="input"
              type="password"
              confirm-type="next"
              placeholder="请输入新密码"
              name="password"
              maxlength="20"
            />
          </view>
          <view class="password input-item">
            <u-icon class="icon" size="22" name="lock"></u-icon>
            <input
              v-model="form.repassword"
              class="input"
              type="password"
              confirm-type="next"
              placeholder="请重复新密码"
              name="repassword"
              maxlength="20"
            />
          </view>

          <view class="graphicCaptcha input-item">
            <u-icon class="icon" size="22" name="info-circle"></u-icon>
            <input
              v-model="graphicCaptchaComputed"
              class="input"
              type="text"
              confirm-type="next"
              placeholder="请输入图形验证码"
              name="code"
              maxlength="4"
            />
            <image
              :src="captchaImg"
              class="captchaImg"
              mode="scaleToFill"
              @click="refreshGraphicCaptcha"
            >
            </image>
          </view>

          <view class="emailCaptcha input-item">
            <u-icon class="icon" size="22" name="chat"></u-icon>
            <input
              v-model="form.emailCaptcha"
              class="input"
              type="text"
              confirm-type="done"
              placeholder="请输入邮箱验证码"
              name="code"
              maxlength="6"
              @confirm="reset"
            />
            <view v-if="showFetchMailCaptcha" class="fetch-btn" @click="getEmailCaptcha"
              >点击获取验证码</view
            >
            <view v-else class="waiting">{{ timer }}秒后重新获取</view>
          </view>
        </view>

        <button class="button" type="primary" form-type="submit">重置密码</button>
      </form>
    </view>

    <view class="footer">
      <app-footer />
    </view>
  </view>
</template>

<script lang="ts">
import { getGraphicCaptcha, getEmailCaptcha, userResetPassword } from '@/api/register'

import { defineComponent } from 'vue'
import { sleep } from '@/utils'
import { useUserStore } from '@/store/user'

export default defineComponent({
  data() {
    return {
      form: {
        email: '',
        password: '',
        repassword: '',
        graphicCaptcha: '',
        emailCaptcha: ''
      },
      isPassFocus: false,
      showFetchMailCaptcha: true,
      timer: 60,
      captchaImg: '',
      token: ''
    }
  },
  computed: {
    graphicCaptchaComputed: {
      get: function () {
        return this.form.graphicCaptcha
      },
      set: function (val: string) {
        this.form.graphicCaptcha = val.toUpperCase()
      }
    }
  },
  methods: {
    async refreshGraphicCaptcha() {
      // 获取图形验证码
      const args = this.token === '' ? {} : { token: this.token }

      try {
        const { image, token } = await getGraphicCaptcha(args)

        this.captchaImg = image
        this.token = token
      } catch (e) {
        console.error(e)
      }
    },
    async getEmailCaptcha() {
      const reqParamsObj = {
        email: this.form.email,
        graphicCaptcha: this.graphicCaptchaComputed,
        token: this.token
      }

      /* 验证一下输入是否合法 */
      // 验证邮箱格式
      if (
        !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
          reqParamsObj.email
        )
      ) {
        uni.showToast({
          title: '邮箱格式有误',
          icon: 'error'
        })
        return
      }
      // 验证图形验证码长度
      if (reqParamsObj.graphicCaptcha.length !== 4) {
        uni.showToast({
          title: '图形验证码长度有误',
          icon: 'none'
        })
        return
      }

      uni.showToast({
        title: '请稍后...',
        icon: 'loading',
        duration: 999999
      })
      try {
        const { code, message } = await getEmailCaptcha(reqParamsObj)

        if (code !== '200') {
          uni.showToast({
            title: message,
            icon: 'error'
          })
          if (code === '4001' || code === '4002') {
            // token过期，重新获取验证码
            this.refreshGraphicCaptcha()
            this.graphicCaptchaComputed = ''
          }
          return
        }
      } catch (e) {
        console.error(e)
        return
      }

      uni.showToast({
        title: '发送成功, 请检查您的邮箱！',
        icon: 'none',
        position: 'bottom'
      })

      this.showFetchMailCaptcha = false
      for (let i = 60; i >= 0; i--) {
        this.timer = i
        await sleep(1000)
      }
      this.showFetchMailCaptcha = true
    },
    async reset() {
      /* 验证一下输入是否合法 */
      // 检查密码是否相同
      if (this.form.password !== this.form.repassword) {
        uni.showToast({
          title: '输入密码不一致',
          icon: 'error'
        })
        return
      }
      const reqParamsObj = {
        email: this.form.email,
        password: this.form.password,
        graphicCaptcha: this.graphicCaptchaComputed,
        emailCaptcha: this.form.emailCaptcha,
        token: this.token
      }

      // 验证邮箱格式
      if (
        !/^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
          reqParamsObj.email
        )
      ) {
        uni.showToast({
          title: '邮箱格式有误',
          icon: 'error'
        })
        return
      }
      // 验证密码长度
      if (reqParamsObj.password.length < 6) {
        uni.showToast({
          title: '密码长度过短',
          icon: 'none'
        })
        return
      }
      // 验证图形验证码长度
      if (reqParamsObj.graphicCaptcha.length !== 4) {
        uni.showToast({
          title: '图形验证码长度有误',
          icon: 'none'
        })
        return
      }
      // 验证邮箱验证码长度
      if (reqParamsObj.emailCaptcha.length !== 6) {
        uni.showToast({
          title: '邮箱验证码长度有误',
          icon: 'none'
        })
        return
      }

      uni.showToast({
        title: '请稍后...',
        icon: 'loading',
        duration: 999999
      })
      try {
        const { code, message } = await userResetPassword(reqParamsObj)

        if (code !== '200') {
          uni.showToast({
            title: message,
            icon: 'error'
          })
          if (code === '4001' || code === '4002') {
            // token过期，重新获取验证码
            this.refreshGraphicCaptcha()
            this.graphicCaptchaComputed = ''
            this.form.emailCaptcha = ''
          }
          return
        }
      } catch (e) {
        console.error(e)
        return
      }

      uni.showToast({
        title: '重置密码成功',
        icon: 'success'
      })

      // 成功重置密码，使用用户名密码进行登录
      const userStore = useUserStore()
      await userStore.login(this.form.email, this.form.password)

      // 验证通过，获取用户信息
      await userStore.getUserMetaInfo()

      uni.hideToast()

      // 返回首页
      uni.switchTab({
        url: '/pages/index/index'
      })
    }
  },
  onLoad() {
    this.refreshGraphicCaptcha()
  }
})
</script>

<style lang="scss" scoped>
page {
  height: 100%;
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
      margin-top: 40rpx;
      align-items: center;

      .icon {
        width: 70rpx;
      }

      .input {
        flex: 1;
      }

      .fetch-btn {
        color: #007aff;
        cursor: pointer;
      }

      .waiting {
        color: #cccccc;
      }

      .captchaImg {
        height: 40px;
        width: 120px;
      }

      &.graphicCaptcha {
        margin-top: 20rpx;
      }
    }
  }

  .button {
    margin-top: 100rpx;
    height: 90rpx;
    line-height: 90rpx;
    border-radius: 45rpx;
    background-color: #007aff;
  }

  .footer {
    margin-top: 30rpx;
  }
}
</style>
