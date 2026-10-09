import { createRouter, createWebHashHistory } from 'vue-router'

import axios from 'axios'
import jsCookie from 'js-cookie'

import Introduction from '../pages/Introduction/Introduction.vue'
import Home from '../pages/Introduction/pages/Home.vue'
import Members from '../pages/Introduction/pages/Ｍembers.vue'
import Publications from '../pages/Introduction/pages/Publications.vue'
import Equipments from '../pages/Introduction/pages/Equipments.vue'

import UserLogin from '../pages/UserLogin/UserLogin.vue'

import Reservation from '../pages/Reservation/Reservation.vue'
import ExperimentRecord from '../pages/ExperimentRecord/ExperimentRecord.vue'
import EditExperimentRecord from '../pages/ExperimentRecord/pages/EditExperimentRecord.vue'


const routes = [
    {
      path: '/login',
      component: UserLogin,
    },
    {
      path: '/introduction',
      component: Introduction,
      children:[
        {
          path: 'home',
          component: Home,
        },
        {
          path: 'members',
          component: Members,
        },
        {
          path: 'publications',
          component: Publications,
        },
        {
          path: 'equipments',
          component: Equipments,
        },
        {
          path: '',
          redirect: '/introduction/home'
        }
      ]
    },
    {
      path: '/experiment-records',
      component: ExperimentRecord
    },
    {
      path: '/experiment-records/edit',
      component: EditExperimentRecord
    },
    {
      path: '/reservation',
      component: Reservation
    },
    {
      path: '/profile',
      component: () => import('../pages/Profile/Profile.vue'),
    },
    {
      path: '/cloud/:token?',
      component: () => import('../pages/Cloud/Cloud.vue'),
    },
    {
      path: '/analysis-tools',
      component: () => import('../pages/AnalysisTools/AnalysisTools.vue'),
    },
    {
      path: '/settings',
      component: () => import('../pages/Settings/Settings.vue'),
    },
    // setting by admin (Lazy Load)
    {
      path: '/settings/admin/member-setting',
      component: () => import('../pages/Settings/pages/byAdmin/MemberSetting/MemberSetting.vue')
    },
    {
      path: '/settings/admin/member-setting/edit',
      component: () => import('../pages/Settings/pages/byAdmin/MemberSetting/pages/EditMember.vue')
    },
    {
      path: '/settings/admin/lab-setting',
      component: () => import('../pages/Settings/pages/byAdmin/LabSetting/LabSetting.vue')
    },
    {
      path: '/settings/admin/lab-setting/edit',
      component: () => import('../pages/Settings/pages/byAdmin/LabSetting/pages/EditLab/EditLab.vue')
    },
    {
      path: '/settings/admin/equipment-setting',
      component: () => import('../pages/Settings/pages/byAdmin/EquipmentSetting/EquipmentSetting.vue')
    },
    {
      path: '/settings/admin/door-access-control',
      component: () => import('../pages/Settings/pages/byAdmin/DoorAccessControl/DoorAccessControl.vue')
    },
    // by superUser (Lazy Load)
    {
      path: '/settings/superUser/equipment-setting',
      component: () => import('../pages/Settings/pages/bySuperUser/EquipmentSetting/EquipmentSetting.vue')
    },
    // by user (Lazy Load)
    {
      path: '/settings/user/lab-setting/edit',
      component: () => import('../pages/Settings/pages/byUser/LabSetting/EditLab/EditLab.vue')
    },
    {
      path: '/settings/user/reservation-record',
      component: () => import('../pages/Settings/pages/byUser/ReservationRecord/ReservationRecord.vue')
    },
    {
      path: '/settings/user/affidavit',
      component: () => import('../pages/Settings/pages/byUser/Affidavit/Affidavit.vue')
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

import levelRoutes from '../config/Router/level_routes_config.js'

router.beforeEach(async (to, from) => {

  // 找出目前路徑的最高權限設定
  const requiredRoute = levelRoutes
    .filter((group) => {
      return group.paths.some((path) => to.path.includes(path));
    })
    .reduce((highest, current) => {
      if (!highest || (current.level ?? -1) > (highest.level ?? -1)) {
        return current;
      }
      return highest;
    }, null);

  // 無需驗證
  if (requiredRoute?.level === null) return true;

  // 找不到權限設定
  if (!requiredRoute) return true;

  const token = jsCookie.get('authToken');

  // 沒有 Token
  if (!token) {
    return { path: '/login', query: { redirect: to.fullPath } };
  }

  try {
    const res = await axios.post('/login/token', { save: false }, {
      headers: {
        'x-user-token': token
      }
    });

    const level = res.data?.data?.level ?? null;

    // Token 無效
    if (res.data.type !== 'success') {
      return { path: '/login', query: { redirect: to.fullPath } };
    }

    // 檢查路徑權限
    if (level < requiredRoute.level) {
      return { path: '/login', query: { redirect: to.fullPath } };
    }

    return true;

  } catch (e) {
    console.log(e);
    return { path: '/login', query: { redirect: to.fullPath } };
  }

});

export default router