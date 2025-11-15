<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme.js'
import { createApiClient } from '@/services/apiClient.js'
import { API_DEFAULTS } from '@/core/constants.js'

const router = useRouter()
const { themeToggleLabel, themeIcon, cycleThemePreference } = useTheme()

const lastSignDate = ref<Date | null>(null)
const message = ref('')
const showMessage = ref(false)
const animationClass = ref('')
const isAnimating = ref(false)
const animationDuration = ref(400)
const signStatus = ref<null | 'success' | 'error'>(null)
const qq = ref('')
const isLoggedIn = ref(!!localStorage.getItem(API_DEFAULTS.tokenStorageKey))
const useQQFlow = ref(!isLoggedIn.value)

onMounted(() => {
  const storedDate = localStorage.getItem('lastSignDate')
  if (storedDate) lastSignDate.value = new Date(storedDate)

  nextTick(() => {
    setTimeout(() => {
      isAnimating.value = true
      animationClass.value = 'slide-in'
      setTimeout(() => {
        isAnimating.value = false
        animationClass.value = ''
      }, animationDuration.value)
    }, 0)
  })
})

async function handleSign() {
  try {
    const api = createApiClient()
    if (isLoggedIn.value && !useQQFlow.value) {
      const res = await api.signUser()
      showMessageWithDelay(res.message || '签到成功', 'success')
    } else {
      if (!qq.value) {
        showMessageWithDelay('请输入QQ号', 'error')
        return
      }
      const res = await api.signWithQQ(qq.value)
      showMessageWithDelay(res.message || '签到成功', 'success')
    }
  } catch (err: any) {
    const reason = err?.reason || err?.message || '签到失败'
    if (/not found/i.test(String(reason))) {
      useQQFlow.value = true
      signStatus.value = null
      showMessage.value = false
    } else {
      showMessageWithDelay(reason, 'error')
    }
  }
}

function showMessageWithDelay(msg: string, status: 'success' | 'error') {
  message.value = msg
  signStatus.value = status
  showMessage.value = true

  setTimeout(() => {
    signStatus.value = null
    showMessage.value = false
    isAnimating.value = true
    animationClass.value = 'slide-out'
    setTimeout(() => {
      router.push('/')
    }, animationDuration.value)
  }, 3000)
}
</script>

<template>
  <div class="register-container no-border" :class="animationClass">
    <!-- 主题切换按钮 -->
    <button
      class="theme-toggle fixed"
      @click="cycleThemePreference"
      :title="themeToggleLabel"
    >
      {{ themeIcon }}
    </button>
    <div class="form-container">
      <router-link class="text-link btn-home" to="/"><span class="btn-icon">←</span> 返回首页</router-link>
      <div :class="['form-step', animationClass]">
        <h2>每日签到</h2>
      <div class="input-group" v-if="!showMessage && (useQQFlow || !isLoggedIn)">
        <label for="qq">QQ号</label>
        <input id="qq" v-model="qq" type="text" placeholder="请输入QQ号" />
      </div>
      <div class="completion-message" v-if="showMessage">
        <p>{{ message }}</p>
        <p>即将返回首页...</p>
      </div>
      <div v-else>
          <p style="text-align: center; margin-bottom: 30px;">
            点击下方按钮完成今日签到
          </p>
          <div class="button-group">
            <button 
              class="btn btn-submit sign-button"
              :class="{ 
              'sign-success': signStatus === 'success',
              'sign-error': signStatus === 'error',
              'sign-in-progress': showMessage
              }"
              @click="handleSign"
            >
              <span v-if="showMessage">{{ message }}</span>
              <span v-else>签到</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 使用register.css中的样式 */
@import '/src/assets/register.css';

.register-container.no-border {
  box-shadow: none;
  border: none;
  border-radius: 0;
  max-width: 400px;
  margin: 100px auto;
}

.completion-message {
  background-color: #f0f9ff;
  border-radius: 5px;
  padding: 30px;
  text-align: center;
}

.completion-message p:first-child {
  font-size: 20px;
  font-weight: bold;
  color: var(--success-color);
  margin-bottom: 15px;
}

.completion-message p {
  font-size: 16px;
  color: var(--text-muted);
}

/* 添加滑出动画 */
.form-step.slide-out {
  animation: slideOutRight 0.4s ease-in forwards;
}

@keyframes slideOutRight {
  0% {
    transform: translateX(0);
    opacity: 1;
  }
  100% {
    transform: translateX(100px);
    opacity: 0;
  }
}

/* 添加进入和离开动画样式 */
@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.slide-in {
  animation: slideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.slide-out {
  animation: slideOut 0.4s cubic-bezier(0.55, 0.085, 0.68, 0.53) forwards;
}

/* 签到按钮动画样式 */
.sign-button {
  width: 100%;
  transition: all 0.3s ease;
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

.sign-button.sign-in-progress {
  transform: scale(1.1);
  width: 100%;
  height: 60px;
  font-size: 18px;
  font-weight: bold;
}

.sign-button.sign-success {
  border-color: var(--success-color);
  color: var(--success-color);
}

.sign-button.sign-error {
  border-color: var(--error-color);
  color: var(--error-color);
}
</style>

/* back button uses global .text-link .btn-home .btn-icon */

