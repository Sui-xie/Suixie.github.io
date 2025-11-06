<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const aiServiceUrl = 'https://example.com/ai-service'
const manualServiceQQ = '123456789'

const openAiService = () => {
  window.open(aiServiceUrl, '_blank', 'noreferrer')
}

const openManualService = () => {
  const qqUrl = `https://wpa.qq.com/msgrd?v=3&uin=${manualServiceQQ}&site=qq&menu=yes`
  window.open(qqUrl, '_blank', 'noreferrer')
}

onMounted(() => {
  document.title = '幽柠的小站 · 客服角落'
})
</script>

<template>
  <main class="support-page">
    <button class="back-link" @click="router.back()">← 回到上一页</button>

    <section class="intro-card">
      <div class="intro-avatar" aria-hidden="true">🌿</div>
      <div class="intro-content">
        <h1>幽柠的小客栈客服角落</h1>
        <p>
          嗨～欢迎来到我的小站后台。如果你遇到问题，先看看下方的两个入口：
          AI 小助手负责答疑解惑，而我会在 QQ 上继续跟进。
        </p>
        <ul class="intro-highlights">
          <li>真·个人站点，所有服务都由我亲自维护</li>
          <li>提供轻量 AI 对话，日常问题几乎都能搞定</li>
          <li>需要真人？点个按钮就能直接加我 QQ</li>
        </ul>
      </div>
    </section>

    <section class="support-grid">
      <article class="support-card ai">
        <header class="card-header">
          <span class="card-tag">AI 小助手</span>
          <h2>幽幽的树洞</h2>
          <p>
            这是我自己折腾的迷你模型，适合快速咨询、记录灵感或吐槽心情。
            它会整理常见问题，也会把重要的需求转发给我。
          </p>
        </header>
        <ul class="card-list">
          <li>随时在线，回复速度嗖嗖的</li>
          <li>懂我的世界观和站点设定</li>
          <li>可根据需求更换为你自己的模型地址</li>
        </ul>
        <button class="primary" @click="openAiService">和幽幽聊聊</button>
        <small class="card-tip">Tips：模型接口在代码里可自行替换成你的轻量模型。</small>
      </article>

      <article class="support-card human">
        <header class="card-header">
          <span class="card-tag">人工支援</span>
          <h2>找幽柠本人聊聊</h2>
          <p>
            有些情况还是人工靠谱。点按钮就能打开 QQ 聊天窗，也可以记下号码稍后联系。
          </p>
        </header>
        <div class="manual-contact">
          <span class="label">QQ：</span>
          <span class="value">{{ manualServiceQQ }}</span>
        </div>
        <button class="secondary" @click="openManualService">联系我</button>
        <small class="card-tip">工作日晚上和周末白天都在，回复不秒回也会尽快。</small>
      </article>
    </section>

    <section class="extra-notes">
      <h3>一些小提醒</h3>
      <ul>
        <li>如果是 bug，最好附上截图或报错提示，这样我能更快定位。</li>
        <li>提交需求时告诉我你期待的效果，手绘草图也完全没问题。</li>
        <li>
          更多幕后细节，可以翻阅
          <a href="https://example.com/help" target="_blank" rel="noopener">我的折腾笔记</a>。
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.support-page {
  min-height: 100vh;
  padding: 40px 20px 72px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  background: radial-gradient(circle at top, rgba(255, 232, 210, 0.6), rgba(255, 255, 255, 0.95));
}

.back-link {
  align-self: flex-start;
  background: transparent;
  border: none;
  color: #6a4432;
  font-size: 0.95rem;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.back-link:hover {
  background: rgba(106, 68, 50, 0.15);
}

.intro-card {
  max-width: 920px;
  margin: 0 auto;
  display: grid;
  gap: 20px;
  grid-template-columns: minmax(80px, 120px) 1fr;
  align-items: center;
  padding: 32px;
  border-radius: 28px;
  background: linear-gradient(135deg, rgba(255, 214, 182, 0.8), rgba(255, 255, 255, 0.95));
  box-shadow: 0 24px 48px rgba(222, 140, 90, 0.18);
}

.intro-avatar {
  width: 100px;
  height: 100px;
  border-radius: 32px;
  display: grid;
  place-items: center;
  font-size: 2.4rem;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 0 16px 30px rgba(222, 140, 90, 0.24);
}

.intro-content h1 {
  margin: 0 0 12px;
  font-size: 2.2rem;
  color: #4a2e20;
}

.intro-content p {
  margin: 0 0 12px;
  color: #5f4635;
  line-height: 1.7;
}

.intro-highlights {
  margin: 0;
  padding-left: 18px;
  color: #5b3f30;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.support-grid {
  max-width: 920px;
  margin: 0 auto;
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.support-card {
  background: #fff7ef;
  border-radius: 24px;
  padding: 28px;
  box-shadow: 0 20px 40px rgba(222, 140, 90, 0.15);
  display: flex;
  flex-direction: column;
  gap: 18px;
  border: 1px solid rgba(255, 194, 145, 0.45);
}

.support-card.ai {
  background: linear-gradient(140deg, rgba(255, 236, 206, 0.95), rgba(255, 255, 255, 0.95));
}

.support-card.human {
  background: linear-gradient(140deg, rgba(205, 222, 255, 0.9), rgba(255, 255, 255, 0.95));
}

.card-header h2 {
  margin: 8px 0 10px;
  font-size: 1.8rem;
  color: #472a1b;
}

.card-header p {
  margin: 0;
  color: #5a4132;
  line-height: 1.6;
}

.card-tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(255, 194, 145, 0.45);
  color: #8a4e26;
}

.support-card.human .card-tag {
  background: rgba(160, 189, 255, 0.45);
  color: #35528d;
}

.card-list {
  margin: 0;
  padding-left: 18px;
  color: #5b3f30;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.primary,
.secondary {
  align-self: flex-start;
  padding: 12px 28px;
  border-radius: 999px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border: none;
  font-size: 1rem;
}

.primary {
  background: linear-gradient(135deg, #ffb36a, #f77f94);
  color: #fff;
  box-shadow: 0 12px 24px rgba(247, 127, 148, 0.25);
}

.secondary {
  background: #ffffff;
  color: #38507c;
  border: 2px dashed rgba(56, 80, 124, 0.45);
  box-shadow: 0 12px 22px rgba(56, 80, 124, 0.18);
}

.primary:hover,
.secondary:hover {
  transform: translateY(-1px);
  box-shadow: 0 14px 26px rgba(0, 0, 0, 0.12);
}

.card-tip {
  color: #776052;
}

.manual-contact {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  color: #3d2a1d;
}

.manual-contact .label {
  font-weight: 600;
  color: #6f4b31;
}

.manual-contact .value {
  letter-spacing: 0.08em;
}

.extra-notes {
  max-width: 920px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 20px;
  padding: 28px;
  border: 1px dashed rgba(255, 194, 145, 0.6);
  box-shadow: 0 16px 34px rgba(222, 140, 90, 0.12);
}

.extra-notes h3 {
  margin: 0 0 12px;
  color: #4a2e20;
}

.extra-notes ul {
  margin: 0;
  padding-left: 18px;
  color: #5f4635;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.extra-notes a {
  color: #f77f94;
  font-weight: 600;
  text-decoration: underline;
}

@media (max-width: 640px) {
  .support-page {
    padding: 28px 16px 56px;
  }

  .intro-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .intro-avatar {
    margin: 0 auto;
  }

  .intro-highlights {
    text-align: left;
  }

  .back-link {
    position: relative;
    left: 0;
  }
}
</style>
