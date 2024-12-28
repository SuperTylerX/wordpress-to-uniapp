import * as Pinia from 'pinia'
import { createUnistorage } from 'pinia-plugin-unistorage'
// @ts-expect-error 未找到声明
import Quill from 'quill'
// @ts-expect-error 未找到声明
import ImageResize from 'quill-image-resize-mp'
// @ts-expect-error 未找到声明
import uviewPlus from 'uview-plus'
// h5 依赖 quill 依赖，这里引入依赖，挂在全局避免去远程引入
// #ifdef H5
import { createSSRApp } from 'vue'

import App from './App.vue'

window.Quill = Quill
window.ImageResize = { default: ImageResize }

declare global {
  interface Window {
    Quill: AnyObject
    ImageResize: AnyObject
  }
}
// #endif

export function createApp() {
  // 创建 pinia 实例
  const store = Pinia.createPinia()
  // 持久化插件
  store.use(createUnistorage())

  const app = createSSRApp(App)
  app.use(store)
  app.use(uviewPlus)
  return {
    app,
    Pinia
  }
}
