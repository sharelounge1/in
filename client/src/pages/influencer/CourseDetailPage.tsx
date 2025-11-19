import { useParams, Link } from 'react-router-dom';
import { useCourseDetail } from '@/hooks/useCourses';

export const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: courseData, isLoading } = useCourseDetail(id || '');

  // Mock data for demonstration
  const mockCourse = {
    id: '1',
    title: '제주 힐링 3박 4일',
    thumbnail: 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=800',
    status: 'recruiting',
    startDate: '2025.01.25',
    endDate: '01.28',
    daysLeft: 7,
    confirmed: 12,
    pending: 8,
    maxParticipants: 20,
    price: 890000,
    location: '제주도, 서귀포',
    recruitmentPeriod: '01.10 - 01.23',
    includes: '숙박, 식사, 교통',
    createdAt: '2025.01.05',
    grossRevenue: 10680000,
    fee: 1068000,
    netRevenue: 9612000,
  };

  const mockApplicants = [
    { id: '1', name: '김민수', date: '오늘 14:30', status: 'pending', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
    { id: '2', name: '이서연', date: '오늘 11:20', status: 'approved', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
    { id: '3', name: '박준호', date: '어제 18:45', status: 'pending', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  ];

  const mockSchedule = [
    {
      day: 1,
      date: '1월 25일',
      items: [
        { time: '10:00', content: '제주공항 집결' },
        { time: '12:00', content: '점심 - 흑돼지 맛집' },
        { time: '14:00', content: '성산일출봉 탐방' },
      ],
    },
    {
      day: 2,
      date: '1월 26일',
      items: [
        { time: '09:00', content: '카페 투어' },
        { time: '14:00', content: '우도 관광' },
      ],
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const actionButtons = [
    { to: `/influencer/courses/${id}/edit`, label: '수정하기', icon: 'edit', primary: false },
    { to: `/influencer/courses/${id}/applications`, label: '신청자 관리', icon: 'users', primary: true },
    { to: `/influencer/courses/${id}/participants`, label: '참가자', icon: 'participants', primary: false },
    { to: `/influencer/courses/${id}/announcements`, label: '공지', icon: 'announcement', primary: false },
    { to: `/influencer/courses/${id}/expenses`, label: '경비', icon: 'expense', primary: false },
    { to: `/influencer/courses/${id}/nbang`, label: 'N빵', icon: 'nbang', primary: false },
  ];

  return (
    <div className="pb-20">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to="/influencer/courses" className="p-1">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="font-semibold">코스 상세</span>
          <button className="p-1">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Image */}
      <img src={mockCourse.thumbnail} alt={mockCourse.title} className="w-full h-60 object-cover" />

      {/* Course Header */}
      <div className="p-5 bg-white">
        <div className="flex justify-between items-center mb-3">
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-violet-50 text-violet-600">모집중</span>
          <span className="text-sm text-gray-500">D-{mockCourse.daysLeft}</span>
        </div>
        <h1 className="text-xl font-bold mb-2">{mockCourse.title}</h1>
        <p className="text-sm text-gray-500 flex items-center">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {mockCourse.startDate} - {mockCourse.endDate}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2 mx-5 mb-5">
        {[
          { value: mockCourse.confirmed, label: '확정' },
          { value: mockCourse.pending, label: '대기' },
          { value: mockCourse.maxParticipants, label: '정원' },
          { value: '890K', label: '가격' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-3.5 text-center shadow-sm">
            <p className="text-lg font-bold text-violet-600 mb-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-2 mx-5 mb-5">
        {actionButtons.map((action) => (
          <Link
            key={action.label}
            to={action.to}
            className={`flex flex-col items-center justify-center gap-1 py-3 px-2 rounded-lg text-xs font-medium ${
              action.primary
                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
              {action.icon === 'edit' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />}
              {action.icon === 'users' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
              {action.icon === 'participants' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />}
              {action.icon === 'announcement' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />}
              {action.icon === 'expense' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />}
              {action.icon === 'nbang' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />}
            </svg>
            {action.label}
          </Link>
        ))}
      </div>

      {/* Revenue Summary */}
      <div className="mx-5 mb-5">
        <h3 className="font-semibold mb-3">예상 수익</h3>
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-2">예상 정산 금액</p>
          <p className="text-2xl font-bold mb-3">{formatCurrency(mockCourse.netRevenue)}</p>
          <div className="flex justify-between text-sm opacity-90">
            <span>총 수익: {formatCurrency(mockCourse.grossRevenue)}</span>
            <span>수수료: -{formatCurrency(mockCourse.fee)}</span>
          </div>
        </div>
      </div>

      {/* Course Info */}
      <div className="mx-5 mb-5">
        <h3 className="font-semibold mb-3">코스 정보</h3>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          {[
            { label: '여행 지역', value: mockCourse.location },
            { label: '모집 기간', value: mockCourse.recruitmentPeriod },
            { label: '포함 사항', value: mockCourse.includes },
            { label: '생성일', value: mockCourse.createdAt },
          ].map((info, index, arr) => (
            <div
              key={info.label}
              className={`flex justify-between py-2.5 ${index < arr.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <span className="text-sm text-gray-500">{info.label}</span>
              <span className="text-sm font-medium">{info.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Applicants */}
      <div className="mx-5 mb-5">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold">최근 신청자</h3>
          <Link to={`/influencer/courses/${id}/applications`} className="text-sm text-gray-500">
            전체보기
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {mockApplicants.map((applicant, index) => (
            <div
              key={applicant.id}
              className={`flex items-center p-3.5 ${index < mockApplicants.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <img src={applicant.avatar} alt={applicant.name} className="w-10 h-10 rounded-full object-cover mr-3" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-0.5">{applicant.name}</p>
                <p className="text-xs text-gray-500">{applicant.date}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  applicant.status === 'pending' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                {applicant.status === 'pending' ? '대기중' : '승인'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule */}
      <div className="mx-5 mb-5">
        <h3 className="font-semibold mb-3">여행 일정</h3>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          {mockSchedule.map((day) => (
            <div key={day.day} className="mb-4 last:mb-0">
              <p className="text-sm font-semibold text-violet-600 mb-2">
                Day {day.day} - {day.date}
              </p>
              {day.items.map((item, index) => (
                <div key={index} className="flex items-start gap-2 py-1.5">
                  <span className="text-xs text-gray-400 w-12 flex-shrink-0">{item.time}</span>
                  <span className="text-sm text-gray-600">{item.content}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
