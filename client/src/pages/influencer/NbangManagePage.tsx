import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInfluencerMutations } from '@/hooks/useInfluencer';

type ExpenseCategory = 'food' | 'transport' | 'accommodation' | 'activity' | 'other';

interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: ExpenseCategory;
  perPerson: number;
  date: string;
}

export const NbangManagePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [selectedCourse, setSelectedCourse] = useState('제주 힐링 3박 4일');
  const { addNbangItem, isAddingNbangItem } = useInfluencerMutations();

  // Mock data
  const mockSummary = {
    totalAmount: 1560000,
    perPerson: 130000,
    participantCount: 12,
    itemCount: 8,
    settledCount: 5,
  };

  const mockExpenses: ExpenseItem[] = [
    { id: '1', title: '1일차 점심 식사', amount: 360000, category: 'food', perPerson: 30000, date: '2025.01.28' },
    { id: '2', title: '공항-호텔 버스', amount: 240000, category: 'transport', perPerson: 20000, date: '2025.01.28' },
    { id: '3', title: '한라산 트레킹', amount: 480000, category: 'activity', perPerson: 40000, date: '2025.01.29' },
    { id: '4', title: '단체 사진 촬영', amount: 480000, category: 'other', perPerson: 40000, date: '2025.01.30' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const getCategoryIcon = (category: ExpenseCategory) => {
    switch (category) {
      case 'food':
        return (
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-500 flex items-center justify-center">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      case 'transport':
        return (
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        );
      case 'activity':
        return (
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
        );
    }
  };

  const getCategoryLabel = (category: ExpenseCategory) => {
    const labels = { food: '식비', transport: '교통', accommodation: '숙박', activity: '액티비티', other: '기타' };
    return labels[category];
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
          <span className="font-semibold">N빵 관리</span>
          <div className="w-6" />
        </div>
      </header>

      {/* Course Selector */}
      <div className="px-5 py-4 border-b border-gray-100">
        <p className="text-xs text-gray-500 mb-2">코스 선택</p>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm"
        >
          <option>제주 힐링 3박 4일</option>
          <option>도쿄 맛집 투어 4박 5일</option>
          <option>방콕 럭셔리 5박 6일</option>
        </select>
      </div>

      {/* Summary Card */}
      <div className="mx-5 mt-5">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-5 text-white shadow-lg">
          <p className="text-sm opacity-90 mb-3">총 공동 비용</p>
          <p className="text-2xl font-bold mb-1">{formatCurrency(mockSummary.totalAmount)}</p>
          <p className="text-sm opacity-90 mb-4">
            1인당 {formatCurrency(mockSummary.perPerson)} ({mockSummary.participantCount}명 기준)
          </p>
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20 text-center">
            <div>
              <p className="font-semibold">{mockSummary.itemCount}</p>
              <p className="text-xs opacity-80">등록 항목</p>
            </div>
            <div>
              <p className="font-semibold">{mockSummary.participantCount}</p>
              <p className="text-xs opacity-80">참가자</p>
            </div>
            <div>
              <p className="font-semibold">{mockSummary.settledCount}</p>
              <p className="text-xs opacity-80">정산 완료</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mx-5 mt-5 p-3.5 bg-blue-50 rounded-lg flex items-center gap-3">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5 text-blue-500 flex-shrink-0">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm text-blue-600">비용 등록 후 참가자에게 자동으로 알림이 발송됩니다</p>
      </div>

      {/* Expense List Header */}
      <div className="flex justify-between items-center px-5 py-4">
        <h3 className="font-semibold">비용 항목</h3>
        <button className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-medium">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          비용 추가
        </button>
      </div>

      {/* Expense List */}
      <div className="px-5">
        {mockExpenses.map((expense) => (
          <div key={expense.id} className="bg-white rounded-lg shadow-sm mb-3 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-3.5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                {getCategoryIcon(expense.category)}
                <span className="font-semibold text-sm">{expense.title}</span>
              </div>
              <span className="font-bold text-violet-600">{formatCurrency(expense.amount)}</span>
            </div>

            {/* Body */}
            <div className="p-3.5">
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-gray-500">카테고리</span>
                <span className="text-xs font-medium">{getCategoryLabel(expense.category)}</span>
              </div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-gray-500">1인당 금액</span>
                <span className="text-xs font-medium">{formatCurrency(expense.perPerson)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-gray-500">등록일</span>
                <span className="text-xs font-medium">{expense.date}</span>
              </div>
              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
                <button className="flex-1 py-2 rounded-lg text-xs font-medium bg-gray-100 text-gray-900">
                  수정
                </button>
                <button className="flex-1 py-2 rounded-lg text-xs font-medium bg-red-50 text-red-500">
                  삭제
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NbangManagePage;
