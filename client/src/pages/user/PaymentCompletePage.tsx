import { useSearchParams, Link } from 'react-router-dom';
import { useCourseDetail } from '@/hooks/useCourses';

// Icons
const CheckIcon = () => (
  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const InfoIcon = () => (
  <svg className="w-4.5 h-4.5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const PaymentCompletePage = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('courseId');

  const { data: courseData } = useCourseDetail(courseId || '');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  // Mock payment data
  const paymentInfo = {
    orderNumber: 'ORD-2024122847382',
    paymentDate: '2024.12.21 15:32',
    paymentMethod: '네이버페이',
    amount: courseData?.data?.price || 890000,
    course: {
      title: courseData?.data?.title || '제주 힐링 3박 4일',
      date: '2025.01.25 - 01.28',
      image: courseData?.data?.thumbnail_url || 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=200',
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
        <div className="w-6" />
        <span className="font-semibold">결제 완료</span>
        <div className="w-6" />
      </header>

      {/* Content */}
      <div className="p-5 pb-32">
        {/* Success Message */}
        <div className="py-10 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-600 to-pink-500">
            <CheckIcon />
          </div>
          <h1 className="mb-2 text-2xl font-bold">결제가 완료되었습니다</h1>
          <p className="text-sm text-gray-500">신청 내역이 이메일로 발송되었습니다</p>
        </div>

        {/* Product Card */}
        <div className="flex gap-3 p-4 mb-5 bg-white border border-gray-100 rounded-lg">
          <img
            src={paymentInfo.course.image}
            alt={paymentInfo.course.title}
            className="object-cover w-20 h-20 rounded-lg"
          />
          <div className="flex-1">
            <h3 className="mb-1 font-semibold">{paymentInfo.course.title}</h3>
            <p className="mb-2 text-sm text-gray-500">{paymentInfo.course.date}</p>
            <p className="font-bold text-purple-600">{formatCurrency(paymentInfo.amount)}</p>
          </div>
        </div>

        {/* Order Info */}
        <div className="p-5 mb-5 bg-gray-100 rounded-xl">
          <h3 className="mb-4 text-sm font-semibold text-gray-500">결제 정보</h3>
          <div className="mb-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">주문번호</span>
              <span className="font-medium">{paymentInfo.orderNumber}</span>
            </div>
          </div>
          <div className="mb-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">결제일시</span>
              <span className="font-medium">{paymentInfo.paymentDate}</span>
            </div>
          </div>
          <div className="mb-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">결제수단</span>
              <span className="font-medium">{paymentInfo.paymentMethod}</span>
            </div>
          </div>
          <div className="text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">결제금액</span>
              <span className="font-medium">{formatCurrency(paymentInfo.amount)}</span>
            </div>
          </div>
        </div>

        {/* Notice */}
        <div className="p-4 mb-5 bg-purple-50 rounded-xl">
          <h4 className="flex items-center gap-2 mb-2 text-sm font-semibold">
            <InfoIcon />
            안내사항
          </h4>
          <p className="text-sm leading-relaxed text-gray-600">
            출발 7일 전까지 전액 환불 가능합니다.<br />
            상세 일정은 출발 3일 전 카카오톡으로 안내됩니다.<br />
            문의사항은 마이페이지에서 확인해주세요.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to="/my-applications"
            className="block w-full px-4 py-4 text-base font-semibold text-center text-white rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg shadow-purple-500/30"
          >
            신청 내역 확인
          </Link>
          <Link
            to="/"
            className="block w-full px-4 py-4 text-base font-semibold text-center text-gray-700 bg-gray-100 rounded-lg"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentCompletePage;
