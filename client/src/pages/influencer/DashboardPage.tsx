import { useState } from 'react';
import { Link } from 'react-router-dom';
import { InfluencerLayout } from '@/components/layout';
import { useInfluencerCourses, useCourseApplications, useSettlements } from '@/hooks/useInfluencer';
import { useAuth } from '@/hooks/useAuth';

interface StatCard {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  colorClass: string;
}

export const DashboardPage = () => {
  const { user } = useAuth();
  const { data: coursesData } = useInfluencerCourses({ status: 'recruiting' });
  const { data: settlementsData } = useSettlements();

  // Mock data for demonstration - in real app, this would come from API
  const mockStats = {
    totalParticipants: 47,
    newApplications: 8,
    activeCourses: 3,
    averageRating: 4.8,
    monthlyRevenue: 2450000,
    revenueChange: 23,
  };

  const mockRecentApplicants = [
    { id: '1', name: '김민수', course: '제주 힐링 3박 4일', status: 'pending', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
    { id: '2', name: '이서연', course: '제주 힐링 3박 4일', status: 'approved', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { id: '3', name: '박준호', course: '도쿄 맛집 투어', status: 'pending', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  ];

  const weeklyData = [40, 65, 50, 80, 95, 70, 45];

  const statCards: StatCard[] = [
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      value: mockStats.totalParticipants,
      label: '총 참가자',
      colorClass: 'bg-blue-50 text-blue-500',
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      value: mockStats.newApplications,
      label: '신규 신청',
      colorClass: 'bg-violet-50 text-violet-600',
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      value: mockStats.activeCourses,
      label: '진행중 코스',
      colorClass: 'bg-emerald-50 text-emerald-500',
    },
    {
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      value: mockStats.averageRating,
      label: '평균 평점',
      colorClass: 'bg-amber-50 text-amber-500',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  return (
    <div className="pb-20">
      {/* Welcome Section */}
      <div className="p-6 bg-white">
        <p className="text-sm text-gray-500 mb-1">안녕하세요,</p>
        <h1 className="text-xl font-bold">{user?.nickname || '인플루언서'}님</h1>
      </div>

      {/* Revenue Card */}
      <div className="mx-5 -mt-2 relative z-10">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-2">이번 달 예상 수익</p>
          <p className="text-3xl font-bold mb-1">{formatCurrency(mockStats.monthlyRevenue)}</p>
          <p className="text-sm opacity-90">
            지난 달 대비{' '}
            <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">
              +{mockStats.revenueChange}%
            </span>
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 m-5">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.colorClass}`}>
              {stat.icon}
            </div>
            <p className="text-xl font-bold mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mx-5 mb-5">
        <Link
          to="/influencer/courses/create"
          className="flex items-center justify-center gap-2 py-3.5 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold text-sm shadow-md"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          새 코스 만들기
        </Link>
        <Link
          to="/influencer/applications"
          className="flex items-center justify-center gap-2 py-3.5 rounded-lg bg-gray-100 text-gray-900 font-semibold text-sm"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          신청자 관리
        </Link>
      </div>

      {/* Weekly Chart */}
      <div className="mx-5 mb-5 bg-white rounded-xl p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">주간 신청 현황</h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">이번 주</span>
        </div>
        <div className="flex items-end justify-between h-28 px-2">
          {weeklyData.map((value, index) => (
            <div key={index} className="w-6 bg-gray-100 rounded relative" style={{ height: '100%' }}>
              <div
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-violet-600 to-purple-600 rounded"
                style={{ height: `${value}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 px-1">
          {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
            <span key={day} className="text-xs text-gray-400 w-6 text-center">{day}</span>
          ))}
        </div>
      </div>

      {/* Recent Applicants */}
      <div className="mx-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">최근 신청자</h3>
          <Link to="/influencer/applications" className="text-sm text-gray-500">
            전체보기
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {mockRecentApplicants.map((applicant, index) => (
            <div
              key={applicant.id}
              className={`flex items-center p-3.5 ${
                index < mockRecentApplicants.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <img
                src={applicant.avatar}
                alt={applicant.name}
                className="w-10 h-10 rounded-full object-cover mr-3"
              />
              <div className="flex-1">
                <p className="text-sm font-medium mb-0.5">{applicant.name}</p>
                <p className="text-xs text-gray-500">{applicant.course}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  applicant.status === 'pending'
                    ? 'bg-amber-50 text-amber-600'
                    : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                {applicant.status === 'pending' ? '대기중' : '승인'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
