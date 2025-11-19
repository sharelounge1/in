import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface InquiryDetail {
  id: string;
  inquiryId: string;
  title: string;
  content: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  attachments: Array<{ name: string; url: string }>;
  user: {
    name: string;
    email: string;
    avatar: string;
    courses: number;
    inquiries: number;
  };
  history: Array<{
    id: string;
    action: string;
    time: string;
  }>;
}

export const InquiryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [replyContent, setReplyContent] = useState(`안녕하세요, 김서연 고객님.

먼저 불편을 끼쳐드려 죄송합니다.

확인 결과, 결제는 정상적으로 완료되었으나 시스템 동기화 지연으로 인해 예약 내역이 마이페이지에 반영되지 않았습니다.

현재 해당 건은 정상 예약 처리되었으며, 마이페이지에서도 확인하실 수 있도록 조치하였습니다.

다시 한번 불편을 끼쳐드린 점 사과드리며, 추가 문의사항이 있으시면 언제든 연락주세요.

감사합니다.`);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  const [inquiry] = useState<InquiryDetail>({
    id: '1',
    inquiryId: 'INQ-2024011500001',
    title: '결제 완료 후 예약 확인이 안됩니다',
    content: `안녕하세요,

오늘 오후 2시경에 "제주 힐링 3박4일" 코스를 결제했는데, 마이페이지에서 예약 내역을 확인할 수가 없습니다.

카드 결제는 정상적으로 완료되어 문자도 왔는데, 앱에서는 예약이 표시되지 않네요.

결제 금액: 890,000원
결제 수단: 신한카드
결제 승인번호: 12345678

확인 부탁드립니다. 출발일이 2주 뒤라서 좀 급합니다.

감사합니다.`,
    category: '결제',
    priority: 'high',
    status: 'pending',
    createdAt: '2024-01-15 14:32',
    attachments: [
      { name: '결제_완료_캡처.png', url: '#' },
      { name: '마이페이지_화면.png', url: '#' },
    ],
    user: {
      name: '김서연',
      email: 'seoyeon.kim@email.com',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      courses: 5,
      inquiries: 3,
    },
    history: [
      { id: '1', action: '문의 등록됨', time: '2024-01-15 14:32' },
      { id: '2', action: '관리자 확인', time: '2024-01-15 14:45' },
    ],
  });

  const handleSaveDraft = () => {
    alert('답변이 임시저장되었습니다.');
  };

  const handleSubmitReply = () => {
    alert('답변이 등록되었습니다.');
    navigate('/admin/inquiries');
  };

  const handleAssignAgent = () => {
    alert('담당자를 배정합니다.');
  };

  const handleChangePriority = () => {
    alert('우선순위를 변경합니다.');
  };

  const handleChangeStatus = () => {
    alert('상태를 변경합니다.');
  };

  const handleDeleteInquiry = () => {
    if (confirm('정말 삭제하시겠습니까?')) {
      alert('문의가 삭제되었습니다.');
      navigate('/admin/inquiries');
    }
  };

  return (
    <div className="max-w-[1200px]">
      {/* Back Link */}
      <Link to="/admin/inquiries" className="inline-flex items-center gap-2 text-text-secondary text-sm mb-4 hover:text-primary-start">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
        </svg>
        문의 목록으로 돌아가기
      </Link>

      {/* Page Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">문의 상세</h1>
          <div className="flex gap-4 items-center">
            <span className="font-mono text-[13px] text-text-muted">{inquiry.inquiryId}</span>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-[2fr_1fr] gap-6">
        {/* Main Content */}
        <div>
          <Card className="overflow-hidden">
            {/* Inquiry Header */}
            <div className="p-6 border-b border-border-light">
              <h2 className="text-lg font-semibold text-text-primary mb-3">{inquiry.title}</h2>
              <div className="flex gap-6 flex-wrap">
                <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                  <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  {inquiry.createdAt}
                </div>
                <div className="flex items-center gap-2 text-[13px] text-text-secondary">
                  <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/>
                  </svg>
                  {inquiry.category}
                </div>
              </div>
            </div>

            {/* Inquiry Content */}
            <div className="p-6">
              <div className="text-[15px] leading-relaxed text-text-primary whitespace-pre-wrap">
                {inquiry.content}
              </div>

              {/* Attachments */}
              {inquiry.attachments.length > 0 && (
                <div className="mt-6 pt-6 border-t border-border-light">
                  <h4 className="text-sm font-semibold mb-3">첨부파일</h4>
                  <div className="flex gap-3 flex-wrap">
                    {inquiry.attachments.map((attachment) => (
                      <a
                        key={attachment.name}
                        href={attachment.url}
                        className="flex items-center gap-2 px-3 py-2 bg-background-light rounded text-[13px] text-text-secondary hover:bg-border-light transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                        {attachment.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reply Section */}
            <div className="p-6 border-t border-border-light bg-background-light">
              <h3 className="text-base font-semibold mb-4">답변 작성</h3>
              <textarea
                className="w-full min-h-[150px] p-4 border border-border-light rounded-md text-sm resize-y bg-white focus:outline-none focus:border-primary-start"
                placeholder="답변 내용을 입력하세요..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex justify-between items-center mt-4">
                <select
                  className="py-2.5 px-4 border border-border-light rounded-md text-[13px] bg-white"
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                >
                  <option value="">템플릿 선택...</option>
                  <option value="payment">결제 확인 안내</option>
                  <option value="refund">환불 처리 안내</option>
                  <option value="schedule">일정 변경 안내</option>
                  <option value="general">일반 안내</option>
                </select>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleSaveDraft}>
                    임시저장
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSubmitReply}>
                    답변 등록
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          {/* User Info */}
          <Card className="p-6 mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4 pb-3 border-b border-border-light">회원 정보</h3>
            <div className="flex items-center gap-3 mb-4">
              <img src={inquiry.user.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
              <div>
                <div className="text-[15px] font-semibold mb-0.5">{inquiry.user.name}</div>
                <div className="text-xs text-text-secondary">{inquiry.user.email}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border-light">
              <div className="text-center">
                <div className="text-lg font-bold text-text-primary">{inquiry.user.courses}</div>
                <div className="text-[11px] text-text-muted">참여 코스</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-text-primary">{inquiry.user.inquiries}</div>
                <div className="text-[11px] text-text-muted">총 문의</div>
              </div>
            </div>
          </Card>

          {/* Status Info */}
          <Card className="p-6 mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4 pb-3 border-b border-border-light">문의 상태</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-3 border-b border-border-light">
                <span className="text-[13px] text-text-secondary">상태</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-600">대기중</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border-light">
                <span className="text-[13px] text-text-secondary">카테고리</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-600">{inquiry.category}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-border-light">
                <span className="text-[13px] text-text-secondary">우선순위</span>
                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">높음</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-[13px] text-text-secondary">담당자</span>
                <span className="text-[13px] font-medium">미배정</span>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 mb-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4">빠른 작업</h3>
            <div className="flex flex-col gap-2">
              <button
                className="w-full py-3 rounded-md text-sm font-medium bg-gradient-to-r from-primary-start to-primary-end text-white shadow-[0_4px_14px_rgba(124,58,237,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(124,58,237,0.4)] transition-all"
                onClick={handleAssignAgent}
              >
                담당자 배정
              </button>
              <button
                className="w-full py-3 rounded-md text-sm font-medium bg-background-light text-text-primary hover:bg-border-light transition-colors"
                onClick={handleChangePriority}
              >
                우선순위 변경
              </button>
              <button
                className="w-full py-3 rounded-md text-sm font-medium bg-background-light text-text-primary hover:bg-border-light transition-colors"
                onClick={handleChangeStatus}
              >
                상태 변경
              </button>
              <button
                className="w-full py-3 rounded-md text-sm font-medium bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                onClick={handleDeleteInquiry}
              >
                문의 삭제
              </button>
            </div>
          </Card>

          {/* History */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-text-primary mb-4 pb-3 border-b border-border-light">처리 이력</h3>
            <div className="space-y-3">
              {inquiry.history.map((item) => (
                <div key={item.id} className="flex gap-3 py-3 border-b border-border-light last:border-0">
                  <div className="w-6 h-6 rounded-full bg-background-light flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-text-primary">{item.action}</div>
                    <div className="text-[11px] text-text-muted mt-0.5">{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
