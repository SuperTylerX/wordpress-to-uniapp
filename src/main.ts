import { createSSRApp } from 'vue'
import App from './App.vue'
import * as Pinia from 'pinia'
import { createUnistorage } from 'pinia-plugin-unistorage'
// @ts-expect-error 未找到声明
import uviewPlus from 'uview-plus'

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
