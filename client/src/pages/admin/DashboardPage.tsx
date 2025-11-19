import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface StatCard {
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  icon: React.ReactNode;
  iconColor: string;
  link: string;
}

interface RecentApproval {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  followers: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Activity {
  id: string;
  type: 'settlement' | 'user' | 'influencer' | 'payment' | 'inquiry';
  text: string;
  time: string;
}

export const DashboardPage = () => {
  const [stats] = useState<StatCard[]>([
    {
      label: '총 회원수',
      value: '8,456',
      change: '+12.5%',
      changeType: 'up',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
        </svg>
      ),
      iconColor: 'bg-blue-100 text-blue-500',
      link: '/admin/users',
    },
    {
      label: '활동 인플루언서',
      value: '127',
      change: '+8.2%',
      changeType: 'up',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
        </svg>
      ),
      iconColor: 'bg-purple-100 text-purple-500',
      link: '/admin/influencers',
    },
    {
      label: '이번 달 거래액',
      value: '1.2억',
      change: '+23.1%',
      changeType: 'up',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      ),
      iconColor: 'bg-green-100 text-green-500',
      link: '/admin/payments',
    },
    {
      label: '진행중 코스',
      value: '342',
      change: '-2.4%',
      changeType: 'down',
      icon: (
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
        </svg>
      ),
      iconColor: 'bg-orange-100 text-orange-500',
      link: '/admin/settlements',
    },
  ]);

  const [recentApprovals] = useState<RecentApproval[]>([
    { id: '1', name: '김지현', handle: '@travel_jihyun', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', followers: '125K', date: '2024-01-15', status: 'pending' },
    { id: '2', name: '이준혁', handle: '@junhyuk_trip', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', followers: '89K', date: '2024-01-14', status: 'pending' },
    { id: '3', name: '박서윤', handle: '@seoyun_travel', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', followers: '256K', date: '2024-01-13', status: 'approved' },
    { id: '4', name: '최민준', handle: '@minjun_adventure', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', followers: '67K', date: '2024-01-12', status: 'rejected' },
  ]);

  const [activities] = useState<Activity[]>([
    { id: '1', type: 'settlement', text: '<strong>정산 완료</strong> - 김지민 인플루언서 3월 정산 2,450,000원', time: '5분 전' },
    { id: '2', type: 'user', text: '<strong>신규 가입</strong> - 박서연 회원이 가입했습니다', time: '15분 전' },
    { id: '3', type: 'influencer', text: '<strong>인플루언서 승인</strong> - 이수진 승인 완료', time: '1시간 전' },
    { id: '4', type: 'payment', text: '<strong>결제 완료</strong> - 제주 힐링 3박4일 코스 890,000원', time: '2시간 전' },
    { id: '5', type: 'inquiry', text: '<strong>문의 접수</strong> - 환불 관련 문의 등록', time: '3시간 전' },
  ]);

  const getStatusBadge = (status: RecentApproval['status']) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-600',
      approved: 'bg-green-100 text-green-600',
      rejected: 'bg-red-100 text-red-600',
    };
    const labels = {
      pending: '대기중',
      approved: '승인완료',
      rejected: '반려',
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const getActivityIcon = (type: Activity['type']) => {
    const icons = {
      settlement: { bg: 'bg-green-100', color: 'text-green-500', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/> },
      user: { bg: 'bg-blue-100', color: 'text-blue-500', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/> },
      influencer: { bg: 'bg-purple-100', color: 'text-purple-500', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/> },
      payment: { bg: 'bg-green-100', color: 'text-green-500', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/> },
      inquiry: { bg: 'bg-blue-100', color: 'text-blue-500', icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/> },
    };
    return icons[type];
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-text-primary">대시보드</h1>
          <p className="text-sm text-text-secondary mt-1">플랫폼 전체 현황을 확인하세요</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            리포트 다운로드
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <Link key={stat.label} to={stat.link} className="block">
            <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-md flex items-center justify-center ${stat.iconColor}`}>
                  <div className="w-6 h-6">{stat.icon}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${stat.changeType === 'up' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                  {stat.change}
                </span>
              </div>
              <div className="text-[32px] font-bold text-text-primary mb-1">{stat.value}</div>
              <div className="text-sm text-text-secondary">{stat.label}</div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-[2fr_1fr] gap-6">
        {/* Recent Approvals */}
        <Card>
          <div className="flex justify-between items-center px-6 py-5 border-b border-border-light">
            <h3 className="text-base font-semibold text-text-primary">최근 인플루언서 승인 요청</h3>
            <Link to="/admin/influencers" className="text-sm text-primary-start hover:underline">전체보기</Link>
          </div>
          <table className="w-full">
            <thead>
              <tr>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">인플루언서</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">팔로워</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">신청일</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">상태</th>
              </tr>
            </thead>
            <tbody>
              {recentApprovals.map((approval) => (
                <tr key={approval.id} className="hover:bg-background-light cursor-pointer border-b border-border-light last:border-0">
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <img src={approval.avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
                      <div>
                        <div className="font-medium text-sm">{approval.name}</div>
                        <div className="text-xs text-text-secondary">{approval.handle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-sm">{approval.followers}</td>
                  <td className="px-6 py-3.5 text-sm">{approval.date}</td>
                  <td className="px-6 py-3.5">{getStatusBadge(approval.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="flex justify-between items-center px-6 py-5 border-b border-border-light">
            <h3 className="text-base font-semibold text-text-primary">최근 활동</h3>
            <a href="#" className="text-sm text-primary-start hover:underline">전체보기</a>
          </div>
          <div className="p-4">
            {activities.map((activity) => {
              const iconData = getActivityIcon(activity.type);
              return (
                <div key={activity.id} className="flex gap-3 py-3 border-b border-border-light last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${iconData.bg}`}>
                    <svg className={`w-4 h-4 ${iconData.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {iconData.icon}
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] text-text-primary leading-relaxed" dangerouslySetInnerHTML={{ __html: activity.text }} />
                    <p className="text-xs text-text-muted mt-1">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
};
