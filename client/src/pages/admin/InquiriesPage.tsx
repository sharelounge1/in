import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';

interface Inquiry {
  id: string;
  inquiryId: string;
  userName: string;
  userAvatar: string;
  title: string;
  category: 'payment' | 'refund' | 'course' | 'account' | 'other';
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  isUrgent: boolean;
}

interface InquiryStat {
  label: string;
  value: string;
  isUrgent?: boolean;
}

type TabFilter = 'pending' | 'in-progress' | 'completed';
type CategoryFilter = '' | 'payment' | 'refund' | 'course' | 'account' | 'other';
type PriorityFilter = '' | 'high' | 'medium' | 'low';

export const InquiriesPage = () => {
  const [activeTab, setActiveTab] = useState<TabFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('');

  const [stats] = useState<InquiryStat[]>([
    { label: '긴급 문의', value: '3건', isUrgent: true },
    { label: '대기중 문의', value: '12건' },
    { label: '오늘 처리', value: '8건' },
    { label: '평균 응답시간', value: '2.5시간' },
  ]);

  const [inquiries] = useState<Inquiry[]>([
    { id: '1', inquiryId: 'INQ-2024011500001', userName: '김서연', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', title: '결제 완료 후 예약 확인이 안됩니다', category: 'payment', priority: 'high', status: 'pending', createdAt: '2024-01-15 14:32', isUrgent: true },
    { id: '2', inquiryId: 'INQ-2024011500002', userName: '이민수', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', title: '환불 요청드립니다 - 개인 사정', category: 'refund', priority: 'high', status: 'pending', createdAt: '2024-01-15 13:20', isUrgent: true },
    { id: '3', inquiryId: 'INQ-2024011500003', userName: '박지현', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', title: '부분 환불이 가능한가요?', category: 'refund', priority: 'high', status: 'pending', createdAt: '2024-01-15 11:45', isUrgent: true },
    { id: '4', inquiryId: 'INQ-2024011500004', userName: '최준혁', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', title: '코스 일정 변경 문의', category: 'course', priority: 'medium', status: 'pending', createdAt: '2024-01-15 10:30', isUrgent: false },
    { id: '5', inquiryId: 'INQ-2024011500005', userName: '정다영', userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', title: '계정 이메일 변경 요청', category: 'account', priority: 'low', status: 'pending', createdAt: '2024-01-15 09:15', isUrgent: false },
    { id: '6', inquiryId: 'INQ-2024011400001', userName: '강현우', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', title: '인플루언서 연락처 문의', category: 'other', priority: 'low', status: 'in-progress', createdAt: '2024-01-14 16:42', isUrgent: false },
    { id: '7', inquiryId: 'INQ-2024011400002', userName: '윤소희', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100', title: '예약 확인서 발급 요청', category: 'course', priority: 'medium', status: 'completed', createdAt: '2024-01-14 14:20', isUrgent: false },
  ]);

  const tabs = [
    { key: 'pending' as const, label: '대기중', count: 12 },
    { key: 'in-progress' as const, label: '처리중', count: 5 },
    { key: 'completed' as const, label: '완료', count: 234 },
  ];

  const getCategoryBadge = (category: Inquiry['category']) => {
    const styles = {
      payment: 'bg-blue-100 text-blue-600',
      refund: 'bg-red-100 text-red-600',
      course: 'bg-purple-100 text-purple-600',
      account: 'bg-green-100 text-green-600',
      other: 'bg-gray-100 text-gray-600',
    };
    const labels = {
      payment: '결제',
      refund: '환불',
      course: '코스',
      account: '계정',
      other: '기타',
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[category]}`}>{labels[category]}</span>;
  };

  const getPriorityBadge = (priority: Inquiry['priority']) => {
    const styles = {
      high: 'bg-red-100 text-red-600',
      medium: 'bg-yellow-100 text-yellow-600',
      low: 'bg-gray-100 text-gray-600',
    };
    const labels = {
      high: '높음',
      medium: '보통',
      low: '낮음',
    };
    return <span className={`px-2 py-1 rounded-full text-[11px] font-medium ${styles[priority]}`}>{labels[priority]}</span>;
  };

  const getStatusBadge = (status: Inquiry['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-600',
      'in-progress': 'bg-blue-100 text-blue-600',
      completed: 'bg-green-100 text-green-600',
    };
    const labels = {
      pending: '대기중',
      'in-progress': '처리중',
      completed: '완료',
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-text-primary">문의 관리</h1>
          <p className="text-sm text-text-secondary mt-1">고객 문의를 확인하고 응대합니다</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} className={`p-5 ${stat.isUrgent ? 'border-l-4 border-red-500' : ''}`}>
            <div className="text-[13px] text-text-secondary mb-2">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.isUrgent ? 'text-red-500' : 'text-text-primary'}`}>{stat.value}</div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2.5 rounded-md text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-gradient-to-r from-primary-start to-primary-end text-white'
                : 'bg-white text-text-secondary hover:bg-background-gray'
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] ${
              activeTab === tab.key
                ? 'bg-white/20'
                : 'bg-background-light text-text-muted'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 max-w-[400px] relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            className="w-full py-3 px-4 pl-11 border border-border-light rounded-md text-sm bg-white focus:outline-none focus:border-primary-start"
            placeholder="제목, 회원명으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="py-3 px-4 border border-border-light rounded-md text-sm bg-white min-w-[140px] focus:outline-none focus:border-primary-start"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
        >
          <option value="">전체 카테고리</option>
          <option value="payment">결제</option>
          <option value="refund">환불</option>
          <option value="course">코스</option>
          <option value="account">계정</option>
          <option value="other">기타</option>
        </select>
        <select
          className="py-3 px-4 border border-border-light rounded-md text-sm bg-white min-w-[140px] focus:outline-none focus:border-primary-start"
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
        >
          <option value="">전체 우선순위</option>
          <option value="high">높음</option>
          <option value="medium">보통</option>
          <option value="low">낮음</option>
        </select>
      </div>

      {/* Table */}
      <Card>
        <div className="flex justify-between items-center px-6 py-5 border-b border-border-light">
          <span className="font-semibold">문의 목록</span>
          <span className="text-sm text-text-secondary">총 251건</span>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">문의번호</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">회원</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">제목</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">카테고리</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">우선순위</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">상태</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">등록일</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">작업</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr
                key={inquiry.id}
                className={`hover:bg-background-light cursor-pointer border-b border-border-light last:border-0 ${inquiry.isUrgent ? 'bg-red-50/50' : ''}`}
              >
                <td className="px-6 py-3.5">
                  <span className="font-mono text-xs text-text-secondary">{inquiry.inquiryId}</span>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <img src={inquiry.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-medium text-sm">{inquiry.userName}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5">
                  <Link
                    to={`/admin/inquiries/${inquiry.id}`}
                    className="font-medium text-sm text-text-primary hover:text-primary-start max-w-[300px] truncate block"
                  >
                    {inquiry.title}
                  </Link>
                </td>
                <td className="px-6 py-3.5">{getCategoryBadge(inquiry.category)}</td>
                <td className="px-6 py-3.5">{getPriorityBadge(inquiry.priority)}</td>
                <td className="px-6 py-3.5">{getStatusBadge(inquiry.status)}</td>
                <td className="px-6 py-3.5 text-sm">{inquiry.createdAt}</td>
                <td className="px-6 py-3.5">
                  <Link
                    to={`/admin/inquiries/${inquiry.id}`}
                    className="px-3 py-1.5 rounded text-xs font-medium bg-background-light text-text-primary hover:bg-border-light transition-colors"
                  >
                    {inquiry.status === 'pending' ? '답변' : '상세'}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center px-6 py-4 border-t border-border-light">
          <span className="text-sm text-text-secondary">1 - 7 / 251 건</span>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white disabled:opacity-50" disabled>&lt;</button>
            <button className="px-3 py-2 border border-transparent rounded text-sm bg-gradient-to-r from-primary-start to-primary-end text-white">1</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">2</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">3</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white">...</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">36</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">&gt;</button>
          </div>
        </div>
      </Card>
    </div>
  );
};
