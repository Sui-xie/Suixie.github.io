<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const isExpanded = ref(false)
const showSubmenu = ref(false)
const router = useRouter()

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  // 关闭主面板时也关闭子菜单
  if (!isExpanded.value) {
    showSubmenu.value = false
  }
}

// 修改快速注册功能，添加验证码输入框
async function quickRegister() {
  try {
    const account = "zhy2347";
    const password = "zhy@2347";
    // 弹出输入框等待用户输入验证码
    const code = prompt("请输入验证码:");
    
    // 如果用户取消输入或输入为空，则直接返回
    if (!code) {
      alert("验证码不能为空");
      return;
    }
    
    const result = await window.$Api.register(account, password, code);
    if (result.status === 200) {
      console.log('快速注册成功');
      alert('快速注册成功');
    }
  } catch (error) {
    console.error('注册失败:', error.reason);
    alert(`注册失败: ${error.reason}`);
  }
}

// 添加快速登录功能
async function quickLogin() {
  try {
    const account = "zhy2347";
    const password = "zhy@2347";
    
    const result = await window.$Api.login(account, password);
    if (result.status === 200) {
      console.log('快速登录成功');
      alert('快速登录成功');
    }
  } catch (error) {
    console.error('登录失败:', error.reason);
    alert(`登录失败: ${error.reason}`);
  }
}

// 添加验证本地登录状态功能
const checkLoginStatus = () => {
  const token = localStorage.getItem('userToken');
  if (token) {
    alert('本地存在登录状态');
  } else {
    alert('本地不存在登录状态');
  }
}

// 添加空功能处理函数
const emptyFunction = (name: string) => {
  alert(`功能 "${name}" 暂未实现`);
}

const debugFunctions = [
  { 
    name: '路由管理',
    action: () => {
      showSubmenu.value = !showSubmenu.value
    }
  },
  { name: '发送验证码', action: sendVerificationCode },
  { name: '快速注册测试', action: quickRegister },
  { name: '快速登录测试', action: quickLogin },
  { name: '验证本地登录', action: checkLoginStatus },
  { name: '功能6', action: () => emptyFunction('功能6') },
  { name: '功能7', action: () => emptyFunction('功能7') },
  { name: '功能8', action: () => emptyFunction('功能8') }
]

// 添加发送验证码功能
async function sendVerificationCode() {
  try {
    const result = await window.$Api.sendCode('1298428557@qq.com')
    if (result.status === 200) {
      console.log('验证码发送成功:', result.code)
      alert('验证码已发送至 1298428557@qq.com')
    }
  } catch (error) {
    console.error('发送验证码失败:', error.reason)
    alert(`发送失败: ${error.reason}`)
  }
}

const submenuItems = [
  { name: '首页', path: '/' },
  { name: '注册', path: '/register' },
  { name: '登录', path: '/login' },
  { name: '恢复', path: '/recover' },
  { name: '签名', path: '/sign' }
]

const navigateTo = (path: string) => {
  router.push(path)
  // 导航后关闭面板和子菜单
  isExpanded.value = false
  showSubmenu.value = false
}
</script>

<template>
  <div 
    class="debug-container" 
    :class="{ expanded: isExpanded }"
    @click="toggleExpand"
  >
    <div v-if="!isExpanded" class="debug-button">
      DEBUG
    </div>
    <div v-else class="debug-panel">
      <div class="panel-header">
        调试功能列表
      </div>
      <ul class="function-list">
        <li 
          v-for="(func, index) in debugFunctions" 
          :key="index"
          @click.stop="func.action"
          class="function-item"
        >
          {{ func.name }}
          <!-- 子菜单 -->
          <ul v-if="index === 0 && showSubmenu" class="submenu">
            <li 
              v-for="(item, subIndex) in submenuItems" 
              :key="subIndex"
              @click.stop="navigateTo(item.path)"
              class="submenu-item"
            >
              {{ item.name }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.debug-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  cursor: pointer;
}

.debug-button {
  width: 100px;
  height: 100px;
  background-color: #ff6b6b;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.debug-panel {
  width: 250px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}

.panel-header {
  background-color: #4ecdc4;
  color: white;
  padding: 15px;
  text-align: center;
  font-weight: bold;
}

.function-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.function-item {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  position: relative;
}

.function-item:hover {
  background-color: #f5f5f5;
}

.function-item:last-child {
  border-bottom: none;
}

.submenu {
  list-style: none;
  padding: 0;
  margin: 10px 0 0 0;
  background-color: #f9f9f9;
}

.submenu-item {
  padding: 8px 15px 8px 30px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.submenu-item:hover {
  background-color: #e9e9e9;
}

.submenu-item:last-child {
  border-bottom: none;
}
</style>