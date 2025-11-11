<template>
  <div class="support-shell">
    <button
      class="theme-toggle fixed"
      @click="cycleThemePreference"
      :title="themeToggleLabel"
    >
      {{ themeIcon }}
    </button>

    <section class="support-hero">
      <div class="hero-main">
        <p class="eyebrow">SUÌXIE · 自托管客服</p>
        <h1>有事就喊我，客服和运维都是我</h1>
        <p>
          我盯着服务器状态面板，也守着 {{ manualServiceQQ }} 这个 QQ 号。掉线、补丁、账号、节点调整——你只要告诉我，剩下的我和机器人一起接手。
        </p>
        <ul class="badge-list">
          <li v-for="badge in badges" :key="badge">{{ badge }}</li>
        </ul>
        <div class="hero-actions">
          <button class="btn primary" @click="openManualService">立即联系 QQ</button>
          <button class="btn outline" @click="focusBotComposer">和机器人试跑</button>
          <button class="text-link" @click="goHome">返回主页</button>
        </div>
      </div>
      <div class="hero-aside">
        <div class="qq-card">
          <p class="label">人工客服 QQ</p>
          <strong>{{ manualServiceQQ }}</strong>
          <small>全节点维护 · 单线程服务</small>
        </div>
        <div class="status-grid">
          <article v-for="signal in statusSignals" :key="signal.label" class="status-card">
            <strong>{{ signal.value }}</strong>
            <span>{{ signal.label }}</span>
            <small>{{ signal.meta }}</small>
          </article>
        </div>
      </div>
    </section>

    <section class="bot-hub" ref="botSectionRef">
      <aside class="bot-brief">
        <p class="eyebrow">KSNAG · 吹水机器人</p>
        <h2>先让 LLM 跑一遍，再由我亲自跟进</h2>
        <p>
          KSNAG 接入 botapi 配置，和主站同一套凭据。它会整理日志、提炼关键词、生成工单草稿，然后同步到我这里审核。
        </p>
        <ul class="bot-points">
          <li>关键词总结 + 待办列表</li>
          <li>自动生成工单草稿</li>
          <li>支持 Markdown / 代码块</li>
        </ul>
        <div class="quick-phrases">
          <button
            v-for="phrase in quickPhrases"
            :key="phrase"
            class="chip"
            @click="applyPhrase(phrase)"
          >
            {{ phrase }}
          </button>
        </div>
        <p class="sync-tip">同步到：{{ syncedDestinations }}</p>
        <p class="bot-meta">模型：{{ botMeta }}</p>
      </aside>
      <div class="bot-console">
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
            ref="messageInputRef"
            v-model="userMessage"
            type="text"
            placeholder="描述你的问题，或者让 KSNAG 帮你吹吹水，它都会记录"
            :disabled="isBotTyping"
          />
          <button class="btn primary" :disabled="!userMessage.trim() || isBotTyping">发送</button>
        </form>
        <p class="bot-hint">
          提示：输入“生成工单”或“整理日志”，KSNAG 会自动生成工单草稿并告诉我。
        </p>
      </div>
    </section>

    <section class="faq-shelf">
      <div class="faq-intro">
        <h2>常见问题先写在这里</h2>
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
import { computed, nextTick, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useTheme } from '../composables/useTheme.js'
import { botApi, chatWithBot } from '../api/botapi.js'

const router = useRouter()
const { themePreference, resolvedTheme, themeToggleLabel, themeIcon, cycleThemePreference } = useTheme()
const manualServiceQQ = ref('2124007978')
const botSectionRef = ref(null)
const messageInputRef = ref(null)
const userMessage = ref('')
const isBotTyping = ref(false)

const openManualService = () => {
  const qqUrl = `https://wpa.qq.com/msgrd?v=3&uin=${manualServiceQQ.value}&site=qq&menu=yes`
  window.open(qqUrl, '_blank', 'noreferrer')
}

const goHome = () => {
  router.push('/')
}

