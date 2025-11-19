import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMyApplications } from '@/hooks/useCourses';

// Icons
const BackIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

type TabType = 'all' | 'course' | 'party';

export const MyApplicationsPage = () => {
  const [activeTab, setActiveTab] = useState<TabType>('all');

  const { data: applicationsData, isLoading } = useMyApplications(
    activeTab === 'all' ? undefined : activeTab
  );

  const applications = useMemo(() => {
    if (!applicationsData?.success) return [];
    return applicationsData.data.items;
  }, [applicationsData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 text-xs font-medium text-green-600 bg-green-100 rounded">확정</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium text-yellow-600 bg-yellow-100 rounded">대기중</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded">완료</span>;
      case 'cancelled':
        return <span className="px-2 py-1 text-xs font-medium text-red-600 bg-red-100 rounded">취소됨</span>;
      default:
        return null;
    }
  };

  // Mock data for display
  const mockApplications = [
    {
      id: '1',
      date: '2024.12.21',
      status: 'confirmed',
      type: 'course',
      title: '제주 힐링 3박 4일',
      schedule: '2025.01.25 - 01.28',
      price: 890000,
      image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=200',
    },
    {
      id: '2',
      date: '2024.12.20',
      status: 'confirmed',
      type: 'party',
      title: '부산 송정 서핑 파티',
      schedule: '2024.12.28 (토) 10:00',
      price: 85000,
      image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=200',
    },
    {
      id: '3',
      date: '2024.12.18',
      status: 'pending',
      type: 'course',
      title: '도쿄 맛집 투어 4박 5일',
      schedule: '2025.02.15 - 02.19',
      price: 1250000,
      image: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=200',
    },
    {
      id: '4',
      date: '2024.11.15',
      status: 'completed',
      type: 'party',
      title: '서울 와인 테이스팅',
      schedule: '2024.12.01 (일) 18:00',
      price: 120000,
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200',
    },
    {
      id: '5',
      date: '2024.10.20',
      status: 'cancelled',
      type: 'course',
      title: '스위스 알프스 5박 6일',
      schedule: '2024.11.20 - 11.25',
      price: 2890000,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
    },
  ];

  const displayApplications = applications.length > 0 ? applications : mockApplications;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
        <Link to="/mypage">
          <BackIcon />
        </Link>
        <span className="font-semibold">내 신청 내역</span>
        <div className="w-6" />
      </header>

      {/* Tabs */}
      <div className="flex bg-white border-b border-gray-100">
        <button
          onClick={() => setActiveTab('all')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 ${
            activeTab === 'all'
              ? 'text-purple-600 border-purple-600'
              : 'text-gray-400 border-transparent'
          }`}
        >
          전체
        </button>
        <button
          onClick={() => setActiveTab('course')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 ${
            activeTab === 'course'
              ? 'text-purple-600 border-purple-600'
              : 'text-gray-400 border-transparent'
          }`}
        >
          코스
        </button>
        <button
          onClick={() => setActiveTab('party')}
          className={`flex-1 py-3 text-sm font-medium border-b-2 ${
            activeTab === 'party'
              ? 'text-purple-600 border-purple-600'
              : 'text-gray-400 border-transparent'
          }`}
        >
          파티
        </button>
      </div>

      {/* Content */}
      <div className="p-5 pb-20 space-y-4">
        {isLoading ? (
          [1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl animate-pulse">
              <div className="p-3 bg-gray-100 rounded-t-xl">
                <div className="w-32 h-4 bg-gray-200 rounded" />
              </div>
              <div className="flex gap-3 p-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                <div className="flex-1">
                  <div className="w-16 h-3 mb-2 bg-gray-200 rounded" />
                  <div className="w-full h-5 mb-2 bg-gray-200 rounded" />
                  <div className="w-24 h-4 bg-gray-200 rounded" />
                </div>
              </div>
            </div>
          ))
        ) : (
          displayApplications.map((app) => (
            <div key={app.id} className="overflow-hidden bg-white shadow-sm rounded-xl">
              {/* Card Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                <span className="text-xs text-gray-500">{app.date} 신청</span>
                {getStatusBadge(app.status)}
              </div>

              {/* Card Body */}
              <div className="flex gap-3 p-4">
                <img
                  src={app.image}
                  alt={app.title}
                  className="object-cover w-20 h-20 rounded-lg"
                />
                <div className="flex-1">
                  <p className="mb-1 text-xs text-gray-400">{app.type === 'course' ? '코스' : '파티'}</p>
                  <h3 className="mb-1 font-semibold">{app.title}</h3>
                  <p className="mb-2 text-sm text-gray-500">{app.schedule}</p>
                  <p className={`font-bold ${app.status === 'cancelled' ? 'text-gray-400 line-through' : 'text-purple-600'}`}>
                    {formatCurrency(app.price)}
                  </p>
                </div>
              </div>

              {/* Card Footer */}
              <div className="flex gap-2 px-4 py-3 border-t border-gray-100">
                {app.status === 'confirmed' || app.status === 'pending' ? (
                  <>
                    <Link
                      to={`/travels/${app.id}`}
                      className="flex-1 py-2.5 text-sm font-medium text-center text-white rounded-lg bg-gradient-to-r from-purple-600 to-pink-500"
                    >
                      상세보기
                    </Link>
                    <button className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
                      취소요청
                    </button>
                  </>
                ) : app.status === 'completed' ? (
                  <>
                    <button className="flex-1 py-2.5 text-sm font-medium text-white rounded-lg bg-gradient-to-r from-purple-600 to-pink-500">
                      후기작성
                    </button>
                    <button className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
                      영수증
                    </button>
                  </>
                ) : (
                  <button className="flex-1 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg">
                    환불내역
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link to="/" className="flex flex-col items-center py-2 text-gray-400">
            <HomeIcon />
            <span className="mt-1 text-xs">홈</span>
          </Link>
          <Link to="/my-applications" className="flex flex-col items-center py-2 text-purple-600">
            <ClipboardIcon />
            <span className="mt-1 text-xs">내 신청</span>
          </Link>
          <Link to="/active-travels" className="flex flex-col items-center py-2 text-gray-400">
            <BellIcon />
            <span className="mt-1 text-xs">진행중</span>
          </Link>
          <Link to="/mypage" className="flex flex-col items-center py-2 text-gray-400">
            <UserIcon />
            <span className="mt-1 text-xs">마이페이지</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default MyApplicationsPage;
