<template>
  <view>
    <view v-if="isLoading">
      <view class="topic-common-list">
        <view class="topic-list-item">
          <view>
            <u-skeleton
              :title="false"
              :rows="1"
              loading
              :rows-width="['100%']"
              rows-height="240rpx"
            >
            </u-skeleton>
          </view>
        </view>
      </view>
      <!-- 加载图 -->
      <view class="skeleton">
        <view v-for="item in 4" :key="item" class="item">
          <u-skeleton
            rows="2"
            title
            loading
            :rows-width="['90%', '70%']"
            rows-height="14"
            avatar
            avatar-size="80"
            avatar-shape="square"
          >
          </u-skeleton>
        </view>
      </view>
    </view>
    <view v-else>
      <!-- 文章分类 -->
      <view v-if="isCategoryPage" class="topic-common-list">
        <view class="topic-list-item">
          <image :src="cover" class="cover" mode="aspectFill"></image>
          <view class="topic-item-content">
            <view class="topic-content-brief">
              <text>{{ category.description }}</text>
            </view>
            <view class="topic-content-num">
              <text>共有 {{ category.count }} 篇文章</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 标签列表 -->
      <view v-if="isTagPage" class="topic-common-list">
        <view class="topic-list-item">
          <image :src="cover" class="cover" mode="aspectFill"></image>
          <view class="topic-item-content">
            <view class="topic-content-brief">
              <text>#{{ tag.name }}</text>
            </view>
            <view class="topic-content-num">
              <text>共收录 {{ tag.count }} 篇文章</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 搜索 -->
      <view v-if="isSearchPage" class="search_box">
        <view class="topic-list-item">
          <image mode="aspectFill" src="/static/bg-search.jpg" class="cover"></image>
          <view class="topic-item-content">
            <view class="topic-content-brief">
              <text>关于“{{ searchKey }}”的搜索结果</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 阅读历史 -->
      <view v-if="isHistoryPage" class="search_box">
        <view class="topic-list-item">
          <image mode="aspectFill" src="/static/bg-list.jpg" class="cover"></image>
          <view class="topic-item-content">
            <view class="topic-content-brief">
              <text>阅读历史</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 收藏文章 -->
      <view v-if="isLikePage" class="search_box">
        <view class="topic-list-item">
          <image mode="aspectFill" src="/static/bg-list.jpg" class="cover"></image>
          <view class="topic-item-content">
            <view class="topic-content-brief">
              <text>点赞文章</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 文章列表 -->
      <view class="" style="padding-top: 20rpx">
        <app-list :posts-list="postsList"></app-list>
        <view v-if="postsList.length === 0" class="empty">
          <u-empty :text="emptyText" :icon="icon"></u-empty>
        </view>
      </view>

      <app-footer></app-footer>
    </view>
  </view>
</template>

<script lang="ts">
import { getMyFavoritePosts, getPostList } from '@/api/post'
import { defineComponent } from 'vue'
import type { GetPostListParams, Post } from '@/types/post'
import { getCategory } from '@/api/category'
import { getTag } from '@/api/tag'

let page = 1

