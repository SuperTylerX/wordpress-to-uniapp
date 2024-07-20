<template>
  <view>
    <view class="separator">
      <text class="title">基本信息</text>
    </view>
    <view class="cell-wrap">
      <u-cell-group>
        <u-cell size="large" title="头像" is-link @click="selectAvatar">
          <template #value>
            <button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="wxSelectAvatar">
              <u-avatar :src="userInfo.avatar"></u-avatar>
            </button>
          </template>
        </u-cell>
        <u-cell
          size="large"
          title="昵称"
          is-link
          :value="userInfo.nickname"
          @click="changeItem('nickname')"
        ></u-cell>
        <u-cell size="large" title="UID" :value="userInfo.id"></u-cell>
        <u-cell size="large" title="用户等级" :value="userInfo.role"></u-cell>
        <u-cell
          size="large"
          title="邮箱"
          :value="userInfo.email ? userInfo.email : '未设置'"
          is-link
          @click="changeItem('email')"
        ></u-cell>
        <u-cell size="large" title="个性签名" is-link @click="changeItem('description')"></u-cell>
      </u-cell-group>
    </view>
    <view class="separator"><text class="title">社交绑定</text></view>

    <view class="cell-wrap">
      <u-cell-group>
        <u-cell
          size="large"
          title="微信"
          icon="weixin-fill"
          :label="socialWechat"
          :icon-style="{ marginRight: '20rpx' }"
        >
          <!--          <template #value>-->
          <!--            <u-tag-->
          <!--              :text="socialWechat ? '已绑定' : '绑定'"-->
          <!--              plain-->
          <!--              color="#909193"-->
          <!--              border-color="#909193"-->
          <!--              shape="circle"-->
          <!--              size="large"-->
          <!--              @click="bindSocial('wechat')"-->
          <!--            >-->
          <!--            </u-tag>-->
          <!--          </template>-->
        </u-cell>
        <u-cell
          size="large"
          title="QQ"
          icon="qq-fill"
          :label="socialQQ"
          :icon-style="{ marginRight: '20rpx' }"
        >
          <!--          <template #value>-->
          <!--            <u-tag-->
          <!--              :text="socialQQ ? '已绑定' : '绑定'"-->
          <!--              plain-->
          <!--              color="#909193"-->
          <!--              border-color="#909193"-->
          <!--              shape="circle"-->
          <!--              size="large"-->
          <!--              @click="bindSocial('qq')"-->
          <!--            >-->
          <!--            </u-tag>-->
          <!--          </template>-->
        </u-cell>
        <!--        <u-cell-->
        <!--          size="large"-->
        <!--          title="字节跳动"-->
        <!--          icon="/static/icon-toutiao.png"-->
        <!--          :label="socialBytedance"-->
        <!--          :icon-style="{ marginRight: '20rpx' }"-->
        <!--        >-->
        <!--          <template #value>-->
        <!--            <u-tag-->
        <!--              :text="socialBytedance ? '已绑定' : '绑定'"-->
        <!--              plain-->
        <!--              color="#909193"-->
        <!--              border-color="#909193"-->
        <!--              shape="circle"-->
        <!--              size="large"-->
        <!--              @click="bindSocial('byteDance')"-->
        <!--            >-->
        <!--            </u-tag>-->
        <!--          </template>-->
        <!--        </u-cell>-->

        <u-cell
          size="large"
          title="百度"
          icon="baidu"
          :label="socialBaidu"
          :icon-style="{ marginRight: '20rpx' }"
        >
          <!--          <template #value>-->
          <!--            <u-tag-->
          <!--              :text="socialBaidu ? '已绑定' : '绑定'"-->
          <!--              plain-->
          <!--              color="#909193"-->
          <!--              border-color="#909193"-->
          <!--              shape="circle"-->
          <!--              size="large"-->
          <!--              @click="bindSocial('byteDance')"-->
          <!--            >-->
          <!--            </u-tag>-->
          <!--          </template>-->
        </u-cell>

        <u-cell
          size="large"
          title="支付宝"
          icon="zhifubao"
          :label="socialAlipay"
          :icon-style="{ marginRight: '20rpx' }"
        >
          <!--          <template #value>-->
          <!--            <u-tag-->
          <!--              :text="socialAlipay ? '已绑定' : '绑定'"-->
          <!--              plain-->
          <!--              color="#909193"-->
          <!--              border-color="#909193"-->
          <!--              shape="circle"-->
          <!--              size="large"-->
          <!--              @click="bindSocial('byteDance')"-->
          <!--            >-->
          <!--            </u-tag>-->
          <!--          </template>-->
        </u-cell>
      </u-cell-group>
    </view>

    <u-popup
      :show="isChangeNicknamePopupShow"
      mode="center"
      :safe-area-inset-bottom="false"
      closeable
      :custom-style="{
        height: '200px'
      }"
      @close="isChangeNicknamePopupShow = false"
    >
      <view class="pop-box">
        <view class="title">更换昵称</view>
        <view class="item">
          <up-input
            v-model="newNickname"
            placeholder="请输入新昵称"
            border="bottom"
            clearable
          ></up-input>
        </view>

        <view class="buttons">
          <button class="cancel" @tap="closeUsernamePopup">取消</button>
          <button class="confirm" @tap="updateUsername">确认</button>
        </view>
      </view>
    </u-popup>

    <u-popup
      :show="isChangeDescriptionPopupShow"
      mode="center"
      :safe-area-inset-bottom="false"
      closeable
      :custom-style="{
        height: '200px'
      }"
      @close="isChangeDescriptionPopupShow = false"
    >
      <view class="pop-box">
        <view class="title">更新个性签名</view>
        <view class="item">
          <up-textarea
            v-model="newDescription"
            placeholder="请输入个性签名"
            border="bottom"
            clearable
          ></up-textarea>
        </view>

        <view class="buttons">
          <button class="cancel" @tap="closeDescriptionPopup">取消</button>
          <button class="confirm" @tap="updateDescription">确认</button>
        </view>
      </view>
    </u-popup>

    <u-popup
      :show="isChangeEmailPopupShow"
      mode="center"
      :safe-area-inset-bottom="false"
      closeable
      @close="isChangeEmailPopupShow = false"
    >
      <view class="pop-box">
        <view class="title">更换新邮箱</view>
        <view class="item">
          <up-input
            v-model="newEmail.email"
            placeholder="请输入新邮箱"
            border="bottom"
            clearable
          ></up-input>
        </view>
        <view class="item captchaImg-wrap">
          <up-input
            v-model="graphicCaptchaComputed"
            placeholder="请输入图形验证码"
            border="bottom"
            clearable
            :maxlength="4"
          >
          </up-input>
          <image
            :src="captchaImg"
            class="captchaImg"
            mode="scaleToFill"
            @click="refreshGraphicCaptcha"
          ></image>
        </view>
        <view class="item captchaImg-wrap">
          <up-input
            v-model="newEmail.emailCaptcha"
            placeholder="请输入邮箱验证码"
            border="bottom"
            clearable
          >
          </up-input>
          <view v-if="showFetchMailCaptcha" class="fetch-btn" @click="getEmailCaptcha"
            >点击获取验证码</view
          >
          <view v-else class="waiting">{{ timer }}秒后重新获取</view>
        </view>

        <view class="buttons">
          <button class="cancel" @tap="closeEmailPopup">取消</button>
          <button class="confirm" @tap="updateEmail">确认</button>
        </view>
      </view>
    </u-popup>
  </view>
  <image-crop
    v-if="chooseAvatarUrl"
    :url="chooseAvatarUrl"
    :width="200"
    :height="200"
    @cancel="chooseAvatarUrl = ''"
    @success="updateAvatar"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useUserStore } from '@/store/user'
