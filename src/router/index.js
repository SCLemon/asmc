import { createRouter, createWebHashHistory  } from 'vue-router'
import Introduction from '../pages/Introduction/Introduction.vue'
const routes = [
    {
        path: '/introduction',
        component: Introduction
    },
    {
        path: '/',
        redirect: '/introduction'
    }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

export default router