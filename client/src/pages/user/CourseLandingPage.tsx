import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCourseDetail } from '@/hooks/useCourses';

// Icons
const BackIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

export const CourseLandingPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'schedule' | 'details' | 'reviews'>('schedule');

  const { data: courseData, isLoading } = useCourseDetail(id || '');

  const course = useMemo(() => {
    if (!courseData?.success) return null;
    return courseData.data;
  }, [courseData]);

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

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">코스를 찾을 수 없습니다.</p>
      </div>
    );
  }

  // Mock schedule data
  const schedule = [
    { day: 1, title: '제주 도착 & 동쪽 해안', description: '공항 픽업 후 성산일출봉 방문, 우도 투어, 해녀 체험' },
    { day: 2, title: '한라산 트레킹', description: '한라산 영실코스 등반, 1100고지 방문, 산방산 일몰' },
    { day: 3, title: '서쪽 해안 & 카페 투어', description: '협재 해수욕장, 오설록 티뮤지엄, 인생샷 카페 투어' },
    { day: 4, title: '자유시간 & 출발', description: '올레시장 쇼핑, 공항 이동 및 출발' },
  ];

  const includes = ['숙박', '조식', '교통비', '입장료', '가이드'];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Image */}
      <div className="relative">
        <img
          src={course.thumbnail_url || 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800'}
          alt={course.title}
          className="object-cover w-full h-72"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute flex items-center justify-center bg-white rounded-full top-4 left-4 w-9 h-9 bg-opacity-90"
        >
          <BackIcon />
        </button>
        <button className="absolute flex items-center justify-center bg-white rounded-full top-4 right-4 w-9 h-9 bg-opacity-90">
          <ShareIcon />
        </button>
      </div>

      {/* Content */}
      <div className="pb-24">
        <div className="relative p-5 -mt-5 bg-white rounded-t-3xl">
          {/* Influencer Profile */}
          <div className="flex items-center gap-3 mb-4">
            <img
              src={course.influencer?.profile_image_url || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100'}
              alt={course.influencer?.nickname}
              className="object-cover w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <p className="font-semibold">{course.influencer?.nickname || '인플루언서'}</p>
              <p className="text-sm text-gray-500">팔로워 12.5만</p>
            </div>
            <button className="px-4 py-2 text-xs font-medium text-white rounded-full bg-gradient-to-r from-purple-600 to-pink-500">
              팔로우
            </button>
          </div>

          {/* Course Title */}
          <h1 className="mb-2 text-xl font-bold">{course.title}</h1>
          <p className="mb-4 text-sm text-gray-500">
            <LocationIcon />
            {course.location || '제주도, 대한민국'}
          </p>

          {/* Info Grid */}
          <div className="grid grid-cols-3 gap-3 p-4 mb-5 bg-gray-50 rounded-xl">
            <div className="text-center">
              <p className="mb-1 text-xs text-gray-500">일정</p>
              <p className="text-sm font-semibold">{course.duration || '3박 4일'}</p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-xs text-gray-500">인원</p>
              <p className="text-sm font-semibold">{course.current_participants}/{course.max_participants}명</p>
            </div>
            <div className="text-center">
              <p className="mb-1 text-xs text-gray-500">출발일</p>
              <p className="text-sm font-semibold">1.25 (토)</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex mb-5 border-b border-gray-100">
            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'schedule'
                  ? 'text-purple-600 border-purple-600'
                  : 'text-gray-400 border-transparent'
              }`}
            >
              일정
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'details'
                  ? 'text-purple-600 border-purple-600'
                  : 'text-gray-400 border-transparent'
              }`}
            >
              상세정보
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'reviews'
                  ? 'text-purple-600 border-purple-600'
                  : 'text-gray-400 border-transparent'
              }`}
            >
              후기
            </button>
          </div>

          {/* Schedule Content */}
          {activeTab === 'schedule' && (
            <div className="space-y-0">
              {schedule.map((item, index) => (
                <div
                  key={item.day}
                  className={`flex gap-4 py-4 ${
                    index < schedule.length - 1 ? 'border-b border-gray-100' : ''
                  }`}
                >
                  <div className="flex-shrink-0 w-12">
                    <p className="text-lg font-bold text-purple-500">{item.day}</p>
                    <p className="text-xs text-gray-400">Day</p>
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 font-semibold">{item.title}</p>
                    <p className="text-sm leading-relaxed text-gray-500">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Includes Section */}
          <div className="pt-5 mt-5 border-t border-gray-100">
            <h3 className="mb-3 font-semibold">포함사항</h3>
            <div className="flex flex-wrap gap-2">
              {includes.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-50 rounded-full"
                >
                  <CheckIcon />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center gap-4 p-4 bg-white border-t border-gray-100">
        <div className="flex-1">
          <p className="text-xs text-gray-500">1인 참가비</p>
          <p className="text-xl font-bold text-purple-600">{formatCurrency(course.price)}</p>
        </div>
        <div className="flex gap-2">
          <Link
            to={`/courses/${id}/inquiry`}
            className="px-4 py-3.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg"
          >
            문의
          </Link>
          <Link
            to={`/courses/${id}/apply`}
            className="px-6 py-3.5 text-sm font-semibold text-white rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg shadow-purple-500/30"
          >
            신청하기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseLandingPage;