import { getEmailCaptcha, getGraphicCaptcha, updateUserEmail, uploadAvatar } from '@/api/register'
import { getPlatform, localImgToBase64, sleep } from '@/utils'
import { mapState, mapActions } from 'pinia'
import { updateUserInfo } from '@/api/user'
import type { ButtonOnChooseavatarEvent } from '@uni-helper/uni-app-types'

export default defineComponent({
  data() {
    return {
      isChangeEmailPopupShow: false,
      email: '',
      captchaImg: '',
      newEmail: {
        email: '',
        graphicCaptcha: '',
        emailCaptcha: ''
      },
      showFetchMailCaptcha: true,
      timer: 60,
      token: '',
      isChangeNicknamePopupShow: false,
      newNickname: '',
      chooseAvatarUrl: '',
      isChangeDescriptionPopupShow: false,
      newDescription: ''
    }
  },
  computed: {
    ...mapState(useUserStore, ['userInfo']),
    socialQQ() {
      if (this.userInfo.social_connect) {
        return this.userInfo.social_connect.qq
      } else {
        return ''
      }
    },
    socialWechat() {
      if (this.userInfo.social_connect) {
        return this.userInfo.social_connect.wechat
      } else {
        return ''
      }
    },
    socialBytedance() {
      if (this.userInfo.social_connect) {
        return this.userInfo.social_connect.bytedance
      } else {
        return ''
      }
    },
    socialBaidu() {
      if (this.userInfo.social_connect) {
        return this.userInfo.social_connect.baidu
      } else {
        return ''
      }
    },
    socialAlipay() {
      if (this.userInfo.social_connect) {
        return this.userInfo.social_connect.alipay
      } else {
        return ''
      }
    },
    graphicCaptchaComputed: {
      get: function () {
        return this.newEmail.graphicCaptcha
      },
      set: function (val: string) {
        this.newEmail.graphicCaptcha = val.toUpperCase()
      }
    }
  },
  methods: {
    ...mapActions(useUserStore, ['getUserMetaInfo']),
    async uploadAvatar(avatar: string) {
      try {
        uni.showLoading({
          title: '更新中',
          mask: true
        })
        const res = await uploadAvatar(avatar)
        uni.hideLoading()
        if (res.code === 'success') {
          uni.showToast({
            title: res.message,
            icon: 'success'
          })
          const userStore = useUserStore()
          userStore.userInfo.avatar = res.data.avatarUrl
        }
      } catch (e) {
        uni.hideLoading()
        console.error()
      }
    },
    async wxSelectAvatar(e: ButtonOnChooseavatarEvent) {
      const avatarUrl = e.detail.avatarUrl
      const avatar = await localImgToBase64(avatarUrl)
      this.uploadAvatar(avatar)
    },
    async selectAvatar() {
      if (getPlatform() === 'MP-WEIXIN') {
        return
      }
      try {
        const { tempFilePaths } = await uni.chooseImage({
          count: 1
        })
        this.chooseAvatarUrl = tempFilePaths[0]
      } catch (e) {
        console.error(e)
      }
    },
    async updateAvatar(imageUrl: string) {
      this.chooseAvatarUrl = ''
      if (getPlatform() !== 'H5') {
        const avatar = await localImgToBase64(imageUrl)
        this.uploadAvatar(avatar)
      } else {
        // H5环境下，imageUrl是base64
        this.uploadAvatar(imageUrl)
      }
    },
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
        email: this.newEmail.email,
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
        uni.showToast({
          title: '请检查网络',
          icon: 'error'
        })
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
    async updateEmail() {
      const reqParamsObj = {
        email: this.newEmail.email,
        graphicCaptcha: this.graphicCaptchaComputed,
        emailCaptcha: this.newEmail.emailCaptcha,
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
        const { code, message } = await updateUserEmail(reqParamsObj)

        if (code !== '200') {
          uni.showToast({
            title: message,
            icon: ['APP', 'H5'].includes(getPlatform()) ? 'error' : 'none'
          })
          if (code === '4001' || code === '4002') {
            // token过期，重新获取验证码
            this.refreshGraphicCaptcha()
            this.graphicCaptchaComputed = ''
            this.newEmail.emailCaptcha = ''
          }
          return
        }
      } catch (e) {
        console.error(e)
        uni.showToast({
          title: '请检查网络',
          icon: 'error'
        })
        return
      }

      uni.showToast({
        title: '修改成功',
        icon: 'success'
      })

      this.getUserMetaInfo()
      this.closeEmailPopup()
    },
    changeItem(item: 'email' | 'nickname' | 'description') {
      switch (item) {
        case 'email': {
          this.isChangeEmailPopupShow = true
          this.refreshGraphicCaptcha()
          break
        }
        case 'nickname': {
          this.isChangeNicknamePopupShow = true
          break
        }
        case 'description': {
          this.isChangeDescriptionPopupShow = true
          break
        }
      }
    },
    closeEmailPopup() {
      this.isChangeEmailPopupShow = false
      this.newEmail = {
        email: '',
        graphicCaptcha: '',
        emailCaptcha: ''
      }
    },
    closeUsernamePopup() {
      this.isChangeNicknamePopupShow = false
      this.newNickname = ''
    },
    closeDescriptionPopup() {
      this.isChangeDescriptionPopupShow = false
      this.newDescription = ''
    },
    async updateUsername() {
      try {
        uni.showLoading({
          title: '更新中',
          mask: true
        })
        const res = await updateUserInfo({
          nickname: this.newNickname
        })
        uni.hideLoading()
        uni.showToast({
          title: '修改成功',
          icon: 'success'
        })
        const userStore = useUserStore()
        userStore.userInfo.nickname = res.nickname
        this.closeUsernamePopup()
      } catch (e) {
        uni.hideLoading()
        console.error(e)
      }
    },
    async updateDescription() {
      try {
        uni.showLoading({
          title: '更新中',
          mask: true
        })
        const res = await updateUserInfo({
          description: this.newDescription
        })
        uni.hideLoading()
        uni.showToast({
          title: '修改成功',
          icon: 'success'
        })
        const userStore = useUserStore()
        userStore.userInfo.description = res.description
        this.closeDescriptionPopup()
      } catch (e) {
        uni.hideLoading()
        console.error(e)
      }
    },
    async bindSocial(type: 'wechat' | 'qq' | 'byteDance' | 'baidu' | 'alipay') {
      switch (type) {
        case 'wechat':
          if (!this.userInfo.email) {
            uni.showToast({
              title: '您尚未绑定邮箱，无法解绑！',
              icon: 'none'
            })
            return
          }
          if (this.socialWechat) {
            const res = await uni.showModal({
              title: '提示',
              content: '您确认要解绑微信吗？'
            })
            if (res.confirm) {
              // 取消绑定
              console.error('取消绑定')
            }
          } else {
            if (!['MP-WEIXIN', 'APP'].includes(getPlatform())) {
              uni.showToast({
                title: '请在微信小程序或APP中绑定',
                icon: 'none'
              })
              return
            }
            console.error('去绑定')
          }

          break
        case 'qq':
          break
        case 'byteDance':
          break
      }
    }
  }
})
</script>

