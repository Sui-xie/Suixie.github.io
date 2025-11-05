<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-code">404</div>
      <h1 class="title">页面未找到</h1>
      <p class="message">抱歉，您请求的页面不存在或已被移除</p>
      <div class="actions">
        <button @click="goToHome" class="btn-primary">返回主页</button>
        <button @click="goBack" class="btn-secondary">返回上一级</button>
      </div>
      <div class="suggestions">
        <p class="suggestion-title">快速导航：</p>
        <div class="suggestion-buttons">
          <button v-for="(item, index) in suggestions" :key="index" @click="goToPage(item.path)" class="suggestion-btn">
            {{ item.name }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'NotFound',
  setup() {
    const router = useRouter()
    
    const suggestions = [
      { name: '系统主页', path: '/' },
      { name: '账户登录', path: '/login' },
      { name: '赞助我们', path: '/Sponsor' }
    ]
    
    const goToHome = () => {
      router.push('/')
    }
    
    const goBack = () => {
      window.history.back()
    }
    
    const goToPage = (path) => {
      router.push(path)
    }
    
    return {
      goToHome,
      goBack,
      goToPage,
      suggestions
    }
  }
}
</script>

<style scoped>
/* 全局样式重置 */
.not-found-container * {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 基础容器样式，支持系统主题自动切换 */
.not-found-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  transition: background-color 0.3s ease, color 0.3s ease;
  
  /* 默认浅色主题 */
  background-color: #ffffff;
  color: #333333;
}

/* 深色主题支持 */
@media (prefers-color-scheme: dark) {
  .not-found-container {
    background-color: #121212;
    color: #ffffff;
  }
}

/* 内容容器 */
.not-found-content {
  width: 100%;
  max-width: 600px;
  text-align: center;
  padding: 40px;
  border-radius: 12px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  
  /* 默认浅色主题 */
  background-color: #f8f9fa;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 深色主题下的内容容器 */
@media (prefers-color-scheme: dark) {
  .not-found-content {
    background-color: #1e1e1e;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }
}

/* 错误代码 */
.error-code {
  font-size: 100px;
  font-weight: 800;
  margin-bottom: 20px;
  line-height: 1;
  transition: color 0.3s ease;
  
  /* 默认浅色主题 */
  color: #333333;
}

/* 深色主题下的错误代码 */
@media (prefers-color-scheme: dark) {
  .error-code {
    color: #ffffff;
  }
}

/* 标题 */
.title {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 16px;
  transition: color 0.3s ease;
  
  /* 默认浅色主题 */
  color: #333333;
}

/* 深色主题下的标题 */
@media (prefers-color-scheme: dark) {
  .title {
    color: #ffffff;
  }
}

/* 消息文本 */
.message {
  font-size: 16px;
  margin-bottom: 32px;
  line-height: 1.6;
  opacity: 0.8;
  transition: color 0.3s ease;
  
  /* 默认浅色主题 */
  color: #666666;
}

/* 深色主题下的消息文本 */
@media (prefers-color-scheme: dark) {
  .message {
    color: #cccccc;
  }
}

/* 按钮容器 */
.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
  flex-wrap: wrap;
}

/* 按钮基础样式 */
.btn-primary,
.btn-secondary {
  padding: 12px 24px;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  border-radius: 8px;
  min-width: 140px;
  font-family: inherit;
}

/* 主要按钮 */
.btn-primary {
  transition: background-color 0.3s ease, transform 0.2s ease;
  
  /* 默认浅色主题 */
  background-color: #007bff;
  color: #ffffff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
  
  /* 默认浅色主题 */
  background-color: #0056b3;
}

.btn-primary:active {
  transform: translateY(0);
}

/* 次要按钮 */
.btn-secondary {
  transition: background-color 0.3s ease, border-color 0.3s ease, transform 0.2s ease;
  
  /* 默认浅色主题 */
  background-color: transparent;
  color: #666666;
  border: 1px solid #dddddd;
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  
  /* 默认浅色主题 */
  background-color: #f1f1f1;
  border-color: #cccccc;
}

.btn-secondary:active {
  transform: translateY(0);
}

/* 深色主题下的按钮 */
@media (prefers-color-scheme: dark) {
  .btn-primary {
    background-color: #1a73e8;
    color: #ffffff;
  }
  
  .btn-primary:hover {
    background-color: #1557b0;
    box-shadow: 0 4px 12px rgba(26, 115, 232, 0.4);
  }
  
  .btn-secondary {
    background-color: transparent;
    color: #cccccc;
    border: 1px solid #444444;
  }
  
  .btn-secondary:hover {
    background-color: #2a2a2a;
    border-color: #666666;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
}

/* 建议部分 */
.suggestions {
  margin-top: 24px;
}

.suggestion-title {
  font-size: 14px;
  margin-bottom: 16px;
  font-weight: 500;
  transition: color 0.3s ease;
  
  /* 默认浅色主题 */
  color: #666666;
}

/* 深色主题下的建议标题 */
@media (prefers-color-scheme: dark) {
  .suggestion-title {
    color: #999999;
  }
}

/* 建议按钮容器 */
.suggestion-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
}

/* 建议按钮 */
.suggestion-btn {
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  font-family: inherit;
  font-weight: 400;
  
  /* 默认浅色主题 */
  background-color: #f8f9fa;
  color: #666666;
  border: 1px solid #eeeeee;
}

.suggestion-btn:hover {
  transform: translateY(-1px);
  
  /* 默认浅色主题 */
  background-color: #e9ecef;
  border-color: #dddddd;
}

/* 深色主题下的建议按钮 */
@media (prefers-color-scheme: dark) {
  .suggestion-btn {
    background-color: #2a2a2a;
    color: #cccccc;
    border: 1px solid #333333;
  }
  
  .suggestion-btn:hover {
    background-color: #333333;
    border-color: #444444;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .not-found-content {
    padding: 30px 20px;
  }
  
  .error-code {
    font-size: 80px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    max-width: 280px;
  }
}

@media (max-width: 480px) {
  .not-found-container {
    padding: 15px;
  }
  
  .not-found-content {
    padding: 20px 15px;
  }
  
  .error-code {
    font-size: 60px;
    margin-bottom: 15px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .message {
    font-size: 14px;
  }
}
</style>