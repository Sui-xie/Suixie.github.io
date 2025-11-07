<template>
  <div class="cuddle-wrap">
    <!-- 顶部右侧主题切换按钮（参考主页样式） -->
    <button
      class="theme-toggle fixed"
      @click="cycleThemePreference"
      :title="themeToggleLabel"
    >
      {{ themeIcon }}
    </button>
    <section class="hero-card">
      <div class="scribble scribble-one" aria-hidden="true"></div>
      <div class="scribble scribble-two" aria-hidden="true"></div>
      <header class="hero-copy">
        <p class="eyebrow">SUÌXIE · 游戏服务器</p>
        <h1>有事就喊我，<br />客服还是我本人。</h1>
        <p>
          我一直盯着服务器状态面板，也守在 2124007978 这个 QQ 号后面。无论是掉线、补丁还是账号问题，直接告诉我就好。
        </p>
        <div class="hero-tags">
          <span v-for="badge in badges" :key="badge">{{ badge }}</span>
        </div>
        <div class="hero-buttons">
          <button class="btn primary" @click="openManualService">找我聊聊</button>
          <button class="btn ghost" @click="goHome">返回主页</button>
          <button class="btn outline" @click="cycleThemePreference">
            {{ themeToggleLabel }}
          </button>
        </div>
      </header>
      <div class="hero-side">
        <img
          class="avatar"
          src="https://img.100sucai.com/2024/05/18/14/23/100601.jpg"
          alt="站长插画"
        />
        <ul class="mini-stats">
          <li>
            <strong>1,287</strong>
            <span>次暖心回复</span>
          </li>
          <li>
            <strong>2年</strong>
            <span>个人站点</span>
          </li>
        </ul>
        <div class="qq-card">
          <p>客服 QQ</p>
          <strong>2124007978</strong>
          <small>游戏服务器专属通道</small>
        </div>
      </div>
    </section>

    <section class="bot-lounge">
      <div class="bot-info">
        <h2>KSNAG · 吹水机器人客服</h2>
        <p>
          KSNAG 基于 LLM 的提示词定制，能陪你吹水，也能在后台整理常见问题、生成工单草稿，并同步给我审核。
        </p>
        <ul>
          <li>关键词总结 + 待办</li>
          <li>自动生成工单草稿</li>
          <li>支持 Markdown / 代码块</li>
        </ul>
        <span class="sync-tip">同步到：{{ syncedDestinations }}</span>
      </div>
      <div class="bot-panel">
        <div class="bot-history">
          <div
            v-for="bubble in chatHistory"
            :key="bubble.id"
            class="bubble"
            :class="bubble.role"
          >
            <strong>{{ bubble.role === 'user' ? '你' : 'KSNAG' }}</strong>
            <p>{{ bubble.content }}</p>
          </div>
          <div v-if="isBotTyping" class="bubble assistant typing">
            <strong>KSNAG</strong>
            <p>正在思考...</p>
          </div>
        </div>
        <form class="bot-input" @submit.prevent="handleBotSend">
          <input
            v-model="userMessage"
            type="text"
            placeholder="描述你的问题，或和 KSNAG 吹吹水，它都会记录。"
            :disabled="isBotTyping"
          />
          <button class="btn primary" :disabled="!userMessage.trim() || isBotTyping">发送</button>
        </form>
        <p class="bot-hint">提示：输入 “生成工单” 让 KSNAG 帮你整理提交材料。</p>
      </div>
    </section>

    <section class="faq-shelf">
      <div class="faq-intro">
        <h2>常见小问题，我先写在这里</h2>
        <p>找不到答案就留言，KSNAG 会记下关键字，我上线后第一时间处理。</p>
      </div>
      <div class="faq-list">
        <article v-for="faq in faqs" :key="faq.title" class="faq-card">
          <h3>{{ faq.title }}</h3>
          <p>{{ faq.answer }}</p>
          <button class="text-link" @click="openManualService">继续问我 →</button>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme.js'

const router = useRouter()
const { themePreference, resolvedTheme, themeToggleLabel, themeIcon, cycleThemePreference } = useTheme()
const manualServiceQQ = ref('2124007978')

const openManualService = () => {
  const qqUrl = `https://wpa.qq.com/msgrd?v=3&uin=${manualServiceQQ.value}&site=qq&menu=yes`
  window.open(qqUrl, '_blank', 'noreferrer')
}

const goHome = () => {
  router.push('/')
}

const badges = ['实时看板', '夜间值守', '跨时区友好']

