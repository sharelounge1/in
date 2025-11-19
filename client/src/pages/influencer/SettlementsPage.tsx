import { useState } from 'react';
import { useSettlements } from '@/hooks/useInfluencer';
import type { SettlementStatus } from '@/types';

type FilterStatus = 'all' | SettlementStatus;

interface Settlement {
  id: string;
  courseName: string;
  status: SettlementStatus;
  grossAmount: number;
  feeAmount: number;
  netAmount: number;
  settlementDate?: string;
  expectedDate?: string;
}

interface WithdrawalItem {
  id: string;
  date: string;
  amount: number;
  status: 'completed' | 'processing';
}

export const SettlementsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2025년 1월');
  const { data: settlementsData, isLoading } = useSettlements();

  // Mock data
  const mockBalance = 3240000;
  const mockMonthlyRevenue = 2450000;
  const mockMonthlyFee = 245000;

  const mockSettlements: Settlement[] = [
    {
      id: '1',
      courseName: '제주 힐링 3박 4일',
      status: 'pending',
      grossAmount: 10680000,
      feeAmount: 1068000,
      netAmount: 9612000,
      expectedDate: '2025.02.04',
    },
    {
      id: '2',
      courseName: '도쿄 맛집 투어 4박 5일',
      status: 'approved',
      grossAmount: 25000000,
      feeAmount: 2500000,
      netAmount: 22500000,
      expectedDate: '2025.01.21',
    },
    {
      id: '3',
      courseName: '파리 로맨틱 5박 6일',
      status: 'completed',
      grossAmount: 31500000,
      feeAmount: 3150000,
      netAmount: 28350000,
      settlementDate: '2025.01.02',
    },
  ];

  const mockWithdrawals: WithdrawalItem[] = [
    { id: '1', date: '2025.01.15', amount: 5000000, status: 'completed' },
    { id: '2', date: '2025.01.18', amount: 2000000, status: 'processing' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const getStatusLabel = (status: SettlementStatus) => {
    const labels: Record<SettlementStatus, string> = {
      pending: '정산 예정',
      approved: '정산 처리중',
      completed: '정산 완료',
      cancelled: '취소',
    };
    return labels[status];
  };

  const getStatusStyle = (status: SettlementStatus) => {
    const styles: Record<SettlementStatus, string> = {
      pending: 'bg-blue-50 text-blue-600',
      approved: 'bg-amber-50 text-amber-600',
      completed: 'bg-emerald-50 text-emerald-600',
      cancelled: 'bg-gray-100 text-gray-500',
    };
    return styles[status];
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center justify-between h-14 px-4">
          <span className="font-semibold">정산</span>
          <button className="p-1">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Balance Card */}
      <div className="mx-5 mt-5">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-2">출금 가능 금액</p>
          <p className="text-3xl font-bold mb-4">{formatCurrency(mockBalance)}</p>
          <div className="flex gap-2">
            <button className="flex-1 py-2.5 rounded-lg font-medium text-sm bg-white text-violet-600">
              출금 신청
            </button>
            <button className="flex-1 py-2.5 rounded-lg font-medium text-sm bg-white/20 text-white">
              상세 내역
            </button>
          </div>
        </div>
      </div>

      {/* Summary Grid */}
      <div className="grid grid-cols-2 gap-3 mx-5 mt-5">
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">이번 달 수익</p>
          <p className="text-lg font-bold text-emerald-500">+{new Intl.NumberFormat('ko-KR').format(mockMonthlyRevenue)}</p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <p className="text-xs text-gray-500 mb-1">이번 달 수수료</p>
          <p className="text-lg font-bold text-red-500">-{new Intl.NumberFormat('ko-KR').format(mockMonthlyFee)}</p>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mx-5 mt-5 p-3.5 bg-blue-50 rounded-lg flex items-center gap-3">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-blue-500 flex-shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-blue-600">정산은 여행 완료 후 7일 이내 처리됩니다</p>
      </div>

      {/* Settlement List */}
      <div className="flex justify-between items-center px-5 pt-5 pb-3">
        <h3 className="font-semibold">정산 내역</h3>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full border-none"
        >
          <option>2025년 1월</option>
          <option>2024년 12월</option>
          <option>2024년 11월</option>
        </select>
      </div>

      <div className="mx-5">
        {mockSettlements.map((settlement) => (
          <div key={settlement.id} className="bg-white rounded-lg shadow-sm mb-3 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <span className="font-semibold text-sm">{settlement.courseName}</span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyle(settlement.status)}`}>
                {getStatusLabel(settlement.status)}
              </span>
            </div>

            {/* Body */}
            <div className="p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">총 수익</span>
                <span className="text-sm font-medium">{formatCurrency(settlement.grossAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">플랫폼 수수료 (10%)</span>
                <span className="text-sm font-medium">-{formatCurrency(settlement.feeAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {settlement.status === 'completed' ? '정산일' : '정산 예정일'}
                </span>
                <span className="text-sm font-medium">
                  {settlement.settlementDate || settlement.expectedDate}
                </span>
              </div>
              <div className="flex justify-between pt-2 mt-2 border-t border-gray-100">
                <span className="text-sm font-semibold">
                  {settlement.status === 'completed' ? '정산 금액' : '정산 예정 금액'}
                </span>
                <span className="text-base font-bold text-violet-600">{formatCurrency(settlement.netAmount)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Withdrawal History */}
      <div className="mx-5 mt-5">
        <h3 className="font-semibold mb-3">출금 내역</h3>
        {mockWithdrawals.map((withdrawal) => (
          <div key={withdrawal.id} className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm mb-2">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">{withdrawal.date}</p>
              <p className="font-semibold">{formatCurrency(withdrawal.amount)}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              withdrawal.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {withdrawal.status === 'completed' ? '완료' : '처리중'}
            </span>
          </div>
        ))}
      </div>

      {/* Account Info */}
      <div className="mx-5 mt-5 p-4 bg-gray-100 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold">정산 계좌</span>
          <button className="text-xs text-violet-600">변경</button>
        </div>
        <p className="text-sm text-gray-500">신한은행 110-123-456789 (김*민)</p>
      </div>
    </div>
  );
};

export default SettlementsPage;
