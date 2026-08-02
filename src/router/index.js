import { createRouter, createWebHashHistory  } from 'vue-router'
import Introduction from '../pages/Introduction/Introduction.vue'
import Home from '../pages/Introduction/pages/Home.vue'
import Publications from '../pages/Introduction/pages/Publications.vue'
const routes = [
    {
        path: '/introduction',
        component: Introduction,
        children:[
          {
            path: 'home',
            component: Home,
          },
          {
            path: 'publications',
            component: Publications,
          },
          {
            path: '',
            redirect: 'introduction/home'
          }
        ]
    },
    {
        path: '/',
        redirect: '/introduction'
    },
    // {
    //   path: '/:pathMatch(.*)*',
    //   redirect: '/'
    // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  next()
})

export default router