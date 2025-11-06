<template>
  <div class="support-page">
    <section class="hero">
      <div class="hero-text">
        <p class="eyebrow">SUPPORT CENTER</p>
        <h1>联系客服 · 让问题在这里解决</h1>
        <p>7×24 小时在线支持，工单平均 5 分钟响应。需要帮助？我们始终在您身边。</p>
        <div class="hero-actions">
          <button class="cta primary" @click="openManualService">立即联系人工客服</button>
          <button class="cta ghost" @click="openQQ">QQ 支持通道</button>
        </div>
      </div>
      <ul class="hero-meta">
        <li>
          <strong>95%</strong>
          <span>满意度</span>
        </li>
        <li>
          <strong>3min</strong>
          <span>平均响应</span>
        </li>
        <li>
          <strong>50+</strong>
          <span>常见问题</span>
        </li>
      </ul>
    </section>

    <section class="contact-grid">
      <article
        v-for="channel in contactChannels"
        :key="channel.id"
        class="contact-card"
      >
        <div class="card-header">
          <span class="icon" :style="{ background: channel.accent }">
            {{ channel.icon }}
          </span>
          <span class="badge">{{ channel.badge }}</span>
        </div>
        <h2>{{ channel.title }}</h2>
        <p>{{ channel.description }}</p>
        <ul>
          <li v-for="tip in channel.tips" :key="tip">{{ tip }}</li>
        </ul>
        <button class="cta secondary" @click="channel.onClick">{{ channel.action }}</button>
      </article>
    </section>

    <section class="highlights">
      <article v-for="item in highlights" :key="item.title" class="highlight-card">
        <h3>{{ item.title }}</h3>
        <p>{{ item.content }}</p>
        <span>{{ item.extra }}</span>
      </article>
    </section>

    <section class="faq-section">
      <div class="faq-intro">
        <h2>常见问题速览</h2>
        <p>这些问题覆盖了 90% 的咨询场景，搜索即可快速定位答案。</p>
      </div>
      <div class="faq-cards">
        <article v-for="faq in faqs" :key="faq.title" class="faq-card">
          <h3>{{ faq.title }}</h3>
          <p>{{ faq.answer }}</p>
          <button class="text-link" @click="openManualService">还没解决？问人工</button>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const manualServiceQQ = ref('10086')

const openManualService = () => {
  const qqUrl = `https://wpa.qq.com/msgrd?v=3&uin=${manualServiceQQ.value}&site=qq&menu=yes`
  window.open(qqUrl, '_blank', 'noreferrer')
}

const openQQ = () => {
  const qqUrl = 'https://wpa.qq.com/msgrd?v=3&uin=1008611&site=qq&menu=yes'
  window.open(qqUrl, '_blank', 'noreferrer')
}

const contactChannels = [
  {
    id: 'manual',
    title: '人工客服',
    description: '实时连线支持顾问，适合紧急或复杂问题。',
    action: '立即连线',
    icon: '🤝',
    badge: '实时 · 7×24',
    accent: 'linear-gradient(135deg, #7d5fff, #5b8cfe)',
    tips: ['VIP 排队优先', '语音/文字可选', '平均 2 分钟接入'],
    onClick: openManualService
  },
  {
    id: 'qq',
    title: 'QQ 支持群',
    description: '加入官方支持群，获取公告、补丁与活动提醒。',
    action: '加入 QQ 群',
    icon: '💬',
    badge: '社区 · 500人',
    accent: 'linear-gradient(135deg, #34d399, #10b981)',
    tips: ['群文件实时更新', '在线版主轮值', '每日答疑'],
    onClick: openQQ
  },
  {
    id: 'ticket',
    title: '工单系统',
    description: '提交带附件的技术工单，自动追踪进度。',
    action: '提交工单',
    icon: '📝',
    badge: '记录 · 可追溯',
    accent: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    tips: ['支持日志上传', '进度自动推送', '历史随时查看'],
    onClick: () => window.open('https://support.suixie.com/tickets', '_blank', 'noreferrer')
  }
]

const highlights = [
  { title: '状态透明', content: '工单、群聊、公告三端联动，实时掌握处理进度。', extra: '实时同步' },
  { title: '安全加密', content: '所有会话启用 SSL 加密，敏感信息仅授权工程师可见。', extra: 'AES-256' },
  { title: '多端协同', content: '桌面、移动与小程序统一账号，可随时续接对话。', extra: '跨端漫游' }
]

