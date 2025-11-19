import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCourseDetail, useCourseMutations } from '@/hooks/useCourses';
import { useAuthStore } from '@/stores/authStore';

interface ApplyFormData {
  name: string;
  phone: string;
  email: string;
  instagram?: string;
  introduction?: string;
  paymentMethod: string;
  agreeToTerms: boolean;
}

// Icons
const BackIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

export const CourseApplyPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [selectedPayment, setSelectedPayment] = useState('naverpay');

  const { data: courseData, isLoading } = useCourseDetail(id || '');
  const { apply, isApplying } = useCourseMutations();

  const course = useMemo(() => {
    if (!courseData?.success) return null;
    return courseData.data;
  }, [courseData]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplyFormData>({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      paymentMethod: 'naverpay',
      agreeToTerms: true,
    },
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원';
  };

  const onSubmit = async (data: ApplyFormData) => {
    if (!id) return;

    try {
      await apply({
        courseId: id,
        data: {
          participant_name: data.name,
          participant_phone: data.phone,
          participant_email: data.email,
          instagram_handle: data.instagram,
          introduction: data.introduction,
          payment_method: data.paymentMethod,
        },
      });
      navigate(`/payment-complete?courseId=${id}`);
    } catch (error) {
      console.error('Failed to apply:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 animate-pulse">
        <div className="p-5">
          <div className="w-full h-20 mb-4 bg-gray-200 rounded-lg" />
          <div className="w-full h-40 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">코스를 찾을 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
        <Link to={`/courses/${id}`}>
          <BackIcon />
        </Link>
        <span className="font-semibold">신청하기</span>
        <div className="w-6" />
      </header>

      {/* Content */}
      <div className="p-5 pb-32">
        {/* Course Summary */}
        <div className="flex gap-3 p-4 mb-6 bg-gray-100 rounded-lg">
          <img
            src={course.thumbnail_url || 'https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=200'}
            alt={course.title}
            className="object-cover w-20 h-20 rounded-lg"
          />
          <div className="flex-1">
            <h3 className="mb-1 font-semibold">{course.title}</h3>
            <p className="mb-2 text-sm text-gray-500">2025.01.25 - 01.28</p>
            <p className="font-bold text-purple-600">{formatCurrency(course.price)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Participant Info */}
          <div className="mb-6">
            <h3 className="mb-4 font-semibold">참가자 정보</h3>
            <div className="p-4 mb-3 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-purple-500">참가자 1 (본인)</span>
              </div>
              <div className="mb-3">
                <label className="block mb-2 text-sm text-gray-500">이름</label>
                <input
                  {...register('name', { required: '이름을 입력해주세요' })}
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="mb-3">
                <label className="block mb-2 text-sm text-gray-500">연락처</label>
                <input
                  {...register('phone', { required: '연락처를 입력해주세요' })}
                  type="tel"
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <label className="block mb-2 text-sm text-gray-500">이메일</label>
                <input
                  {...register('email', { required: '이메일을 입력해주세요' })}
                  type="email"
                  className="w-full px-4 py-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>
            </div>
            <button
              type="button"
              className="flex items-center justify-center w-full gap-2 py-3.5 text-sm text-gray-500 border-2 border-dashed border-gray-300 rounded-lg"
            >
              <PlusIcon />
              동행자 추가
            </button>
          </div>

          {/* Payment Method */}
          <div className="mb-6">
            <h3 className="mb-4 font-semibold">결제 수단</h3>
            <div className="space-y-3">
              <label
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
                  selectedPayment === 'naverpay'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  {...register('paymentMethod')}
                  value="naverpay"
                  checked={selectedPayment === 'naverpay'}
                  onChange={() => setSelectedPayment('naverpay')}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPayment === 'naverpay' ? 'border-purple-500' : 'border-gray-300'
                  }`}
                >
                  {selectedPayment === 'naverpay' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500" />
                  )}
                </div>
                <span className="flex-1 text-sm font-medium">네이버페이</span>
                <div className="w-6 h-6 bg-green-500 rounded" />
              </label>
              <label
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
                  selectedPayment === 'kakaopay'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  {...register('paymentMethod')}
                  value="kakaopay"
                  checked={selectedPayment === 'kakaopay'}
                  onChange={() => setSelectedPayment('kakaopay')}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPayment === 'kakaopay' ? 'border-purple-500' : 'border-gray-300'
                  }`}
                >
                  {selectedPayment === 'kakaopay' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500" />
                  )}
                </div>
                <span className="flex-1 text-sm font-medium">카카오페이</span>
                <div className="w-6 h-6 bg-yellow-400 rounded" />
              </label>
              <label
                className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition ${
                  selectedPayment === 'card'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  {...register('paymentMethod')}
                  value="card"
                  checked={selectedPayment === 'card'}
                  onChange={() => setSelectedPayment('card')}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedPayment === 'card' ? 'border-purple-500' : 'border-gray-300'
                  }`}
                >
                  {selectedPayment === 'card' && (
                    <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-500" />
                  )}
                </div>
                <span className="flex-1 text-sm font-medium">신용/체크카드</span>
              </label>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mb-6">
            <h3 className="mb-4 font-semibold">결제 금액</h3>
            <div className="p-4 bg-gray-100 rounded-lg">
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-gray-500">참가비 x 1명</span>
                <span>{formatCurrency(course.price)}</span>
              </div>
              <div className="flex justify-between mb-3 text-sm">
                <span className="text-gray-500">할인</span>
                <span>-0원</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-gray-200">
                <span className="font-semibold text-gray-500">총 결제 금액</span>
                <span className="text-lg font-bold text-purple-600">{formatCurrency(course.price)}</span>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white border-t border-gray-100">
        <label className="flex items-start gap-2.5 mb-4 text-sm text-gray-500">
          <input
            type="checkbox"
            {...register('agreeToTerms', { required: true })}
            defaultChecked
            className="mt-0.5"
          />
          <span>
            결제 내용을 확인하였으며, <Link to="/refund-policy" className="text-purple-500">환불 규정</Link>에 동의합니다.
          </span>
        </label>
        <button
          onClick={handleSubmit(onSubmit)}
          disabled={isApplying}
          className="w-full px-4 py-4 text-base font-semibold text-white rounded-lg bg-gradient-to-r from-purple-600 to-pink-500 shadow-lg shadow-purple-500/30 disabled:opacity-50"
        >
          {isApplying ? '처리중...' : `${formatCurrency(course.price)} 결제하기`}
        </button>
      </div>
    </div>
  );
};

export default CourseApplyPage;
