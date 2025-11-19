import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useMyActiveTravels } from '@/hooks/useCourses';

// Icons
const BackIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
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

export const ActiveTravelsPage = () => {
  const { data: travelsData, isLoading } = useMyActiveTravels();

  const travels = useMemo(() => {
    if (!travelsData?.success) return [];
    return travelsData.data.items;
  }, [travelsData]);

  // Mock data for display
  const mockTravels = [
    {
      id: '1',
      title: '제주 힐링 3박 4일',
      date: '2025.01.25 (토) - 01.28 (화)',
      dday: 35,
      location: '제주도',
      duration: '3박 4일',
      influencer: '여행하는 지민',
      participants: 12,
      image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800',
      participantImages: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60',
        'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=60',
      ],
    },
    {
      id: '2',
      title: '부산 송정 서핑 파티',
      date: '2024.12.28 (토) 10:00',
      dday: 7,
      location: '부산 송정',
      duration: '당일',
      influencer: '서핑마스터 태현',
      participants: 8,
      image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
      participantImages: [],
    },
  ];

  const displayTravels = travels.length > 0 ? travels : mockTravels;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
        <Link to="/mypage">
          <BackIcon />
        </Link>
        <span className="font-semibold">진행중인 여행</span>
        <div className="w-6" />
      </header>

      {/* Content */}
      <div className="p-5 pb-20">
        {/* Notice Card */}
        <div className="p-4 mb-4 bg-purple-50 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <BellIcon />
            <span className="text-sm font-semibold text-purple-600">새 공지사항</span>
          </div>
          <p className="text-sm text-gray-600">
            제주 힐링 3박 4일 여행의 상세 일정이 업데이트되었습니다. 확인해주세요!
          </p>
        </div>

        {/* Travel Cards */}
        {isLoading ? (
          [1, 2].map((i) => (
            <div key={i} className="mb-5 overflow-hidden bg-white shadow-sm rounded-xl animate-pulse">
              <div className="w-full h-40 bg-gray-200" />
              <div className="p-4">
                <div className="w-3/4 h-6 mb-2 bg-gray-200 rounded" />
                <div className="w-1/2 h-4 bg-gray-200 rounded" />
              </div>
            </div>
          ))
        ) : (
          displayTravels.map((travel) => (
            <div key={travel.id} className="mb-5 overflow-hidden bg-white shadow-sm rounded-xl">
              <img
                src={travel.image}
                alt={travel.title}
                className="object-cover w-full h-40"
              />
              <div className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h2 className="mb-1 text-lg font-bold">{travel.title}</h2>
                    <p className="text-sm text-gray-500">{travel.date}</p>
                  </div>
                  <span className="px-2.5 py-1.5 text-xs font-semibold text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-500">
                    D-{travel.dday}
                  </span>
                </div>

                {/* Meta Info */}
                <div className="grid grid-cols-2 gap-3 p-3 mb-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <LocationIcon />
                    <span className="text-sm text-gray-500">{travel.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ClockIcon />
                    <span className="text-sm text-gray-500">{travel.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon />
                    <span className="text-sm text-gray-500">{travel.influencer}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UsersIcon />
                    <span className="text-sm text-gray-500">{travel.participants}명 참가</span>
                  </div>
                </div>

                {/* Participants */}
                {travel.participantImages && travel.participantImages.length > 0 && (
                  <div className="pt-4 mt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold">함께하는 참가자</span>
                      <span className="text-sm text-purple-500">{travel.participants}명</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {travel.participantImages.map((img, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-full"
                        >
                          <img
                            src={img}
                            alt="참가자"
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm font-medium">
                            {index === 0 ? '지민' : index === 1 ? '민수' : '서연'}
                          </span>
                        </div>
                      ))}
                      {travel.participants > 3 && (
                        <div className="flex items-center px-3 py-2 bg-gray-50 rounded-full">
                          <span className="text-sm font-medium">+{travel.participants - 3}명</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Link
                    to={`/travels/${travel.id}/chat`}
                    className="flex-1 py-3 text-sm font-medium text-center text-white rounded-lg bg-gradient-to-r from-purple-600 to-pink-500"
                  >
                    채팅방 입장
                  </Link>
                  <Link
                    to={`/travels/${travel.id}`}
                    className="flex-1 py-3 text-sm font-medium text-center text-gray-700 bg-gray-100 rounded-lg"
                  >
                    상세일정
                  </Link>
                </div>
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
          <Link to="/my-applications" className="flex flex-col items-center py-2 text-gray-400">
            <ClipboardIcon />
            <span className="mt-1 text-xs">내 신청</span>
          </Link>
          <Link to="/active-travels" className="flex flex-col items-center py-2 text-purple-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="mt-1 text-xs">진행중</span>
          </Link>
          <Link to="/mypage" className="flex flex-col items-center py-2 text-gray-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="mt-1 text-xs">마이페이지</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default ActiveTravelsPage;
