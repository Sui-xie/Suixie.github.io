import {createRouter, createWebHashHistory, } from 'vue-router'

const home = () => import('../components/Home.vue')
const register = () => import('../components/register.vue')
const  login = () => import('../components/NewLogin.vue')
const recover = () => import('../components/recover.vue')
const sign = () => import('../components/sign.vue')
const bindCode = () => import('../components/bindCode.vue')

const routes = [
    { path: '/', component: home },
    { path: '/register', component: register },
    { path: '/login', component: login },
    { path: '/recover', component: recover },
    { path: '/sign', component: sign },
    { path: '/bindCode', component: bindCode },

]

const router = createRouter({
    history: createWebHashHistory(),
    routes
})

export default router