const focusBotComposer = async () => {
  if (botSectionRef.value) {
    botSectionRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
  await nextTick()
  messageInputRef.value?.focus()
}

const applyPhrase = async (phrase) => {
  userMessage.value = phrase
  await focusBotComposer()
}

const badges = ['实时看板', '夜间值守', '跨时区友好', '自建工单流']
const quickPhrases = [
  '帮我生成工单：晚高峰延迟 180ms',
  '掉线 3 次，想查服务器状态',
  '账号充值延迟到账，帮我核对订单',
  '整理一下 CDN 切换步骤发我'
]

const statusSignals = [
  { label: '今日处理', value: '27', meta: '+4 工单' },
  { label: '在线节点', value: '8', meta: '多地自选' },
  { label: '平均响应', value: '3′', meta: '人工回复' },
  { label: '机器人命中', value: '92%', meta: 'FAQ 覆盖' }
]

const faqs = [
  {
    title: '账号怎么绑定？',
    answer: '进入「获取绑定码」，复制后在游戏里粘贴提交，控制台显示成功即完成签收。'
  },
  {
    title: '充值未到账怎么办？',
    answer: '截图付款记录发给我，或让 KSNAG 生成工单，我会在 10 分钟内核实。'
  },
  {
    title: '延迟太高如何排查？',
    answer: '告诉我所在地区、运营商和时间段，我会推送经过自测的备用节点。'
  }
]

const chatHistory = ref([
  {
    id: 1,
    role: 'assistant',
    content: '嗨，我是 KSNAG，想吹水还是提问题？我会把重点同步给站长。'
  }
])

const syncedDestinations = computed(() => botApi.destinations.join(' · '))
const botMeta = computed(() => `${botApi.model} · 温度 ${botApi.temperature}`)

const handleBotSend = async () => {
  if (!userMessage.value.trim() || isBotTyping.value) return

  const content = userMessage.value.trim()
  chatHistory.value.push({ id: Date.now(), role: 'user', content })
  userMessage.value = ''

  isBotTyping.value = true
  try {
    const reply = await chatWithBot(
      chatHistory.value.map(({ role, content }) => ({ role, content })),
      {
        extraPayload: {
          metadata: {
            page: 'support',
            theme: themePreference.value || resolvedTheme.value,
            qq: manualServiceQQ.value
          }
        }
      }
    )
    chatHistory.value.push({
      id: Date.now() + 1,
      role: 'assistant',
      content: reply
    })
  } catch (error) {
    console.error(error)
    chatHistory.value.push({
      id: Date.now() + 2,
      role: 'assistant',
      content: 'KSNAG 有点害羞，暂时没能连上。我已经把你的留言记下，稍后我会亲自回复。'
    })
  } finally {
    isBotTyping.value = false
  }
}
</script>

<style scoped>
:global(:root) {
  color-scheme: light;
  --body-bg: linear-gradient(180deg, #f4f7fb 0%, #e8f0f7 60%, #dde8f3 100%);
  --text-primary: #1a202c;
  --text-secondary: #4a5568;
  --tag-bg: rgba(168, 213, 255, 0.15);
  --card-bg: linear-gradient(135deg, #ffffff, #f8fafc);
  --card-outline: rgba(168, 213, 255, 0.3);
  --accent: #4a90e2;
  --accent-soft: rgba(168, 213, 255, 0.2);
  --bot-panel-bg: rgba(255, 255, 255, 0.85);
  --bot-border: rgba(168, 213, 255, 0.2);
  --bubble-assistant-bg: rgba(200, 230, 255, 0.85);
  --bubble-user-bg: rgba(74, 144, 226, 0.12);
  --bubble-user-text: #1a202c;
  --faq-card-bg: rgba(255, 255, 255, 0.92);
  --faq-border: rgba(168, 213, 255, 0.15);
}

:global([data-theme='dark']) {
  color-scheme: dark;
  --body-bg: linear-gradient(180deg, #0a1929 0%, #0f172a 60%, #1e293b 100%);
  --text-primary: #f8fafc;
  --text-secondary: #cbd5e1;
  --tag-bg: rgba(168, 213, 255, 0.12);
  --card-bg: linear-gradient(135deg, #0f172a, #1e293b);
  --card-outline: rgba(168, 213, 255, 0.25);
  --accent: #a8d5ff;
  --accent-soft: rgba(168, 213, 255, 0.2);
  --bot-panel-bg: rgba(30, 41, 59, 0.9);
  --bot-border: rgba(168, 213, 255, 0.25);
  --bubble-assistant-bg: rgba(30, 41, 59, 0.75);
  --bubble-user-bg: rgba(168, 213, 255, 0.2);
  --bubble-user-text: #f8fafc;
  --faq-card-bg: rgba(30, 41, 59, 0.88);
  --faq-border: rgba(168, 213, 255, 0.18);
}

:global(body) {
  background: var(--body-bg);
  font-family: 'Poppins', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  color: var(--text-primary);
  background-size: 180% 180%;
  animation: bodyWave 18s ease-in-out infinite alternate;
  transition: background 0.6s ease;
}

.support-shell {
  max-width: 1160px;
  margin: 0 auto;
  padding: 48px 20px 80px;
  color: var(--text-primary);
}

.support-hero {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 32px;
  padding: 48px;
  border-radius: 32px;
  background: var(--card-bg);
  border: 1px solid var(--card-outline);
  box-shadow: 0 30px 80px rgba(20, 40, 80, 0.12);
  position: relative;
  overflow: hidden;
}

.hero-main h1 {
  font-size: clamp(2.2rem, 4vw, 3.1rem);
  line-height: 1.2;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.hero-main p {
  color: var(--text-secondary);
  line-height: 1.7;
}

.badge-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
  padding: 0;
  list-style: none;
}

.badge-list li {
  background: var(--tag-bg);
  border-radius: 999px;
  padding: 6px 16px;
  font-size: 0.9rem;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 18px;
  align-items: center;
}

.btn {
  border: none;
  border-radius: 999px;
  padding: 12px 26px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn.primary {
  background: var(--accent);
  color: #fff;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
}

.btn.ghost {
  background: transparent;
  color: var(--text-primary);
  border: 1px dashed var(--card-outline);
}

.btn.outline {
  background: transparent;
  color: var(--text-primary);
  border: 1px solid var(--card-outline);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.text-link {
  background: none;
  border: none;
  color: var(--text-primary);
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.text-link:hover {
  text-decoration: underline wavy;
}

.hero-aside {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.qq-card {
  padding: 24px;
  border-radius: 24px;
  background: var(--accent-soft);
  border: 1px solid var(--card-outline);
}

.qq-card strong {
  font-size: 2rem;
  display: block;
  margin: 8px 0;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 14px;
}

.status-card {
  padding: 16px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid var(--card-outline);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.status-card strong {
  font-size: 1.6rem;
}

.label {
  text-transform: uppercase;
  letter-spacing: 0.2em;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.bot-hub {
  margin-top: 48px;
  padding: 40px;
  border-radius: 32px;
  background: var(--card-bg);
  border: 1px solid var(--card-outline);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 28px;
}

.bot-brief h2 {
  margin: 10px 0 12px;
  font-size: clamp(1.6rem, 3vw, 2.2rem);
}

.bot-points {
  padding-left: 18px;
  color: var(--text-secondary);
  line-height: 1.6;
}

.quick-phrases {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 18px 0;
}

.chip {
  border: 1px solid var(--card-outline);
  border-radius: 999px;
  padding: 6px 14px;
  background: transparent;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.chip:hover {
  border-color: var(--accent);
  color: var(--text-primary);
}

.sync-tip,
.bot-meta {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.bot-console {
  background: var(--bot-panel-bg);
  border-radius: 28px;
  border: 1px solid var(--bot-border);
  display: flex;
  flex-direction: column;
  padding: 18px;
  min-height: 380px;
}

.bot-history {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 6px;
}

.bubble {
  border-radius: 18px;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border: 1px solid transparent;
}

.bubble.assistant {
  background: var(--bubble-assistant-bg);
  border-color: var(--card-outline);
}

.bubble.user {
  background: var(--bubble-user-bg);
  color: var(--bubble-user-text);
  margin-left: auto;
  border-color: rgba(74, 144, 226, 0.25);
}

.bubble.typing p {
  opacity: 0.8;
  font-style: italic;
}

.bot-input {
  margin-top: 16px;
  display: flex;
  gap: 10px;
}

.bot-input input {
  flex: 1;
  border-radius: 18px;
  border: 1px solid rgba(128, 128, 128, 0.4);
  padding: 10px 16px;
  font-size: 0.95rem;
  background: transparent;
  color: var(--text-primary);
}

.bot-input input::placeholder {
  color: var(--text-secondary);
}

.bot-hint {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-top: 8px;
}

.faq-shelf {
  margin-top: 50px;
  padding: 32px;
  border-radius: 32px;
  background: var(--faq-card-bg);
  border: 1px solid var(--faq-border);
  box-shadow: 0 25px 60px rgba(20, 40, 80, 0.08);
}

.faq-list {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.faq-card {
  background: var(--card-bg);
  border-radius: 20px;
  padding: 18px;
  border: 1px solid var(--faq-border);
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.theme-toggle.fixed {
  width: 48px;
  height: 48px;
  font-size: 1.4rem;
  background-color: #e9ecef;
  color: #333;
  position: fixed;
  top: 18px;
  right: 24px;
  border-radius: 50%;
  border: none;
  z-index: 20;
  cursor: pointer;
}

[data-theme='dark'] .theme-toggle.fixed {
  background-color: #343a40;
  color: #f8f9fa;
}

@media (max-width: 720px) {
  .support-hero,
  .bot-hub {
    padding: 28px;
  }

  .theme-toggle.fixed {
    top: 12px;
    right: 12px;
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
</style>
