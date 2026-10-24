import { createRouter, createWebHashHistory, createWebHistory} from 'vue-router'

import axios from 'axios'
import jsCookie from 'js-cookie'

import Introduction from '../pages/Introduction/Introduction.vue'
import Home from '../pages/Introduction/pages/Home.vue'
import Members from '../pages/Introduction/pages/Ｍembers.vue'
import Publications from '../pages/Introduction/pages/Publications.vue'
import Equipments from '../pages/Introduction/pages/Equipments.vue'
import Contact from '../pages/Introduction/pages/Contact.vue'

import UserLogin from '../pages/UserLogin/UserLogin.vue'

import Reservation from '../pages/Reservation/Reservation.vue'
import ExperimentRecord from '../pages/ExperimentRecord/ExperimentRecord.vue'
import EditExperimentRecord from '../pages/ExperimentRecord/pages/EditExperimentRecord.vue'

import Cloud from '../pages/Cloud/Cloud.vue'

const routes = [
    {
      path: '/login',
      component: UserLogin,
      meta: {
        title: 'ASMC LAB｜登入',
        description: '登入 ASMC 實驗室網站，使用實驗室系統服務。',
        keywords: 'ASMC, ASMC Lab, 登入'
      }
    },
    {
      path: '/introduction',
      component: Introduction,
      meta: {
        title: 'ASMC LAB | 國立清華大學電子工程研究所葉昭輝教授實驗室',
        description: 'ASMC LAB | 國立清華大學電子工程研究所葉昭輝教授實驗室。',
        keywords: 'ASMC, ASMC Lab, 實驗室, 研究, 學術研究'
      },
      children:[
        {
          path: 'home',
          component: Home,
          meta: {
            title: 'ASMC LAB | 國立清華大學電子工程研究所葉昭輝教授實驗室',
            description: 'ASMC LAB | 國立清華大學電子工程研究所葉昭輝教授實驗室。',
            keywords: 'ASMC, ASMC Lab, 實驗室首頁, 研究方向'
          }
        },
        {
          path: 'members',
          component: Members,
          meta: {
            title: 'ASMC LAB｜研究團隊與成員',
            description: '認識 ASMC 的研究團隊、實驗室成員與研究人員。',
            keywords: 'ASMC, ASMC Lab, 研究團隊, 實驗室成員, 研究人員'
          }
        },
        {
          path: 'publications',
          component: Publications,
          meta: {
            title: 'ASMC LAB｜學術論文與研究發表',
            description: '瀏覽 ASMC 的學術論文、研究出版品與學術研究成果。',
            keywords: 'ASMC, ASMC Lab, 學術論文, 研究發表, 學術出版'
          }
        },
        {
          path: 'equipments',
          component: Equipments,
          meta: {
            title: 'ASMC LAB｜研究設備與儀器',
            description: '了解 ASMC 的研究設備、實驗儀器與相關研究資源。',
            keywords: 'ASMC, ASMC Lab, 研究設備, 實驗儀器, 研究資源'
          }
        },
        {
          path: 'contact',
          component: Contact,
          meta: {
            title: 'ASMC LAB｜聯絡我們',
            description: '取得 ASMC 的聯絡資訊，了解實驗室相關資訊與研究合作事宜。',
            keywords: 'ASMC, ASMC Lab, 聯絡資訊, 研究合作'
          }
        },
        {
          path: '',
          redirect: '/introduction/home'
        }
      ]
    },
    {
      path: '/experiment-records',
      component: ExperimentRecord,
      meta: {
        title: 'ASMC LAB｜實驗紀錄',
        description: 'ASMC 實驗紀錄系統。',
        keywords: 'ASMC, 實驗紀錄'
      }
    },
    {
      path: '/experiment-records/edit',
      component: EditExperimentRecord,
      meta: {
        title: 'ASMC LAB｜編輯實驗紀錄',
        description: '編輯 ASMC 實驗紀錄。',
        keywords: 'ASMC, 編輯實驗紀錄'
      }
    },
    {
      path: '/reservation',
      component: Reservation,
      meta: {
        title: 'ASMC LAB｜設備預約',
        description: 'ASMC 實驗室設備預約系統。',
        keywords: 'ASMC, 設備預約'
      }
    },
    {
      path: '/profile',
      component: () => import('../pages/Profile/Profile.vue'),
      meta: {
        title: 'ASMC LAB｜個人資料維護',
        description: '管理 ASMC 使用者個人資料。',
        keywords: 'ASMC, 個人資料'
      }
    },
    {
      path: '/cloud/:token?',
      component: Cloud,
      meta: {
        title: 'ASMC LAB｜雲端硬碟',
        description: 'ASMC 雲端檔案管理系統。',
        keywords: 'ASMC, 雲端硬碟, 檔案管理'
      }
    },
    {
      path: '/analysis-tools',
      component: () => import('../pages/AnalysisTools/AnalysisTools.vue'),
      meta: {
        title: 'ASMC LAB｜分析工具',
        description: 'ASMC 研究分析工具。',
        keywords: 'ASMC, 分析工具'
      }
    },
    {
      path: '/settings',
      component: () => import('../pages/Settings/Settings.vue'),
      meta: {
        title: 'ASMC LAB｜系統設定',
        description: 'ASMC 系統設定。',
        keywords: 'ASMC, 系統設定'
      }
    },
    // setting by admin (Lazy Load)
    {
      path: '/settings/admin/member-setting',
      component: () => import('../pages/Settings/pages/byAdmin/MemberSetting/MemberSetting.vue'),
      meta: {
        title: 'ASMC LAB｜會員管理',
        description: 'ASMC 管理員成員管理功能。',
        keywords: 'ASMC, 成員管理'
      }
    },
    {
      path: '/settings/admin/member-setting/edit',
      component: () => import('../pages/Settings/pages/byAdmin/MemberSetting/pages/EditMember.vue'),
      meta: {
        title: 'ASMC LAB｜編輯成員',
        description: 'ASMC 管理員編輯成員資料。',
        keywords: 'ASMC, 編輯成員'
      }
    },
    {
      path: '/settings/admin/lab-setting',
      component: () => import('../pages/Settings/pages/byAdmin/LabSetting/LabSetting.vue'),
      meta: {
        title: 'ASMC LAB｜實驗室管理',
        description: 'ASMC 管理員實驗室設定。',
        keywords: 'ASMC, 實驗室管理'
      }
    },
    {
      path: '/settings/admin/lab-setting/edit',
      component: () => import('../pages/Settings/pages/byAdmin/LabSetting/pages/EditLab/EditLab.vue'),
      meta: {
        title: 'ASMC LAB｜編輯實驗室',
        description: 'ASMC 管理員編輯實驗室資料。',
        keywords: 'ASMC, 編輯實驗室'
      }
    },
    {
      path: '/settings/admin/equipment-setting',
      component: () => import('../pages/Settings/pages/byAdmin/EquipmentSetting/EquipmentSetting.vue'),
      meta: {
        title: 'ASMC LAB｜儀器管理',
        description: 'ASMC 管理員設備管理功能。',
        keywords: 'ASMC, 設備管理'
      }
    },
    {
      path: '/settings/admin/tool-setting',
      component: () => import('../pages/Settings/pages/byAdmin/ToolSetting/ToolSetting.vue'),
      meta: {
        title: 'ASMC LAB｜工具管理',
        description: 'ASMC 管理員工具管理功能。',
        keywords: 'ASMC, 工具管理'
      }
    },
    {
      path: '/settings/admin/tool-setting/edit',
      component: () => import('../pages/Settings/pages/byAdmin/ToolSetting/pages/EditTool.vue'),
      meta: {
        title: 'ASMC LAB｜編輯工具',
        description: 'ASMC 管理員編輯工具資料。',
        keywords: 'ASMC, 編輯工具'
      }
    },
    {
      path: '/settings/admin/door-access-control',
      component: () => import('../pages/Settings/pages/byAdmin/DoorAccessControl/DoorAccessControl.vue'),
      meta: {
        title: 'ASMC LAB｜門禁管理',
        description: 'ASMC 管理員門禁管理功能。',
        keywords: 'ASMC, 門禁管理'
      }
    },
    // by superUser (Lazy Load)
    {
      path: '/settings/superUser/equipment-setting',
      component: () => import('../pages/Settings/pages/bySuperUser/EquipmentSetting/EquipmentSetting.vue'),
      meta: {
        title: 'ASMC LAB｜儀器管理',
        description: 'ASMC 設備設定功能。',
        keywords: 'ASMC, 設備設定'
      }
    },
    // by user (Lazy Load)
    {
      path: '/settings/user/lab-setting/edit',
      component: () => import('../pages/Settings/pages/byUser/LabSetting/EditLab/EditLab.vue'),
      meta: {
        title: 'ASMC LAB｜實驗室資訊',
        description: 'ASMC 使用者實驗室資料設定。',
        keywords: 'ASMC, 實驗室資訊'
      }
    },
    {
      path: '/settings/user/reservation-record',
      component: () => import('../pages/Settings/pages/byUser/ReservationRecord/ReservationRecord.vue'),
      meta: {
        title: 'ASMC LAB｜預約紀錄',
        description: '查看 ASMC 的預約紀錄。',
        keywords: 'ASMC, 預約紀錄'
      }
    },
    {
      path: '/settings/user/affidavit',
      component: () => import('../pages/Settings/pages/byUser/Affidavit/Affidavit.vue'),
      meta: {
        title: 'ASMC LAB｜切結書簽核',
        description: 'ASMC 使用聲明與切結書簽核。',
        keywords: 'ASMC, 使用聲明, 切結書簽核'
      }
    },
    {
      path: '/',
      redirect: '/introduction'
    },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.afterEach((to) => {
    const defaultTitle = 'ASMC LAB | 國立清華大學電子工程研究所葉昭輝教授實驗室'
    const defaultDescription = 'ASMC LAB | 國立清華大學電子工程研究所葉昭輝教授實驗室。'
    const siteUrl = 'https://asmclab.ai'

    const title = to.meta.title || defaultTitle
    const description = to.meta.description || defaultDescription
    const canonicalUrl = `${siteUrl}${to.path}`

    document.title = title

    const updateMeta = (name, content) => {
        let element = document.querySelector(`meta[name="${name}"]`)

        if (!element) {
            element = document.createElement('meta')
            element.setAttribute('name', name)
            document.head.appendChild(element)
        }

        element.setAttribute('content', content)
    }

    const updateProperty = (property, content) => {
        let element = document.querySelector(`meta[property="${property}"]`)

        if (!element) {
            element = document.createElement('meta')
            element.setAttribute('property', property)
            document.head.appendChild(element)
        }

        element.setAttribute('content', content)
    }

    const updateCanonical = (href) => {
        let element = document.querySelector('link[rel="canonical"]')

        if (!element) {
            element = document.createElement('link')
            element.setAttribute('rel', 'canonical')
            document.head.appendChild(element)
        }

        element.setAttribute('href', href)
    }

    updateMeta('description', description)
    updateMeta('keywords', to.meta.keywords || 'ASMC')

    updateProperty('og:title', title)
    updateProperty('og:description', description)
    updateProperty('og:url', canonicalUrl)
    updateProperty('og:type', 'website')
    updateProperty('og:site_name', 'ASMC LAB')

    updateCanonical(canonicalUrl)
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