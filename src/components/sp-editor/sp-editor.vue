<template>
  <view class="sp-editor" :style="{ '--icon-size': iconSize }">
    <view class="sp-editor-toolbar" @tap="format">
      <view
        v-if="toolbarList.includes('header')"
        :class="formats.header === 1 ? 'ql-active' : ''"
        class="iconfont icon-format-header-1"
        title="标题"
        data-name="header"
        :data-value="1"
      ></view>
      <view
        v-if="toolbarList.includes('header')"
        :class="formats.header === 2 ? 'ql-active' : ''"
        class="iconfont icon-format-header-2"
        title="标题"
        data-name="header"
        :data-value="2"
      ></view>
      <view
        v-if="toolbarList.includes('header')"
        :class="formats.header === 3 ? 'ql-active' : ''"
        class="iconfont icon-format-header-3"
        title="标题"
        data-name="header"
        :data-value="3"
      ></view>
      <view
        v-if="toolbarList.includes('bold')"
        :class="formats.bold ? 'ql-active' : ''"
        class="iconfont icon-zitijiacu"
        title="加粗"
        data-name="bold"
      ></view>
      <view
        v-if="toolbarList.includes('italic')"
        :class="formats.italic ? 'ql-active' : ''"
        class="iconfont icon-zitixieti"
        title="斜体"
        data-name="italic"
      ></view>
      <view
        v-if="toolbarList.includes('underline')"
        :class="formats.underline ? 'ql-active' : ''"
        class="iconfont icon-zitixiahuaxian"
        title="下划线"
        data-name="underline"
      ></view>
      <view
        v-if="toolbarList.includes('strike')"
        :class="formats.strike ? 'ql-active' : ''"
        class="iconfont icon-zitishanchuxian"
        title="删除线"
        data-name="strike"
      ></view>
      <!-- #ifndef MP-BAIDU -->
      <view
        v-if="toolbarList.includes('alignLeft')"
        :class="formats.align === 'left' ? 'ql-active' : ''"
        class="iconfont icon-zuoduiqi"
        title="左对齐"
        data-name="align"
        data-value="left"
      ></view>
      <!-- #endif -->
      <view
        v-if="toolbarList.includes('alignCenter')"
        :class="formats.align === 'center' ? 'ql-active' : ''"
        class="iconfont icon-juzhongduiqi"
        title="居中对齐"
        data-name="align"
        data-value="center"
      ></view>
      <view
        v-if="toolbarList.includes('alignRight')"
        :class="formats.align === 'right' ? 'ql-active' : ''"
        class="iconfont icon-youduiqi"
        title="右对齐"
        data-name="align"
        data-value="right"
      ></view>
      <view
        v-if="toolbarList.includes('alignJustify')"
        :class="formats.align === 'justify' ? 'ql-active' : ''"
        class="iconfont icon-zuoyouduiqi"
        title="两端对齐"
        data-name="align"
        data-value="justify"
      ></view>
      <!-- #ifndef MP-BAIDU -->
      <view
        v-if="toolbarList.includes('lineHeight')"
        :class="formats.lineHeight ? 'ql-active' : ''"
        class="iconfont icon-line-height"
        title="行间距"
        data-name="lineHeight"
        data-value="2"
      ></view>
      <view
        v-if="toolbarList.includes('letterSpacing')"
        :class="formats.letterSpacing ? 'ql-active' : ''"
        class="iconfont icon-Character-Spacing"
        title="字间距"
        data-name="letterSpacing"
        data-value="2em"
      ></view>
      <view
        v-if="toolbarList.includes('marginTop')"
        :class="formats.marginTop ? 'ql-active' : ''"
        class="iconfont icon-722bianjiqi_duanqianju"
        title="段前距"
        data-name="marginTop"
        data-value="20px"
      ></view>
      <view
        v-if="toolbarList.includes('marginBottom')"
        :class="formats.marginBottom ? 'ql-active' : ''"
        class="iconfont icon-723bianjiqi_duanhouju"
        title="段后距"
        data-name="marginBottom"
        data-value="20px"
      ></view>
      <!-- #endif -->
      <!-- #ifndef MP-BAIDU -->
      <view
        v-if="toolbarList.includes('fontSize')"
        :class="formats.fontFamily ? 'ql-active' : ''"
        class="iconfont icon-font"
        title="字体"
        data-name="fontFamily"
        data-value="宋体"
      ></view>
      <view
        v-if="toolbarList.includes('fontSize')"
        :class="formats.fontSize === '24px' ? 'ql-active' : ''"
        class="iconfont icon-fontsize"
        title="字号"
        data-name="fontSize"
        data-value="24px"
      ></view>
      <!-- #endif -->
      <view
        v-if="toolbarList.includes('color')"
        :style="{ color: formats.color ? textColor : 'initial' }"
        class="iconfont icon-text_color"
        title="文字颜色"
        data-name="color"
        :data-value="textColor"
      ></view>
      <view
        v-if="toolbarList.includes('backgroundColor')"
        :style="{ color: formats.backgroundColor ? backgroundColor : 'initial' }"
        class="iconfont icon-fontbgcolor"
        title="背景颜色"
        data-name="backgroundColor"
        :data-value="backgroundColor"
      ></view>
      <view
        v-if="toolbarList.includes('date')"
        class="iconfont icon-date"
        title="日期"
        @tap="insertDate"
      ></view>
      <view
        v-if="toolbarList.includes('listCheck')"
        class="iconfont icon--checklist"
        title="待办"
        data-name="list"
        data-value="check"
      ></view>
      <view
        v-if="toolbarList.includes('listOrdered')"
        :class="formats.list === 'ordered' ? 'ql-active' : ''"
        class="iconfont icon-youxupailie"
        title="有序列表"
        data-name="list"
        data-value="ordered"
      ></view>
      <view
        v-if="toolbarList.includes('listBullet')"
        :class="formats.list === 'bullet' ? 'ql-active' : ''"
        class="iconfont icon-wuxupailie"
        title="无序列表"
        data-name="list"
        data-value="bullet"
      ></view>
      <view
        v-if="toolbarList.includes('divider')"
        class="iconfont icon-fengexian"
        title="分割线"
        @click="insertDivider"
      ></view>
      <view
        v-if="toolbarList.includes('indentDec')"
        class="iconfont icon-outdent"
        title="减少缩进"
        data-name="indent"
        data-value="-1"
      ></view>
      <view
        v-if="toolbarList.includes('indentInc')"
        class="iconfont icon-indent"
        title="增加缩进"
        data-name="indent"
        data-value="+1"
      ></view>
      <view
        v-if="toolbarList.includes('scriptSub')"
        :class="formats.script === 'sub' ? 'ql-active' : ''"
        class="iconfont icon-zitixiabiao"
        title="下标"
        data-name="script"
        data-value="sub"
      ></view>
      <view
        v-if="toolbarList.includes('scriptSuper')"
        :class="formats.script === 'super' ? 'ql-active' : ''"
        class="iconfont icon-zitishangbiao"
        title="上标"
        data-name="script"
        data-value="super"
      ></view>
      <view
        v-if="toolbarList.includes('direction')"
        :class="formats.direction === 'rtl' ? 'ql-active' : ''"
        class="iconfont icon-direction-rtl"
        title="文本方向"
        data-name="direction"
        data-value="rtl"
      ></view>
      <view
        v-if="toolbarList.includes('image')"
        class="iconfont icon-charutupian"
        title="图片"
        @tap="insertImage"
      ></view>
      <view
        v-if="toolbarList.includes('link')"
        class="iconfont icon-charulianjie"
        title="超链接"
        @tap="insertLink"
      ></view>
      <view
        v-if="toolbarList.includes('undo')"
        class="iconfont icon-undo"
        title="撤销"
        @tap="undo"
      ></view>
      <view
        v-if="toolbarList.includes('redo')"
        class="iconfont icon-redo"
        title="重做"
        @tap="redo"
      ></view>
      <view
        v-if="toolbarList.includes('removeFormat')"
        class="iconfont icon-clearedformat"
        title="清除格式"
        @tap="removeFormat"
      ></view>
      <view
        v-if="toolbarList.includes('clear')"
        class="iconfont icon-shanchu"
        title="清空"
        @tap="clear"
      ></view>
    </view>

    <!-- 自定义功能组件 -->
    <color-picker
      v-if="toolbarList.includes('color') || toolbarList.includes('backgroundColor')"
      ref="colorPickerRef"
      :color="defaultColor"
      @confirm="confirmColor"
    ></color-picker>
    <link-edit
      v-if="toolbarList.includes('link')"
      ref="linkEditRef"
      @confirm="confirmLink"
    ></link-edit>

    <view class="sp-editor-wrapper">
      <editor
        id="editor"
        class="ql-editor editor-container"
        show-img-size
        show-img-toolbar
        show-img-resize
        :placeholder="placeholder"
        :read-only="readOnly"
        @statuschange="onStatusChange"
        @ready="onEditorReady"
        @input="onEditorInput"
      ></editor>
    </view>
  </view>
