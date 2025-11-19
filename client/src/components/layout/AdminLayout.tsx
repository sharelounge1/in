import { Outlet } from 'react-router-dom';
import {
  Sidebar,
  DashboardIcon,
  UsersIcon,
  CalendarIcon,
  MoneyIcon,
  SettingsIcon,
} from '@/components/common';

const adminSidebarSections = [
  {
    title: '메인',
    items: [
      {
        to: '/admin',
        label: '대시보드',
        icon: <DashboardIcon />,
      },
    ],
  },
  {
    title: '관리',
    items: [
      {
        to: '/admin/users',
        label: '회원 관리',
        icon: <UsersIcon />,
      },
      {
        to: '/admin/trips',
        label: '여행 관리',
        icon: <CalendarIcon />,
      },
      {
        to: '/admin/settlements',
        label: '정산 관리',
        icon: <MoneyIcon />,
      },
    ],
  },
  {
    title: '설정',
    items: [
      {
        to: '/admin/settings',
        label: '시스템 설정',
        icon: <SettingsIcon />,
      },
    ],
  },
];

export const AdminLayout = () => {
  return (
    <div className="flex h-screen bg-background-light">
      <Sidebar
        sections={adminSidebarSections}
        header={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-primary-start to-primary-end flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-text-primary">관리자</span>
          </div>
        }
      />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};
