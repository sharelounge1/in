import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

type FilterStatus = 'all' | 'paid' | 'partial' | 'unpaid';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  applicationDate: string;
  status: 'paid' | 'partial' | 'unpaid';
  amount: number;
  paidAmount: number;
  paymentDate?: string;
  dueDate?: string;
}

export const ExpenseStatusPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [filter, setFilter] = useState<FilterStatus>('all');

  // Mock data
  const mockCourse = {
    title: '제주 힐링 3박 4일',
    date: '2025.01.28 - 2025.01.31',
    participantCount: 12,
  };

  const mockParticipants: Participant[] = [
    {
      id: '1',
      name: '김민수',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      applicationDate: '2025.01.10',
      status: 'paid',
      amount: 890000,
      paidAmount: 890000,
      paymentDate: '2025.01.11',
    },
    {
      id: '2',
      name: '이서연',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      applicationDate: '2025.01.12',
      status: 'partial',
      amount: 890000,
      paidAmount: 445000,
    },
    {
      id: '3',
      name: '박준호',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      applicationDate: '2025.01.15',
      status: 'unpaid',
      amount: 890000,
      paidAmount: 0,
      dueDate: '2025.01.20',
    },
    {
      id: '4',
      name: '최유진',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      applicationDate: '2025.01.08',
      status: 'paid',
      amount: 890000,
      paidAmount: 890000,
      paymentDate: '2025.01.09',
    },
  ];

  const summary = {
    total: mockParticipants.length,
    paid: mockParticipants.filter((p) => p.status === 'paid').length,
    unpaid: mockParticipants.filter((p) => p.status !== 'paid').length,
  };

  const filters: { label: string; value: FilterStatus }[] = [
    { label: '전체', value: 'all' },
    { label: '결제완료', value: 'paid' },
    { label: '부분결제', value: 'partial' },
    { label: '미결제', value: 'unpaid' },
  ];

  const filteredParticipants = filter === 'all'
    ? mockParticipants
    : mockParticipants.filter((p) => p.status === filter);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const getStatusLabel = (status: 'paid' | 'partial' | 'unpaid') => {
    const labels = { paid: '결제완료', partial: '부분결제', unpaid: '미결제' };
    return labels[status];
  };

  const getStatusStyle = (status: 'paid' | 'partial' | 'unpaid') => {
    const styles = {
      paid: 'bg-emerald-50 text-emerald-600',
      partial: 'bg-amber-50 text-amber-600',
      unpaid: 'bg-red-50 text-red-600',
    };
    return styles[status];
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to={`/influencer/courses/${courseId}`} className="p-1">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="font-semibold">참가자 비용 현황</span>
          <button className="p-1">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </button>
        </div>
      </header>

      {/* Course Info */}
      <div className="p-5 border-b border-gray-100">
        <h1 className="text-lg font-bold mb-2">{mockCourse.title}</h1>
        <p className="text-sm text-gray-500">{mockCourse.date} | 참가자 {mockCourse.participantCount}명</p>
      </div>

      {/* Summary Card */}
      <div className="mx-5 mt-5">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xl font-bold mb-1">{summary.total}명</p>
              <p className="text-xs opacity-90">총 참가자</p>
            </div>
            <div>
              <p className="text-xl font-bold mb-1">{summary.paid}명</p>
              <p className="text-xs opacity-90">결제 완료</p>
            </div>
            <div>
              <p className="text-xl font-bold mb-1">{summary.unpaid}명</p>
              <p className="text-xs opacity-90">미결제</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 px-5 py-4">
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

      {/* Participant List */}
      <div className="px-5">
        {filteredParticipants.map((participant) => (
          <div key={participant.id} className="bg-white rounded-lg shadow-sm mb-3 overflow-hidden">
            {/* Header */}
            <div className="flex items-center p-3.5 border-b border-gray-100">
              <img src={participant.avatar} alt={participant.name} className="w-10 h-10 rounded-full object-cover mr-3" />
              <div className="flex-1">
                <p className="font-semibold text-sm mb-0.5">{participant.name}</p>
                <p className="text-xs text-gray-500">신청일: {participant.applicationDate}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(participant.status)}`}>
                {getStatusLabel(participant.status)}
              </span>
            </div>

            {/* Body */}
            <div className="p-3.5">
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-gray-500">참가비</span>
                <span className="text-xs font-medium">{formatCurrency(participant.amount)}</span>
              </div>
              {participant.status === 'paid' ? (
                <>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-gray-500">결제일</span>
                    <span className="text-xs font-medium">{participant.paymentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">결제 금액</span>
                    <span className="text-sm font-bold text-violet-600">{formatCurrency(participant.paidAmount)}</span>
                  </div>
                </>
              ) : participant.status === 'partial' ? (
                <>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-gray-500">결제 금액</span>
                    <span className="text-xs font-medium">{formatCurrency(participant.paidAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">미결제 금액</span>
                    <span className="text-sm font-bold text-violet-600">{formatCurrency(participant.amount - participant.paidAmount)}</span>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button className="flex-1 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                      알림 보내기
                    </button>
                    <button className="flex-1 py-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-900">
                      메시지
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-xs text-gray-500">결제 기한</span>
                    <span className="text-xs font-medium">{participant.dueDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-500">미결제 금액</span>
                    <span className="text-sm font-bold text-violet-600">{formatCurrency(participant.amount)}</span>
                  </div>
                  <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                    <button className="flex-1 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-violet-600 to-purple-600 text-white">
                      알림 보내기
                    </button>
                    <button className="flex-1 py-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-900">
                      메시지
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpenseStatusPage;
