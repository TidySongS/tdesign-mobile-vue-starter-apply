import { createApp } from 'vue'
import { enableMocking } from '@/mocks/browser'
import App from './App.vue'
import router from './router'
import 'tdesign-mobile-vue/es/style/index.css'
import '@/style/index.less'

const app = createApp(App)
app.use(router);

(async () => {
  if (import.meta.env.MODE === 'mock') {
    await enableMocking()
    app.mount('#app')
  }
  else {
    app.mount('#app')
  }
})()
