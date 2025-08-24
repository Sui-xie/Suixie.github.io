<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const checkToken = () => {
  const token = localStorage.getItem('userToken');
  if (token) {
    alert("你都注册了，直接去服务器里用账号密码就能登录了嘛");
    router.push('/');
  } else {
    // 如果没有token，引导用户去登录
    alert("没有查到的登录记录哦~如果你已经注册了，直接使用账号密码就可以登录了呢！如果还没注册，等会就会送你去注册哦");
    router.push('/register');
  }
};
</script>

<template>
  <div class="container">
    <button @click="checkToken" class="token-button">点这里获取绑定码</button>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
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