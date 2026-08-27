import { UserIcon } from 'vorium-ui/icons'
export default [
    {
        title: '管理員列表',
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
        ]
    },
    {
        title: '使用者列表',
        block: [
            {
                title: '個人資料維護',
                icon: UserIcon,
                path: '/settings/user/member-setting'
            },
            {
                title: '實驗室狀態',
                icon: UserIcon,
                path: '/settings/user/lab-setting'
            },
        ]
    },
]