const faqs = [
  { title: '账号怎么绑定？', answer: '进入「获取绑定码」，复制后在游戏里粘贴，就算完成签收啦。' },
  { title: '充值未到账？', answer: '截图付款记录发给我，或让 KSNAG 生成工单。我会在 10 分钟内核实。' },
  { title: '延迟太高怎么办？', answer: '告诉我所在地区和网络，我会提供自测过的备用节点。' }
]

const chatHistory = ref([
  { id: 1, role: 'assistant', content: '嗨，我是 KSNAG，想吹水还是提问题？我会把重点同步给站长。' }
])
const userMessage = ref('')
const isBotTyping = ref(false)

const botConfig = {
  endpoint: import.meta.env.VITE_SUPPORT_BOT_ENDPOINT || '/api/support-bot',
  apiKey: import.meta.env.VITE_SUPPORT_BOT_API_KEY || '',
  model: import.meta.env.VITE_SUPPORT_BOT_MODEL || 'gpt-4o-mini',
  temperature: Number(import.meta.env.VITE_SUPPORT_BOT_TEMPERATURE ?? 0.3)
}

const syncedDestinations = computed(() => 'QQ 私信 · 工单草稿 · 服务器看板')

const callSupportBot = async (messages) => {
  const payload = {
    model: botConfig.model,
    messages,
    temperature: botConfig.temperature,
    stream: false
  }

  const headers = { 'Content-Type': 'application/json' }
  if (botConfig.apiKey) {
    headers.Authorization = `Bearer ${botConfig.apiKey}`
  }

  const response = await fetch(botConfig.endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload)
  })

  if (!response.ok) {
    throw new Error(`bot offline (${response.status})`)
  }

  const data = await response.json()
  return (
    data.reply ??
    data.choices?.[0]?.message?.content ??
    '我已经记下啦，我们继续聊聊。'
  )
}

const handleBotSend = async () => {
  if (!userMessage.value.trim() || isBotTyping.value) return

  const content = userMessage.value.trim()
  chatHistory.value.push({ id: Date.now(), role: 'user', content })
  userMessage.value = ''

  isBotTyping.value = true
  try {
    const reply = await callSupportBot(
      chatHistory.value.map(({ role, content }) => ({ role, content }))
    )
    chatHistory.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      content: reply
    })
  } catch (error) {
    chatHistory.value.push({
      id: Date.now() + 2,
      role: 'assistant',
      content: 'KSNAG 有点害羞，暂时没能连上。我已经把你的留言记下，稍后我会亲自回复！'
    })
  } finally {
    isBotTyping.value = false
  }
}
</script>

