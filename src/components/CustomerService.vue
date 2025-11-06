<template>
  <div class="cuddle-wrap">
    <section class="hero-card">
      <div class="scribble scribble-one" aria-hidden="true"></div>
      <div class="scribble scribble-two" aria-hidden="true"></div>
      <header class="hero-copy">
        <p class="eyebrow">SUÌXIE · 小站</p>
        <h1>有事就喊我，<br />客服还是我本人。</h1>
        <p>
          我在暖黄色灯光下写代码，也随时留意你发来的消息。你可以冲我扔 QQ、工单，或者直接窗口呼唤。
        </p>
        <div class="hero-tags">
          <span v-for="badge in badges" :key="badge">{{ badge }}</span>
        </div>
        <div class="hero-buttons">
          <button class="btn peach" @click="openManualService">找我聊聊</button>
          <button class="btn outline" @click="openQQ">QQ 小窗</button>
          <button class="btn ghost" @click="goHome">返回主页</button>
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
      </div>
    </section>

    <section class="contact-grid">
      <article
        v-for="channel in contactChannels"
        :key="channel.id"
        class="contact-card"
        :style="{ background: channel.background }"
      >
        <div class="contact-head">
          <span class="doodle-icon">{{ channel.icon }}</span>
          <span class="contact-badge">{{ channel.badge }}</span>
        </div>
        <h2>{{ channel.title }}</h2>
        <p>{{ channel.description }}</p>
        <ul>
          <li v-for="tip in channel.tips" :key="tip">{{ tip }}</li>
        </ul>
        <button class="btn tiny" @click="channel.onClick">{{ channel.action }}</button>
      </article>
    </section>

    <section class="bot-lounge">
      <div class="bot-info">
        <h2>机器人 KSNAG · 吹水小帮手</h2>
        <p>
          先和 KSNAG 吹吹水吧，它接入了我的 LLM 提示词，既能陪你聊天，也会把常见问题整理成可执行步骤，并同步给我。
        </p>
        <ul>
          <li>关键词总结 + 待办</li>
          <li>自动生成工单草稿</li>
          <li>支持 Markdown 代码块</li>
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
            placeholder="描述你的问题，或和 KSNAG 吹水，它都会记录。"
            :disabled="isBotTyping"
          />
          <button class="btn peach" :disabled="!userMessage.trim() || isBotTyping">发送</button>
        </form>
        <p class="bot-hint">提示：输入 “生成工单” 让 KSNAG 帮你整理提交材料。</p>
      </div>
    </section>

    <section class="notebook">
      <article v-for="note in notes" :key="note.title" class="note-card">
        <h3>{{ note.title }}</h3>
        <p>{{ note.content }}</p>
        <span>{{ note.extra }}</span>
      </article>
    </section>

    <section class="faq-shelf">
      <div class="faq-intro">
        <h2>常见小问题，我先写在这里</h2>
        <p>要是没找到合适答案，就直接召唤我，留一张便签我马上回。</p>
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
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const manualServiceQQ = ref('10086')
const router = useRouter()

const openManualService = () => {
  const qqUrl = `https://wpa.qq.com/msgrd?v=3&uin=${manualServiceQQ.value}&site=qq&menu=yes`
  window.open(qqUrl, '_blank', 'noreferrer')
}

const openQQ = () => {
  const qqUrl = 'https://wpa.qq.com/msgrd?v=3&uin=2124007978&site=qq&menu=yes'
  window.open(qqUrl, '_blank', 'noreferrer')
}

const goHome = () => {
  router.push('/')
}

const badges = ['温暖陪伴', '日常分享', '跨时区友好']

