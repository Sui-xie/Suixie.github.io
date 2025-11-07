<script>
import { useTheme } from '../composables/useTheme.js'
const { themeToggleLabel, themeIcon, cycleThemePreference } = useTheme()

export default {
  name: 'Sign',
  data() {
    return {
      lastSignDate: null,
      message: '',
      showMessage: false,
      animationClass: '',
      // 添加动画控制相关的响应式数据
      isAnimating: false,
      // 定义动画持续时间
      animationDuration: 400,
      // 添加签到状态
      signStatus: null // null: 未签到, 'success': 成功, 'error': 失败
    }
  },
  mounted() {
    // 从本地存储获取上次签到日期
    const storedDate = localStorage.getItem('lastSignDate');
    if (storedDate) {
      this.lastSignDate = new Date(storedDate);
    }
    // 实现页面首次进入时的动画效果
    this.$nextTick(() => {
      setTimeout(() => {
        this.isAnimating = true
        this.animationClass = 'slide-in'
        setTimeout(() => {
          this.isAnimating = false
          this.animationClass = ''
        }, this.animationDuration)
      }, 0)
    })
  },
  methods: {
    handleSign() {
      // 修改: 添加alert提示
      alert("骗你的，还没做好，三秒之后送你回去");
      // 添加: 3秒后跳转到首页
      setTimeout(() => {
        this.$router.push('/');
      }, 3000);
      
      /*
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // 检查是否已经签到过
      if (this.lastSignDate) {
        this.lastSignDate.setHours(0, 0, 0, 0);
        // 如果是同一天，则不允许重复签到
        if (this.lastSignDate.getTime() === today.getTime()) {
          this.showMessageWithDelay('禁止重复签到', 'error');
          return;
        }
      }
      
      // 更新签到日期并保存到本地存储
      this.lastSignDate = today;
      localStorage.setItem('lastSignDate', today.toString());
      
      // 显示成功消息
      this.showMessageWithDelay('签到成功！', 'success');
      */
    },
    
    showMessageWithDelay(message, status) {
      this.message = message;
      this.signStatus = status;
      this.showMessage = true;
      
      // 3秒后开始播放动画
      setTimeout(() => {
        // 恢复按钮原始状态
        this.signStatus = null;
        this.showMessage = false;
        // 添加离开动画，等待动画完成后才切换路由
        this.isAnimating = true
        this.animationClass = 'slide-out'
        setTimeout(() => {
          this.$router.push('/');
        }, this.animationDuration);
      }, 3000);
    }
    
  }
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
      <div :class="['form-step', animationClass]">
        <h2>每日签到</h2>
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