export default defineComponent({
  data() {
    return {
      isLoading: true,
      isCategoryPage: false,
      isTagPage: false,
      isSearchPage: false,
      isHistoryPage: false,
      isLikePage: false,

      isLastPage: false,
      postsList: [] as Post[],
      cover: '/static/bg-list.jpg',

      // 搜索页面
      searchKey: '',

      // 分类页面
      categoryID: 0,
      category: {
        description: '',
        name: '',
        count: 0
      },

      // 标签页面
      tagID: 0,
      tag: {
        name: '',
        count: 0
      }
    }
  },
  computed: {
    icon() {
      if (this.isCategoryPage || this.isTagPage || this.isHistoryPage || this.isLikePage) {
        return '/static/no-data.png'
      } else if (this.isSearchPage) {
        return '/static/no-result.png'
      }
      return '/static/no-data.png'
    },
    emptyText() {
      if (this.isCategoryPage || this.isTagPage || this.isHistoryPage || this.isLikePage) {
        return '空空如也'
      } else if (this.isSearchPage) {
        return '搜索结果为空'
      }
      return '空空如也'
    }
  },
  async onLoad(options) {
    if (!options) {
      return
    }

    page = 1
    this.isLoading = true
    // 如果是搜索页
    if (options.search) {
      uni.setNavigationBarTitle({
        title: '搜索'
      })
      this.isSearchPage = true
      this.searchKey = options.search
    } else if (options.categoryID) {
      this.categoryID = Number(options.categoryID)
      this.isCategoryPage = true
      this.getCategoryMeta()
    } else if (options.tagID) {
      this.tagID = Number(options.tagID)
      this.isTagPage = true
      this.getTagMeta()
    } else if (options.history) {
      this.isHistoryPage = true
      this.postsList = uni.getStorageSync<Post[]>('history') || []
      this.isLoading = false
      return
    } else if (options.like) {
      this.isLikePage = true
      await this.fetchLikePosts()
      this.isLoading = false
      return
    }

    await this.fetchPosts()
    this.isLoading = false
  },
  async onPullDownRefresh() {
    if (this.isHistoryPage) {
      uni.stopPullDownRefresh()
      return
    }
    page = 1
    this.postsList = []
    this.isLastPage = false
    if (this.isLikePage) {
      await this.fetchLikePosts()
      uni.stopPullDownRefresh()
      return
    }
    await this.fetchPosts()
    uni.stopPullDownRefresh()
  },
  onReachBottom() {
    if (this.isLastPage) return
    if (this.isHistoryPage || this.isLikePage) return
    this.fetchPosts()
  },
  methods: {
    async fetchPosts() {
      const queryObj: GetPostListParams = {
        per_page: 10,
        orderby: 'date',
        order: 'desc',
        page
      }

      if (this.searchKey) {
        queryObj.search = this.searchKey
      } else if (this.categoryID) {
        queryObj.categories = this.categoryID
      } else if (this.tagID) {
        queryObj.tags = String(this.tagID)
      }

      const res = await getPostList(queryObj)
      if (Array.isArray(res)) {
        this.postsList = this.postsList.concat(res)
        page++
      } else {
        this.isLastPage = true
      }
    },
    async getCategoryMeta() {
      try {
        const res = await getCategory(this.categoryID)
        this.category.description = res.description
        this.category.name = res.name
        this.category.count = res.count
        if (res.category_thumbnail_image) {
          this.cover = res.category_thumbnail_image
        }

        uni.setNavigationBarTitle({
          title: this.category.name
        })
      } catch (e) {
        console.error(e)
      }
    },
    async getTagMeta() {
      const res = await getTag(this.tagID)
      this.tag.name = res.name
      this.tag.count = res.count
      // 	if (res.category_thumbnail_image) {
      // 		this.cover = res.category_thumbnail_image
      // 	}
      uni.setNavigationBarTitle({
        title: this.tag.name
      })
    },
    async fetchLikePosts() {
      try {
        const res = await getMyFavoritePosts()
        if (res.code == 'success') {
          this.postsList = this.postsList.concat(res.data)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }
})
</script>

<style scoped lang="scss">
.skeleton {
  margin: 20rpx 20rpx;

  .item {
    margin-bottom: 30rpx;
    background-color: #ffffff;
    padding: 30rpx;
    border-radius: 10rpx;
    border-bottom: 1rpx solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }
}

.topic-list-item {
  position: relative;
  overflow: hidden;
  background: #f4f6f9;

  .cover {
    display: block;
    width: 100%;
    height: 240rpx;
    filter: brightness(88%) blur(8px);
    transform: scale(1.2);
    overflow: hidden;
  }

  .topic-item-content {
    position: absolute;
    z-index: 2;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    vertical-align: middle;
    width: 90%;

    .topic-content-brief {
      font-size: 30rpx;
      font-weight: 500;
      line-height: 1.4;
      color: #fff;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      margin-bottom: 16rpx;
    }

    .topic-content-num {
      font-size: 24rpx;
      line-height: 24rpx;
      color: #fff;
      margin-bottom: 24rpx;
    }
  }
}

.empty {
  height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
