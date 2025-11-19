import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  joinDate: string;
  role: 'user' | 'influencer';
  status: 'active' | 'inactive' | 'blocked';
  lastActivity: string;
}

type StatusFilter = '' | 'active' | 'inactive' | 'blocked';
type RoleFilter = '' | 'user' | 'influencer';
type SortFilter = '' | 'name' | 'recent';

export const UsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('');
  const [sortFilter, setSortFilter] = useState<SortFilter>('');
  const [currentPage, setCurrentPage] = useState(1);

  const [users] = useState<User[]>([
    { id: '1', name: '김서연', email: 'seoyeon.kim@email.com', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', joinDate: '2024-01-10', role: 'user', status: 'active', lastActivity: '2시간 전' },
    { id: '2', name: '이민수', email: 'minsu.lee@email.com', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100', joinDate: '2024-01-08', role: 'influencer', status: 'active', lastActivity: '30분 전' },
    { id: '3', name: '박지현', email: 'jihyun.park@email.com', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100', joinDate: '2024-01-05', role: 'user', status: 'inactive', lastActivity: '7일 전' },
    { id: '4', name: '최준혁', email: 'junhyuk.choi@email.com', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', joinDate: '2024-01-03', role: 'user', status: 'blocked', lastActivity: '14일 전' },
    { id: '5', name: '정다영', email: 'dayoung.jung@email.com', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100', joinDate: '2024-01-02', role: 'influencer', status: 'active', lastActivity: '1시간 전' },
    { id: '6', name: '강현우', email: 'hyunwoo.kang@email.com', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100', joinDate: '2023-12-28', role: 'user', status: 'active', lastActivity: '5시간 전' },
  ]);

  const getStatusBadge = (status: User['status']) => {
    const styles = {
      active: 'bg-green-100 text-green-600',
      inactive: 'bg-gray-100 text-gray-600',
      blocked: 'bg-red-100 text-red-600',
    };
    const labels = {
      active: '활성',
      inactive: '비활성',
      blocked: '차단',
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[status]}`}>{labels[status]}</span>;
  };

  const getRoleBadge = (role: User['role']) => {
    const styles = {
      user: 'bg-blue-100 text-blue-600',
      influencer: 'bg-purple-100 text-purple-600',
    };
    const labels = {
      user: '일반',
      influencer: '인플루언서',
    };
    return <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${styles[role]}`}>{labels[role]}</span>;
  };

  const handleViewUser = (userId: string) => {
    alert(`회원 상세 정보를 표시합니다. (ID: ${userId})`);
  };

  const handleBlockUser = (userId: string, currentStatus: User['status']) => {
    if (currentStatus === 'blocked') {
      alert('차단을 해제합니다.');
    } else {
      alert('회원을 차단 처리합니다.');
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[28px] font-bold text-text-primary">회원 관리</h1>
          <p className="text-sm text-text-secondary mt-1">전체 회원 목록을 관리합니다</p>
        </div>
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
            placeholder="이름, 이메일로 검색..."
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
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
          <option value="blocked">차단</option>
        </select>
        <select
          className="py-3 px-4 border border-border-light rounded-md text-sm bg-white min-w-[140px] focus:outline-none focus:border-primary-start"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value as RoleFilter)}
        >
          <option value="">전체 유형</option>
          <option value="user">일반 회원</option>
          <option value="influencer">인플루언서</option>
        </select>
        <select
          className="py-3 px-4 border border-border-light rounded-md text-sm bg-white min-w-[140px] focus:outline-none focus:border-primary-start"
          value={sortFilter}
          onChange={(e) => setSortFilter(e.target.value as SortFilter)}
        >
          <option value="">가입일 순</option>
          <option value="name">이름 순</option>
          <option value="recent">최근 활동 순</option>
        </select>
      </div>

      {/* Table */}
      <Card>
        <div className="flex justify-between items-center px-6 py-5 border-b border-border-light">
          <span className="font-semibold">회원 목록</span>
          <span className="text-sm text-text-secondary">총 8,456명</span>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">회원정보</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">가입일</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">유형</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">상태</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">최근 활동</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-text-muted uppercase bg-background-light">작업</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-background-light cursor-pointer border-b border-border-light last:border-0" onClick={() => handleViewUser(user.id)}>
                <td className="px-6 py-3.5">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="font-medium text-sm">{user.name}</div>
                      <div className="text-xs text-text-secondary">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3.5 text-sm">{user.joinDate}</td>
                <td className="px-6 py-3.5">{getRoleBadge(user.role)}</td>
                <td className="px-6 py-3.5">{getStatusBadge(user.status)}</td>
                <td className="px-6 py-3.5 text-sm">{user.lastActivity}</td>
                <td className="px-6 py-3.5">
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="px-3 py-1.5 rounded text-xs font-medium bg-background-light text-text-primary hover:bg-border-light transition-colors"
                      onClick={() => handleViewUser(user.id)}
                    >
                      상세
                    </button>
                    <button
                      className="px-3 py-1.5 rounded text-xs font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                      onClick={() => handleBlockUser(user.id, user.status)}
                    >
                      {user.status === 'blocked' ? '해제' : '차단'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center px-6 py-4 border-t border-border-light">
          <span className="text-sm text-text-secondary">1 - 6 / 8,456 명</span>
          <div className="flex gap-2">
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white disabled:opacity-50" disabled>&lt;</button>
            <button className="px-3 py-2 border border-transparent rounded text-sm bg-gradient-to-r from-primary-start to-primary-end text-white">1</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">2</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">3</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white">...</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">1410</button>
            <button className="px-3 py-2 border border-border-light rounded text-sm bg-white hover:border-primary-start hover:text-primary-start">&gt;</button>
          </div>
        </div>
      </Card>
    </div>
  );
};
