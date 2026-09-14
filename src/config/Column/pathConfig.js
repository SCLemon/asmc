import { HomeIcon, ToolIcon, CalendarIcon, BookIcon, UserIcon, EditIcon, SettingIcon } from 'vorium-ui/icons'
export default {
    menu:[
        {
            name: 'Introduction',
            path: '/introduction',
            icon: HomeIcon,
        },
        {
            name: 'Experiment Records',
            path: '/experiment-records',
            icon: EditIcon,
        },
        {
            name: 'Reservation',
            path: '/reservation',
            icon: CalendarIcon,
        },
        {
            name: 'Cloud Materials',
            path: '/cloud',
            icon: BookIcon,
        },
        {
            name: 'Analysis Tools',
            path: '/analysis-tools',
            icon: ToolIcon,
        }
    ],
    setting:[
        {
            name: 'Profile',
            path: '/profile',
            icon: UserIcon,
        },
        {
            name: 'Settings Dashboard',
            path: '/settings',
            icon: SettingIcon,
        },
    ]
}