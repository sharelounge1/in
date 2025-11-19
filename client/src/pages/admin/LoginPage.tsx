import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - in production this would call an API
    setTimeout(() => {
      setIsLoading(false);
      navigate('/admin');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background-light">
      <div className="w-full max-w-[420px] px-5">
        <div className="bg-white rounded-xl shadow-lg p-12">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-start to-primary-end rounded-lg inline-flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">관리자 로그인</h1>
            <p className="text-sm text-text-secondary">인플루언서 여행 플랫폼 관리 시스템</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-text-secondary mb-2">
                이메일
              </label>
              <input
                type="email"
                className="w-full px-4 py-3.5 border border-border-light rounded-md text-[15px] focus:outline-none focus:border-primary-start focus:ring-[3px] focus:ring-primary-start/10 transition-all"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-[13px] font-medium text-text-secondary mb-2">
                비밀번호
              </label>
              <input
                type="password"
                className="w-full px-4 py-3.5 border border-border-light rounded-md text-[15px] focus:outline-none focus:border-primary-start focus:ring-[3px] focus:ring-primary-start/10 transition-all"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="flex items-center gap-2 mb-6">
              <input
                type="checkbox"
                id="remember"
                className="w-[18px] h-[18px] accent-primary-start"
                checked={formData.rememberMe}
                onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
              />
              <label htmlFor="remember" className="text-[13px] text-text-secondary">
                로그인 상태 유지
              </label>
            </div>
            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
            >
              로그인
            </Button>
          </form>

          {/* Footer */}
          <div className="text-center mt-6 text-[13px] text-text-muted">
            <p>
              비밀번호를 잊으셨나요?{' '}
              <a href="#" className="text-primary-start font-medium hover:underline">
                비밀번호 재설정
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
