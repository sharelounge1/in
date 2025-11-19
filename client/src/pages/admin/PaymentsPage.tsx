import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Payment {
  id: string;
  paymentId: string;
  userName: string;
  userAvatar: string;
  courseName: string;
  amount: number;
  method: string;
  status: 'completed' | 'pending' | 'refunded' | 'failed';
  date: string;
}

interface PaymentStat {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
}

type StatusFilter = '' | 'completed' | 'pending' | 'refunded' | 'failed';
type MethodFilter = '' | 'card' | 'bank' | 'naver' | 'kakao';

export const PaymentsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
  const [methodFilter, setMethodFilter] = useState<MethodFilter>('');
  const [startDate, setStartDate] = useState('2024-01-01');
  const [endDate, setEndDate] = useState('2024-01-15');

  const [stats] = useState<PaymentStat[]>([
    { label: '오늘 결제액', value: '8,450,000원', change: '전일 대비 +15.2%', changeType: 'up' },
    { label: '이번 달 결제액', value: '1.2억', change: '전월 대비 +23.1%', changeType: 'up' },
    { label: '환불 금액', value: '2,340,000원', change: '환불률 1.9%', changeType: 'down' },
    { label: '평균 결제액', value: '456,000원', change: '전월 대비 +8.4%', changeType: 'up' },
  ]);

  const [payments] = useState<Payment[]>([
    { id: '1', paymentId: 'PAY-2024011500001', userName: '김서연', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', courseName: '제주 힐링 3박4일', amount: 890000, method: '신용카드', status: 'completed', date: '2024-01-15 14:32' },
    { id: '2', paymentId: 'PAY-2024011500002', userName: '이민수', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', courseName: '도쿄 맛집 투어 5일', amount: 1250000, method: '네이버페이', status: 'completed', date: '2024-01-15 13:45' },
    { id: '3', paymentId: 'PAY-2024011500003', userName: '박지현', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', courseName: '방콕 파티 4박5일', amount: 780000, method: '카카오페이', status: 'pending', date: '2024-01-15 12:20' },
    { id: '4', paymentId: 'PAY-2024011400001', userName: '최준혁', userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', courseName: '오사카 여행 3박4일', amount: 650000, method: '계좌이체', status: 'refunded', date: '2024-01-14 16:55' },
    { id: '5', paymentId: 'PAY-2024011400002', userName: '정다영', userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', courseName: '부산 힐링 2박3일', amount: 450000, method: '신용카드', status: 'completed', date: '2024-01-14 11:30' },
    { id: '6', paymentId: 'PAY-2024011300001', userName: '강현우', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', courseName: '서울 맛집 투어 1박2일', amount: 280000, method: '신용카드', status: 'failed', date: '2024-01-13 09:15' },
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const getStatusBadge = (status: Payment['status']) => {
    const styles = {
      completed: 'bg-green-100 text-green-600',
      pending: 'bg-yellow-100 text-yellow-600',
      refunded: 'bg-red-100 text-red-600',
      failed: 'bg-gray-100 text-gray-600',
    };
    const labels = {
      completed: '결제완료',
      pending: '대기중',
      refunded: '환불',
      failed: '실패',
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const handleViewPayment = (paymentId: string) => {
    alert('결제 상세 정보를 표시합니다.');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-text-primary">결제 관리</h1>
          <p className="text-sm text-text-secondary mt-1">모든 결제 내역을 확인하고 관리합니다</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            엑셀 다운로드
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div className="text-[13px] text-text-secondary mb-2">{stat.label}</div>
            <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
            <div className={`text-xs mt-1 ${stat.changeType === 'up' ? 'text-green-600' : 'text-red-600'}`}>
              {stat.change}
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6 flex-wrap">
        <div className="flex-1 min-w-[300px] relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            className="w-full py-3 px-4 pl-11 border border-border-light rounded-md text-sm bg-white focus:outline-none focus:border-primary-start"
            placeholder="결제번호, 회원명으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="py-3 px-4 border border-border-light rounded-md text-sm bg-white min-w-[140px] focus:outline-none focus:border-primary-start"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
        >
          <option value="">전체 상태</option>
          <option value="completed">결제완료</option>
          <option value="pending">대기중</option>
          <option value="refunded">환불</option>
          <option value="failed">실패</option>
        </select>
        <select
          className="py-3 px-4 border border-border-light rounded-md text-sm bg-white min-w-[140px] focus:outline-none focus:border-primary-start"
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value as MethodFilter)}
        >
          <option value="">결제수단</option>
          <option value="card">신용카드</option>
          <option value="bank">계좌이체</option>
          <option value="naver">네이버페이</option>
          <option value="kakao">카카오페이</option>
        </select>
        <input
          type="date"
          className="py-3 px-4 border border-border-light rounded-md text-sm bg-white focus:outline-none focus:border-primary-start"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <input
          type="date"
          className="py-3 px-4 border border-border-light rounded-md text-sm bg-white focus:outline-none focus:border-primary-start"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      {/* Table */}
      <Card>
        <div className="flex justify-between items-center px-6 py-5 border-b border-border-light">
          <span className="font-semibold">결제 내역</span>
          <span className="text-sm text-text-secondary">총 2,847건</span>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">결제번호</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">회원</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">코스명</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">결제금액</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">결제수단</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">상태</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">결제일시</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">작업</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="hover:bg-background-light cursor-pointer border-b border-border-light last:border-0" onClick={() => handleViewPayment(payment.paymentId)}>
                <td className="px-6 py-3.5">
                  <span className="font-mono text-xs text-text-secondary">{payment.paymentId}</span>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <img src={payment.userAvatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                    <span className="font-medium text-sm">{payment.userName}</span>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-sm">{payment.courseName}</td>
                <td className="px-6 py-3.5 font-semibold text-sm">{formatCurrency(payment.amount)}</td>
                <td className="px-6 py-3.5">
                  <span className="flex items-center gap-1.5 text-[13px]">
                    <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                    </svg>
                    {payment.method}
                  </span>
                </td>
                <td className="px-6 py-3.5">{getStatusBadge(payment.status)}</td>
                <td className="px-6 py-3.5 text-sm">{payment.date}</td>
                <td className="px-6 py-3.5">
                  <button
                    className="px-3 py-1.5 rounded text-xs font-medium bg-background-light text-text-primary hover:bg-border-light transition-colors"
                    onClick={(e) => { e.stopPropagation(); handleViewPayment(payment.paymentId); }}
                  >
                    상세
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center px-6 py-4 border-t border-border-light">
          <span className="text-sm text-text-secondary">1 - 6 / 2,847 건</span>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white disabled:opacity-50" disabled>&lt;</button>
            <button className="px-3 py-2 border border-transparent rounded text-sm bg-gradient-to-r from-primary-start to-primary-end text-white">1</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">2</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">3</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white">...</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">475</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">&gt;</button>
          </div>
        </div>
      </Card>
    </div>
  );
};