</template>

<script>
import { uploadMedia } from '@/api/media'

import ColorPicker from './color-picker.vue'
import LinkEdit from './link-edit.vue'

import { addLink, linkFlag } from './index.js'

export default {
  components: {
    ColorPicker,
    LinkEdit
  },
  props: {
    placeholder: {
      type: String,
      default: '写点什么吧 ~'
    },
    // 是否只读
    readOnly: {
      type: Boolean,
      default: false
    },
    // 最大字数限制，-1不限
    maxlength: {
      type: Number,
      default: -1
    },
    // 工具栏配置
    toolbarConfig: {
      type: Object,
      default: () => {
        return {
          keys: [], // 要显示的工具，优先级最大
          excludeKeys: [], // 除这些指定的工具外，其他都显示
          iconSize: '20px' // 工具栏字体大小
        }
      }
    }
  },
  emits: ['init', 'addLink', 'overMax', 'input'],
  data() {
    return {
      formats: {},
      textColor: '',
      backgroundColor: '',
      curColor: '',
      defaultColor: { r: 0, g: 0, b: 0, a: 1 }, // 调色板默认颜色
      iconSize: '20px', // 工具栏图标字体大小
      toolbarList: [],
      toolbarAllList: [
        'bold', // 加粗
        'italic', // 斜体
        'underline', // 下划线
        'strike', // 删除线
        'alignLeft', // 左对齐
        'alignCenter', // 居中对齐
        'alignRight', // 右对齐
        'alignJustify', // 两端对齐
        'lineHeight', // 行间距
        'letterSpacing', // 字间距
        'marginTop', // 段前距
        'marginBottom', // 段后距
        'fontFamily', // 字体
        'fontSize', // 字号
        'color', // 文字颜色
        'backgroundColor', // 背景颜色
        'date', // 日期
        'listCheck', // 待办
        'listOrdered', // 有序列表
        'listBullet', // 无序列表
        'indentInc', // 增加缩进
        'indentDec', // 减少缩进
        'divider', // 分割线
        'header', // 标题
        'scriptSub', // 下标
        'scriptSuper', // 上标
        'direction', // 文本方向
        'image', // 图片
        'link', // 超链接
        'undo', // 撤销
        'redo', // 重做
        'removeFormat', // 清除格式
        'clear', // 清空
        'export' // 导出
      ]
    }
  },
  watch: {
    toolbarConfig: {
      deep: true,
      immediate: true,
      handler(newToolbar) {
        /**
         * 若工具栏配置中keys存在，则以keys为准
         * 否则以excludeKeys向toolbarAllList中排查
         * 若keys与excludeKeys皆为空，则以toolbarAllList为准
         */
        if (newToolbar.keys?.length > 0) {
          this.toolbarList = newToolbar.keys
        } else {
          this.toolbarList =
            newToolbar.excludeKeys?.length > 0
              ? this.toolbarAllList.filter(item => !newToolbar.excludeKeys.includes(item))
              : this.toolbarAllList
        }
        this.iconSize = newToolbar.iconSize || '20px'
      }
    }
  },
  methods: {
    onEditorReady() {
      // #ifdef MP-BAIDU
      this.editorCtx = requireDynamicLib('editorLib').createEditorContext('editor')
      // #endif

      // #ifdef APP || MP-WEIXIN || H5
      uni
        .createSelectorQuery()
        .in(this)
        .select('#editor')
        .context(res => {
          this.editorCtx = res.context
          this.$emit('init', this.editorCtx)
        })
        .exec()
      // #endif
    },
    undo() {
      this.editorCtx.undo()
    },
    redo() {
      this.editorCtx.redo()
    },
    format(e) {
      const { name, value } = e.target.dataset

      if (!name) return
      switch (name) {
        case 'color':
        case 'backgroundColor':
          this.curColor = name
          this.showPicker()
          break
        default:
          this.editorCtx.format(name, value)
          break
      }
    },
    showPicker() {
      switch (this.curColor) {
        case 'color':
          this.defaultColor = this.textColor
            ? this.$refs.colorPickerRef.hex2Rgb(this.textColor)
            : { r: 0, g: 0, b: 0, a: 1 }
          break
        case 'backgroundColor':
          this.defaultColor = this.backgroundColor
            ? this.$refs.colorPickerRef.hex2Rgb(this.backgroundColor)
            : { r: 0, g: 0, b: 0, a: 0 }
          break
      }
      this.$refs.colorPickerRef.open()
    },
    confirmColor(e) {
      switch (this.curColor) {
        case 'color':
          this.textColor = e.hex
          this.editorCtx.format('color', this.textColor)
          break
        case 'backgroundColor':
          this.backgroundColor = e.hex
          this.editorCtx.format('backgroundColor', this.backgroundColor)
          break
      }
    },
    onStatusChange(e) {
      if (e.detail.color) {
        this.textColor = e.detail.color
      }
      if (e.detail.backgroundColor) {
        this.backgroundColor = e.detail.backgroundColor
      }
      this.formats = e.detail
    },
    insertDivider() {
      this.editorCtx.insertDivider()
    },
    clear() {
      uni.showModal({
        title: '清空编辑器',
        content: '确定清空编辑器吗？',
        success: ({ confirm }) => {
          if (confirm) {
            this.editorCtx.clear()
            uni.removeStorageSync('draft')
          }
        }
      })
    },
    removeFormat() {
      uni.showModal({
        title: '文本格式化',
        content: '确定要清除所选择部分文本块格式吗？',
        showCancel: true,
        success: ({ confirm }) => {
          if (confirm) {
            this.editorCtx.removeFormat()
          }
        }
      })
    },
    insertDate() {
      const date = new Date()
      const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      this.editorCtx.insertText({ text: formatDate })
    },
    insertLink() {
      this.$refs.linkEditRef.open()
    },
    /**
     * 确认添加链接
     * @param {Object} e { text: '链接描述', href: '链接地址' }
     */
    confirmLink(e) {
      this.$refs.linkEditRef.close()
      this.$emit('addLink', e)
      addLink(this.editorCtx, e)
    },
    insertImage() {
      // #ifdef APP-PLUS || H5 || MP-BAIDU
      uni.chooseImage({
        // count: 1, // 默认9
        success: res => {
          uni.showLoading({
            title: '上传中',
            mask: true,
            duration: 10000
          })
          const { tempFiles } = res
          // 将文件和编辑器示例抛出，由开发者自行上传和插入图片
          this.uploadImage(tempFiles.map(item => item.path))
        },
        fail() {
          uni.showToast({
            title: '未授权访问相册权限，请授权后使用',
            icon: 'none'
          })
        }
      })
      // #endif

      // #ifdef MP-WEIXIN
      // 微信小程序从基础库 2.21.0 开始， wx.chooseImage 停止维护，请使用 uni.chooseMedia 代替。
      uni.chooseMedia({
        // count: 1, // 默认9
        success: res => {
          uni.showLoading({
            title: '上传中',
            mask: true,
            duration: 10000
          })
          // 同上chooseImage处理
          const { tempFiles } = res
          this.uploadImage(tempFiles.map(item => item.tempFilePath))
        },
        fail() {
          uni.showToast({
            title: '未授权访问相册权限，请授权后使用',
            icon: 'none'
          })
        }
      })
      // #endif
    },
    async uploadImage(imgUrlArr) {
      try {
        const res = await Promise.all(
          imgUrlArr.map(url =>
            uploadMedia({
              filePath: url
            })
          )
        )

        res.forEach(item => {
          this.editorCtx.insertImage({
            src: item.source_url,
            width: '80%', // 默认不建议铺满宽度100%，预留一点空隙以便用户编辑
            success: () => {
              uni.hideLoading()
            }
          })
        })
      } catch (e) {
        console.error(e)
        uni.hideLoading()
      }
    },
    onEditorInput(e) {
      // 注意不要使用getContents获取html和text，会导致重复触发onStatusChange从而失去toolbar工具的高亮状态
      // 复制粘贴的时候detail会为空，此时应当直接return
      if (Object.keys(e.detail).length <= 0) return
      const { html, text } = e.detail
      // 识别到标识立即return
      if (text.indexOf(linkFlag) !== -1) return

      const maxlength = parseInt(this.maxlength)
      const textStr = text.replace(/[ \t\r\n]/g, '')
      if (textStr.length > maxlength && maxlength !== -1) {
        uni.showModal({
          content: `超过${maxlength}字数啦~`,
          confirmText: '确定',
          showCancel: false,
          success: () => {
            this.$emit('overMax', { html, text })
          }
        })
      } else {
        this.$emit('input', { html, text })
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/static/icons/editor-icon.css';

.sp-editor {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.iconfont {
  display: inline-block;
  padding: 16rpx 16rpx;
  width: calc(var(--icon-size) * 1.2);
  height: calc(var(--icon-size) * 1.2);
  cursor: pointer;
  font-size: var(--icon-size);
}

.sp-editor-toolbar {
  box-sizing: border-box;
  padding-bottom: 12rpx;
  border-bottom: 1px solid #e4e4e4;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  //background-color: #f6f6f6;
}

.sp-editor-wrapper {
  flex: 1;
  overflow: hidden;
}

.editor-container {
  padding: 8rpx 16rpx;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  font-size: 16px;
  line-height: 1.5;
}

::v-deep .ql-editor.ql-blank::before {
  font-style: normal;
  color: #cccccc;
}

::v-deep .ql-container {
  min-height: unset;
}

.ql-active {
  color: #66ccff;
}
</style>
