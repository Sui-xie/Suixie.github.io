export default {
  data() {
    return {
      currentStep: 0,
      formData: {
        account: '',
        password: '',
        mail: '',
        qq: '',
        verificationCode: '',
        qqVerificationCode: ''
      },
      animationClass: '',
      // 添加验证码计时器相关数据
      countdown: 0,
      qqCountdown: 0,
      timer: null,
      qqTimer: null,
      // 添加密码显示控制字段
      showPassword: false,
      // 添加加载状态
      isLoading: false
    }
  },
  computed: {
    isFormValid() {
      return this.formData.account && this.formData.password && this.formData.mail;
    },
    // 添加QQ验证是否需要显示的计算属性
    showQqVerification() {
      return this.formData.qq && this.formData.qq.trim() !== '';
    }
  },
  methods: {
    // 修改：实现邮箱验证逻辑
    validateEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },
    // 添加发送验证码方法
    async sendVerificationCode() {
      if (this.countdown > 0) return; // 阻止重复发送
      
      // 验证邮箱格式
      if (!this.validateEmail(this.formData.mail)) {
        this.showMessage('邮箱格式不正确');
        return;
      }
      
      this.isLoading = true;
      try {
        const result = await window.$Api.sendCode(this.formData.mail);
        if (result.status === 200) {
          // 启动倒计时 (60秒)
          this.countdown = 60;
          this.timer = setInterval(() => {
            this.countdown--;
            if (this.countdown <= 0) {
              clearInterval(this.timer);
            }
          }, 1000);
          
          this.showMessage('验证码已发送，请查收邮箱');
        }
      } catch (error) {
        console.error('发送验证码失败:', error);
        this.showMessage(error.reason || '发送验证码失败');
      } finally {
        this.isLoading = false;
      }
    },
    // 添加发送QQ验证码方法
    async sendQqVerificationCode() {
      if (this.qqCountdown > 0) return; // 防止重复发送
      
      // 拼接QQ邮箱
      const qqEmail = this.formData.qq + '@qq.com';
      
      this.isLoading = true;
      try {
        const result = await window.$Api.sendCode(qqEmail);
        if (result.status === 200) {
          // 启动倒计时 (60秒)
          this.qqCountdown = 60;
          this.qqTimer = setInterval(() => {
            this.qqCountdown--;
            if (this.qqCountdown <= 0) {
              clearInterval(this.qqTimer);
            }
          }, 1000);
          
          this.showMessage('验证码已发送至QQ邮箱，请查收');
        }
      } catch (error) {
        console.error('发送QQ验证码失败:', error);
        this.showMessage(error.reason || '发送QQ验证码失败');
      } finally {
        this.isLoading = false;
      }
    },
    showMessage(message) {
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
        border-left: 4px solid #409eff;
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
    },
    nextStep() {
      // 如果当前是邮箱验证页面，则验证邮箱
      if (this.currentStep === 2) {
        if (!this.validateEmail(this.formData.mail)) {
          this.showMessage('邮箱格式不正确');
          return;
        }
        // 验证通过后自动发送验证码
        this.sendVerificationCode();
      }
      
      // 如果当前是QQ页面且用户输入了QQ号，则跳转到QQ验证页面
      if (this.currentStep === 4 && this.showQqVerification) {
        this.currentStep = 5; // 跳转到QQ验证页面
        return;
      }
      
      // 如果当前是QQ验证页面，跳转到信息确认页面
      if (this.currentStep === 5) {
        this.currentStep = 6;
        return;
      }
      
      // 如果当前是信息确认页面，执行提交
      if (this.currentStep === 6) {
        this.handleSubmit();
        return;
      }
      
      if (this.currentStep < 7) {
        this.animationClass = 'slide-out';
        setTimeout(() => {
          this.currentStep++;
          // 如果是QQ页面且没有输入QQ号，跳过QQ验证页面，直接到信息确认页面
          if (this.currentStep === 5 && !this.showQqVerification) {
            this.currentStep = 6; // 直接跳转到信息确认页面
          }
          this.animationClass = 'slide-in';
          setTimeout(() => {
            this.animationClass = '';
          }, 300);
        }, 300);
      }
    },
    prevStep() {
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
    },
    async handleSubmit() {
      // 显示加载状态
      this.isLoading = true;
      
      try {
        // 调用API进行注册
        const result = await window.$Api.register(
          this.formData.account, 
          this.formData.password, 
          this.formData.verificationCode
        );
        
        if (result.status === 200) {
          // 显示注册成功消息
          this.showMessage('注册成功！');
          this.currentStep = 7; // 跳转到完成页面
        }
      } catch (error) {
        console.error('注册失败:', error);
        // 优化错误提示
        if (error.status === 400) {
          this.showMessage(`注册失败: ${error.reason}`);
        } else {
          this.showMessage(error.reason || '注册失败');
        }
      } finally {
        this.isLoading = false;
      }
    },
    // 验证码输入限制，只能输入数字
    onVerificationCodeInput(e) {
      this.formData.verificationCode = e.target.value.replace(/\D/g, '');
    },
    // QQ验证码输入限制
    onQqVerificationCodeInput(e) {
      this.formData.qqVerificationCode = e.target.value.replace(/\D/g, '');
    },
    // 添加切换密码显示的方法
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    // 添加QQ号输入框禁用提示
    showQqDisabledMessage() {
      this.showMessage('存在未知问题，该功能已禁用，请直接下一步');
    }
  },
  // 清理计时器
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.qqTimer) {
      clearInterval(this.qqTimer);
    }
  }
}
