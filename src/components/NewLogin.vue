<template>
  <div class="login-container">
    <!-- 主题切换按钮 -->
    <button
      class="theme-toggle fixed"
      @click="cycleThemePreference"
      :title="themeToggleLabel"
    >
      {{ themeIcon }}
    </button>
    <div class="login-card">
      <div class="progress-bar">
        <div
            class="progress-fill"
            :style="{ width: ((currentStep + 1) * (100/6)) + '%' }">
        </div>
      </div>

      <div class="form-container">
        <!-- 步骤1: 欢迎页面 -->
        <div v-show="currentStep === 0" :class="['form-step', animationClass]">
          <h2>欢迎回到幽柠之域</h2>
          <p class="subtitle">请点击下一步按钮以继续</p>
          <div class="login-method">
            <router-link to="/register" class="register-link">没有账户？立即注册！</router-link>
          </div>
          <div class="button-group">
            <router-link to="/" class="btn btn-prev">回到首页</router-link>
            <button class="btn btn-next" @click="nextStep">下一步</button>
          </div>
        </div>

        <!-- 步骤2: 选择登录方式 -->
        <div v-show="currentStep === 1" :class="['form-step', animationClass]">
          <h2>选择登录方式</h2>
          <div class="login-methods">
            <button
                class="method-btn"
                :class="{ active: loginMethod === 'account' }"
                @click="loginMethod = 'account'">
              账号密码
            </button>
            <button
                class="method-btn"
                :class="{ active: loginMethod === 'email' }"
                @click="loginMethod = 'email'"
                disabled>
              邮箱验证(暂未开放)
            </button>
            <button
                class="method-btn"
                :class="{ active: loginMethod === 'qq' }"
                @click="loginMethod = 'qq'"
                disabled>
              QQ验证(暂未开放)
            </button>
          </div>
          <div class="button-group">
            <button class="btn btn-prev" @click="prevStep">上一步</button>
            <button class="btn btn-next" @click="nextStep" :disabled="!loginMethod">
              下一步
            </button>
          </div>
        </div>

        <!-- 步骤3: 输入账号 -->
        <div v-show="currentStep === 2 && loginMethod === 'account'" :class="['form-step', animationClass]">
          <h2>账号密码登录</h2>
          <div class="input-group">
            <label for="username">账号 *</label>
            <input
                id="username"
                v-model="loginForm.username"
                type="text"
                placeholder="请输入账号"
                required
            />
          </div>
          <div class="button-group">
            <button class="btn btn-prev" @click="prevStep">上一步</button>
            <button class="btn btn-next" @click="nextStep" :disabled="!loginForm.username">
              下一步
            </button>
          </div>
        </div>

        <!-- 步骤4: 输入密码 -->
        <div v-show="currentStep === 3 && loginMethod === 'account'" :class="['form-step', animationClass]">
          <h2>账号密码登录</h2>
          <div class="input-group">
            <label for="password">密码 *</label>
            <div class="password-input">
              <input
                  id="password"
                  v-model="loginForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="请输入密码"
                  required
              />
              <button
                  type="button"
                  class="toggle-password"
                  @click="togglePasswordVisibility"
              >
                {{ showPassword ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div class="remember-me-option">
            <label class="remember-me">
              <input
                  type="checkbox"
                  v-model="loginForm.rememberMe"
              />
              <span>记住我</span>
            </label>
          </div>

          <div class="button-group">
            <button class="btn btn-prev" @click="prevStep">上一步</button>
            <button class="btn btn-next" @click="nextStep" :disabled="!loginForm.password">
              登录
            </button>
          </div>
        </div>

        <!-- 步骤3: 输入邮箱 -->
        <div v-show="currentStep === 2 && loginMethod === 'email'" :class="['form-step', animationClass]">
          <h2>邮箱登录</h2>
          <div class="input-group">
            <label for="email">邮箱 *</label>
            <input
                id="email"
                v-model="loginForm.email"
                type="email"
                placeholder="请输入邮箱"
                required
            />
          </div>
          <div class="button-group">
            <button class="btn btn-prev" @click="prevStep">上一步</button>
            <button class="btn btn-next" @click="nextStep" :disabled="!loginForm.email">
              下一步
            </button>
          </div>
        </div>

        <!-- 步骤3: 输入QQ -->
        <div v-show="currentStep === 2 && loginMethod === 'qq'" :class="['form-step', animationClass]">
          <h2>QQ登录</h2>
          <div class="input-group">
            <label for="qq">QQ号 *</label>
            <input
                id="qq"
                v-model="loginForm.qq"
                type="text"
                placeholder="请输入QQ号"
                required
            />
          </div>
          <div class="button-group">
            <button class="btn btn-prev" @click="prevStep">上一步</button>
            <button class="btn btn-next" @click="nextStep" :disabled="!loginForm.qq">
              下一步
            </button>
          </div>
        </div>

        <!-- 步骤4: 验证码输入（邮箱/QQ验证） -->
        <div v-show="(currentStep === 3 && loginMethod !== 'account') ||
                     (currentStep === 4 && loginMethod === 'account')"
             :class="['form-step', animationClass]"
             ref="verificationStep">
          <h2 v-if="loginMethod === 'email'">邮箱验证</h2>
          <h2 v-else-if="loginMethod === 'qq'">QQ验证</h2>
          <h2 v-else-if="loginMethod === 'account'">账号验证</h2>

          <div class="input-group">
            <label for="verificationCode">验证码 *</label>
            <input
                id="verificationCode"
                v-model="loginForm.verificationCode"
                type="text"
                placeholder="请输入验证码"
                required
                @input="onVerificationCodeInput"
            />
            <div class="verification-actions">
              <p class="verification-hint">
                验证码已发送至
                <span v-if="loginMethod === 'email'">{{ loginForm.email }}</span>
                <span v-else-if="loginMethod === 'qq'">{{ loginForm.qq }}@qq.com</span>
                <span v-else-if="loginMethod === 'account'">您的注册邮箱</span>
              </p>
              <button
                  class="btn-resend"
                  @click="sendVerificationCode"
                  :disabled="countdown > 0">
                {{ countdown > 0 ? `重新发送(${countdown}s)` : '重新发送' }}
              </button>
            </div>
          </div>

          <div class="button-group">
            <button class="btn btn-prev" @click="prevStep">上一步</button>
            <button class="btn btn-next" @click="nextStep">
              下一步
            </button>
          </div>
        </div>

        <!-- 步骤5: 登录成功 -->
        <div v-show="currentStep === 5" :class="['form-step', animationClass]">
          <h2>登录成功</h2>
          <div class="success-message">
            <p>欢迎回来 {{ getDisplayName() }}</p>
          </div>
          <div class="button-group">
            <router-link to="/" class="btn btn-submit">回到首页</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onBeforeUnmount } from 'vue';
import { useTheme } from '../composables/useTheme.js';

const { themeToggleLabel, themeIcon, cycleThemePreference } = useTheme();

const currentStep = ref(0);
const loginMethod = ref(''); // 'account', 'email', 'qq'
const loginForm = reactive({
  username: '',
  password: '',
  email: '',
  qq: '',
  verificationCode: '',
  rememberMe: false
});
const showPassword = ref(false);
const isLoggingIn = ref(false);
const animationClass = ref('');
const countdown = ref(0);
let timer = null;

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const isCurrentStepValid = () => {
  if (currentStep.value === 2) {
    if (loginMethod.value === 'account') {
      return loginForm.username;
    } else if (loginMethod.value === 'email') {
      return loginForm.email;
    } else if (loginMethod.value === 'qq') {
      return loginForm.qq;
    }
  } else if (currentStep.value === 3 && loginMethod.value === 'account') {
    return loginForm.password;
  }
  return true;
};

const getDisplayName = () => {
  if (loginMethod.value === 'account') {
    return loginForm.username;
  } else if (loginMethod.value === 'email') {
    return loginForm.email;
  } else if (loginMethod.value === 'qq') {
    return loginForm.qq;
  }
  return '';
};

const nextStep = () => {
  if ((currentStep.value === 2 || (currentStep.value === 3 && loginMethod.value === 'account')) && !isCurrentStepValid()) {
    showMessage('请填写完整信息');
    return;
  }

  if (currentStep.value === 2 && loginMethod.value !== 'account') {
    sendVerificationCode();
  }

  if ((currentStep.value === 3 && loginMethod.value !== 'account') || (currentStep.value === 4 && loginMethod.value === 'account')) {
    console.log('验证验证码:', loginForm.verificationCode);
  }

  if (currentStep.value === 3 && loginMethod.value === 'account') {
    handleLogin();
    return;
  }

  if (currentStep.value === 3 && loginMethod.value !== 'account') {
    handleLogin();
    return;
  }

  if (loginMethod.value === 'account') {
    if (currentStep.value === 2) {
      animationClass.value = 'slide-out';
      setTimeout(() => {
        currentStep.value = 3;
        animationClass.value = 'slide-in';
        setTimeout(() => {
          animationClass.value = '';
        }, 300);
      }, 300);
      return;
    }
  }

  if (currentStep.value < 5) {
    animationClass.value = 'slide-out';
    setTimeout(() => {
      currentStep.value++;
      animationClass.value = 'slide-in';
      setTimeout(() => {
        animationClass.value = '';
      }, 300);
    }, 300);
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    animationClass.value = 'slide-out-back';
    setTimeout(() => {
      currentStep.value--;
      animationClass.value = 'slide-in-back';
      setTimeout(() => {
        animationClass.value = '';
      }, 300);
    }, 300);
  }
};

const handleLogin = async () => {
  isLoggingIn.value = true;

  try {
    if (loginMethod.value === 'account') {
      const result = await window.$Api.login(loginForm.username, loginForm.password);
      if (result.status === 200) {
        animationClass.value = 'slide-out';
        setTimeout(() => {
          currentStep.value = 5;
          animationClass.value = 'slide-in';
          setTimeout(() => {
            animationClass.value = '';
          }, 300);
        }, 300);
      }
    } else {
      showMessage('此登录方式暂未开放');
      return;
    }
  } catch (error) {
    let errorMessage = '登录失败';
    if (error.reason) {
      errorMessage = error.reason;
    }
    showMessage(errorMessage);
  } finally {
    isLoggingIn.value = false;
  }
};

const sendVerificationCode = () => {
  if (countdown.value > 0) return;

  if (loginMethod.value === 'email') {
    console.log('发送验证码到邮箱:', loginForm.email);
  } else if (loginMethod.value === 'qq') {
    console.log('发送验证码到QQ邮箱:', loginForm.qq + '@qq.com');
  } else if (loginMethod.value === 'account') {
    console.log('发送验证码到账号绑定邮箱');
  }

  countdown.value = 60;
  timer = setInterval(() => {
    countdown.value--;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);

  showMessage('验证码已发送');
};

const onVerificationCodeInput = (e) => {
  loginForm.verificationCode = e.target.value.replace(/\D/g, '');
};

const showMessage = (message, type = 'error') => {
  const messageEl = document.createElement('div');
  messageEl.innerText = message;
  messageEl.style.cssText = `
    position: fixed;
    top: -60px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    color: #333;
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    transition: top 0.3s ease, opacity 0.3s ease;
    opacity: 0;
    min-width: 250px;
    text-align: center;
    font-weight: 500;
    border-left: 4px solid ${type === 'success' ? '#67c23a' : '#f56565'};
  `;

  document.body.appendChild(messageEl);

  setTimeout(() => {
    messageEl.style.top = '20px';
    messageEl.style.opacity = '1';
  }, 10);

  setTimeout(() => {
    messageEl.style.top = '-60px';
    messageEl.style.opacity = '0';
    setTimeout(() => {
      if (messageEl.parentNode) {
        document.body.removeChild(messageEl);
      }
    }, 300);
  }, 3000);
};

onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<style scoped src="../assets/NewLogin.css"></style>
