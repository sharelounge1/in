import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCourseApplications, useInfluencerMutations } from '@/hooks/useInfluencer';
import type { ApplicationStatus } from '@/types';

type FilterStatus = 'all' | ApplicationStatus;

interface Applicant {
  id: string;
  name: string;
  avatar: string;
  date: string;
  status: ApplicationStatus;
  message: string;
  gender: string;
  age: number;
  phone: string;
}

export const ApplicationsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [selectedCourse, setSelectedCourse] = useState('제주 힐링 3박 4일 (모집중)');

  const { data: applicationsData, isLoading } = useCourseApplications(courseId || '');
  const { selectApplication, rejectApplication, isSelectingApplication, isRejectingApplication } = useInfluencerMutations();

  // Mock data
  const mockApplicants: Applicant[] = [
    {
      id: '1',
      name: '김민수',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      date: '오늘 14:30',
      status: 'pending',
      message: '지민님의 여행 콘텐츠를 항상 즐겁게 보고 있습니다! 이번 제주 힐링 여행에 꼭 참가하고 싶습니다.',
      gender: '남',
      age: 28,
      phone: '010-1234-5678',
    },
    {
      id: '2',
      name: '정수진',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      date: '오늘 12:15',
      status: 'pending',
      message: '친구와 함께 신청합니다! 사진 찍는 것을 좋아해서 좋은 추억을 많이 남기고 싶어요.',
      gender: '여',
      age: 26,
      phone: '010-2345-6789',
    },
    {
      id: '3',
      name: '이서연',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      date: '어제 16:00',
      status: 'confirmed',
      message: '혼자 여행하는 것보다 함께하는 여행이 좋아서 신청합니다. 기대되요!',
      gender: '여',
      age: 30,
      phone: '010-3456-7890',
    },
    {
      id: '4',
      name: '최영훈',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      date: '3일 전',
      status: 'rejected',
      message: '제주도 여행 좋아합니다.',
      gender: '남',
      age: 35,
      phone: '010-4567-8901',
    },
  ];

  const filters: { label: string; value: FilterStatus }[] = [
    { label: '전체', value: 'all' },
    { label: '대기중', value: 'pending' },
    { label: '승인', value: 'confirmed' },
    { label: '거절', value: 'rejected' },
  ];

  const summary = {
    pending: mockApplicants.filter((a) => a.status === 'pending').length,
    approved: mockApplicants.filter((a) => a.status === 'confirmed').length,
    rejected: mockApplicants.filter((a) => a.status === 'rejected').length,
  };

  const filteredApplicants = filter === 'all'
    ? mockApplicants
    : mockApplicants.filter((a) => a.status === filter);

  const handleApprove = async (id: string) => {
    try {
      await selectApplication(id);
    } catch (error) {
      // Handle error
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectApplication(id);
    } catch (error) {
      // Handle error
    }
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    const labels: Record<ApplicationStatus, string> = {
      pending: '대기중',
      confirmed: '승인',
      rejected: '거절',
      cancelled: '취소',
      refunded: '환불',
    };
    return labels[status];
  };

  const getStatusStyle = (status: ApplicationStatus) => {
    const styles: Record<ApplicationStatus, string> = {
      pending: 'bg-amber-50 text-amber-600',
      confirmed: 'bg-emerald-50 text-emerald-600',
      rejected: 'bg-red-50 text-red-600',
      cancelled: 'bg-gray-100 text-gray-600',
      refunded: 'bg-blue-50 text-blue-600',
    };
    return styles[status];
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to={courseId ? `/influencer/courses/${courseId}` : '/influencer/courses'} className="p-1">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="font-semibold">신청자 관리</span>
          <button className="p-1">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Course Selector */}
      <div className="px-5 py-4 bg-white border-b border-gray-100">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm"
        >
          <option>제주 힐링 3박 4일 (모집중)</option>
          <option>도쿄 맛집 투어 4박 5일</option>
          <option>파리 로맨틱 5박 6일</option>
        </select>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-2 px-5 py-4">
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <p className="text-xl font-bold text-amber-500 mb-1">{summary.pending}</p>
          <p className="text-xs text-gray-500">대기중</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <p className="text-xl font-bold text-emerald-500 mb-1">{summary.approved}</p>
          <p className="text-xs text-gray-500">승인</p>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-sm">
          <p className="text-xl font-bold text-red-500 mb-1">{summary.rejected}</p>
          <p className="text-xs text-gray-500">거절</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-5 mb-4">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              filter === f.value
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Applicant List */}
      <div className="px-5">
        {filteredApplicants.map((applicant) => (
          <div key={applicant.id} className="bg-white rounded-xl shadow-sm mb-3 overflow-hidden">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-gray-100">
              <img src={applicant.avatar} alt={applicant.name} className="w-12 h-12 rounded-full object-cover mr-3" />
              <div className="flex-1">
                <p className="font-semibold mb-1">{applicant.name}</p>
                <p className="text-xs text-gray-500">
                  {applicant.status === 'pending' ? '신청일' : applicant.status === 'confirmed' ? '승인일' : '거절일'}: {applicant.date}
                </p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(applicant.status)}`}>
                {getStatusLabel(applicant.status)}
              </span>
            </div>

            {/* Body */}
            <div className="p-4">
              <p className="text-sm text-gray-600 leading-relaxed mb-3">{applicant.message}</p>
              <div className="flex gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {applicant.gender}, {applicant.age}세
                </span>
                <span className="flex items-center gap-1">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {applicant.phone}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 p-3 bg-gray-50">
              <button className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-white border border-gray-200">
                상세보기
              </button>
              {applicant.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleReject(applicant.id)}
                    disabled={isRejectingApplication}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-white border border-red-500 text-red-500"
                  >
                    거절
                  </button>
                  <button
                    onClick={() => handleApprove(applicant.id)}
                    disabled={isSelectingApplication}
                    className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-emerald-500 text-white"
                  >
                    승인
                  </button>
                </>
              )}
              {applicant.status === 'confirmed' && (
                <button className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-white border border-gray-200">
                  메시지
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsPage;
