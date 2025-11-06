<template>
    <div class="customer-service-container">
        <header>
            <h1>联系我们</h1>
            <p>我们随时为您提供帮助。请选择以下方式与我们联系。</p>
        </header>

        <div class="contact-options">
            <div class="contact-card">
                <img src="https://img.100sucai.com/2024/01/13/18/39/100601.jpg" alt="人工客服" />
                <h2>人工客服</h2>
                <p>与我们的支持团队成员实时交谈。</p>
                <button @click="openManualService">立即联系人工客服</button>
            </div>

            <div class="contact-card">
                <img src="https://img.100sucai.com/2024/01/13/18/39/100601.jpg" alt="QQ" />
                <h2>QQ</h2>
                <p>通过QQ联系我们，快速获得帮助。</p>
                <button @click="openQQ">联系我</button>
            </div>
        </div>

        <div class="faq-section">
            <h2>常见问题</h2>
            <ul>
                <li>
                    <strong>如何注册账户？</strong>
                    <p>您可以在我们的网站首页点击“注册”按钮，按照提示完成注册流程。</p>
                </li>
                <li>
                    <strong>忘记密码怎么办？</strong>
                    <p>在登录页面点击“忘记密码”，通过绑定的邮箱或手机号可以重置密码。</p>
                </li>
                <li>
                    <strong>如何联系技术支持？</strong>
                    <p>您可以选择上方的人工客服或QQ渠道，我们的技术支持团队会尽快为您解答。</p>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const manualServiceQQ = ref('10086'); 

const openManualService = () => {
    const qqUrl = `https://wpa.qq.com/msgrd?v=3&uin=${manualServiceQQ.value}&site=qq&menu=yes`;
    window.open(qqUrl, '_blank', 'noreferrer');
};

const openQQ = () => {
    const qqUrl = `https://wpa.qq.com/msgrd?v=3&uin=1008611&site=qq&menu=yes`;
    window.open(qqUrl, '_blank', 'noreferrer');
};
</script>

<style scoped>
.customer-service-container {
    max-width: 800px;
    margin: 2rem auto;
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
}

header {
    text-align: center;
    margin-bottom: 2rem;
}

header h1 {
    font-size: 2.5rem;
    color: #333;
}

header p {
    font-size: 1.1rem;
    color: #666;
}

.contact-options {
    display: flex;
    justify-content: space-around;
    gap: 1rem;
    margin-bottom: 2rem;
}

.contact-card {
    background-color: #fff;
    padding: 1.5rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    text-align: center;
    flex: 1;
    transition: transform 0.3s;
}

.contact-card:hover {
    transform: translateY(-5px);
}

.contact-card img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-bottom: 1rem;
}

.contact-card h2 {
    font-size: 1.5rem;
    color: #333;
    margin-bottom: 0.5rem;
}

.contact-card p {
    color: #666;
    margin-bottom: 1rem;
}

.contact-card button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s;
}

.contact-card button:hover {
    background-color: #0056b3;
}

.faq-section {
    background-color: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.faq-section h2 {
    font-size: 2rem;
    color: #333;
    margin-bottom: 1.5rem;
    text-align: center;
}

.faq-section ul {
    list-style: none;
    padding: 0;
}

.faq-section li {
    margin-bottom: 1.5rem;
}

.faq-section li strong {
    font-size: 1.2rem;
    color: #007bff;
    display: block;
    margin-bottom: 0.5rem;
}

.faq-section li p {
    color: #666;
    line-height: 1.6;
}
</style>