<style>
page {
  background-color: #f4f7f6;
}
</style>

<style lang="scss" scoped>
.separator {
  height: 80rpx;
  background-color: #f4f7f6;
  display: flex;
  justify-content: flex-end;
  padding: 10rpx;
  flex-direction: column;

  .title {
    font-size: 30rpx;
    margin-left: 25rpx;
    color: #909193;
  }
}

.cell-wrap {
  background-color: #ffffff;

  .avatar-wrapper {
    background: transparent;
    border: none;

    &::after {
      border: none;
    }
  }
}

.pop-box {
  width: 600rpx;
  height: 600rpx;
  border-radius: 10rpx;
  display: flex;
  justify-content: space-between;
  padding: 30rpx;
  background-color: #ffffff;
  flex-direction: column;

  .item {
    display: flex;

    .label {
      margin-bottom: 10rpx;
    }

    .captchaImg {
      height: 40px;
      width: 120px;
    }

    .fetch-btn {
      color: #007aff;
      cursor: pointer;
    }

    .waiting {
      color: #cccccc;
    }

    &.captchaImg-wrap {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
    }
  }

  .buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    gap: 20rpx;

    .cancel,
    .confirm {
      border: none;
      background-color: transparent;
      font-size: 30rpx;

      &::after {
        border: none;
      }
    }

    .confirm {
      color: #0081ff;
    }
  }
}
</style>
