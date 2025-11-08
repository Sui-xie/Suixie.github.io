import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import { createApiPlugin } from './plugins/api.js';
import './assets/theme.css';

const apiPlugin = createApiPlugin({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  port: import.meta.env.VITE_API_PORT,
  apiKey: import.meta.env.VITE_API_KEY,
});

const app = createApp(App);
app.use(router);
app.use(apiPlugin);
app.mount('#app');
