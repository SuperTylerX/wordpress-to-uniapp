<template>
  <view class="editor-wrap">
    <div class="input-wrap">
      <input
        v-model="title"
        placeholder="请输入文章标题"
        style="font-size: 40rpx; font-weight: bold"
      />
    </div>
    <view v-if="isEditorShow" class="editor-box">
      <sp-editor
        :toolbar-config="{
          iconSize: '18px'
        }"
        @init="initEditor"
        @input="inputOver"
      ></sp-editor>
    </view>

    <u-cell-group>
      <u-cell
        :stop="false"
        title="分类"
        size="large"
        :is-link="true"
        arrow-direction="right"
        @click="showPicker"
      >
        <template #value>
          <span class="cell-value">
            {{ pickerSelected }}
          </span>
        </template>
      </u-cell>
      <u-cell
        :stop="false"
        size="large"
        :is-link="true"
        arrow-direction="right"
        @click="showTagModal"
      >
        <template #label>
          <text style="white-space: nowrap">标签</text>
        </template>
        <template #value>
          <text class="cell-value">
            {{ tags.map(item => item.name).join('、') || '请选择标签' }}
          </text>
        </template>
      </u-cell>
    </u-cell-group>

    <view class="submit-btn-wrap">
      <u-button type="primary" @click="publish">发布</u-button>
    </view>

    <app-footer></app-footer>

    <uni-data-picker
      ref="pickerRef"
      v-model="category"
      :localdata="topicCategory"
      popup-title="请选择分类"
      :border="false"
    >
      <div></div>
    </uni-data-picker>

    <u-popup
      :show="isTagModalShow"
      :round="10"
      mode="bottom"
      closeable
      close-on-click-overlay
      @close="isTagModalShow = false"
    >
      <view class="popup-wrap">
        <div>
          <u-input
            v-model="tagKeywords"
            placeholder="请输入标签名称"
            @change="onKeywordChange"
            @confirm="addTag"
          >
            <template #suffix>
              <u-icon name="plus-circle-fill" color="#999" @click="addTag"></u-icon>
            </template>
          </u-input>
        </div>

        <view class="tag-wrap">
          <view>已选标签</view>
          <div class="candidate-tags-wrap">
            <u-tag
              v-for="item in tags"
              :key="item.id"
              :text="item.name"
              size="large"
              closable
              @close="removeTag(item)"
            ></u-tag>
          </div>
        </view>

        <view class="tag-wrap">
          <view>待选标签</view>
          <div class="candidate-tags-wrap">
            <u-tag
              v-for="item in candidateTagsFilter"
              :key="item.id"
              :text="item.name"
              plain
              size="large"
              @click="addToTagList(item)"
            ></u-tag>
          </div>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app'
import { throttle } from 'lodash-es'
import { computed, nextTick, ref } from 'vue'

import { getCategoryList } from '@/api/category'
import { createPost, getPost, updatePost } from '@/api/post'
import { createTag, getTagList } from '@/api/tag'
import UniDataPicker from '@/components/uni-data-picker/uni-data-picker.vue'
import { useUserStore } from '@/store/user'
import type { Category } from '@/types/category'
import type { Tag } from '@/types/tag'

const userStore = useUserStore()

// 分类逻辑开始
const pickerRef = ref<InstanceType<typeof UniDataPicker> | null>(null)

const pickerSelected = computed(() => {
  if (pickerRef.value?.selected.length === 0) {
    return '请选择分类'
  }
  return pickerRef.value?.selected.map((item: AnyObject) => item.text).join(' / ')
})

type CategoryOptions = {
  text: string
  value: number
  children?: CategoryOptions[]
}

const topicCategory = ref<CategoryOptions[]>([])

function convertToArrayTree(nodes: Category[], parentId = 0): CategoryOptions[] {
  return nodes
    .filter(node => node.parent === parentId)
    .map(node => ({
      text: node.name,
      value: node.id,
      children: convertToArrayTree(nodes, node.id) // 递归构建子树
    }))
}

const fetchCategory = async () => {
  try {
    const res = await getCategoryList({})
    topicCategory.value = convertToArrayTree(res)
  } catch (e) {
    console.error(e)
  }
}

const category = ref<number[]>([])

const isEditorShow = ref(false)

const renderContent = ref('')
const title = ref('')
const tags = ref<Tag[]>([])

const editorCtx = ref<UniNamespace.EditorContext | null>(null)

const showPicker = () => {
  pickerRef.value?.show()
}

const inputOver = () =>
  // e: AnyObject
  {
    // 可以在此处获取到编辑器已编辑的内容
    // uni.setStorageSync('draft', e.html)
  }

