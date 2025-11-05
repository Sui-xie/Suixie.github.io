import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.js'
import start from './assets/Api.js'
start()


let app = createApp(App)
app.use(router)
app.mount('#app')
