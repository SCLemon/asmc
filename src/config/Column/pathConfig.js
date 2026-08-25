import { HomeIcon, ToolIcon, CalendarIcon, BookIcon, UserIcon, EditIcon, SettingIcon } from 'vorium-ui/icons'
export default {
    menu:[
        {
            name: 'Introduction',
            path: '/introduction',
            icon: HomeIcon,
        },
        {
            name: 'Experimental Records',
            path: '/experimental-records',
            icon: EditIcon,
        },
        {
            name: 'Machine Reservation',
            path: '/machine-reservation',
            icon: CalendarIcon,
        },
        {
            name: 'Cloud Materials',
            path: '/cloud-materials',
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