const initEditor = async (editor: UniNamespace.EditorContext) => {
  editorCtx.value = editor // 保存编辑器实例
  await nextTick()
  editorCtx.value!.setContents({
    html: renderContent.value
  })
}

const postId = ref(0)

onLoad(async options => {
  if (!options) {
    return
  }
  uni.showLoading({
    title: '加载中',
    mask: true
  })
  await fetchCategory()
  if (options.id) {
    postId.value = Number(options.id)
    // 获取已有的文章内容
    const res = await getPost(postId.value)
    renderContent.value = res.content.rendered
    // 设置文章标题
    title.value = res.title.rendered
    // 设置文章分类
    category.value = res.categories
    // 设置文章标签
    tags.value = await getTagList({
      include: res.tags
    })
  } else {
    // 从本地存储中获取草稿
    // const draft = uni.getStorageSync('draft')
    // if (draft) {
    //   renderContent.value = draft
    // }
  }
  isEditorShow.value = true
  uni.hideLoading()
})

const publish = () => {
  editorCtx.value?.getContents({
    success: async content => {
      if (!title.value) {
        uni.showToast({
          title: '请输入标题',
          icon: 'none'
        })
        return
      }

      uni.showLoading({
        title: '发布中',
        mask: true
      })
      try {
        if (postId.value) {
          await updatePost({
            id: postId.value,
            title: title.value,
            content: content.html,
            categories: pickerRef.value?.selected.map((item: AnyObject) => item.value),
            tags: tags.value.map(item => item.id),
            status: userStore.userInfo.capabilities.publish_posts ? 'publish' : 'pending'
          })

          uni.hideLoading()
          await uni.showToast({
            title: '更新成功',
            icon: 'success'
          })
        } else {
          await createPost({
            title: title.value,
            content: content.html,
            categories: pickerRef.value?.selected.map((item: AnyObject) => item.value),
            tags: tags.value.map(item => item.id),
            status: userStore.userInfo.capabilities.publish_posts ? 'publish' : 'pending'
          })

          uni.hideLoading()
          await uni.showToast({
            title: '发布成功',
            icon: 'success'
          })
        }

        // uni.removeStorageSync('draft')
        uni.navigateBack()
      } catch (e) {
        await uni.hideLoading()
        console.error(e)
      }
    }
  })
}

const isTagModalShow = ref(false)

const showTagModal = () => {
  isTagModalShow.value = true
}

// 候选区标签
const candidateTags = ref<Tag[]>([])
const candidateTagsFilter = computed(() => {
  return candidateTags.value.filter(item => !tags.value.some(el => el.id === item.id))
})

const tagKeywords = ref('')

const getTags = async () => {
  // 获取标签
  candidateTags.value = await getTagList({
    search: tagKeywords.value,
    orderby: 'count',
    order: 'desc',
    per_page: 20
  })
}
getTags()

const onKeywordChange = throttle(getTags, 1000)

const addToTagList = (tag: Tag) => {
  if (tags.value.some(item => item.id === tag.id)) {
    return
  }
  tags.value.push(tag)
}

const removeTag = (tag: Tag) => {
  tags.value = tags.value.filter(item => item.id !== tag.id)
}

const addTag = async () => {
  // 检查输入框是否为空
  if (!tagKeywords.value) {
    return
  }
  // 检查已选标签中是否有该标签, 有则不添加
  if (tags.value.some(item => item.name === tagKeywords.value)) {
    tagKeywords.value = ''
    return
  }
  // 检查候选框中是否有该标签, 有则直接添加
  let tag = candidateTags.value.find(item => item.name === tagKeywords.value)
  if (tag) {
    addToTagList(tag)
    return
  } else {
    // 没有则先创建标签再添加
    await uni.showLoading({
      title: '添加中',
      mask: true
    })
    tag = await createTag({
      name: tagKeywords.value
    })
    uni.hideLoading()
    addToTagList(tag)
  }
  tagKeywords.value = ''
}
</script>

<style>
page {
  background-color: #fff;
}
</style>

<style lang="scss" scoped>
.editor-wrap {
  padding: 0 20rpx;
}

.input-wrap {
  margin-top: 20rpx;
  margin-bottom: 20rpx;
  border-bottom: 1px solid #ebeef5;
  padding: 10rpx 10rpx;
}

.editor-box {
  min-height: 1000rpx;
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

.popup-wrap {
  height: 1000rpx;
  padding: 80rpx 40rpx 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  .search-bar {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20rpx;
  }
}

.candidate-tags-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 10rpx;
}

.tag-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.cell-value {
  color: #888888;
}

.submit-btn-wrap {
  padding: 30rpx;
  margin-top: 30rpx;
}
</style>
