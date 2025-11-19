import { useState } from 'react';
import { Button } from '@/components/ui/Button';

interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  platforms: string[];
  followers: string;
  engagementRate: string;
  posts: number;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

type TabFilter = 'pending' | 'approved' | 'rejected';

export const InfluencersPage = () => {
  const [activeTab, setActiveTab] = useState<TabFilter>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const [influencers] = useState<Influencer[]>([
    { id: '1', name: '김지현', handle: '@travel_jihyun', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', platforms: ['Instagram', 'YouTube'], followers: '125K', engagementRate: '4.2%', posts: 86, applicationDate: '2024-01-15', status: 'pending' },
    { id: '2', name: '이준혁', handle: '@junhyuk_trip', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', platforms: ['Instagram'], followers: '89K', engagementRate: '3.8%', posts: 124, applicationDate: '2024-01-14', status: 'pending' },
    { id: '3', name: '박서윤', handle: '@seoyun_travel', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', platforms: ['YouTube', 'TikTok'], followers: '256K', engagementRate: '5.1%', posts: 203, applicationDate: '2024-01-14', status: 'pending' },
    { id: '4', name: '정민재', handle: '@minjae_adventure', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', platforms: ['Instagram'], followers: '45K', engagementRate: '6.2%', posts: 67, applicationDate: '2024-01-13', status: 'pending' },
    { id: '5', name: '최동현', handle: '@donghyun_travel', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', platforms: ['YouTube'], followers: '178K', engagementRate: '4.5%', posts: 156, applicationDate: '2024-01-12', status: 'pending' },
  ]);

  const tabs = [
    { key: 'pending' as const, label: '대기중', count: 5 },
    { key: 'approved' as const, label: '승인완료', count: 127 },
    { key: 'rejected' as const, label: '반려', count: 12 },
  ];

  const handleApprove = (influencerId: string) => {
    alert('인플루언서 승인이 완료되었습니다.');
  };

  const handleReject = (influencerId: string) => {
    alert('인플루언서 신청이 반려되었습니다.');
  };

  const filteredInfluencers = influencers.filter(inf => inf.status === activeTab);

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-text-primary">인플루언서 관리</h1>
          <p className="text-sm text-text-secondary mt-1">인플루언서 신청을 검토하고 승인합니다</p>
        </div>
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
            placeholder="이름, 채널명으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Influencer Cards Grid */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-5">
        {filteredInfluencers.map((influencer) => (
          <div key={influencer.id} className="bg-white rounded-lg shadow-card p-6">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <img src={influencer.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
              <div className="flex-1">
                <div className="text-lg font-semibold mb-1">{influencer.name}</div>
                <div className="text-[13px] text-text-secondary mb-2">{influencer.handle}</div>
                <div className="flex gap-1.5">
                  {influencer.platforms.map((platform) => (
                    <span key={platform} className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-background-light text-text-secondary">
                      {platform}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-border-light mb-4">
              <div className="text-center">
                <div className="text-lg font-bold text-text-primary">{influencer.followers}</div>
                <div className="text-[11px] text-text-muted mt-0.5">팔로워</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-text-primary">{influencer.engagementRate}</div>
                <div className="text-[11px] text-text-muted mt-0.5">참여율</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-text-primary">{influencer.posts}</div>
                <div className="text-[11px] text-text-muted mt-0.5">게시물</div>
              </div>
            </div>

            {/* Meta */}
            <div className="flex justify-between items-center mb-4">
              <span className="text-xs text-text-secondary">
                <span className="text-text-muted">신청일:</span> {influencer.applicationDate}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">
                대기중
              </span>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                onClick={() => handleApprove(influencer.id)}
              >
                승인
              </Button>
              <button
                className="flex-1 py-2.5 rounded-md text-[13px] font-semibold bg-background-light text-text-primary hover:bg-border-light transition-all"
                onClick={() => handleReject(influencer.id)}
              >
                반려
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
