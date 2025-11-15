<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createApiClient } from '@/services/apiClient.js'

const qq = ref('')
const result = ref('')
const loading = ref(false)

const fetchProfile = async () => {
  if (!qq.value) {
    result.value = '请输入QQ号'
    return
  }
  loading.value = true
  result.value = ''
  try {
    const api = createApiClient()
    const payload = await api.request('/getProfileInfo', { method: 'GET', searchParams: { qq: qq.value } })
    result.value = payload.result || '查询成功'
  } catch (err) {
    result.value = err?.reason || err?.message || '查询失败'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container">
    <h2>找回密码</h2>
    <p class="desc">通过QQ查询账号资料以辅助找回。</p>
    <div class="input-group">
      <label for="qq">QQ号</label>
      <input id="qq" v-model="qq" type="text" placeholder="请输入QQ号" />
    </div>
    <button class="action" @click="fetchProfile" :disabled="loading">{{ loading ? '查询中...' : '查询资料' }}</button>
    <pre v-if="result" class="result">{{ result }}</pre>
    <router-link class="back-btn" to="/">返回首页</router-link>
  </div>
  
</template>

<style scoped>
.container {
  max-width: 600px;
  margin: 80px auto;
  padding: 20px;
}

.desc { color: var(--text-muted); margin-bottom: 12px; }

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

.action {
  background: var(--btn-primary-bg);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
}

.result {
  margin-top: 16px;
  white-space: pre-wrap;
  background: var(--card-bg);
  padding: 12px;
  border-radius: 8px;
}

.back-btn { display: inline-block; margin-top: 12px; background: var(--btn-secondary-bg); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 8px; padding: 8px 12px; }
</style>
const router = useRouter()