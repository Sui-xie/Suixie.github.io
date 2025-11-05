export default {
  name: 'NewLogin',
  data() {
    return {
      currentStep: 0,
      loginMethod: '', // 'account', 'email', 'qq'
      loginForm: {
        username: '',
        password: '',
        email: '',
        qq: '',
        verificationCode: '',
        rememberMe: false
      },
      showPassword: false,
      isLoggingIn: false,
      animationClass: '',
      countdown: 0,
      timer: null
    }
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword
    },

    isCurrentStepValid() {
      if (this.currentStep === 2) {
        if (this.loginMethod === 'account') {
          return this.loginForm.username
        } else if (this.loginMethod === 'email') {
          return this.loginForm.email
        } else if (this.loginMethod === 'qq') {
          return this.loginForm.qq
        }
      } else if (this.currentStep === 3 && this.loginMethod === 'account') {
        return this.loginForm.password
      }
      return true
    },

    getDisplayName() {
      if (this.loginMethod === 'account') {
        return this.loginForm.username
      } else if (this.loginMethod === 'email') {
        return this.loginForm.email
      } else if (this.loginMethod === 'qq') {
        return this.loginForm.qq
      }
      return ''
    },

    nextStep() {
      // 如果是输入账号/邮箱/QQ后的步骤，需要验证表单
      if ((this.currentStep === 2 || (this.currentStep === 3 && this.loginMethod === 'account'))
          && !this.isCurrentStepValid()) {
        this.showMessage('请填写完整信息')
        return
      }

      // 如果是输入邮箱/QQ后的步骤，自动发送验证码
      if (this.currentStep === 2 && this.loginMethod !== 'account') {
        this.sendVerificationCode()
      }

      // 如果是验证码页面，模拟验证过程
      if ((this.currentStep === 3 && this.loginMethod !== 'account') || 
          (this.currentStep === 4 && this.loginMethod === 'account')) {
        // 这里应该是实际的验证码验证逻辑
        console.log('验证验证码:', this.loginForm.verificationCode)
      }

      // 如果是账号密码登录且在密码输入步骤，直接登录
      if (this.currentStep === 3 && this.loginMethod === 'account') {
        this.handleLogin()
        return
      }

      // 如果是邮箱/QQ登录的验证码步骤，执行登录
      if (this.currentStep === 3 && this.loginMethod !== 'account') {
        this.handleLogin()
        return
      }

      // 如果是账号密码登录，在输入用户名后直接跳到输入密码步骤
      // 在输入密码后直接登录
      if (this.loginMethod === 'account') {
        if (this.currentStep === 2) {
          // 输入用户名后跳到密码输入步骤
          this.animationClass = 'slide-out'
          setTimeout(() => {
            this.currentStep = 3
            this.animationClass = 'slide-in'
            setTimeout(() => {
              this.animationClass = ''
            }, 300)
          }, 300)
          return
        }
      }

      if (this.currentStep < 5) {
        this.animationClass = 'slide-out'
        setTimeout(() => {
          this.currentStep++
          this.animationClass = 'slide-in'
          setTimeout(() => {
            this.animationClass = ''
          }, 300)
        }, 300)
      }
    },

    prevStep() {
      if (this.currentStep > 0) {
        this.animationClass = 'slide-out-back'
        setTimeout(() => {
          this.currentStep--
          this.animationClass = 'slide-in-back'
          setTimeout(() => {
            this.animationClass = ''
          }, 300)
        }, 300)
      }
    },

    async handleLogin() {
      this.isLoggingIn = true

      try {
        // 实际调用API进行登录
        if (this.loginMethod === 'account') {
          const result = await window.$Api.login(this.loginForm.username, this.loginForm.password);
          if (result.status === 200) {
            // 登录成功
            this.animationClass = 'slide-out'
            setTimeout(() => {
              this.currentStep = 5
              this.animationClass = 'slide-in'
              setTimeout(() => {
                this.animationClass = ''
              }, 300)
            }, 300)
          }
        } else {
          // 其他登录方式暂时禁用
          this.showMessage('此登录方式暂未开放')
          return
        }
      } catch (error) {
        let errorMessage = '登录失败'
        if (error.reason) {
          errorMessage = error.reason
        }
        this.showMessage(errorMessage)
      } finally {
        this.isLoggingIn = false
      }
    },

    sendVerificationCode() {
      if (this.countdown > 0) return // 阻止重复发送

      // 这里应该是实际的发送验证码逻辑
      if (this.loginMethod === 'email') {
        console.log('发送验证码到邮箱:', this.loginForm.email)
      } else if (this.loginMethod === 'qq') {
        console.log('发送验证码到QQ邮箱:', this.loginForm.qq + '@qq.com')
      } else if (this.loginMethod === 'account') {
        console.log('发送验证码到账号绑定邮箱')
      }

      // 启动倒计时 (60秒)
      this.countdown = 60
      this.timer = setInterval(() => {
        this.countdown--
        if (this.countdown <= 0) {
          clearInterval(this.timer)
        }
      }, 1000)

      this.showMessage('验证码已发送')
    },

    onVerificationCodeInput(e) {
      this.loginForm.verificationCode = e.target.value.replace(/\D/g, '')
    },

    showMessage(message, type = 'error') {
      // 创建消息元素
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

      // 添加到页面
      document.body.appendChild(messageEl);

      // 淡入效果
      setTimeout(() => {
        messageEl.style.top = '20px';
        messageEl.style.opacity = '1';
      }, 10);

      // 3秒后淡出并移除
      setTimeout(() => {
        messageEl.style.top = '-60px';
        messageEl.style.opacity = '0';
        setTimeout(() => {
          if (messageEl.parentNode) {
            document.body.removeChild(messageEl);
          }
        }, 300);
      }, 3000);
    }
  },

  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
}