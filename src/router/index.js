import { createRouter, createWebHashHistory  } from 'vue-router'

import axios from 'axios'
import jsCookie from 'js-cookie'

import Introduction from '../pages/Introduction/Introduction.vue'
import Home from '../pages/Introduction/pages/Home.vue'
import Publications from '../pages/Introduction/pages/Publications.vue'
import AnalysisTools from '../pages/AnalysisTools/AnalysisTools.vue'
import UserLogin from '../pages/UserLogin/UserLogin.vue'

import Id_Vg_Analysis from '../pages/AnalysisTools/pages/Id_Vg_Analysis/Id_Vg_Analysis.vue'
import Id_Vd_Analysis from '../pages/AnalysisTools/pages/Id_Vd_Analysis/Id_Vd_Analysis.vue'
import Settings from '../pages/Settings/Settings.vue'

import MemberSetting from '../pages/Settings/pages/MemberSetting/MemberSetting.vue'
import EditMember from '../pages/Settings/pages/MemberSetting/pages/EditMember.vue'
import LabSetting from '../pages/Settings/pages/LabSetting/LabSetting.vue'


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
          redirect: '/introduction/home'
        }
      ]
    },
    {
      path: '/analysis-tools',
      component: AnalysisTools,
    },
    {
      path: '/analysis-tools/id-vg-analysis-tool',
      component: Id_Vg_Analysis,
    },
    {
      path: '/analysis-tools/id-vd-analysis-tool',
      component: Id_Vd_Analysis,
    },
    {
      path: '/analysis-tools/id-vd-analysis-tool',
      component: Id_Vd_Analysis,
    },
    {
      path: '/user/login',
      component: UserLogin,
    },
    {
      path: '/settings',
      component: Settings,
    },
    {
      path: '/settings/member-setting',
      component: MemberSetting
    },
    {
      path: '/settings/member-setting/edit',
      component: EditMember
    },
    {
      path: '/settings/lab-setting',
      component: LabSetting
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

router.beforeEach(async (to, from) => {
  
  if(to.fullPath === '/user/login' || to.fullPath === '/introduction/home') return true;

  const token = jsCookie.get('authToken');

  if (!token && to.path !== '/user/login') {
    return { path: '/user/login', query: { redirect: to.fullPath } }
  }
  
  const res = await axios.post('/login/token',{ save: false },{
    headers:{
      'x-user-token': token
    }
  })

  if(res.data.type == 'success') return true;
  else{
    if (to.path !== '/user/login') {
      return { path: '/user/login', query: { redirect: to.fullPath } }
    }
  }
  

});

export default router