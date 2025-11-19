import { useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourseDetail } from '@/hooks/useCourses';

// Icons
const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const MoreIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ScheduleIcon = () => (
  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const ExpenseIcon = () => (
  <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const AnnouncementIcon = () => (
  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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

export const TravelDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: courseData, isLoading } = useCourseDetail(id || '');

  const course = useMemo(() => {
    if (!courseData?.success) return null;
    return courseData.data;
  }, [courseData]);

  // Mock travel detail data
  const travelDetail = {
    id: id || '1',
    title: '제주 힐링 3박 4일',
    date: '2025.01.25 (토) - 01.28 (화)',
    status: '진행중',
    currentDay: 2,
    participants: 18,
    myExpenses: 245000,
    newAnnouncements: 2,
    influencer: {
      name: '여행하는 지민',
      role: '인플루언서 / 여행 가이드',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    todaySchedule: {
      day: 2,
      date: '1월 26일 (일)',
      title: '한라산 트레킹',
      description: '한라산 영실코스 등반, 1100고지 방문, 산방산 일몰',
    },
    image: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800',
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white animate-pulse">
        <div className="w-full h-72 bg-gray-200" />
        <div className="p-5">
          <div className="w-32 h-6 mb-4 bg-gray-200 rounded" />
          <div className="w-full h-8 mb-2 bg-gray-200 rounded" />
          <div className="w-2/3 h-4 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative">
        <img
          src={course?.thumbnail_url || travelDetail.image}
          alt={travelDetail.title}
          className="object-cover w-full h-72"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute flex items-center justify-center bg-white rounded-full top-4 left-4 w-9 h-9 bg-opacity-90"
        >
          <BackIcon />
        </button>
        <button className="absolute flex items-center justify-center bg-white rounded-full top-4 right-4 w-9 h-9 bg-opacity-90">
          <MoreIcon />
        </button>
      </div>

      {/* Content */}
      <div className="pb-20">
        <div className="relative p-5 -mt-5 bg-white rounded-t-3xl">
          {/* Status Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 mb-3 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
            <CheckCircleIcon />
            {travelDetail.status}
          </div>

          {/* Travel Title */}
          <h1 className="mb-2 text-xl font-bold">{travelDetail.title}</h1>
          <p className="flex items-center gap-1.5 mb-4 text-sm text-gray-500">
            <CalendarIcon />
            {travelDetail.date}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="mb-1 text-xs text-gray-500">현재 일차</p>
              <p className="font-semibold text-purple-600">{travelDetail.currentDay}일차</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="mb-1 text-xs text-gray-500">참여 인원</p>
              <p className="font-semibold">{travelDetail.participants}명</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="mb-1 text-xs text-gray-500">내 경비</p>
              <p className="font-semibold">{formatCurrency(travelDetail.myExpenses)}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="mb-1 text-xs text-gray-500">새 공지</p>
              <p className="font-semibold text-purple-600">{travelDetail.newAnnouncements}건</p>
            </div>
          </div>

          {/* Influencer Card */}
          <div className="flex items-center gap-3 p-4 mb-5 bg-gray-50 rounded-xl">
            <img
              src={travelDetail.influencer.image}
              alt={travelDetail.influencer.name}
              className="object-cover w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <p className="font-semibold">{travelDetail.influencer.name}</p>
              <p className="text-sm text-gray-500">{travelDetail.influencer.role}</p>
            </div>
            <ChevronRightIcon />
          </div>

          {/* Quick Menu */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            <Link
              to={`/travels/${id}/schedule`}
              className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-100 rounded-xl hover:border-purple-500 transition"
            >
              <ScheduleIcon />
              <span className="text-xs font-medium">일정</span>
            </Link>
            <Link
              to={`/travels/${id}/participants`}
              className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-100 rounded-xl hover:border-purple-500 transition"
            >
              <UsersIcon />
              <span className="text-xs font-medium">참여자</span>
            </Link>
            <Link
              to={`/travels/${id}/chat`}
              className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-100 rounded-xl hover:border-purple-500 transition"
            >
              <ChatIcon />
              <span className="text-xs font-medium">채팅</span>
            </Link>
            <Link
              to={`/travels/${id}/expenses`}
              className="flex flex-col items-center gap-2 p-4 bg-white border border-gray-100 rounded-xl hover:border-purple-500 transition"
            >
              <ExpenseIcon />
              <span className="text-xs font-medium">경비</span>
            </Link>
          </div>

          {/* Notice Banner */}
          <Link
            to={`/travels/${id}/announcements`}
            className="flex items-center gap-3 p-4 mb-5 bg-purple-50 rounded-xl"
          >
            <AnnouncementIcon />
            <div className="flex-1">
              <p className="mb-0.5 text-sm font-semibold">새로운 공지가 있습니다</p>
              <p className="text-xs text-gray-500">2일차 일정 변경 안내를 확인하세요</p>
            </div>
            <ChevronRightIcon />
          </Link>

          {/* Today's Schedule */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">오늘의 일정</h2>
              <Link to={`/travels/${id}/schedule`} className="text-xs text-gray-500">전체보기</Link>
            </div>
            <div className="p-4 bg-white border border-gray-100 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 text-xs font-medium text-purple-600 bg-purple-100 rounded">
                  {travelDetail.todaySchedule.day}일차
                </span>
                <span className="text-xs text-gray-400">{travelDetail.todaySchedule.date}</span>
              </div>
              <h3 className="mb-1 font-semibold">{travelDetail.todaySchedule.title}</h3>
              <p className="text-sm text-gray-500">{travelDetail.todaySchedule.description}</p>
            </div>
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
            <ClipboardIcon />
            <span className="mt-1 text-xs">내 신청</span>
          </Link>
          <Link to="/active-travels" className="flex flex-col items-center py-2 text-purple-600">
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

export default TravelDetailPage;
