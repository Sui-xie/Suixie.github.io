<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const aiServiceUrl = ref('https://example.com/ai-service')
const manualServiceQQ = ref('123456789')

const openAiService = () => {
  window.open(aiServiceUrl.value, '_blank')
}

const openManualService = () => {
  const qqUrl = `https://wpa.qq.com/msgrd?v=3&uin=${manualServiceQQ.value}&site=qq&menu=yes`
  window.open(qqUrl, '_blank')
}

onMounted(() => {
  document.title = '客服中心 - 幽柠之域'
})
</script>

<template>
  <div class="support-wrapper">
    <header class="support-header">
      <button class="back-button" @click="router.back()">← 返回</button>
      <h1 class="support-title">客服中心</h1>
      <p class="support-description">需要帮助？我们提供智能客服与人工客服，随时为你解答疑问。</p>
    </header>

    <section class="support-card">
      <div class="card-content">
        <h2 class="card-title">智能客服 · AI 小模型</h2>
        <p class="card-subtitle">
          快速获取问题答案，接入我们的小模型智能客服，支持问题引导、常见问题快速匹配以及操作建议。
        </p>
        <ul class="feature-list">
          <li>24/7 全天候响应</li>
          <li>支持根据关键词推荐知识库文章</li>
          <li>可输出操作步骤与注意事项</li>
        </ul>
        <button class="primary-action" @click="openAiService">立即打开智能客服</button>
        <p class="action-tip">如需接入自定义 AI 服务，可在管理后台更新链接。</p>
      </div>
      <div class="card-illustration">
        <div class="bubble bubble-large"></div>
        <div class="bubble bubble-medium"></div>
        <div class="bubble bubble-small"></div>
        <span class="bot-icon">🤖</span>
      </div>
    </section>

    <section class="support-card secondary">
      <div class="card-content">
        <h2 class="card-title">转人工客服</h2>
        <p class="card-subtitle">
          如果 AI 无法解决您的问题，可一键转人工客服，通过 QQ 与客服专员直接沟通。
        </p>
        <div class="manual-info">
          <span class="manual-label">客服 QQ：</span>
          <span class="manual-value">{{ manualServiceQQ }}</span>
        </div>
        <button class="secondary-action" @click="openManualService">立即联系人工客服</button>
        <p class="action-tip">人工客服在线时间：每日 09:00 - 22:00。</p>
      </div>
      <div class="card-illustration">
        <span class="bot-icon human">🙋</span>
        <div class="bubble bubble-medium"></div>
      </div>
    </section>

    <footer class="support-footer">
      <h3>常见问题</h3>
      <ul>
        <li>服务器无法连接？请先查看公告或尝试重启客户端。</li>
        <li>账号相关问题？请准备注册邮箱、角色名便于核实。</li>
        <li>更多帮助？访问我们的<a href="https://example.com/help" target="_blank" rel="noopener">帮助中心</a>。</li>
      </ul>
    </footer>
  </div>
</template>

<style scoped>
.support-wrapper {
  min-height: 100vh;
  padding: 40px 20px 80px;
  background: linear-gradient(180deg, rgba(16, 162, 80, 0.08), rgba(255, 255, 255, 0.9));
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.support-header {
  max-width: 960px;
  margin: 0 auto;
  text-align: center;
  position: relative;
}

.support-title {
  font-size: 2.4rem;
  margin: 10px 0 16px;
  color: #0f5132;
}

.support-description {
  color: #4f5d75;
  margin: 0;
}

.back-button {
  position: absolute;
  left: 0;
  top: 8px;
  background: transparent;
  border: none;
  color: #0f5132;
  font-size: 1rem;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 999px;
  transition: background 0.2s ease;
}

.back-button:hover {
  background: rgba(15, 81, 50, 0.1);
}

.support-card {
  max-width: 960px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 24px;
  padding: 32px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  box-shadow: 0 20px 45px rgba(15, 81, 50, 0.1);
  border: 1px solid rgba(16, 162, 80, 0.08);
}

.support-card.secondary {
  background: linear-gradient(135deg, rgba(16, 162, 80, 0.08), rgba(255, 255, 255, 0.9));
}

.card-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.card-title {
  font-size: 1.8rem;
  margin: 0;
  color: #0f5132;
}

.card-subtitle {
  margin: 0;
  color: #4f5d75;
  line-height: 1.6;
}

.feature-list {
  margin: 0;
  padding-left: 20px;
  color: #344966;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.primary-action,
.secondary-action {
  padding: 12px 24px;
  border-radius: 999px;
  border: none;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.primary-action {
  background: linear-gradient(135deg, #10a250, #0f5132);
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(16, 162, 80, 0.25);
}

.primary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 26px rgba(16, 162, 80, 0.3);
}

.secondary-action {
  background: #ffffff;
  color: #0f5132;
  border: 2px solid rgba(16, 162, 80, 0.4);
  box-shadow: 0 10px 20px rgba(15, 81, 50, 0.15);
}

.secondary-action:hover {
  transform: translateY(-1px);
  box-shadow: 0 12px 24px rgba(15, 81, 50, 0.2);
}

.action-tip {
  font-size: 0.9rem;
  color: #6c757d;
}

.manual-info {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 1.1rem;
  color: #0f5132;
  font-weight: 600;
}

.card-illustration {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.bot-icon {
  font-size: 3rem;
  position: relative;
  z-index: 2;
}

.bot-icon.human {
  font-size: 3.5rem;
}

.bubble {
  position: absolute;
  border-radius: 50%;
  background: rgba(16, 162, 80, 0.12);
  filter: blur(0.4px);
}

.bubble-large {
  width: 140px;
  height: 140px;
  top: 20px;
  right: 30px;
}

.bubble-medium {
  width: 100px;
  height: 100px;
  bottom: 20px;
  left: 40px;
}

.bubble-small {
  width: 60px;
  height: 60px;
  top: 50px;
  left: 60px;
}

.support-footer {
  max-width: 960px;
  margin: 0 auto 40px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 10px 24px rgba(15, 81, 50, 0.1);
}

.support-footer h3 {
  margin-top: 0;
  color: #0f5132;
}

.support-footer ul {
  margin: 12px 0 0;
  padding-left: 20px;
  color: #4f5d75;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.support-footer a {
  color: #0f5132;
  font-weight: 600;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .support-wrapper {
    padding: 24px 16px 60px;
  }

  .support-card {
    padding: 24px;
  }

  .support-title {
    font-size: 2rem;
  }

  .back-button {
    position: relative;
    margin-bottom: 12px;
  }
}
</style>
