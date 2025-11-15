<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createApiClient } from '@/services/apiClient.js'

const qq = ref('')
const status = ref('')
const loading = ref(false)

const sendCode = async () => {
  if (!qq.value) {
    status.value = '请输入QQ号'
    return
  }
  loading.value = true
  status.value = ''
  try {
    const api = createApiClient()
    await api.sendQQBindCode(qq.value)
    status.value = '验证码已发送至您绑定的QQ邮箱（qq@qq.com）'
  } catch (err) {
    status.value = err?.reason || err?.message || '发送失败'
  } finally {
    loading.value = false
  }
}

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="container">
    <div class="input-group">
      <label for="qq">QQ号</label>
      <input id="qq" v-model="qq" type="text" placeholder="请输入QQ号" />
    </div>
    <button @click="sendCode" class="token-button" :disabled="loading">{{ loading ? '发送中...' : '获取绑定码' }}</button>
    <p v-if="status" class="status">{{ status }}</p>
    <router-link class="back-btn" to="/">返回首页</router-link>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  flex-direction: column;
}

.token-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 50px;
  color: white;
  padding: 15px 30px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
  min-width: 200px;
  text-align: center;
}

.token-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

.token-button:active {
  transform: translateY(0);
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.input-group input {
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--card-bg);
  color: var(--text-primary);
}

.status {
  margin-top: 12px;
  color: var(--text-primary);
}

.back-btn {
  margin-top: 12px;
  background: var(--btn-secondary-bg);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 8px 12px;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }
  
  .token-button {
    padding: 12px 25px;
    font-size: 14px;
    min-width: 180px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 10px;
  }
  
  .token-button {
    padding: 10px 20px;
    font-size: 13px;
    min-width: 160px;
  }
}
</style>
const router = useRouter()