const faqs = [
  { title: '如何绑定游戏账号？', answer: '在「获取绑定码」页面复制绑定码后，进入游戏设置面板完成绑定。' },
  { title: '充值未到账怎么办？', answer: '保留支付凭证，联系人工客服或提交工单，我们将在 10 分钟内核实。' },
  { title: '服务器延迟高？', answer: '先查看公告确认是否维护，再通过支持群反馈网络环境，工程师会协助排查。' }
]
</script>

<style scoped>
:global(body) {
  background: #050816;
}

.support-page {
  min-height: 100vh;
  padding: 60px 24px 80px;
  max-width: 1200px;
  margin: 0 auto;
  color: #e7e9ff;
  font-family: 'HarmonyOS Sans', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.hero {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  padding: 40px;
  border-radius: 32px;
  background: radial-gradient(circle at top left, rgba(93, 80, 255, 0.35), transparent 55%),
    radial-gradient(circle at bottom right, rgba(16, 185, 129, 0.35), transparent 60%),
    rgba(15, 18, 40, 0.9);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  box-shadow: 0 30px 60px rgba(5, 8, 22, 0.65);
}

.hero-text {
  flex: 1;
  min-width: 250px;
}

.eyebrow {
  letter-spacing: 0.2em;
  font-size: 0.85rem;
  color: #8b92ff;
  margin-bottom: 12px;
}

.hero h1 {
  font-size: clamp(2rem, 4vw, 3rem);
  margin-bottom: 12px;
  color: #fff;
}

.hero p {
  color: rgba(231, 233, 255, 0.85);
  line-height: 1.7;
  max-width: 520px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.cta {
  border: none;
  border-radius: 999px;
  padding: 12px 26px;
  font-size: 1rem;
  cursor: pointer;
  font-weight: 600;
  transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}

.cta.primary {
  background: linear-gradient(135deg, #7d5fff, #5b8cfe);
  color: white;
  box-shadow: 0 12px 24px rgba(93, 80, 255, 0.4);
}

.cta.primary:hover {
  transform: translateY(-2px);
}

.cta.ghost {
  background: transparent;
  color: #9bafff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.cta.ghost:hover {
  background: rgba(255, 255, 255, 0.05);
}

.hero-meta {
  display: flex;
  gap: 18px;
  align-items: flex-end;
  min-width: 220px;
  margin: 0;
  list-style: none;
}

.hero-meta li {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 18px 22px;
  text-align: center;
  flex: 1;
}

.hero-meta strong {
  font-size: 1.8rem;
  display: block;
  color: #fff;
}

.hero-meta span {
  color: rgba(231, 233, 255, 0.7);
  font-size: 0.9rem;
}

.contact-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  margin: 40px 0;
}

.contact-card {
  background: rgba(13, 16, 38, 0.85);
  border-radius: 24px;
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04), 0 18px 40px rgba(5, 8, 22, 0.65);
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.icon {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 1.6rem;
  color: #fff;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.25);
}

.badge {
  font-size: 0.85rem;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.contact-card h2 {
  font-size: 1.3rem;
  color: #fff;
}

.contact-card p {
  color: rgba(231, 233, 255, 0.8);
  line-height: 1.6;
}

.contact-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: rgba(231, 233, 255, 0.75);
}

.cta.secondary {
  align-self: flex-start;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.cta.secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

.highlights {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
}

.highlight-card {
  padding: 24px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(11, 14, 34, 0.9);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.04);
}

.highlight-card h3 {
  color: #fff;
  margin-bottom: 8px;
}

.highlight-card span {
  display: inline-flex;
  margin-top: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  font-size: 0.85rem;
  color: rgba(231, 233, 255, 0.75);
}

.faq-section {
  margin-top: 48px;
  background: rgba(9, 11, 28, 0.95);
  border-radius: 32px;
  padding: 36px;
  border: 1px solid rgba(255, 255, 255, 0.04);
}

.faq-intro h2 {
  color: #fff;
  font-size: 1.8rem;
}

.faq-intro p {
  color: rgba(231, 233, 255, 0.75);
  margin-top: 8px;
  max-width: 620px;
}

.faq-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 18px;
  margin-top: 24px;
}

.faq-card {
  background: rgba(255, 255, 255, 0.02);
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.04);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.faq-card h3 {
  color: #fff;
}

.faq-card p {
  color: rgba(231, 233, 255, 0.72);
  line-height: 1.6;
}

.text-link {
  align-self: flex-start;
  border: none;
  background: transparent;
  color: #7d9dff;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.text-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .hero {
    padding: 28px;
  }

  .hero-meta {
    width: 100%;
  }

  .support-page {
    padding: 40px 16px 60px;
  }
}
</style>
