<template>
  <view class="wrap">
    <u-navbar
      title="发布话题"
      :safe-area-inset-top="true"
      :border="true"
      :placeholder="true"
      @left-click="leftClick"
    >
      <!-- #ifndef MP -->
      <template #right>
        <u-button type="default" style="padding: 0" :disabled="!canSubmit" @click="submit"
          ><text class="publish-btn">发布</text></u-button
        >
      </template>
      <!-- #endif -->
    </u-navbar>

    <view class="textarea" @tap="focus = true">
      <up-textarea
        v-model="textarea"
        border="none"
        :auto-height="true"
        :foucus="true"
        placeholder="分享新鲜事..."
        maxlength="-1"
        :focus="focus"
        @blur="focus = false"
      ></up-textarea>
    </view>

    <view class="upload">
      <u-upload
        :file-list="imgList"
        name="imgList"
        multiple
        :max-count="9"
        width="100"
        height="100"
        @after-read="afterRead"
        @delete="deleteImg"
      ></u-upload>
    </view>

    <view class="">
      <u-cell-group>
        <picker
          mode="selector"
          :value="pickerIndex"
          :range="topicCategory"
          range-key="name"
          @change="changeCategory"
        >
          <u-cell
            :stop="false"
            title="话题分类"
            size="large"
            :is-link="true"
            arrow-direction="right"
            :value="topicCategory.length === 0 ? '' : topicCategory[pickerIndex].name"
          ></u-cell>
        </picker>
      </u-cell-group>
      <view class="form-item">
        <view class="left">话题标签</view>
        <view class="right"
          ><input
            v-model="tags"
            type="text"
            class="tag-input"
            placeholder="(可选) 多个标签以、或,分割"
          />
        </view>
      </view>
      <u-line></u-line>
      <!-- 			<view class="hot-tags">
				<view class="">
					热门标签
				</view>
				<view class="">

				</view>
			</view> -->
      <!-- #ifdef MP -->
      <view class="submit-btn-wrap"
        ><button type="primary" :disabled="!canSubmit" @tap="submit">发布</button></view
      >
      <!-- #endif -->
    </view>
  </view>
</template>

<script lang="ts">
import { getPlatform } from '@/utils/utils'
import { getForumCategories, postForumPost } from '@/api/forum'
import type { ForumCategory } from '@/types/forum'
import { deleteMedia, uploadMedia } from '@/api/media'
import { mapState } from 'pinia'
import { useUserStore } from '@/store/user'

interface ImgListItem {
  type: string
  url: string
  thumb: string
  size: number
  name: string
  status: string
  message: string
  id: number
  remoteUrl: string
}
export default {
  data() {
    return {
      textarea: '',
      imgList: [] as ImgListItem[],
      focus: false,
      topicCategory: [] as ForumCategory[],
      pickerIndex: 0,
      tags: '',
      isSubmitting: false
    }
  },
  computed: {
    ...mapState(useUserStore, ['token']),
    isLogin() {
      return !!this.token
    },
    canSubmit() {
      // 输入框有文字且所有图片都是success状态
      return (
        !this.isSubmitting &&
        this.textarea.length !== 0 &&
        this.imgList.filter(item => item.status !== 'success').length === 0
      )
    }
  },
  methods: {
    async fetchCategory() {
      try {
        this.topicCategory = await getForumCategories()
      } catch (e) {
        console.error(e)
      }
    },
    changeCategory(e: { detail: { value: number } }) {
      this.pickerIndex = e.detail.value
    },
    // 删除图片
    deleteImg(event: { index: number; file: ImgListItem }) {
      this.imgList.splice(event.index, 1)
      const id = event.file.id
      if (id) {
        deleteMedia({ id }) // 静默删除，不显示结果
      }
    },
    // 新增图片
    async afterRead(event: { file: ImgListItem[] }) {
      // 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
      const { file: list } = event

      let fileListLen = this.imgList.length

      list.forEach(item => {
        this.imgList.push({
          ...item,
          status: 'uploading',
          message: '上传中'
        })
      })

      for (let i = 0; i < list.length; i++) {
        try {
          const res = await uploadMedia({ filePath: list[i].url })

          const item = this.imgList[fileListLen]
          this.imgList.splice(
            fileListLen,
            1,
            Object.assign(item, {
              status: 'success',
              message: '',
              id: res.id,
              remoteUrl: res.source_url
            })
          )
          fileListLen++
        } catch (e) {
          console.error(e)
          const item = this.imgList[fileListLen]
          this.imgList.splice(
            fileListLen,
            1,
            Object.assign(item, {
              status: 'failed',
              message: '上传失败'
            })
          )
          fileListLen++
        }
      }
    },
    leftClick() {
      const pages = getCurrentPages()
      if (pages[pages.length - 2] && pages[pages.length - 2].route === 'pages/forum/index') {
        uni.navigateBack()
      } else {
        uni.switchTab({
          url: '/pages/forum/index'
        })
      }
    },
    async submit() {
      const forum_id = this.topicCategory[this.pickerIndex].id
      const content = this.textarea
      const tags = this.tags.split(/,|、/)
      const images = this.imgList.map(item => item.remoteUrl)
      const platform = getPlatform()

      this.isSubmitting = true
      try {
        uni.showLoading({
          title: '帖子发布中...'
        })
        const res = await postForumPost({ forum_id, content, tags, images, platform })
        uni.hideLoading()
        uni.showToast({
          title: res.message,
          icon: res.code === '1' ? 'success' : 'none',
          position: res.code === '1' ? 'center' : 'bottom',
          duration: 2000
        })
        uni.$emit('forumListRefresh')
        setTimeout(uni.navigateBack, 2000)
      } catch (e) {
        console.error(e)
        uni.hideLoading()

        this.isSubmitting = false
      }
    }
  },
  onLoad() {
    this.fetchCategory()
  },
  onShow() {
    if (!this.isLogin) {
      uni.redirectTo({
        url: '/pages/login/login'
      })
    }
  }
}
</script>

<style>
page {
  background-color: #fff;
}
</style>

<style lang="scss" scoped>
.publish-btn {
  color: #3c9cff;
}

.textarea {
  padding: 10rpx 10rpx;
  min-height: 300rpx;
}

.upload {
  padding: 10rpx 30rpx;
}

.form-item {
  height: 100rpx;
  padding: 10rpx 30rpx;
  box-sizing: border-box;
  display: flex;

  .left {
    width: 160rpx;
    line-height: 80rpx;
  }

  .right {
    flex: 1;
    display: flex;
    align-items: center;

    .tag-input {
      font-size: 30rpx;
      color: #606266;
      width: 100%;
    }
  }
}

.submit-btn-wrap {
  padding: 30rpx;
  margin-top: 30rpx;
}
</style>
