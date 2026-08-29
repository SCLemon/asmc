import { createRouter, createWebHashHistory  } from 'vue-router'

import axios from 'axios'
import jsCookie from 'js-cookie'

import Introduction from '../pages/Introduction/Introduction.vue'
import Home from '../pages/Introduction/pages/Home.vue'
import Publications from '../pages/Introduction/pages/Publications.vue'
import AnalysisTools from '../pages/AnalysisTools/AnalysisTools.vue'
import UserLogin from '../pages/UserLogin/UserLogin.vue'

import Profile from '../pages/Profile/Profile.vue'

import Id_Vg_Analysis from '../pages/AnalysisTools/pages/Id_Vg_Analysis/Id_Vg_Analysis.vue'
import Id_Vd_Analysis from '../pages/AnalysisTools/pages/Id_Vd_Analysis/Id_Vd_Analysis.vue'
import Settings from '../pages/Settings/Settings.vue'

// setting by admin
import MemberSettingByAdmin from '../pages/Settings/pages/byAdmin/MemberSetting/MemberSetting.vue'
import EditMemberByAdmin from '../pages/Settings/pages/byAdmin/MemberSetting/pages/EditMember.vue'
import LabSettingByAdmin from '../pages/Settings/pages/byAdmin/LabSetting/LabSetting.vue'
import EditLabByAdmin from '../pages/Settings/pages/byAdmin/LabSetting/pages/EditLab/EditLab.vue'

// setting by user
import EditLabByUser from '../pages/Settings/pages/byUser/LabSetting/EditLab/EditLab.vue'

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
      path: '/profile',
      component: Profile
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
    // setting by admin
    {
      path: '/settings/admin/member-setting',
      component: MemberSettingByAdmin
    },
    {
      path: '/settings/admin/member-setting/edit',
      component: EditMemberByAdmin
    },
    {
      path: '/settings/admin/lab-setting',
      component: LabSettingByAdmin
    },
    {
      path: '/settings/admin/lab-setting/edit',
      component: EditLabByAdmin
    },

    // by user
    {
      path: '/settings/user/lab-setting/edit',
      component: EditLabByUser
    },

    {
      path: '/',
      redirect: '/introduction'
    },
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