import { createSSRApp } from 'vue'
import App from './App.vue'
import * as Pinia from 'pinia'
import { createUnistorage } from 'pinia-plugin-unistorage'

export function createApp() {
  // 创建 pinia 实例
  const store = Pinia.createPinia()
  // 持久化插件
  store.use(createUnistorage())

  const app = createSSRApp(App)
  app.use(store)
  return {
    app,
    Pinia
  }
}
