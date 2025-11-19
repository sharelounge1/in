import { useParams, Link } from 'react-router-dom';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  gender: string;
  age: number;
  phone: string;
  email: string;
  paymentStatus: 'paid' | 'partial' | 'unpaid';
}

export const ParticipantsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();

  // Mock data
  const mockCourse = {
    title: '도쿄 맛집 투어 4박 5일',
    date: '2025.01.10 - 01.14',
    status: '진행중',
  };

  const mockParticipants: Participant[] = [
    {
      id: '1',
      name: '이서연',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      gender: '여',
      age: 30,
      phone: '010-3456-7890',
      email: 'seoyeon@email.com',
      paymentStatus: 'paid',
    },
    {
      id: '2',
      name: '박준호',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      gender: '남',
      age: 32,
      phone: '010-4567-8901',
      email: 'junho@email.com',
      paymentStatus: 'paid',
    },
    {
      id: '3',
      name: '정수진',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      gender: '여',
      age: 26,
      phone: '010-5678-9012',
      email: 'sujin@email.com',
      paymentStatus: 'paid',
    },
    {
      id: '4',
      name: '김민수',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      gender: '남',
      age: 28,
      phone: '010-1234-5678',
      email: 'minsu@email.com',
      paymentStatus: 'paid',
    },
  ];

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
          <span className="font-semibold">참가자 관리</span>
          <button className="p-1">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Course Header */}
      <div className="p-5 bg-white border-b border-gray-100">
        <h2 className="text-lg font-bold mb-1">{mockCourse.title}</h2>
        <p className="text-sm text-gray-500">{mockCourse.date} | {mockCourse.status}</p>
      </div>

      {/* Summary Banner */}
      <div className="mx-5 mt-5">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm opacity-90">확정 참가자</span>
            <span className="text-2xl font-bold">{mockParticipants.length} / 20명</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 px-5 py-4">
        <Link
          to={`/influencer/courses/${courseId}/announcements`}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-lg bg-gray-100 text-sm font-medium"
        >
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
          </svg>
          공지 작성
        </Link>
        <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white text-sm font-medium">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          명단 내보내기
        </button>
      </div>

      {/* Participant List Header */}
      <div className="flex justify-between items-center px-5 mb-3">
        <h3 className="font-semibold">참가자 목록</h3>
        <span className="text-sm text-gray-500">{mockParticipants.length}명</span>
      </div>

      {/* Participant List */}
      <div className="px-5">
        {mockParticipants.map((participant, index) => (
          <div key={participant.id} className="bg-white rounded-xl shadow-sm mb-3 overflow-hidden">
            {/* Header */}
            <div className="flex items-center p-4">
              <img src={participant.avatar} alt={participant.name} className="w-12 h-12 rounded-full object-cover mr-3" />
              <div className="flex-1">
                <p className="font-semibold mb-1">{participant.name}</p>
                <p className="text-xs text-gray-500">
                  {participant.gender}, {participant.age}세 | {participant.phone}
                </p>
              </div>
              <span className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                {index + 1}
              </span>
            </div>

            {/* Details */}
            <div className="px-4 pb-4">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {participant.email}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-medium">
                  결제완료
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex border-t border-gray-100">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm text-gray-500 border-r border-gray-100 hover:bg-gray-50">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                전화
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm text-gray-500 border-r border-gray-100 hover:bg-gray-50">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                메시지
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm text-gray-500 hover:bg-gray-50">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
                더보기
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Group Chat FAB */}
      <button className="fixed bottom-24 right-5 w-14 h-14 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg z-50">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6 text-white">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      </button>
    </div>
  );
};

export default ParticipantsPage;
