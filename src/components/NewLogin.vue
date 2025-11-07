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
import { useTheme } from '../composables/useTheme.js'
const { themeToggleLabel, themeIcon, cycleThemePreference } = useTheme()
</script>
<script src="../assets/NewLogin.js"></script>

<style scoped src="../assets/NewLogin.css"></style>
