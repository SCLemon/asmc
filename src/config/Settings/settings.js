import { UserIcon } from 'vorium-ui/icons'
export default [
    {
        title: '管理員列表',
        level: 10,
        block: [
            {
                title: '會員管理',
                icon: UserIcon,
                path: '/settings/admin/member-setting'
            },
            {
                title: '實驗室管理',
                icon: UserIcon,
                path: '/settings/admin/lab-setting'
            },
            {
                title: '儀器管理',
                icon: UserIcon,
                path: '/settings/admin/equipment-setting'
            },
        ]
    },
    {
        title: '使用者列表',
        level: 0,
        block: [
            {
                title: '個人資料維護',
                icon: UserIcon,
                path: '/profile',
            },
            {
                title: '實驗室資訊',
                icon: UserIcon,
                path: '/settings/user/lab-setting/edit'
            },
        ]
    },
]