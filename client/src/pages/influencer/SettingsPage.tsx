import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface SettingsItem {
  to: string;
  icon: React.ReactNode;
  iconClass: string;
  title: string;
  subtitle?: string;
  badge?: number;
}

export const SettingsPage = () => {
  const { user, logout } = useAuth();

  const accountSettings: SettingsItem[] = [
    {
      to: '/influencer/settings/profile',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      iconClass: 'bg-violet-50 text-violet-600',
      title: '프로필 설정',
      subtitle: '이름, 소개, 프로필 사진',
    },
    {
      to: '/influencer/settings/account',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      iconClass: 'bg-emerald-50 text-emerald-500',
      title: '정산 계좌',
      subtitle: '신한은행 110-***-456789',
    },
    {
      to: '/influencer/settings/notifications',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      iconClass: 'bg-blue-50 text-blue-500',
      title: '알림 설정',
      subtitle: '푸시 알림, 이메일 알림',
    },
  ];

  const serviceSettings: SettingsItem[] = [
    {
      to: '/influencer/inquiries',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      iconClass: 'bg-amber-50 text-amber-500',
      title: '받은 문의',
      subtitle: '참가자 문의 및 답변',
      badge: 3,
    },
    {
      to: '/terms',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      iconClass: 'bg-gray-100 text-gray-500',
      title: '이용약관',
      subtitle: '서비스 이용약관',
    },
    {
      to: '/privacy',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      iconClass: 'bg-gray-100 text-gray-500',
      title: '개인정보처리방침',
      subtitle: '개인정보 수집 및 이용',
    },
    {
      to: '/help',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconClass: 'bg-gray-100 text-gray-500',
      title: '고객센터',
      subtitle: 'FAQ, 1:1 문의',
    },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center justify-between h-14 px-4">
          <span className="font-semibold">설정</span>
          <div className="w-6" />
        </div>
      </header>

      {/* Profile Section */}
      <div className="p-6 text-center border-b-8 border-gray-100">
        <img
          src={user?.avatar_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200'}
          alt="프로필"
          className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-3 border-violet-600"
        />
        <h2 className="text-xl font-bold mb-1">{user?.nickname || '여행하는 지민'}</h2>
        <p className="text-sm text-gray-500 mb-3">{user?.email || 'jimin.travel@email.com'}</p>
        <span className="inline-block px-3 py-1.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full text-xs font-medium">
          인플루언서
        </span>
      </div>

      {/* Account Settings */}
      <div className="py-3 border-b-8 border-gray-100">
        <p className="px-5 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">계정 설정</p>
        {accountSettings.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className="flex items-center px-5 py-3.5 hover:bg-gray-50"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3.5 ${item.iconClass}`}>
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm mb-0.5">{item.title}</p>
              {item.subtitle && <p className="text-xs text-gray-500">{item.subtitle}</p>}
            </div>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Service Settings */}
      <div className="py-3 border-b-8 border-gray-100">
        <p className="px-5 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">서비스</p>
        {serviceSettings.map((item) => (
          <Link
            key={item.title}
            to={item.to}
            className="flex items-center px-5 py-3.5 hover:bg-gray-50"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3.5 ${item.iconClass}`}>
              {item.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm mb-0.5">{item.title}</p>
              {item.subtitle && <p className="text-xs text-gray-500">{item.subtitle}</p>}
            </div>
            {item.badge && (
              <span className="px-2 py-1 bg-red-50 text-red-500 rounded-full text-xs font-medium mr-2">
                {item.badge}
              </span>
            )}
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-gray-400">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <div className="py-3">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-5 py-3.5 hover:bg-gray-50"
        >
          <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3.5 bg-red-50 text-red-500">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium text-sm">로그아웃</p>
          </div>
        </button>
      </div>

      {/* Version Info */}
      <div className="text-center py-5 text-xs text-gray-400">
        버전 1.0.0
      </div>
    </div>
  );
};

export default SettingsPage;
