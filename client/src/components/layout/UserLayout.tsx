import { Outlet } from 'react-router-dom';
import {
  BottomNav,
  HomeIcon,
  SearchIcon,
  CalendarIcon,
  HeartIcon,
  UserIcon,
} from '@/components/common';

const userNavItems = [
  {
    to: '/',
    label: '홈',
    icon: <HomeIcon />,
  },
  {
    to: '/search',
    label: '검색',
    icon: <SearchIcon />,
  },
  {
    to: '/my-trips',
    label: '내 여행',
    icon: <CalendarIcon />,
  },
  {
    to: '/favorites',
    label: '찜',
    icon: <HeartIcon />,
  },
  {
    to: '/profile',
    label: '마이',
    icon: <UserIcon />,
  },
];

export const UserLayout = () => {
  return (
    <div className="mobile-container">
      <main className="pb-16">
        <Outlet />
      </main>
      <BottomNav items={userNavItems} />
    </div>
  );
};
