import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface Settlement {
  id: string;
  settlementId: string;
  influencerName: string;
  influencerHandle: string;
  influencerAvatar: string;
  period: string;
  grossAmount: number;
  feeRate: number;
  feeAmount: number;
  netAmount: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
}

interface SettlementStat {
  label: string;
  value: string;
  isHighlight?: boolean;
}

type TabFilter = 'pending' | 'approved' | 'completed' | 'rejected';

export const SettlementsPage = () => {
  const [activeTab, setActiveTab] = useState<TabFilter>('pending');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [stats] = useState<SettlementStat[]>([
    { label: '대기중 정산', value: '3건', isHighlight: true },
    { label: '대기중 금액', value: '7,840,000원' },
    { label: '이번 달 정산', value: '45,230,000원' },
    { label: '총 정산 완료', value: '1.8억' },
  ]);

  const [settlements] = useState<Settlement[]>([
    { id: '1', settlementId: 'STL-2024011500001', influencerName: '김지민', influencerHandle: '@travel_jimin', influencerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', period: '2024-01-01 ~ 01-15', grossAmount: 3250000, feeRate: 10, feeAmount: 325000, netAmount: 2925000, status: 'pending' },
    { id: '2', settlementId: 'STL-2024011500002', influencerName: '이수진', influencerHandle: '@sujin_adventure', influencerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', period: '2024-01-01 ~ 01-15', grossAmount: 2890000, feeRate: 10, feeAmount: 289000, netAmount: 2601000, status: 'pending' },
    { id: '3', settlementId: 'STL-2024011500003', influencerName: '박서윤', influencerHandle: '@seoyun_travel', influencerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', period: '2024-01-01 ~ 01-15', grossAmount: 2570000, feeRate: 10, feeAmount: 257000, netAmount: 2313000, status: 'pending' },
    { id: '4', settlementId: 'STL-2024011400001', influencerName: '정민재', influencerHandle: '@minjae_trip', influencerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', period: '2024-01-01 ~ 01-14', grossAmount: 1850000, feeRate: 10, feeAmount: 185000, netAmount: 1665000, status: 'approved' },
    { id: '5', settlementId: 'STL-2024011300001', influencerName: '최동현', influencerHandle: '@donghyun_travel', influencerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', period: '2024-01-01 ~ 01-13', grossAmount: 4120000, feeRate: 10, feeAmount: 412000, netAmount: 3708000, status: 'completed' },
  ]);

  const tabs = [
    { key: 'pending' as const, label: '승인 대기', count: 3 },
    { key: 'approved' as const, label: '승인완료', count: 12 },
    { key: 'completed' as const, label: '정산완료', count: 156 },
    { key: 'rejected' as const, label: '반려', count: 2 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const getStatusBadge = (status: Settlement['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-600',
      approved: 'bg-blue-100 text-blue-600',
      completed: 'bg-green-100 text-green-600',
      rejected: 'bg-red-100 text-red-600',
    };
    const labels = {
      pending: '승인대기',
      approved: '승인완료',
      completed: '정산완료',
      rejected: '반려',
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const pendingIds = settlements.filter(s => s.status === 'pending').map(s => s.id);
      setSelectedIds(pendingIds);
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter(i => i !== id));
    }
  };

  const handleApprove = (settlementId: string) => {
    alert('정산이 승인되었습니다.');
  };

  const handleReject = (settlementId: string) => {
    alert('정산이 반려되었습니다.');
  };

  const handleViewDetail = (settlementId: string) => {
    alert('정산 상세 정보를 표시합니다.');
  };

  const handleBulkApprove = () => {
    alert(`${selectedIds.length}건의 정산을 일괄 승인합니다.`);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-text-primary">정산 관리</h1>
          <p className="text-sm text-text-secondary mt-1">인플루언서 정산을 검토하고 처리합니다</p>
        </div>
        <div className="flex gap-3">
          <Button variant="primary">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            일괄 정산
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {stats.map((stat) => (
          <Card key={stat.label} className={`p-5 ${stat.isHighlight ? 'bg-gradient-to-r from-primary-start to-primary-end text-white' : ''}`}>
            <div className={`text-[13px] mb-2 ${stat.isHighlight ? 'text-white/90' : 'text-text-secondary'}`}>{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.isHighlight ? 'text-white' : 'text-text-primary'}`}>{stat.value}</div>
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

      {/* Table */}
      <Card>
        <div className="flex justify-between items-center px-6 py-5 border-b border-border-light">
          <span className="font-semibold">정산 요청 목록</span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleBulkApprove} disabled={selectedIds.length === 0}>
              선택 승인
            </Button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light w-10">
                <input
                  type="checkbox"
                  className="w-[18px] h-[18px] accent-primary-start"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">정산번호</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">인플루언서</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">정산기간</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">총 매출</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">수수료</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">정산금액</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">상태</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">작업</th>
            </tr>
          </thead>
          <tbody>
            {settlements.map((settlement) => (
              <tr key={settlement.id} className="hover:bg-background-light cursor-pointer border-b border-border-light last:border-0" onClick={() => handleViewDetail(settlement.settlementId)}>
                <td className="px-6 py-3.5" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    className="w-[18px] h-[18px] accent-primary-start"
                    checked={selectedIds.includes(settlement.id)}
                    onChange={(e) => handleSelectOne(settlement.id, e.target.checked)}
                    disabled={settlement.status !== 'pending'}
                  />
                </td>
                <td className="px-6 py-3.5">
                  <span className="font-mono text-xs text-text-secondary">{settlement.settlementId}</span>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <img src={settlement.influencerAvatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                    <div>
                      <div className="font-medium text-sm">{settlement.influencerName}</div>
                      <div className="text-xs text-text-secondary">{settlement.influencerHandle}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-sm">{settlement.period}</td>
                <td className="px-6 py-3.5 text-right">
                  <div className="font-semibold text-sm">{formatCurrency(settlement.grossAmount)}</div>
                </td>
                <td className="px-6 py-3.5">
                  <span className="text-xs text-text-muted">{settlement.feeRate}% ({formatCurrency(settlement.feeAmount)})</span>
                </td>
                <td className="px-6 py-3.5 text-right">
                  <div className="font-semibold text-sm">{formatCurrency(settlement.netAmount)}</div>
                </td>
                <td className="px-6 py-3.5">{getStatusBadge(settlement.status)}</td>
                <td className="px-6 py-3.5">
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {settlement.status === 'pending' ? (
                      <>
                        <button
                          className="px-3 py-1.5 rounded text-xs font-medium bg-gradient-to-r from-primary-start to-primary-end text-white hover:opacity-90 transition-opacity"
                          onClick={() => handleApprove(settlement.settlementId)}
                        >
                          승인
                        </button>
                        <button
                          className="px-3 py-1.5 rounded text-xs font-medium bg-background-light text-text-primary hover:bg-border-light transition-colors"
                          onClick={() => handleReject(settlement.settlementId)}
                        >
                          반려
                        </button>
                      </>
                    ) : (
                      <button
                        className="px-3 py-1.5 rounded text-xs font-medium bg-background-light text-text-primary hover:bg-border-light transition-colors"
                        onClick={() => handleViewDetail(settlement.settlementId)}
                      >
                        상세
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center px-6 py-4 border-t border-border-light">
          <span className="text-sm text-text-secondary">1 - 5 / 173 건</span>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white disabled:opacity-50" disabled>&lt;</button>
            <button className="px-3 py-2 border border-transparent rounded text-sm bg-gradient-to-r from-primary-start to-primary-end text-white">1</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">2</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">3</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white">...</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">35</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">&gt;</button>
          </div>
        </div>
      </Card>
    </div>
  );
};
