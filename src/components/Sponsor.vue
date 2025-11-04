<template>
  <div class="sponsor-container" :class="{ 'dark-theme': isDarkMode }">
    <!-- 纯色背景 -->
    <div class="solid-background"></div>
    
    <div class="content-wrapper">
      <!-- 返回主页按钮 -->
      <button class="back-button" @click="goToHome">
        ← 返回主页
      </button>
      
      <!-- 主题切换开关 -->
      <button class="theme-toggle" @click="toggleTheme">
        {{ isDarkMode ? '🌞' : '🌙' }}
      </button>
      
      <h1 class="title">感谢您的支持</h1>
      
      <div class="qrcode-container">
        <!-- 收款码1 - 柠檬 -->
        <div class="qrcode-item">
          <div class="qrcode-header">
            <h3 class="fixed-title">{{ qrcodes[0].title }}</h3>
            <div class="subtitle" v-if="qrcodes[0].subtitle">{{ qrcodes[0].subtitle }}</div>
          </div>
          <div class="qrcode-image-container">
            <img 
              :src="qrcodes[0].image || defaultImage" 
              :alt="qrcodes[0].title"
              class="qrcode-image"
              @error="handleImageError(0)"
            />
          </div>
        </div>
        
        <!-- 收款码2 - 鱼鱼 -->
        <div class="qrcode-item">
          <div class="qrcode-header">
            <h3 class="fixed-title">{{ qrcodes[1].title }}</h3>
            <div class="subtitle" v-if="qrcodes[1].subtitle">{{ qrcodes[1].subtitle }}</div>
          </div>
          <div class="qrcode-image-container">
            <img 
              :src="qrcodes[1].image || defaultImage" 
              :alt="qrcodes[1].title"
              class="qrcode-image"
              @error="handleImageError(1)"
            />
          </div>
        </div>
        
        <!-- 收款码3 - ksang -->
        <div class="qrcode-item">
          <div class="qrcode-header">
            <h3 class="fixed-title">{{ qrcodes[2].title }}</h3>
            <div class="subtitle" v-if="qrcodes[2].subtitle">{{ qrcodes[2].subtitle }}</div>
          </div>
          <div class="qrcode-image-container">
            <img 
              :src="qrcodes[2].image || defaultImage" 
              :alt="qrcodes[2].title"
              class="qrcode-image"
              @error="handleImageError(2)"
            />
          </div>
        </div>
      </div>
      
      <div class="message">
        <p class="fixed-message">{{ customMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Sponsor',
  // 预留props接口，以便未来可能从父组件传入配置
  props: {
    // 可以通过props传入自定义配置
    config: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    // 初始化路由
    const router = useRouter();
    
    // 返回主页的方法
    const goToHome = () => {
      router.push('/');
    };
    
    // 主题模式状态
    const isDarkMode = ref(false);
    
    // 默认占位图片
    const defaultImage = ref('https://placehold.co/300x300?text=收款码');
    
    // 检测系统主题
    const checkSystemTheme = () => {
      const prefersDark = window.matchMedia && 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      isDarkMode.value = prefersDark;
    };
    
    // 手动切换主题
    const toggleTheme = () => {
      isDarkMode.value = !isDarkMode.value;
    };
    
    // 监听系统主题变化
    onMounted(() => {
      checkSystemTheme();
      
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      mediaQuery.addEventListener('change', checkSystemTheme);
      
      // 清理监听器
      return () => {
        mediaQuery.removeEventListener('change', checkSystemTheme);
      };
    });
    
    // 固定的收款码数据
    const qrcodes = reactive([
      // 服务器文件路径配置，使用public目录下的qrcodes文件夹
      // 注意：lemon_qrcode.png文件不存在，将使用默认占位图
      { title: '柠檬', image: null, subtitle: '打给柠檬的钱就当你是在请柠檬喝柠檬水了哈' }, // 设为null以使用默认占位图
      // 使用相对路径
      { title: '鱼鱼', image: 'qrcodes/yuyu_qrcode.png', subtitle: '鱼服全家桶、幽柠一服运营' },
      { title: 'ksang', image: 'qrcodes/ksang_qrcode.png', subtitle: '网站运维,幽柠二服运营' }
    ]);
    
    // 固定的感谢信息
    const customMessage = ref('感谢您的支持与鼓励！');
    
    // 图片加载错误处理函数
    const handleImageError = (index) => {
      console.log(`图片加载失败，使用默认图片: ${qrcodes[index].title}`);
      qrcodes[index].image = null; // 设置为null，这样会使用默认图片
    };
    
    // 注意：如果需要从服务器获取实际的二维码路径，可以在这里添加API调用
      // 例如：onMounted(() => fetchQrCodePaths());
    
    return {
        qrcodes,
        customMessage,
        defaultImage,
        handleImageError,
        goToHome,
        isDarkMode,
        toggleTheme
      };
  }
};
</script>

<style scoped>
.sponsor-container {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: #f8f9fa; /* 默认浅色背景 */
  /* 硬件加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.sponsor-container.dark-theme {
  background-color: #121212; /* 深色背景 */
}

/* 纯色背景 */
.solid-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  /* 优化背景渲染 */
  will-change: background-color;
  transition: background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.sponsor-container:not(.dark-theme) .solid-background {
  background-color: #f8f9fa;
}

.sponsor-container.dark-theme .solid-background {
  background-color: #121212;
}

  @keyframes float {
    0%, 100% {
      transform: translate(0, 0) scale(1);
    }
    25% {
      transform: translate(20px, -20px) scale(1.1);
    }
    50% {
      transform: translate(0, 0) scale(1.2);
    }
    75% {
      transform: translate(-20px, 20px) scale(1.1);
    }
  }

.content-wrapper {
  position: relative;
  z-index: 1;
  width: 90%;
  max-width: 1200px;
  padding: 2rem;
  padding-top: 6rem; /* 为顶部按钮留出更多空间 */
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: 
    background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  /* 硬件加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

/* 主题切换时添加微妙的缩放效果 */
.sponsor-container.dark-theme .content-wrapper {
  background-color: #1e1e1e;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.sponsor-container.dark-theme .content-wrapper {
  background-color: #1e1e1e;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.back-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.75rem 1.5rem;
  background-color: #6c757d; /* 单色按钮背景 */
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: 
    background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  /* 减少硬件消耗的阴影 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* 硬件加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.back-button:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
  background-color: #5a6268; /* 深色悬停效果 */
}

/* 主题切换开关 */
.theme-toggle {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  background-color: #e9ecef;
  transition: 
    background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* 硬件加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  /* 主题切换时的焦点指示器 */
  outline: none;
  /* 优化渲染 */
  will-change: transform;
}

.sponsor-container.dark-theme .theme-toggle {
  background-color: #343a40;
  color: #f8f9fa;
}

.theme-toggle:hover {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
}

.theme-toggle:active {
  transform: scale(0.95);
}

.back-button:active {
  transform: translateY(0);
}

.title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  margin-top: 1rem; /* 为返回按钮留出空间 */
  color: #333;
  transition: 
    color 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  /* 硬件加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

/* 微妙的标题效果 */
.sponsor-container.dark-theme .title {
  color: #f8f9fa;
}

.sponsor-container.dark-theme .title {
  color: #f8f9fa;
}

.qrcode-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.qrcode-item {
  background-color: #f8f9fa;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: 
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  /* 硬件加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  /* 减少不必要的硬件消耗 */
  contain: layout style;
}

.sponsor-container.dark-theme .qrcode-item {
  background-color: #2d2d2d;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.qrcode-item:hover {
  transform: translateY(-5px) scale(1.02);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.qrcode-header {
  margin-bottom: 1rem;
  text-align: center;
}

.fixed-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin: 0;
  padding: 0.5rem;
  text-align: center;
  transition: color 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 副标题样式 */
.subtitle {
  font-size: 0.9rem;
  color: #666;
  text-align: center;
  margin-top: 0.5rem;
  padding: 0.25rem;
  transition: color 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.sponsor-container.dark-theme .subtitle {
  color: #aaa;
}

.sponsor-container.dark-theme .fixed-title {
  color: #f8f9fa;
}

.qrcode-image-container {
  width: 100%;
  height: 250px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: white;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
  transition: 
    background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  /* 硬件加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.sponsor-container.dark-theme .qrcode-image-container {
  border-color: #444;
  background-color: #333;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
}

.qrcode-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  /* 优化图片渲染 */
  image-rendering: -webkit-optimize-contrast;
  /* 硬件加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.qrcode-item:hover .qrcode-image {
  transform: scale(1.05);
}

.message {
  text-align: center;
  margin-top: 2rem;
}

.fixed-message {
  font-size: 1.3rem;
  line-height: 1.6;
  color: #555;
  margin: 0;
  padding: 1rem 0;
  font-style: italic;
  transition: 
    color 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  /* 硬件加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.sponsor-container.dark-theme .fixed-message {
  color: #ccc;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .title {
    font-size: 2rem;
  }
  
  .qrcode-container {
    grid-template-columns: 1fr;
  }
  
  .content-wrapper {
    padding: 1.5rem;
  }
}
</style>