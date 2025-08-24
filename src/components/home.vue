<script setup lang="ts">
import {onMounted, ref} from 'vue'
import { useRouter } from 'vue-router'
import '../assets/register.css'

const router = useRouter()
const activeCard = ref(0)
const isExpanded = ref(false) // 添加展开状态控制

// 添加动画控制相关的响应式数据
const isAnimating = ref(false)
const animationClass = ref('')

// 添加触摸事件相关数据
const touchStartX = ref(0)
const touchEndX = ref(0)
const touchStartY = ref(0) // 添加纵向触摸起点

const cards = ref([
  { id: 0, title: '用户注册', path: 'register' },
  { id: 1, title: '用户登录', path: 'login' },
  { id: 2, title: '找回密码', path: 'recover' },
  { id: 3, title: '每日签到', path: 'sign' },
  { id: 4, title: '获取绑定码', path: 'bindCode' } // 添加新卡片
])

const navigateTo = (path: string) => {
  // 添加离开动画，等待动画完成后才切换路由
  isAnimating.value = true
  animationClass.value = 'slide-out'
  setTimeout(() => {
    router.push(path)
  }, 400) // 与动画时长保持一致
}

// 直接点击卡片进入功能
const handleCardClick = (index: number) => {
  // 移除 !isExpanded.value 的限制条件，允许在未展开时也能点击卡片
  navigateTo(cards.value[index].path)
}

const switchCard = (index: number) => {
  activeCard.value = index
}

// 实现优化的卡片循环切换效果，保持前三张卡片同步移动
const nextCard = () => {
  // 将当前第一张卡片移到最后，但保持前三张同步
  const updatedCards = [...cards.value]
  const firstCard = updatedCards.shift()
  if (firstCard) {
    updatedCards.push(firstCard)
  }
  cards.value = updatedCards
  activeCard.value = 0
}

const prevCard = () => {
  // 将最后一张卡片移到最前
  const updatedCards = [...cards.value]
  const lastCard = updatedCards.pop()
  if (lastCard) {
    updatedCards.unshift(lastCard)
  }
  cards.value = updatedCards
  activeCard.value = 0
}

// 添加触摸事件处理函数
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0].screenX
  touchStartY.value = e.changedTouches[0].screenY // 添加纵向触摸起点
}

const handleTouchMove = (e: TouchEvent) => {
  if (!touchStartY.value) return
  
  const touchY = e.changedTouches[0].screenY
  const touchX = e.changedTouches[0].screenX
  
  // 计算横向和纵向移动距离
  const deltaX = Math.abs(touchX - touchStartX.value)
  const deltaY = Math.abs(touchY - touchStartY.value)
  
  // 如果纵向移动大于横向移动，则允许页面滚动
  if (deltaY > deltaX) {
    e.stopPropagation()
    return
  }
  
  // 阻止页面滚动，只处理横向滑动
  e.preventDefault()
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].screenX
  handleSwipe()
  touchStartY.value = 0 // 重置纵向触摸起点
}

const handleSwipe = () => {
  const swipeThreshold = 50 // 最小滑动距离阈值
  
  if (touchStartX.value - touchEndX.value > swipeThreshold) {
    // 向左滑动 - 下一张卡片
    nextCard()
  } else if (touchEndX.value - touchStartX.value > swipeThreshold) {
    // 向右滑动 - 上一张卡片
    prevCard()
  }
}

// 展开/收起功能
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 实现页面首次进入时的动画效果
onMounted(() => {
  // 使用nextTick确保DOM已经渲染完成
  setTimeout(() => {
    isAnimating.value = true
    animationClass.value = 'slide-in'
    setTimeout(() => {
      isAnimating.value = false
      animationClass.value = ''
    }, 400)
  }, 0)
})
</script>

<template>
  <div class="register-container no-border" :class="animationClass">
    
    <div class="card-stack-container" :class="{ 'expanded': isExpanded }">
      <div class="card-stack"
           @touchstart="handleTouchStart"
           @touchmove="handleTouchMove"
           @touchend="handleTouchEnd">
        <div 
          v-for="(card, index) in cards" 
          :key="card.id"
          class="card"
          :class="{ 
            'active': !isExpanded && activeCard === index,
            'behind': !isExpanded && activeCard < index,
            'previous': !isExpanded && activeCard > index,
            'expanded-card': isExpanded,
            'active-expanded': isExpanded // 添加展开状态下的选中样式类
          }"
          :style="{ 
            zIndex: activeCard === index ? cards.length : cards.length - Math.abs(index - activeCard),
            transform: isExpanded ? 'none' : `translateX(${(index - activeCard) * 30}px) translateY(${(index - activeCard) * 15}px)`,
            opacity: isExpanded || activeCard === index ? 1 : 0.7
          }"
          @click="handleCardClick(index)"
        >
          <div class="card-content">
            <h3>{{ card.title }}</h3>
            <p>欢迎喵~</p>
          </div>
        </div>
      </div>
    </div>
    
    <div class="navigation-controls" :class="{ 'floating': isExpanded }">
      <button 
        class="btn btn-prev"
        @click="prevCard"
        :disabled="isExpanded"
      >
        上个
      </button>
      <button 
        class="btn btn-submit"
        @click="toggleExpand"
      >
        {{ isExpanded ? '收起' : '展开' }}
      </button>
      <button 
        class="btn btn-next"
        @click="nextCard"
        :disabled="isExpanded"
      >
        下个
      </button>
    </div>
  </div>
