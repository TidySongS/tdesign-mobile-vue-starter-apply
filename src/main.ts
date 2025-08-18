import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'tdesign-mobile-vue/es/style/index.css'
import '@/style/main.less'
async function enableMocking() {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser')
    return worker.start()
  }
}

const app = createApp(App)
app.use(router)

// (async () => {
//   if (import.meta.env.MODE === 'mock') {
//     await enableMocking()
//     app.mount('#app')
//   }
//   else {
//     app.mount('#app')
//   }
// })()

enableMocking().then(() => {
  app.mount('#app')
})
