<script>
import registerLogic from '/src/assets/register.js';

export default {
  mixins: [registerLogic],
  methods: {
    // 重写 prevStep 方法以处理第一步的上一步操作
    prevStep() {
      // 如果在第一步，跳转到首页
      if (this.currentStep === 0) {
        this.$router.push('/');
        return;
      }
      
      // 如果当前是完成页面，则返回信息确认页面
      if (this.currentStep === 7) {
        this.currentStep = 6;
        return;
      }
      
      // 如果当前是信息确认页面且之前有QQ验证，则返回QQ验证页面
      if (this.currentStep === 6 && this.showQqVerification) {
        this.currentStep = 5;
        return;
      }
      
      // 如果当前是信息确认页面（无QQ号），返回QQ页面
      if (this.currentStep === 6 && !this.showQqVerification) {
        this.currentStep = 4;
        return;
      }
      
      // 如果当前是QQ验证页面，返回QQ页面
      if (this.currentStep === 5) {
        this.currentStep = 4;
        return;
      }
      
      if (this.currentStep > 0) {
        this.animationClass = 'slide-out-back';
        setTimeout(() => {
          this.currentStep--;
          this.animationClass = 'slide-in-back';
          setTimeout(() => {
            this.animationClass = '';
          }, 300);
        }, 300);
      } else {
        // 在第一步时点击上一步按钮显示消息
        this.showMessage('没有上一个页面啦！');
      }
    }
  }
}
</script>

<template>
  <div class="register-container">
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: ((currentStep + 1) * (100/8)) + '%' }">
      </div>
    </div>
    
    <div class="form-container">
      <!-- 步骤1: 账号 -->
      <div v-show="currentStep === 0" :class="['form-step', animationClass]">
        <h2>创建账户</h2>
        <div class="input-group">
          <label for="account">账号 *</label>
          <input 
            type="text" 
            id="account" 
            v-model="formData.account" 
            placeholder="请输入账号"
            required
          />
        </div>
        <div class="button-group">
          <button class="btn btn-prev" @click="prevStep">回到首页</button>
          <button class="btn btn-next" @click="nextStep" :disabled="!formData.account">
            下一步
          </button>
        </div>
      </div>
      
      <!-- 步骤2: 密码 -->
      <div v-show="currentStep === 1" :class="['form-step', animationClass]">
        <h2>设置密码</h2>
        <div class="input-group">
          <label for="password">密码 *</label>
          <input 
            type="password" 
            id="password" 
            v-model="formData.password" 
            placeholder="请输入密码(至少8位)"
            required
          />
          <p v-if="formData.password && formData.password.length < 8" class="password-hint">
            密码长度至少8位
          </p>
        </div>
        <div class="button-group">
          <button class="btn btn-prev" @click="prevStep">上一步</button>
          <button class="btn btn-next" @click="nextStep" :disabled="!formData.password || formData.password.length < 8">
            下一步
          </button>
        </div>
      </div>
      
      <!-- 步骤3: 邮箱 -->
      <div v-show="currentStep === 2" :class="['form-step', animationClass]">
        <h2>邮箱地址</h2>
        <div class="input-group">
          <label for="mail">邮箱 *</label>
          <input 
            type="email" 
            id="mail" 
            v-model="formData.mail" 
            placeholder="请输入邮箱"
            required
          />
        </div>
        <div class="button-group">
          <button class="btn btn-prev" @click="prevStep">上一步</button>
          <button class="btn btn-next" @click="nextStep" :disabled="!formData.mail">
            下一步
          </button>
        </div>
      </div>
      
      <!-- 步骤4: 验证码 -->
      <div v-show="currentStep === 3" :class="['form-step', animationClass]">
        <h2>邮箱验证</h2>
        <div class="input-group">
          <label for="verificationCode">验证码 *</label>
          <input 
            type="text" 
            id="verificationCode" 
            v-model="formData.verificationCode" 
            placeholder="请输入验证码"
            required
            @input="onVerificationCodeInput"
          />
          <div class="verification-actions">
            <p class="verification-hint">验证码已发送至您的邮箱，请查收</p>
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
      
      <!-- 步骤5: QQ -->
      <div v-show="currentStep === 4" :class="['form-step', animationClass]">
        <h2>可选信息</h2>
        <div class="input-group">
          <label for="qq">QQ (可选)</label>
          <input 
            type="text" 
            id="qq" 
            v-model="formData.qq" 
            placeholder="请输入QQ号"
            disabled
            @focus="showQqDisabledMessage"
          />
        </div>
        <div class="button-group">
          <button class="btn btn-prev" @click="prevStep">上一步</button>
          <button class="btn btn-next" @click="nextStep">
            下一步
          </button>
        </div>
      </div>
      
      <!-- 步骤6: QQ验证 -->
      <div v-show="currentStep === 5" :class="['form-step', animationClass]" v-if="showQqVerification">
        <h2>QQ邮箱验证</h2>
        <div class="input-group">
          <label for="qqVerificationCode">验证码 *</label>
          <input 
            type="text" 
            id="qqVerificationCode" 
            v-model="formData.qqVerificationCode" 
            placeholder="请输入验证码"
            required
            @input="onQqVerificationCodeInput"
          />
          <div class="verification-actions">
            <p class="verification-hint">验证码已发送至您的QQ邮箱({{ formData.qq }}@qq.com)，请查收</p>
            <button 
              class="btn-resend" 
              @click="sendQqVerificationCode" 
              :disabled="qqCountdown > 0">
              {{ qqCountdown > 0 ? `重新发送(${qqCountdown}s)` : '重新发送' }}
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
      
      <!-- 步骤6: 信息确认页面 -->
      <div v-show="currentStep === 6" :class="['form-step', animationClass]">
        <h2>请再次确认您的信息</h2>
        <div class="confirmation-info">
          <div class="info-item">
            <span class="info-label">账号:</span>
            <span class="info-value">{{ formData.account }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">密码:</span>
            <span class="info-value">
              {{ showPassword ? formData.password : '•'.repeat(formData.password.length || 4) }}
              <button @click="togglePasswordVisibility" class="toggle-password-btn">
                {{ showPassword ? '隐藏' : '显示' }}
              </button>
            </span>
          </div>
          <div class="info-item">
            <span class="info-label">邮箱:</span>
            <span class="info-value">{{ formData.mail }}</span>
          </div>
          <div class="info-item" v-if="formData.qq">
            <span class="info-label">QQ:</span>
            <span class="info-value">{{ formData.qq }}</span>
          </div>
        </div>
        <div class="button-group">
          <button class="btn btn-prev" @click="prevStep">上一步</button>
          <button class="btn btn-submit" @click="nextStep">
            确认并提交
          </button>
        </div>
      </div>
      
      <!-- 步骤7: 完成注册 -->
      <div v-show="currentStep === 7" :class="['form-step', animationClass]">
        <h2>注册完成</h2>
        <div class="completion-message">
          <p>账号注册成功！祝您游戏愉快</p>
          <p>账号: {{ formData.account }}</p>
        </div>
        <div class="button-group">
          <button class="btn btn-submit" @click="handleSubmit">
            完成注册
          </button>
        </div>
      </div>
      
      <!-- 步骤7: 完成注册 (QQ验证后) -->
    </div>
  </div>
</template>
<style scoped src="/src/assets/register.css"></style>