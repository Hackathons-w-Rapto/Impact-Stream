import { IconLayoutDashboard } from '@tabler/icons-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: IconLayoutDashboard,
        },
      ],
    },
    {
      title: 'Admin',
      items: [
        {
          title: 'Admin Dashboard',
          url: '/admin',
          icon: IconLayoutDashboard,
        },
      ],
    },
  ],
}
