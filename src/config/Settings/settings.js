import { UserIcon, FlaskIcon, SettingsIcon, HomeUnlockIcon, CalendarIcon, EditIcon } from 'vorium-ui/icons'
export default [
    {
        title: '平台管理員列表',
        level: 10,
        block: [
            {
                title: '會員管理',
                icon: UserIcon,
                path: '/settings/admin/member-setting'
            },
            {
                title: '實驗室管理',
                icon: FlaskIcon,
                path: '/settings/admin/lab-setting'
            },
            {
                title: '儀器管理',
                icon: SettingsIcon,
                path: '/settings/admin/equipment-setting'
            },
            {
                title: '門禁管理',
                icon: HomeUnlockIcon,
                path: '/settings/admin/door-access-control'
            },
        ]
    },
    {
        title: '儀器管理員列表',
        level: 4,
        block: [
            {
                title: '儀器管理',
                icon: SettingsIcon,
                path: '/settings/superUser/equipment-setting'
            },
        ]
    },
    {
        title: '使用者列表',
        level: 1,
        block: [
            {
                title: '個人資料維護',
                icon: UserIcon,
                path: '/profile',
            },
            {
                title: '實驗室資訊',
                icon: FlaskIcon,
                path: '/settings/user/lab-setting/edit'
            },
            {
                title: '預約記錄',
                icon: CalendarIcon,
                path: '/settings/user/reservation-record'
            },
            {
                title: '切結書簽核',
                icon: EditIcon,
                path: '/settings/user/affidavit'
            },
        ]
    },
]