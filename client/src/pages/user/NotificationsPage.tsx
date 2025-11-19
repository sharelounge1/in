import { useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotificationsInfinite, useNotificationMutations } from '@/hooks/useNotifications';

// Icons
const BackIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const AnnouncementIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
  </svg>
);

const ScheduleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExpenseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const InquiryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const ClipboardIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const BellIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

interface NotificationItem {
  id: string;
  type: 'announcement' | 'schedule' | 'expense' | 'chat' | 'inquiry';
  title: string;
  time: string;
  isRead: boolean;
  link: string;
}

interface NotificationGroup {
  date: string;
  items: NotificationItem[];
}

export const NotificationsPage = () => {
  const navigate = useNavigate();

  const {
    data: notificationsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useNotificationsInfinite({ limit: 20 });

  const { markAllAsRead, isMarkingAllAsRead } = useNotificationMutations();

  const notifications = useMemo(() => {
    if (!notificationsData?.pages) return [];
    return notificationsData.pages.flatMap((page) =>
      page.success ? page.data.items : []
    );
  }, [notificationsData]);

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, [markAllAsRead]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'announcement':
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full">
            <AnnouncementIcon />
          </div>
        );
      case 'schedule':
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full text-blue-500">
            <ScheduleIcon />
          </div>
        );
      case 'expense':
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-green-100 rounded-full text-green-500">
            <ExpenseIcon />
          </div>
        );
      case 'chat':
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 rounded-full text-yellow-600">
            <ChatIcon />
          </div>
        );
      case 'inquiry':
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-full text-purple-500">
            <InquiryIcon />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full">
            <AnnouncementIcon />
          </div>
        );
    }
  };

  // Mock notification data grouped by date
  const mockNotificationGroups: NotificationGroup[] = [
    {
      date: '오늘',
      items: [
        {
          id: '1',
          type: 'announcement',
          title: '<strong>제주 힐링 3박 4일</strong>에서 새로운 공지가 등록되었습니다: 2일차 일정 변경 안내',
          time: '10분 전',
          isRead: false,
          link: '/announcements/1',
        },
        {
          id: '2',
          type: 'schedule',
          title: '곧 <strong>중식</strong> 일정이 시작됩니다. 1100고지 휴게소로 이동해주세요.',
          time: '30분 전',
          isRead: false,
          link: '/travels/1/schedule',
        },
        {
          id: '3',
          type: 'chat',
          title: '<strong>이서연</strong>님이 채팅방에 사진을 공유했습니다.',
          time: '1시간 전',
          isRead: true,
          link: '/travels/1/chat',
        },
        {
          id: '4',
          type: 'expense',
          title: '등산 스틱 대여 결제가 완료되었습니다. <strong>-5,000원</strong>',
          time: '2시간 전',
          isRead: true,
          link: '/travels/1/expenses',
        },
      ],
    },
    {
      date: '어제',
      items: [
        {
          id: '5',
          type: 'announcement',
          title: '<strong>제주 힐링 3박 4일</strong>에서 새로운 공지가 등록되었습니다: 1일차 일정 완료 및 후기',
          time: '어제 오후 8:30',
          isRead: true,
          link: '/announcements/2',
        },
        {
          id: '6',
          type: 'expense',
          title: '우도 전기차 렌트 결제가 완료되었습니다. <strong>-30,000원</strong>',
          time: '어제 오후 2:15',
          isRead: true,
          link: '/travels/1/expenses',
        },
        {
          id: '7',
          type: 'chat',
          title: '채팅방에서 <strong>5개</strong>의 새로운 메시지가 있습니다.',
          time: '어제 오전 11:20',
          isRead: true,
          link: '/travels/1/chat',
        },
      ],
    },
    {
      date: '1월 25일',
      items: [
        {
          id: '8',
          type: 'schedule',
          title: '<strong>제주 힐링 3박 4일</strong> 여행이 시작되었습니다! 즐거운 여행 되세요!',
          time: '1월 25일 오전 9:00',
          isRead: true,
          link: '/travels/1',
        },
        {
          id: '9',
          type: 'inquiry',
          title: '문의하신 내용에 답변이 등록되었습니다.',
          time: '1월 25일 오전 8:30',
          isRead: true,
          link: '/inquiries/1',
        },
        {
          id: '10',
          type: 'expense',
          title: '경비 충전이 완료되었습니다. <strong>+300,000원</strong>',
          time: '1월 25일 오전 7:00',
          isRead: true,
          link: '/travels/1/expenses',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
        <button onClick={() => navigate(-1)}>
          <BackIcon />
        </button>
        <span className="font-semibold">알림</span>
        <div className="w-6" />
      </header>

      {/* Content */}
      <div className="pb-20">
        {/* Notification Header */}
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-lg font-bold">알림 목록</span>
          <button
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAllAsRead}
            className="text-sm font-medium text-purple-500"
          >
            {isMarkingAllAsRead ? '처리중...' : '모두 읽음'}
          </button>
        </div>

        {/* Notification List */}
        <div className="px-5">
          {isLoading ? (
            [1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3 p-4 mb-2 bg-white rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1">
                  <div className="w-full h-4 mb-2 bg-gray-200 rounded" />
                  <div className="w-16 h-3 bg-gray-200 rounded" />
                </div>
              </div>
            ))
          ) : (
            mockNotificationGroups.map((group) => (
              <div key={group.date} className="mb-6">
                <p className="mb-2 text-sm font-semibold text-gray-500">{group.date}</p>
                {group.items.map((item) => (
                  <Link
                    key={item.id}
                    to={item.link}
                    className={`flex gap-3 p-4 mb-2 bg-white rounded-lg transition hover:bg-gray-50 ${
                      !item.isRead ? 'border-l-3 border-purple-500' : ''
                    }`}
                    style={!item.isRead ? { borderLeftWidth: '3px', borderLeftColor: '#7C3AED' } : {}}
                  >
                    {getNotificationIcon(item.type)}
                    <div className="flex-1">
                      <p
                        className="mb-1 text-sm leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: item.title }}
                      />
                      <p className="text-xs text-gray-400">{item.time}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ))
          )}

          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full py-3 text-sm font-medium text-purple-500"
            >
              {isFetchingNextPage ? '로딩중...' : '더보기'}
            </button>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link to="/" className="flex flex-col items-center py-2 text-gray-400">
            <HomeIcon />
            <span className="mt-1 text-xs">홈</span>
          </Link>
          <Link to="/my-applications" className="flex flex-col items-center py-2 text-gray-400">
            <ClipboardIcon />
            <span className="mt-1 text-xs">내 신청</span>
          </Link>
          <Link to="/active-travels" className="flex flex-col items-center py-2 text-gray-400">
            <BellIcon />
            <span className="mt-1 text-xs">진행중</span>
          </Link>
          <Link to="/mypage" className="flex flex-col items-center py-2 text-gray-400">
            <UserIcon />
            <span className="mt-1 text-xs">마이페이지</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default NotificationsPage;
