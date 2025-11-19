import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useInfluencerCourses } from '@/hooks/useInfluencer';
import type { CourseStatus } from '@/types';

type FilterStatus = 'all' | CourseStatus;

interface CourseItem {
  id: string;
  title: string;
  thumbnail: string;
  status: CourseStatus;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  pending: number;
  price: number;
  daysLeft?: number;
  rating?: number;
}

export const CourseListPage = () => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const { data: coursesData, isLoading } = useInfluencerCourses(
    filter === 'all' ? undefined : { status: filter }
  );

  // Mock data for demonstration
  const mockCourses: CourseItem[] = [
    {
      id: '1',
      title: '제주 힐링 3박 4일',
      thumbnail: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=200',
      status: 'recruiting',
      startDate: '2025.01.25',
      endDate: '01.28',
      participants: 12,
      maxParticipants: 20,
      pending: 8,
      price: 890000,
      daysLeft: 7,
    },
    {
      id: '2',
      title: '도쿄 맛집 투어 4박 5일',
      thumbnail: 'https://images.unsplash.com/photo-1480796927426-f609979314bd?w=200',
      status: 'ongoing',
      startDate: '2025.01.10',
      endDate: '01.14',
      participants: 20,
      maxParticipants: 20,
      pending: 0,
      price: 1250000,
    },
    {
      id: '3',
      title: '파리 로맨틱 5박 6일',
      thumbnail: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=200',
      status: 'completed',
      startDate: '2024.12.20',
      endDate: '12.25',
      participants: 15,
      maxParticipants: 15,
      pending: 0,
      price: 2100000,
      rating: 4.9,
    },
    {
      id: '4',
      title: '발리 힐링 요가 투어',
      thumbnail: 'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?w=200',
      status: 'draft',
      startDate: '일정 미정',
      endDate: '',
      participants: 0,
      maxParticipants: 0,
      pending: 0,
      price: 1500000,
    },
  ];

  const filters: { label: string; value: FilterStatus }[] = [
    { label: '전체', value: 'all' },
    { label: '모집중', value: 'recruiting' },
    { label: '진행중', value: 'ongoing' },
    { label: '완료', value: 'completed' },
    { label: '임시저장', value: 'draft' },
  ];

  const getStatusLabel = (status: CourseStatus) => {
    const labels: Record<CourseStatus, string> = {
      draft: '임시저장',
      recruiting: '모집중',
      closed: '마감',
      ongoing: '진행중',
      completed: '완료',
      cancelled: '취소됨',
    };
    return labels[status];
  };

  const getStatusStyle = (status: CourseStatus) => {
    const styles: Record<CourseStatus, string> = {
      draft: 'bg-amber-50 text-amber-600',
      recruiting: 'bg-violet-50 text-violet-600',
      closed: 'bg-gray-100 text-gray-600',
      ongoing: 'bg-emerald-50 text-emerald-600',
      completed: 'bg-slate-100 text-slate-600',
      cancelled: 'bg-red-50 text-red-600',
    };
    return styles[status];
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount);
  };

  const filteredCourses = filter === 'all'
    ? mockCourses
    : mockCourses.filter((course) => course.status === filter);

  return (
    <div className="pb-20">
      {/* Filter Section */}
      <div className="flex gap-2 px-5 py-4 overflow-x-auto scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === f.value
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Course List */}
      <div className="px-5">
        {filteredCourses.map((course) => (
          <Link
            key={course.id}
            to={`/influencer/courses/${course.id}`}
            className="block bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
          >
            {/* Header */}
            <div className="flex gap-3 p-4">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="mb-1.5">
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${getStatusStyle(course.status)}`}>
                    {getStatusLabel(course.status)}
                  </span>
                </div>
                <h3 className="font-semibold text-sm mb-1 truncate">{course.title}</h3>
                <p className="text-xs text-gray-500">
                  {course.startDate} {course.endDate && `- ${course.endDate}`}
                  {course.daysLeft && ` | D-${course.daysLeft}`}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex border-t border-gray-100">
              <div className="flex-1 text-center py-3 border-r border-gray-100">
                <p className="font-semibold mb-0.5">
                  {course.status === 'draft' ? '-' : `${course.participants}/${course.maxParticipants}`}
                </p>
                <p className="text-xs text-gray-500">참가자</p>
              </div>
              <div className="flex-1 text-center py-3 border-r border-gray-100">
                <p className="font-semibold mb-0.5">
                  {course.status === 'draft' ? '-' : course.status === 'completed' ? course.rating : course.pending}
                </p>
                <p className="text-xs text-gray-500">
                  {course.status === 'completed' ? '평점' : '대기중'}
                </p>
              </div>
              <div className="flex-1 text-center py-3">
                <p className="font-semibold mb-0.5">{formatCurrency(course.price)}</p>
                <p className="text-xs text-gray-500">가격</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 p-3 bg-gray-50">
              {course.status === 'recruiting' && (
                <>
                  <Link
                    to={`/influencer/courses/${course.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center bg-white border border-gray-200"
                  >
                    수정
                  </Link>
                  <Link
                    to={`/influencer/courses/${course.id}/applications`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                  >
                    신청자 관리
                  </Link>
                </>
              )}
              {course.status === 'ongoing' && (
                <>
                  <Link
                    to={`/influencer/courses/${course.id}/announcements`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center bg-white border border-gray-200"
                  >
                    공지 작성
                  </Link>
                  <Link
                    to={`/influencer/courses/${course.id}/participants`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                  >
                    참가자 관리
                  </Link>
                </>
              )}
              {course.status === 'completed' && (
                <>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center bg-white border border-gray-200"
                  >
                    후기 보기
                  </button>
                  <Link
                    to="/influencer/settlements"
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                  >
                    정산 확인
                  </Link>
                </>
              )}
              {course.status === 'draft' && (
                <>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center bg-white border border-gray-200"
                  >
                    삭제
                  </button>
                  <Link
                    to={`/influencer/courses/${course.id}/edit`}
                    onClick={(e) => e.stopPropagation()}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium text-center bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                  >
                    이어서 작성
                  </Link>
                </>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* FAB */}
      <Link
        to="/influencer/courses/create"
        className="fixed bottom-24 right-5 w-14 h-14 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg z-50"
      >
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </Link>
    </div>
  );
};

export default CourseListPage;
