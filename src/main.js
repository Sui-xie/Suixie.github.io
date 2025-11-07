import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import start from './assets/Api.js'
import './assets/theme.css' // 引入全局主题样式
start()


let app = createApp(App)
app.use(router)
app.mount('#app')
