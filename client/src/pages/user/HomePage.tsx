import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useCourseList, useFeaturedCourses } from '@/hooks/useCourses';
import { usePartyList } from '@/hooks/useParties';

// Icons
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch courses and parties
  const { data: coursesData, isLoading: isLoadingCourses } = useCourseList({ limit: 3 });
  const { data: partiesData, isLoading: isLoadingParties } = usePartyList({ limit: 4 });

  const courses = useMemo(() => {
    if (!coursesData?.success) return [];
    return coursesData.data.items;
  }, [coursesData]);

  const parties = useMemo(() => {
    if (!partiesData?.success) return [];
    return partiesData.data.items;
  }, [partiesData]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center justify-between px-5 py-4">
          <button className="text-gray-700">
            <MenuIcon />
          </button>
          <Link to="/" className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            TRAVELY
          </Link>
          <Link to="/notifications" className="text-gray-700">
            <BellIcon />
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="pb-20">
        {/* Hero Section */}
        <div className="px-5 py-6 bg-gray-50">
          <h1 className="mb-2 text-2xl font-bold leading-tight">
            좋아하는 인플루언서와<br />특별한 여행을 떠나요
          </h1>
          <p className="mb-4 text-sm text-gray-500">새로운 여행 경험을 시작하세요</p>
          <div className="flex items-center gap-3 px-4 py-3.5 bg-white rounded-xl shadow-md">
            <SearchIcon />
            <input
              type="text"
              placeholder="여행지, 인플루언서 검색"
              className="flex-1 text-sm bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Popular Courses Section */}
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">인기 코스</h2>
            <Link to="/courses" className="text-xs text-gray-500">전체보기</Link>
          </div>
        </div>

        {/* Course Cards */}
        {isLoadingCourses ? (
          <div className="px-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="mb-4 bg-white rounded-xl shadow-sm animate-pulse">
                <div className="w-full h-48 bg-gray-200 rounded-t-xl" />
                <div className="p-4">
                  <div className="w-20 h-5 mb-2 bg-gray-200 rounded" />
                  <div className="w-3/4 h-5 mb-2 bg-gray-200 rounded" />
                  <div className="w-1/2 h-4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          courses.map((course) => (
            <Link
              key={course.id}
              to={`/courses/${course.id}`}
              className="block mx-5 mb-4"
            >
              <img
                src={course.thumbnail_url || 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800'}
                alt={course.title}
                className="object-cover w-full h-48 rounded-t-xl"
              />
              <div className="p-4 bg-white shadow-sm rounded-b-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded ${
                    course.status === 'recruiting'
                      ? 'bg-purple-100 text-purple-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {course.status === 'recruiting' ? '모집중' : '마감임박'}
                  </span>
                  <span className="text-xs text-gray-400">D-{course.days_until_start || 7}</span>
                </div>
                <h3 className="mb-1 font-semibold">{course.title}</h3>
                <p className="mb-3 text-sm text-gray-500">{course.description}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-600">{formatCurrency(course.price)}</span>
                  <span className="text-xs text-gray-400">{course.current_participants}/{course.max_participants}명</span>
                </div>
                {course.influencer && (
                  <div className="flex items-center gap-2 pt-3 mt-3 border-t border-gray-100">
                    <img
                      src={course.influencer.profile_image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
                      alt={course.influencer.nickname}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium">{course.influencer.nickname}</span>
                  </div>
                )}
              </div>
            </Link>
          ))
        )}

        {/* Recommended Parties Section */}
        <div className="px-5 mt-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">추천 파티</h2>
            <Link to="/parties" className="text-xs text-gray-500">전체보기</Link>
          </div>
        </div>

        {/* Party Cards - Horizontal Scroll */}
        <div className="flex gap-3 px-5 pb-4 overflow-x-auto scrollbar-hide">
          {isLoadingParties ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-36 animate-pulse">
                <div className="w-36 h-24 mb-2 bg-gray-200 rounded-lg" />
                <div className="w-24 h-4 bg-gray-200 rounded" />
              </div>
            ))
          ) : (
            parties.map((party) => (
              <Link
                key={party.id}
                to={`/parties/${party.id}`}
                className="flex-shrink-0 w-36"
              >
                <img
                  src={party.thumbnail_url || 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=300'}
                  alt={party.title}
                  className="object-cover w-36 h-24 mb-2 rounded-lg"
                />
                <p className="text-sm font-medium leading-tight">{party.title}</p>
              </Link>
            ))
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link to="/" className="flex flex-col items-center py-2 text-purple-600">
            <HomeIcon />
            <span className="mt-1 text-xs">홈</span>
          </Link>
          <Link to="/my-applications" className="flex flex-col items-center py-2 text-gray-400">
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

export default HomePage;
