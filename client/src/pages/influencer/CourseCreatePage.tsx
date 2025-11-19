import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { useInfluencerMutations } from '@/hooks/useInfluencer';
import type { CourseCreateRequest } from '@/types';

type Step = 'basic' | 'schedule' | 'includes' | 'accommodation' | 'preview';

interface FormData extends CourseCreateRequest {
  includedChecks: {
    accommodation: boolean;
    meals: boolean;
    transport: boolean;
    guide: boolean;
    admission: boolean;
  };
}

export const CourseCreatePage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('basic');
  const { createCourse, isCreatingCourse } = useInfluencerMutations();

  const steps: { key: Step; label: string }[] = [
    { key: 'basic', label: '기본 정보' },
    { key: 'schedule', label: '일정' },
    { key: 'includes', label: '포함 사항' },
    { key: 'accommodation', label: '숙소' },
    { key: 'preview', label: '미리보기' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      max_participants: 20,
      includedChecks: {
        accommodation: true,
        meals: true,
        transport: true,
        guide: false,
        admission: false,
      },
    },
  });

  const maxParticipants = watch('max_participants');

  const handleNext = () => {
    const stepIndex = steps.findIndex((s) => s.key === currentStep);
    if (stepIndex < steps.length - 1) {
      setCurrentStep(steps[stepIndex + 1].key);
    }
  };

  const handlePrev = () => {
    const stepIndex = steps.findIndex((s) => s.key === currentStep);
    if (stepIndex > 0) {
      setCurrentStep(steps[stepIndex - 1].key);
    } else {
      navigate(-1);
    }
  };

  const handleSaveDraft = () => {
    // Save as draft logic
  };

  const onSubmit = async (data: FormData) => {
    try {
      await createCourse({
        ...data,
        included_items: Object.entries(data.includedChecks)
          .filter(([_, checked]) => checked)
          .map(([name]) => ({ name })),
      });
      navigate('/influencer/courses');
    } catch (error) {
      // Handle error
    }
  };

  const renderBasicInfo = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold mb-2">기본 정보</h2>
        <p className="text-sm text-gray-500 mb-6">여행 코스의 기본 정보를 입력해주세요</p>
      </div>

      {/* Image Upload */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center cursor-pointer hover:border-violet-500 transition-colors">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-12 h-12 mx-auto mb-3 text-gray-400">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-sm text-gray-600 mb-1">대표 이미지 업로드</p>
        <p className="text-xs text-gray-400">권장 사이즈: 1200x800px</p>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">
          코스 제목<span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          {...register('title', { required: '코스 제목을 입력해주세요' })}
          type="text"
          className="w-full px-4 py-3.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-500"
          placeholder="예: 제주 힐링 3박 4일"
        />
        <p className="text-xs text-gray-400 mt-1.5">매력적인 제목으로 참가자의 관심을 끌어보세요</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">
          코스 설명<span className="text-red-500 ml-0.5">*</span>
        </label>
        <textarea
          {...register('description', { required: '코스 설명을 입력해주세요' })}
          className="w-full px-4 py-3.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-500 min-h-[120px] resize-y"
          placeholder="여행 코스에 대한 상세 설명을 작성해주세요"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm font-medium mb-2">
          여행 일정<span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <input
            {...register('start_date', { required: true })}
            type="date"
            className="px-4 py-3.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-500"
          />
          <input
            {...register('end_date', { required: true })}
            type="date"
            className="px-4 py-3.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-500"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium mb-2">
          여행 지역<span className="text-red-500 ml-0.5">*</span>
        </label>
        <input
          {...register('city', { required: '여행 지역을 입력해주세요' })}
          type="text"
          className="w-full px-4 py-3.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-500"
          placeholder="예: 제주도, 서귀포"
        />
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium mb-2">
          참가비<span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="relative">
          <input
            {...register('price', { required: true, valueAsNumber: true })}
            type="text"
            className="w-full px-4 py-3.5 pr-10 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-violet-500"
            placeholder="890,000"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray-500">원</span>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">플랫폼 수수료 10%가 별도로 부과됩니다</p>
      </div>

      {/* Max Participants */}
      <div>
        <label className="block text-sm font-medium mb-2">
          최대 참가 인원<span className="text-red-500 ml-0.5">*</span>
        </label>
        <div className="flex items-center gap-4">
          <Controller
            name="max_participants"
            control={control}
            render={({ field }) => (
              <>
                <button
                  type="button"
                  onClick={() => field.onChange(Math.max(1, field.value - 1))}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-violet-500 hover:text-violet-500 transition-colors"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-lg font-semibold min-w-[40px] text-center">{field.value}</span>
                <button
                  type="button"
                  onClick={() => field.onChange(field.value + 1)}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-violet-500 hover:text-violet-500 transition-colors"
                >
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </>
            )}
          />
        </div>
      </div>

      {/* Includes */}
      <div>
        <label className="block text-sm font-medium mb-2">포함 사항</label>
        <div className="space-y-0">
          {[
            { key: 'accommodation', label: '숙박' },
            { key: 'meals', label: '식사' },
            { key: 'transport', label: '교통' },
            { key: 'guide', label: '가이드' },
            { key: 'admission', label: '입장료' },
          ].map((item) => (
            <div key={item.key} className="flex items-center py-3 border-b border-gray-100">
              <input
                {...register(`includedChecks.${item.key as keyof FormData['includedChecks']}`)}
                type="checkbox"
                className="w-5 h-5 mr-3 accent-violet-600"
              />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
        <button type="button" className="flex items-center gap-2 py-3 text-sm text-violet-600">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          항목 추가
        </button>
      </div>
    </div>
  );

  const renderSchedule = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold mb-2">일정 정보</h2>
        <p className="text-sm text-gray-500 mb-6">여행 일정을 상세히 입력해주세요</p>
      </div>
      {/* Schedule form would go here */}
      <p className="text-gray-500 text-center py-10">일정 입력 폼이 여기에 표시됩니다</p>
    </div>
  );

  const renderIncludes = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold mb-2">포함/불포함 사항</h2>
        <p className="text-sm text-gray-500 mb-6">상세 포함 사항을 입력해주세요</p>
      </div>
      {/* Includes form would go here */}
      <p className="text-gray-500 text-center py-10">포함 사항 폼이 여기에 표시됩니다</p>
    </div>
  );

  const renderAccommodation = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold mb-2">숙소 정보</h2>
        <p className="text-sm text-gray-500 mb-6">숙소 정보를 입력해주세요</p>
      </div>
      {/* Accommodation form would go here */}
      <p className="text-gray-500 text-center py-10">숙소 정보 폼이 여기에 표시됩니다</p>
    </div>
  );

  const renderPreview = () => (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold mb-2">미리보기</h2>
        <p className="text-sm text-gray-500 mb-6">입력한 내용을 확인해주세요</p>
      </div>
      {/* Preview would go here */}
      <p className="text-gray-500 text-center py-10">코스 미리보기가 여기에 표시됩니다</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b border-gray-100 z-10">
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={handlePrev} className="p-1">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="font-semibold">새 코스 만들기</span>
          <div className="w-6" />
        </div>
        {/* Progress Bar */}
        <div className="h-1 bg-gray-100">
          <div
            className="h-full bg-gradient-to-r from-violet-600 to-purple-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <div className="px-5 py-5 pb-28">
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 'basic' && renderBasicInfo()}
          {currentStep === 'schedule' && renderSchedule()}
          {currentStep === 'includes' && renderIncludes()}
          {currentStep === 'accommodation' && renderAccommodation()}
          {currentStep === 'preview' && renderPreview()}
        </form>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-4 flex gap-3">
        <button
          onClick={handleSaveDraft}
          className="flex-1 py-3.5 rounded-lg font-semibold text-sm border border-gray-200"
        >
          임시저장
        </button>
        {currentStep === 'preview' ? (
          <button
            onClick={handleSubmit(onSubmit)}
            disabled={isCreatingCourse}
            className="flex-[2] py-3.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md disabled:opacity-50"
          >
            {isCreatingCourse ? '등록 중...' : '코스 등록'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="flex-[2] py-3.5 rounded-lg font-semibold text-sm bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-md"
          >
            다음 단계
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseCreatePage;