<style scoped>
:global(:root) {
  color-scheme: light;
  /* 背景黑白配色（浅色） */
  --body-bg: linear-gradient(180deg, #f0f4f8 0%, #e8f0f7 50%, #dde8f3 100%);
  /* 文本与冷色系强调 - 提高对比度 */
  --text-primary: #1a202c;
  --text-secondary: #4a5568;
  --tag-bg: rgba(168, 213, 255, 0.15);
  /* 卡片与按钮（白色为主，冰蓝色和银灰色点缀） */
  --hero-card-bg: linear-gradient(135deg, #ffffff, #f8fafc);
  --hero-card-shadow: 0 35px 70px rgba(168, 213, 255, 0.25);
  --button-primary-bg: #a8d5ff;
  --button-primary-text: #1a202c;
  --button-ghost-bg: rgba(232, 240, 247, 0.25);
  --button-ghost-border: rgba(168, 213, 255, 0.35);
  --button-ghost-text: #1a202c;
  --button-outline-border: rgba(168, 213, 255, 0.6);
  --button-outline-text: #1a202c;
  /* 组件背景与边框（冰蓝色和银灰色系） */
  --qq-card-bg: rgba(255, 255, 255, 0.85);
  --qq-card-border: rgba(168, 213, 255, 0.25);
  --bot-lounge-bg: linear-gradient(145deg, #f8fafc, #f0f4f8);
  --bot-panel-bg: rgba(255, 255, 255, 0.75);
  --bot-border: rgba(168, 213, 255, 0.2);
  --bubble-assistant-bg: rgba(200, 230, 255, 0.85);
  --bubble-user-bg: rgba(168, 213, 255, 0.8);
  --bubble-user-text: #1a202c;
  --faq-card-bg: rgba(255, 255, 255, 0.92);
  --faq-border: rgba(168, 213, 255, 0.15);
  --sync-tip-bg: rgba(168, 213, 255, 0.15);
}

:global([data-theme='dark']) {
  color-scheme: dark;
  /* 背景黑白配色（深色） */
  --body-bg: linear-gradient(180deg, #0a1929 0%, #0f172a 50%, #1e293b 100%);
  /* 文本与冷色系强调 - 优化对比度 */
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --tag-bg: rgba(168, 213, 255, 0.12);
  /* 卡片与按钮（深色为主，冰蓝色和银灰色点缀） */
  --hero-card-bg: linear-gradient(135deg, #0f172a, #1e293b);
  --hero-card-shadow: 0 35px 70px rgba(168, 213, 255, 0.15);
  --button-primary-bg: #4a90e2;
  --button-primary-text: #ffffff;
  --button-ghost-bg: rgba(232, 240, 247, 0.12);
  --button-ghost-border: rgba(168, 213, 255, 0.25);
  --button-ghost-text: #f8fafc;
  --button-outline-border: rgba(168, 213, 255, 0.5);
  --button-outline-text: #f8fafc;
  /* 组件背景与边框（冰蓝色和银灰色系） */
  --qq-card-bg: rgba(30, 41, 59, 0.8);
  --qq-card-border: rgba(168, 213, 255, 0.35);
  --bot-lounge-bg: linear-gradient(145deg, #1e293b, #0f172a);
  --bot-panel-bg: rgba(30, 41, 59, 0.8);
  --bot-border: rgba(168, 213, 255, 0.25);
  --bubble-assistant-bg: rgba(30, 41, 59, 0.75);
  --bubble-user-bg: rgba(168, 213, 255, 0.85);
  --bubble-user-text: #0a1929;
  --faq-card-bg: rgba(30, 41, 59, 0.88);
  --faq-border: rgba(168, 213, 255, 0.18);
  --sync-tip-bg: rgba(168, 213, 255, 0.25);
}

:global(body) {
  background: var(--body-bg);
  font-family: 'Fredoka', 'Baloo 2', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  background-size: 200% 200%;
  animation: bodyWave 16s ease-in-out infinite alternate;
  color: var(--text-primary);
  transition: background 0.8s ease, color 0.3s ease;
}

.cuddle-wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  color: var(--text-primary);
}

.hero-card {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 32px;
  padding: 48px;
  border-radius: 32px;
  background: var(--hero-card-bg);
  background-size: 320% 320%;
  animation: auroraShift 12s ease-in-out infinite;
  box-shadow: var(--hero-card-shadow);
  overflow: hidden;
}

.scribble {
  position: absolute;
  width: 240px;
  height: 240px;
  opacity: 0.28;
  background-size: cover;
}

.scribble-one {
  top: -40px;
  right: -30px;
  background-image: url("data:image/svg+xml,%3Csvg width='240' height='240' viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 40 Q120 0 220 50 T220 180 Q140 230 20 180 T20 40Z' fill='none' stroke='%23a8d5ff' stroke-width='12' stroke-linecap='round'/%3E%3C/svg%3E");
}

.scribble-two {
  bottom: -70px;
  left: -50px;
  background-image: url("data:image/svg+xml,%3Csvg width='240' height='240' viewBox='0 0 240 240' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 120 Q70 10 120 120 T225 120' fill='none' stroke='%23c8e6ff' stroke-width='14' stroke-linecap='round' stroke-dasharray='16 14'/%3E%3C/svg%3E");
}

.hero-copy {
  position: relative;
  z-index: 1;
}

.eyebrow {
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
  margin-bottom: 12px;
}

.hero-copy h1 {
  font-size: clamp(2.3rem, 4vw, 3.2rem);
  margin-bottom: 12px;
  line-height: 1.2;
  color: var(--text-primary);
}

.hero-copy p {
  max-width: 520px;
  color: var(--text-secondary);
  line-height: 1.7;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 18px 0;
}

.hero-tags span {
  background: var(--tag-bg);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 10px;
}

.btn {
  border: none;
  border-radius: 999px;
  padding: 12px 26px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

.btn.primary {
  background: var(--button-primary-bg);
  color: var(--button-primary-text);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
}

.btn.ghost {
  background: var(--button-ghost-bg);
  color: var(--button-ghost-text);
  border: 1px dashed var(--button-ghost-border);
}

.btn.outline {
  background: transparent;
  color: var(--button-outline-text);
  border: 1px solid var(--button-outline-border);
}

.btn:hover {
  transform: translateY(-2px);
  opacity: 0.95;
}

.hero-side {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.avatar {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 6px solid rgba(168, 213, 255, 0.55);
  object-fit: cover;
  box-shadow: 0 15px 40px rgba(168, 213, 255, 0.3);
}

.mini-stats {
  display: flex;
  gap: 18px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.mini-stats li {
  background: rgba(232, 240, 247, 0.15);
  border-radius: 20px;
  padding: 12px 18px;
  text-align: center;
  color: var(--text-primary);
}

.mini-stats strong {
  display: block;
  font-size: 1.4rem;
  color: var(--text-primary);
}

.qq-card {
  margin-top: 18px;
  width: 100%;
  background: var(--qq-card-bg);
  border-radius: 22px;
  padding: 16px 20px;
  box-shadow: inset 0 0 0 2px var(--qq-card-border);
  text-align: center;
  color: var(--text-primary);
}

.qq-card p {
  margin: 0;
  font-size: 0.85rem;
  letter-spacing: 0.2em;
  color: var(--text-secondary);
}

.qq-card strong {
  display: block;
  font-size: 1.8rem;
  margin: 6px 0;
  color: var(--text-primary);
}

.qq-card small {
  color: var(--text-secondary);
}

.bot-lounge {
  margin-top: 48px;
  padding: 32px;
  border-radius: 32px;
  background: var(--bot-lounge-bg);
  background-size: 240% 240%;
  animation: auroraShift 14s ease-in-out infinite;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  box-shadow: 0 18px 50px rgba(0, 0, 0, 0.6);
}

.bot-info ul {
  list-style: none;
  padding: 0;
  margin: 12px 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.sync-tip {
  display: inline-flex;
  margin-top: 10px;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--sync-tip-bg);
  font-size: 0.85rem;
  color: var(--text-primary);
}

.bot-panel {
  background: var(--bot-panel-bg);
  border-radius: 28px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 2px dashed var(--bot-border);
  backdrop-filter: blur(12px);
  color: var(--text-primary);
}

.bot-history {
  max-height: 320px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 4px;
}

.bubble {
  border-radius: 18px;
  padding: 12px 14px;
  font-size: 0.95rem;
  background: var(--bubble-assistant-bg);
  color: var(--text-primary);
}

.bubble.user {
  align-self: flex-end;
  background: var(--bubble-user-bg);
  color: var(--bubble-user-text);
}

.bubble.assistant {
  align-self: flex-start;
}

.bubble.typing p {
  font-style: italic;
  color: var(--text-secondary);
}

.bot-input {
  display: flex;
  gap: 10px;
}

.bot-input input {
  flex: 1;
  border-radius: 18px;
  border: 1px solid rgba(128, 128, 128, 0.5);
  padding: 10px 16px;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.12);
  color: var(--text-primary);
}

.bot-input input::placeholder {
  color: var(--text-secondary);
}

.bot-hint {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.faq-shelf {
  margin-top: 50px;
  padding: 32px;
  border-radius: 32px;
  background: var(--faq-card-bg);
  background-size: 200% 200%;
  animation: auroraShift 16s ease-in-out infinite;
  border: 3px solid var(--faq-border);
  position: relative;
  color: var(--text-primary);
}

.faq-shelf::after {
  content: '';
  position: absolute;
  inset: 10px;
  border-radius: 28px;
  border: 1px dashed rgba(168, 213, 255, 0.5);
  pointer-events: none;
}

.faq-intro h2 {
  margin: 0 0 8px;
  color: var(--text-primary);
}

.faq-list {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.faq-card {
  background: var(--faq-card-bg);
  border-radius: 20px;
  padding: 18px;
  box-shadow: inset 0 0 0 2px var(--faq-border);
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--text-primary);
}

.text-link {
  background: none;
  border: none;
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-align: left;
}

.text-link:hover {
  text-decoration: underline wavy;
}

@media (max-width: 640px) {
  .hero-card {
    padding: 32px 24px;
  }

  .mini-stats {
    flex-direction: column;
    width: 100%;
  }
}

@keyframes auroraShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes bodyWave {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 60% 60%;
  }
}

/* 顶部右侧主题切换按钮样式（与主页风格一致） */
.theme-toggle.fixed {
  width: 48px;
  height: 48px;
  font-size: 1.4rem;
  background-color: #e9ecef;
  color: #333;
}

[data-theme='dark'] .theme-toggle.fixed {
  background-color: #343a40;
  color: #f8f9fa;
}
</style>
