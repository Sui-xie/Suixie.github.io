// 引入Vite配置函数和必要的插件
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'  // Vue插件，用于处理.vue文件
import { resolve } from 'path'        // Node.js路径解析模块

// Vite配置文件
// https://vite.dev/config/
export default defineConfig({
  // 基础路径配置，用于部署到子路径
  base: '/',
  // 插件配置
  plugins: [vue()],  // 使用Vue插件处理单文件组件
  // 路径解析配置
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')  // 设置@别名指向src目录
    }
  },
  // 开发服务器配置
  server: {
    host: '0.0.0.0',  // 监听所有网络接口，允许外部访问
    port: 3000,       // 开发服务器端口
    proxy: {
      '/api': {
        target: 'http://183.131.51.178:7878',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})