const contactChannels = [
  {
    id: 'manual',
    title: '手写回复 · 人工客服',
    description: '我会亲自接待，适合需要详细说明的情况。',
    action: '召唤我',
    icon: '🧡',
    badge: '即时',
    background: 'linear-gradient(135deg, #ffd6a5, #ffb5c2)',
    tips: ['语音/文字都 OK', '平均 3 分钟上线', '支持发送截图'],
    onClick: openManualService
  },
  {
    id: 'qq',
    title: 'QQ 小窗 + 群聊',
    description: '平时我会在 QQ 群里丢涂鸦和状态，适合边唠嗑边解决问题。',
    action: '加入小群',
    icon: '🎈',
    badge: '陪聊',
    background: 'linear-gradient(135deg, #ffe29f, #ffa99f)',
    tips: ['群相册记事', '定期语音答疑', '活动第一时间知道'],
    onClick: openQQ
  },
  {
    id: 'ticket',
    title: '暖色工单',
    description: '写下你的问题、附上素材，方便我在不同设备上同步查看进度。',
    action: '写一张便签',
    icon: '📝',
    badge: '追踪',
    background: 'linear-gradient(135deg, #ffd3b6, #fcb0c5)',
    tips: ['支持附件', '状态自动提醒', '历史记录可回顾'],
    onClick: () => window.open('https://support.suixie.com/tickets', '_blank', 'noreferrer')
  }
]

const notes = [
  { title: '夜猫子时间', content: '晚 11 点后也可能在线，夜班玩家放心呼叫。', extra: 'Moon Mode' },
  { title: '周末限定', content: '周六会发手写周报，附赠修复进度与音乐。', extra: 'Weekend Drop' },
  { title: '旅行提示', content: '如果我在旅途中，会提前贴出离线小贴纸。', extra: 'Travel Log' }
]

const faqs = [
  { title: '账号怎么绑定？', answer: '进入「获取绑定码」，复制后在游戏里粘贴，就算完成签收啦。' },
  { title: '遇到充值问题？', answer: '截图付款记录发给我，我核实后会在 10 分钟内回执。' },
  { title: '延迟太高怎么办？', answer: '告诉我所在地区和网络，我会提供我自己测试的备用节点。' }
]

const chatHistory = ref([
  { id: 1, role: 'assistant', content: '嗨，我是 KSNAG，想要吹水还是提问题？我都会记下重点！' }
])
const userMessage = ref('')
const isBotTyping = ref(false)

const botConfig = {
  endpoint: import.meta.env.VITE_SUPPORT_BOT_ENDPOINT || '/api/support-bot',
  apiKey: import.meta.env.VITE_SUPPORT_BOT_API_KEY || '',
  model: import.meta.env.VITE_SUPPORT_BOT_MODEL || 'gpt-4o-mini',
  temperature: Number(import.meta.env.VITE_SUPPORT_BOT_TEMPERATURE ?? 0.3)
}

