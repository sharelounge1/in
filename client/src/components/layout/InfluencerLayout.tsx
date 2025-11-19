import { Outlet } from 'react-router-dom';
import {
  BottomNav,
  HomeIcon,
  PlusIcon,
  CalendarIcon,
  ChartIcon,
  UserIcon,
} from '@/components/common';

const influencerNavItems = [
  {
    to: '/influencer',
    label: '대시보드',
    icon: <HomeIcon />,
  },
  {
    to: '/influencer/create',
    label: '여행 만들기',
    icon: <PlusIcon />,
  },
  {
    to: '/influencer/trips',
    label: '내 여행',
    icon: <CalendarIcon />,
  },
  {
    to: '/influencer/analytics',
    label: '통계',
    icon: <ChartIcon />,
  },
  {
    to: '/influencer/profile',
    label: '프로필',
    icon: <UserIcon />,
  },
];

export const InfluencerLayout = () => {
  return (
    <div className="mobile-container">
      <main className="pb-16">
        <Outlet />
      </main>
      <BottomNav items={influencerNavItems} />
    </div>
  );
};
