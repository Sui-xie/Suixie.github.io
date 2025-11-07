<template>
  <div class="sponsor-container" :class="{ 'dark-theme': resolvedTheme === 'dark' }" style="display: flex; justify-content: center; align-items: center; min-height: 100vh;">
    <!-- 纯色背景 -->
    <div class="solid-background"></div>
    
    <div class="content-wrapper">
      <!-- 返回主页按钮 -->
      <button class="back-button" @click="goToHome">
        ← 返回主页
      </button>
      
      <!-- 主题切换开关 -->
      <button class="theme-toggle" @click="cycleThemePreference">
        {{ themeIcon }}
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
import { useTheme } from '@/composables/useTheme';

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
    const { resolvedTheme, themeIcon, cycleThemePreference } = useTheme();
    
    // 返回主页的方法
    const goToHome = () => {
      router.push('/');
    };
    
    // 默认占位图片
    const defaultImage = ref('https://placehold.co/300x300?text=收款码');
    
    // 初始化为空，将从API获取数据
    const qrcodes = reactive([
      { title: '加载中...', image: null, subtitle: '' },
      { title: '加载中...', image: null, subtitle: '' },
      { title: '加载中...', image: null, subtitle: '' }
    ]);
    
    // 初始化为空，将从API获取数据
    const customMessage = ref('正在加载感谢信息...');
    
    // 图片加载错误处理函数
    const handleImageError = (index) => {
      console.log(`图片加载失败，使用默认图片: ${qrcodes[index].title}`);
      qrcodes[index].image = null; // 设置为null，这样会使用默认图片
    };
    
    // 从服务器获取赞助信息
    const fetchSponsorData = async () => {
      try {
        const data = await window.$Api.getSponsor();
        if (data.status === 200) {
          // 更新二维码信息
          if (data.qrcodes && data.qrcodes.length > 0) {
            // 使用获取的数据替换现有的qrcodes数组
            qrcodes.splice(0, qrcodes.length, ...data.qrcodes);
          }
          // 更新感谢信息
          if (data.customMessage) {
            customMessage.value = data.customMessage;
          }
        } else {
          throw new Error(data.reason || 'Failed to load sponsor data');
        }
      } catch (error) {
        console.error('获取赞助信息失败:', error);
        customMessage.value = '加载赞助信息失败，请稍后重试。';
        // 可选：为所有二维码设置错误状态
        qrcodes.forEach(qr => {
          qr.title = '加载失败';
          qr.subtitle = '请检查网络连接';
          qr.image = null;
        });
      }
    };

    // 在组件挂载后调用API
    onMounted(() => {
      fetchSponsorData();
    });
    
    return {
        qrcodes,
        customMessage,
        defaultImage,
        handleImageError,
        goToHome,
        resolvedTheme,
        themeIcon,
        cycleThemePreference
      };
  }
};
</script>

<style scoped>
/* The scoped styles have been moved to the global theme.css file. */
/* You can adjust animations and transitions here if needed. */

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
  border-radius: 20px;
  transition:
    background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  /* 硬件加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.back-button {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background-color 0.5s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  /* 硬件加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.back-button:hover {
  transform: translateY(-2px) scale(1.03);
  box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
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
  outline: none;
  will-change: transform;
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
  transition:
    color 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  /* 硬件加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
}

.qrcode-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.qrcode-item {
  border-radius: 15px;
  padding: 1.5rem;
  transition:
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  /* 硬件加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  contain: layout style;
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
  margin: 0;
  padding: 0.5rem;
  text-align: center;
  transition: color 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 副标题样式 */
.subtitle {
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0.5rem;
  padding: 0.25rem;
  transition: color 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.qrcode-image-container {
  width: 100%;
  height: 250px;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.05);
  transition:
    background-color 0.8s cubic-bezier(0.4, 0, 0.2, 1),
    border-color 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    box-shadow 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  /* 硬件加速 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
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