const syncedDestinations = computed(() => 'QQ 群 · 工单草稿 · 站长私信')

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
:global(body) {
  background: radial-gradient(circle at top, #fff4ec 0%, #ffe7da 50%, #ffdfd3 100%);
  font-family: 'Fredoka', 'Baloo 2', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.cuddle-wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding: 40px 20px 80px;
  color: #4f2a2a;
}

.hero-card {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 32px;
  padding: 48px;
  border-radius: 32px;
  background: linear-gradient(125deg, rgba(255, 214, 165, 0.9), rgba(255, 179, 174, 0.85));
  box-shadow: 0 25px 60px rgba(255, 149, 128, 0.35);
  overflow: hidden;
}

.scribble {
  position: absolute;
  width: 220px;
  height: 220px;
  opacity: 0.2;
  background-size: cover;
}

.scribble-one {
  top: -40px;
  right: -20px;
  background-image: url("data:image/svg+xml,%3Csvg width='220' height='220' viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 40 Q110 10 200 40 T200 160 Q110 210 20 160 T20 40Z' fill='none' stroke='%23ff8b6a' stroke-width='10' stroke-linecap='round'/%3E%3C/svg%3E");
}

.scribble-two {
  bottom: -60px;
  left: -40px;
  background-image: url("data:image/svg+xml,%3Csvg width='220' height='220' viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 110 Q60 10 110 110 T210 110' fill='none' stroke='%23ffad84' stroke-width='12' stroke-linecap='round' stroke-dasharray='14 12'/%3E%3C/svg%3E");
}

.hero-copy {
  position: relative;
  z-index: 1;
}

.eyebrow {
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  color: rgba(79, 42, 42, 0.8);
  margin-bottom: 12px;
}

.hero-copy h1 {
  font-size: clamp(2.2rem, 5vw, 3.2rem);
  margin-bottom: 12px;
  line-height: 1.2;
}

.hero-copy p {
  max-width: 520px;
  color: rgba(79, 42, 42, 0.9);
  line-height: 1.7;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 18px 0;
}

.hero-tags span {
  background: rgba(255, 255, 255, 0.6);
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 0.9rem;
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
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn.peach {
  background: #ff8b6a;
  color: #fff;
  box-shadow: 0 12px 25px rgba(255, 99, 71, 0.35);
}

.btn.outline {
  background: transparent;
  border: 2px dashed rgba(79, 42, 42, 0.4);
  color: #4f2a2a;
}

.btn.ghost {
  background: rgba(255, 255, 255, 0.65);
  color: #4f2a2a;
  box-shadow: none;
}

.btn:hover {
  transform: translateY(-2px);
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
  border: 6px solid rgba(255, 255, 255, 0.65);
  object-fit: cover;
  box-shadow: 0 15px 35px rgba(255, 105, 97, 0.4);
}

.mini-stats {
  display: flex;
  gap: 18px;
  list-style: none;
  padding: 0;
  margin: 0;
}

.mini-stats li {
  background: rgba(255, 255, 255, 0.55);
  border-radius: 20px;
  padding: 12px 18px;
  text-align: center;
}

.mini-stats strong {
  display: block;
  font-size: 1.4rem;
}

.contact-grid {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.contact-card {
  border-radius: 26px;
  padding: 24px;
  box-shadow: 0 18px 35px rgba(255, 175, 160, 0.45);
  color: #4f2a2a;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.doodle-icon {
  font-size: 1.8rem;
}

.contact-badge {
  background: rgba(255, 255, 255, 0.7);
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.85rem;
}

.contact-card h2 {
  margin: 0;
  font-size: 1.3rem;
}

.contact-card p {
  margin: 0;
  line-height: 1.5;
}

.contact-card ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.95rem;
}

.btn.tiny {
  align-self: flex-start;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.7);
  border-radius: 16px;
  color: #4f2a2a;
  border: none;
}

.notebook {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.note-card {
  background: #fffdf7;
  border-radius: 24px;
  padding: 20px;
  border: 2px dashed rgba(255, 155, 135, 0.5);
  box-shadow: 0 15px 30px rgba(255, 175, 160, 0.25);
}

.note-card span {
  display: inline-flex;
  margin-top: 10px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 152, 120, 0.15);
}

.faq-shelf {
  margin-top: 50px;
  padding: 32px;
  border-radius: 32px;
  background: #fff7f0;
  border: 3px solid rgba(255, 171, 145, 0.4);
  position: relative;
}

.faq-shelf::after {
  content: '';
  position: absolute;
  inset: 10px;
  border-radius: 28px;
  border: 1px dashed rgba(255, 149, 128, 0.6);
  pointer-events: none;
}

.faq-intro h2 {
  margin: 0 0 8px;
}

.faq-list {
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.faq-card {
  background: #fff;
  border-radius: 20px;
  padding: 18px;
  box-shadow: inset 0 0 0 2px rgba(255, 195, 170, 0.4);
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.text-link {
  background: none;
  border: none;
  color: #ff8b6a;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
  text-align: left;
}

.text-link:hover {
  text-decoration: underline wavy;
}

.bot-lounge {
  margin-top: 48px;
  padding: 32px;
  border-radius: 32px;
  background: linear-gradient(135deg, #fff1e6, #ffe2de);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 24px;
  box-shadow: 0 18px 45px rgba(255, 152, 120, 0.25);
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
  background: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
}

.bot-panel {
  background: rgba(255, 255, 255, 0.75);
  border-radius: 28px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 2px dashed rgba(255, 171, 145, 0.5);
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
  background: rgba(255, 224, 210, 0.8);
}

.bubble.user {
  align-self: flex-end;
  background: rgba(255, 139, 106, 0.2);
}

.bubble.assistant {
  align-self: flex-start;
}

.bubble.typing p {
  font-style: italic;
  color: rgba(79, 42, 42, 0.7);
}

.bot-input {
  display: flex;
  gap: 10px;
}

.bot-input input {
  flex: 1;
  border-radius: 18px;
  border: 1px solid rgba(255, 171, 145, 0.6);
  padding: 10px 16px;
  font-size: 0.95rem;
  background: rgba(255, 255, 255, 0.9);
}

.bot-hint {
  font-size: 0.8rem;
  color: rgba(79, 42, 42, 0.7);
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
</style>
