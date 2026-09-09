import { createRouter, createWebHashHistory  } from 'vue-router'

import axios from 'axios'
import jsCookie from 'js-cookie'

import Introduction from '../pages/Introduction/Introduction.vue'
import Home from '../pages/Introduction/pages/Home.vue'
import Publications from '../pages/Introduction/pages/Publications.vue'
import AnalysisTools from '../pages/AnalysisTools/AnalysisTools.vue'
import UserLogin from '../pages/UserLogin/UserLogin.vue'

import Profile from '../pages/Profile/Profile.vue'
import Reservation from '../pages/Reservation/Reservation.vue'
import Cloud from '../pages/Cloud/Cloud.vue'

import Settings from '../pages/Settings/Settings.vue'

// setting by admin
import MemberSettingByAdmin from '../pages/Settings/pages/byAdmin/MemberSetting/MemberSetting.vue'
import EditMemberByAdmin from '../pages/Settings/pages/byAdmin/MemberSetting/pages/EditMember.vue'
import LabSettingByAdmin from '../pages/Settings/pages/byAdmin/LabSetting/LabSetting.vue'
import EditLabByAdmin from '../pages/Settings/pages/byAdmin/LabSetting/pages/EditLab/EditLab.vue'
import EquipmentSettingByAdmin from '../pages/Settings/pages/byAdmin/EquipmentSetting/EquipmentSetting.vue'
import DoorAccessControl from '../pages/Settings/pages/byAdmin/DoorAccessControl/DoorAccessControl.vue'

// setting by superUser
import EquipmentSettingBySuperUser from '../pages/Settings/pages/bySuperUser/EquipmentSetting/EquipmentSetting.vue'

// setting by user
import EditLabByUser from '../pages/Settings/pages/byUser/LabSetting/EditLab/EditLab.vue'
import ReservationRecordByUser from '../pages/Settings/pages/byUser/ReservationRecord/ReservationRecord.vue'


// underConstruction
import UnderConstruction from '../pages/UnderConstruction/UnderConstruction.vue'

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
      path: '/experimental-records',
      component: UnderConstruction
    },
    {
      path: '/reservation',
      component: Reservation
    },
    {
      path: '/cloud/:token?',
      component: Cloud
    },
    {
      path: '/analysis-tools',
      component: AnalysisTools,
    },
    {
      path: '/analysis-tools/id-vg-analysis-tool',
      component: () => import('../pages/AnalysisTools/pages/Id_Vg_Analysis/Id_Vg_Analysis.vue')
    },
    {
      path: '/analysis-tools/id-vd-analysis-tool',
      component: () => import('../pages/AnalysisTools/pages/Id_Vd_Analysis/Id_Vd_Analysis.vue')
    },
    {
      path: '/login',
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
    {
      path: '/settings/admin/equipment-setting',
      component: EquipmentSettingByAdmin
    },
    {
      path: '/settings/admin/door-access-control',
      component: DoorAccessControl
    },
    // by superUser
    {
      path: '/settings/superUser/equipment-setting',
      component: EquipmentSettingBySuperUser
    },
    // by user
    {
      path: '/settings/user/lab-setting/edit',
      component: EditLabByUser
    },
    {
      path: '/settings/user/reservation-record',
      component: ReservationRecordByUser
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