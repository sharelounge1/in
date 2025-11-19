import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInfluencerMutations } from '@/hooks/useInfluencer';

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  isImportant: boolean;
  views: number;
  confirms: number;
}

export const AnnouncementsManagePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [selectedCourse, setSelectedCourse] = useState('도쿄 맛집 투어 4박 5일 (진행중)');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [sendPush, setSendPush] = useState(true);

  const { createCourseAnnouncement, isCreatingCourseAnnouncement } = useInfluencerMutations();

  // Mock announcements
  const mockAnnouncements: Announcement[] = [
    {
      id: '1',
      title: '여행 첫째 날 집합 장소 안내',
      content: '안녕하세요! 드디어 내일 출발이네요. 첫째 날 집합 장소와 시간을 다시 한번 안내드립니다. 나리타 공항 1터미널 입국장 앞에서...',
      date: '오늘 09:30',
      isImportant: true,
      views: 18,
      confirms: 15,
    },
    {
      id: '2',
      title: '준비물 체크리스트',
      content: '여행 전 꼭 챙기셔야 할 준비물을 정리했습니다. 여권, 현금(엔화), 편한 신발, 우산, 카메라 등을 잊지 마세요!',
      date: '어제 14:20',
      isImportant: false,
      views: 20,
      confirms: 20,
    },
    {
      id: '3',
      title: '결제 완료 안내',
      content: '참가비 결제가 완료되었습니다. 결제 영수증은 마이페이지에서 확인하실 수 있습니다. 감사합니다!',
      date: '3일 전',
      isImportant: true,
      views: 20,
      confirms: 20,
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !title || !content) return;

    try {
      await createCourseAnnouncement({
        courseId,
        data: {
          title,
          content,
          is_pinned: isImportant,
        },
      });
      setTitle('');
      setContent('');
      setIsImportant(false);
    } catch (error) {
      // Handle error
    }
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
          <span className="font-semibold">공지사항 관리</span>
          <div className="w-6" />
        </div>
      </header>

      {/* Course Selector */}
      <div className="px-5 py-4 bg-white border-b border-gray-100">
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm"
        >
          <option>도쿄 맛집 투어 4박 5일 (진행중)</option>
          <option>제주 힐링 3박 4일 (모집중)</option>
        </select>
      </div>

      {/* Create Form */}
      <div className="px-5 py-5">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold">새 공지사항 작성</h3>
          </div>
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-500"
                placeholder="공지사항 제목을 입력하세요"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 min-h-[100px] resize-y"
                placeholder="공지사항 내용을 입력하세요"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="important"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="w-4 h-4 accent-violet-600"
              />
              <label htmlFor="important" className="text-sm text-gray-600">중요 공지로 설정</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="push"
                checked={sendPush}
                onChange={(e) => setSendPush(e.target.checked)}
                className="w-4 h-4 accent-violet-600"
              />
              <label htmlFor="push" className="text-sm text-gray-600">참가자에게 푸시 알림 발송</label>
            </div>
            <button
              type="submit"
              disabled={isCreatingCourseAnnouncement || !title || !content}
              className="w-full py-3.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md disabled:opacity-50"
            >
              {isCreatingCourseAnnouncement ? '등록 중...' : '공지사항 등록'}
            </button>
          </form>
        </div>
      </div>

      {/* Announcements List */}
      <div className="px-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">등록된 공지사항</h3>
          <span className="text-sm text-gray-500">{mockAnnouncements.length}개</span>
        </div>

        {mockAnnouncements.map((announcement) => (
          <div key={announcement.id} className="bg-white rounded-xl shadow-sm mb-3 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-gray-400">{announcement.date}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  announcement.isImportant ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'
                }`}>
                  {announcement.isImportant ? '중요' : '일반'}
                </span>
              </div>
              <h4 className="font-semibold text-sm mb-2">{announcement.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{announcement.content}</p>
            </div>

            {/* Stats */}
            <div className="flex gap-4 px-4 py-3 bg-gray-50">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                조회 {announcement.views}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                확인 {announcement.confirms}
              </span>
            </div>

            {/* Actions */}
            <div className="flex border-t border-gray-100">
              <button className="flex-1 py-3 text-sm text-gray-500 border-r border-gray-100 hover:bg-gray-50">
                수정
              </button>
              <button className="flex-1 py-3 text-sm text-red-500 hover:bg-gray-50">
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsManagePage;
