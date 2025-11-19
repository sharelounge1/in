import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useUser';

// Icons
const SettingsIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
  </svg>
);

const CardIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const HelpIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ClipboardNavIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const BellNavIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const MyPagePage = () => {
  const { user } = useAuthStore();
  const { logout } = useAuth();
  const { data: profileData } = useProfile();

  // Mock user data
  const userData = {
    name: user?.name || '김민수',
    email: user?.email || 'minsu.kim@email.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    stats: {
      travels: 5,
      reviews: 3,
      favorites: 12,
    },
    upcomingTrip: {
      title: '제주 힐링 3박 4일',
      date: '2025.01.25 - 01.28',
    },
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
        <span className="font-semibold">마이페이지</span>
        <button>
          <SettingsIcon />
        </button>
      </header>

      {/* Content */}
      <div className="pb-20">
        {/* Profile Section */}
        <div className="py-8 text-center bg-white">
          <div className="relative inline-block mb-4">
            <img
              src={userData.avatar}
              alt={userData.name}
              className="object-cover w-22 h-22 rounded-full"
              style={{ width: '88px', height: '88px' }}
            />
            <div className="absolute bottom-0 right-0 flex items-center justify-center w-7 h-7 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full border-[3px] border-white">
              <CheckIcon />
            </div>
          </div>
          <h2 className="mb-1 text-xl font-bold">{userData.name}</h2>
          <p className="text-sm text-gray-500">{userData.email}</p>
        </div>

        {/* Stats Section */}
        <div className="relative grid grid-cols-3 p-5 mx-5 -mt-5 bg-white shadow-md rounded-xl">
          <div className="relative text-center">
            <p className="mb-1 text-xl font-bold text-purple-600">{userData.stats.travels}</p>
            <p className="text-xs text-gray-500">참여 여행</p>
            <div className="absolute right-0 w-px h-8 -translate-y-1/2 bg-gray-100 top-1/2" />
          </div>
          <div className="relative text-center">
            <p className="mb-1 text-xl font-bold text-purple-600">{userData.stats.reviews}</p>
            <p className="text-xs text-gray-500">작성 후기</p>
            <div className="absolute right-0 w-px h-8 -translate-y-1/2 bg-gray-100 top-1/2" />
          </div>
          <div className="text-center">
            <p className="mb-1 text-xl font-bold text-purple-600">{userData.stats.favorites}</p>
            <p className="text-xs text-gray-500">찜한 코스</p>
          </div>
        </div>

        {/* Upcoming Trip */}
        <div className="p-5 mx-5 mt-5 text-white bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl">
          <p className="mb-2 text-xs opacity-90">다가오는 여행</p>
          <p className="mb-1 font-semibold">{userData.upcomingTrip.title}</p>
          <p className="mb-3 text-sm opacity-90">{userData.upcomingTrip.date}</p>
          <Link
            to="/active-travels"
            className="inline-block px-4 py-2 text-sm font-medium bg-white rounded-full bg-opacity-20"
          >
            상세보기
          </Link>
        </div>

        {/* Menu Section - My Activities */}
        <div className="mt-6">
          <p className="px-5 mb-2 text-xs font-semibold text-gray-500">내 활동</p>
          <div className="bg-white">
            <Link to="/my-applications" className="flex items-center px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-center w-10 h-10 mr-3 bg-gray-100 rounded-lg">
                <ClipboardIcon />
              </div>
              <div className="flex-1">
                <p className="font-medium">내 신청 내역</p>
                <p className="text-sm text-gray-500">신청한 코스와 파티</p>
              </div>
              <ChevronRightIcon />
            </Link>
            <Link to="/active-travels" className="flex items-center px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-center w-10 h-10 mr-3 bg-gray-100 rounded-lg">
                <GlobeIcon />
              </div>
              <div className="flex-1">
                <p className="font-medium">진행중인 여행</p>
                <p className="text-sm text-gray-500">현재 진행중인 여행 목록</p>
              </div>
              <ChevronRightIcon />
            </Link>
            <Link to="/payments" className="flex items-center px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-center w-10 h-10 mr-3 bg-gray-100 rounded-lg">
                <CardIcon />
              </div>
              <div className="flex-1">
                <p className="font-medium">결제 내역</p>
                <p className="text-sm text-gray-500">결제 및 환불 내역</p>
              </div>
              <ChevronRightIcon />
            </Link>
            <Link to="/reviews" className="flex items-center px-5 py-4">
              <div className="flex items-center justify-center w-10 h-10 mr-3 bg-gray-100 rounded-lg">
                <StarIcon />
              </div>
              <div className="flex-1">
                <p className="font-medium">내 후기</p>
                <p className="text-sm text-gray-500">작성한 여행 후기</p>
              </div>
              <ChevronRightIcon />
            </Link>
          </div>
        </div>

        {/* Menu Section - Settings */}
        <div className="mt-6">
          <p className="px-5 mb-2 text-xs font-semibold text-gray-500">설정</p>
          <div className="bg-white">
            <Link to="/settings/notifications" className="flex items-center px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-center w-10 h-10 mr-3 bg-gray-100 rounded-lg">
                <BellIcon />
              </div>
              <div className="flex-1">
                <p className="font-medium">알림 설정</p>
              </div>
              <ChevronRightIcon />
            </Link>
            <Link to="/help" className="flex items-center px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-center w-10 h-10 mr-3 bg-gray-100 rounded-lg">
                <HelpIcon />
              </div>
              <div className="flex-1">
                <p className="font-medium">고객센터</p>
              </div>
              <ChevronRightIcon />
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-5 py-4 text-left"
            >
              <div className="flex items-center justify-center w-10 h-10 mr-3 bg-gray-100 rounded-lg">
                <LogoutIcon />
              </div>
              <div className="flex-1">
                <p className="font-medium">로그아웃</p>
              </div>
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link to="/" className="flex flex-col items-center py-2 text-gray-400">
            <HomeIcon />
            <span className="mt-1 text-xs">홈</span>
          </Link>
          <Link to="/my-applications" className="flex flex-col items-center py-2 text-gray-400">
            <ClipboardNavIcon />
            <span className="mt-1 text-xs">내 신청</span>
          </Link>
          <Link to="/active-travels" className="flex flex-col items-center py-2 text-gray-400">
            <BellNavIcon />
            <span className="mt-1 text-xs">진행중</span>
          </Link>
          <Link to="/mypage" className="flex flex-col items-center py-2 text-purple-600">
            <UserIcon />
            <span className="mt-1 text-xs">마이페이지</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MyPagePage;
