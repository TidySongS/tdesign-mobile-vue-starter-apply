import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'tdesign-mobile-vue/es/style/index.css'
import '@/style/index.less'

// async function enableMocking() {
//   if (import.meta.env.DEV) {
//     const { worker } = await import('./mocks/browser')
//     return worker.start()
//   }
// }

const app = createApp(App)
app.use(router)

// enableMocking().then(() => {
app.mount('#app')
// })