</template>

<style scoped>
.card-stack-container {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 30px 0;
  perspective: 1000px;
  user-select: none; /* 防止拖拽时选中文本 */
  -webkit-user-select: none;
  -webkit-touch-callout: none; /* 禁用iOS长按弹出菜单 */
}

.card-stack-container.expanded {
  height: auto;
  margin: 15px 0; /* 减少上下边距 */
}

.card-stack {
  position: relative;
  width: 90%;
  max-width: 350px;
  height: 250px;
  touch-action: pan-y; /* 允许垂直滚动但处理水平滑动 */
}

.card-stack-container.expanded .card-stack {
  height: auto;
  display: flex;
  flex-direction: column;
  gap: 15px; /* 卡片间距 */
}

.card {
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #eee;
  overflow: hidden;
  cursor: pointer; /* 添加指针样式 */
}

.card:not(.expanded-card) {
  cursor: pointer;
}

.card.expanded-card {
  position: relative;
  height: 100px; /* 展开时卡片高度 */
}

.card.active-expanded {
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  opacity: 1 !important;
}

.card-content {
  text-align: center;
  padding: 30px;
  width: 100%;
  background: white;
}

.card.expanded-card .card-content {
  padding: 20px;
}

.card-content h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 1.5rem;
}

.card-content p {
  margin: 0;
  color: #666;
  font-size: 1rem;
}

.navigation-controls {
  display: flex;
  justify-content: space-between;
  margin: 20px 0;
  padding: 0 20px;
  max-width: 400px;
  margin: 20px auto;
}

.navigation-controls.floating {
  position: sticky;
  top: 10px;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.navigation-controls .btn {
  flex: 1;
  margin: 0 10px;
  padding: 12px 20px;
  font-size: 1rem;
  border-radius: 8px; /* 添加圆角 */
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.navigation-controls .btn:first-child {
  margin-left: 0;
}

.navigation-controls .btn:last-child {
  margin-right: 0;
}

.navigation-controls .btn:active {
  transform: scale(0.95); /* 按钮按下效果 */
}

.navigation-controls .btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .card-stack-container {
    height: 350px;
    margin: 20px 0;
  }
  
  .card-stack-container.expanded {
    margin: 10px 0;
  }
  
  .card-stack {
    height: 220px;
  }
  
  .card-stack-container.expanded .card-stack {
    gap: 10px;
  }
  
  .card.expanded-card {
    height: 90px;
  }
  
  .card-content {
    padding: 20px;
  }
  
  .card.expanded-card .card-content {
    padding: 15px;
  }
  
  .card-content h3 {
    font-size: 1.3rem;
    margin: 0 0 10px 0;
  }
  
  .navigation-controls {
    padding: 0 15px;
  }
  
  .navigation-controls.floating {
    padding: 8px 15px;
  }
  
  .navigation-controls .btn {
    padding: 10px 15px;
    font-size: 0.9rem;
    margin: 0 5px;
  }
}

@media (max-width: 480px) {
  .card-stack-container {
    height: 300px;
  }
  
  .card-stack-container.expanded {
    margin: 8px 0;
  }
  
  .card-stack {
    height: 200px;
  }
  
  .card-stack-container.expanded .card-stack {
    gap: 8px;
  }
  
  .card.expanded-card {
    height: 80px;
  }
  
  .card-content h3 {
    font-size: 1.2rem;
  }
  
  .card-content p {
    font-size: 0.9rem;
  }
  
  .navigation-controls {
    padding: 0 10px;
  }
  
  .navigation-controls.floating {
    padding: 6px 10px;
  }
  
  .navigation-controls .btn {
    padding: 8px 10px;
    font-size: 0.85rem;
    margin: 0 3px;
  }
  
  /* 为小屏幕设备优化卡片间距 */
  .card {
    transform: translateX(0) translateY(0) !important;
    opacity: 1 !important;
  }
  
  .card:not(.active) {
    opacity: 0.6 !important;
    transform: translateX(0) translateY(10px) scale(0.95) !important;
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

/* 为触摸设备优化按钮样式 */
@media (hover: none) and (pointer: coarse) {
  .navigation-controls .btn {
    padding: 14px 20px;
    font-size: 1rem;
    min-height: 44px; /* 符合移动端最小触摸目标尺寸 */
  }
}
</style>