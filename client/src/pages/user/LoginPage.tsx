import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// Icons
const KakaoIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3C6.48 3 2 6.58 2 11c0 2.84 1.89 5.33 4.71 6.73-.19.7-.68 2.53-.78 2.92-.13.51.19.5.4.37.16-.1 2.59-1.76 3.64-2.47.66.09 1.34.14 2.03.14 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
  </svg>
);

const NaverIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.273 12.845L7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727z" />
  </svg>
);

const AppleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

export const LoginPage = () => {
  const { redirectToOAuth, isLoggingIn } = useAuth();

  const handleKakaoLogin = () => {
    redirectToOAuth('kakao');
  };

  const handleNaverLogin = () => {
    redirectToOAuth('naver');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col min-h-screen px-5 py-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center justify-center flex-1 py-10 text-center">
          <h1 className="mb-3 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            TRAVELY
          </h1>
          <p className="text-sm leading-relaxed text-gray-500">
            인플루언서와 함께하는<br />특별한 여행 플랫폼
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className="flex flex-col gap-3 mb-6">
          <button
            onClick={handleKakaoLogin}
            disabled={isLoggingIn}
            className="flex items-center justify-center gap-3 px-4 py-4 text-sm font-semibold text-black transition bg-yellow-400 rounded-lg hover:-translate-y-0.5"
          >
            <KakaoIcon />
            카카오로 시작하기
          </button>
          <button
            onClick={handleNaverLogin}
            disabled={isLoggingIn}
            className="flex items-center justify-center gap-3 px-4 py-4 text-sm font-semibold text-white transition bg-green-500 rounded-lg hover:-translate-y-0.5"
          >
            <NaverIcon />
            네이버로 시작하기
          </button>
          <button
            disabled={isLoggingIn}
            className="flex items-center justify-center gap-3 px-4 py-4 text-sm font-semibold text-white transition bg-black rounded-lg hover:-translate-y-0.5"
          >
            <AppleIcon />
            Apple로 시작하기
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="px-4 text-xs text-gray-400">또는</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Email Login */}
        <button
          disabled={isLoggingIn}
          className="w-full px-4 py-4 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg"
        >
          이메일로 로그인
        </button>

        {/* Terms */}
        <p className="mt-6 text-xs leading-relaxed text-center text-gray-400">
          로그인 시 <Link to="/terms" className="text-purple-500">서비스 이용약관</Link> 및<br />
          <Link to="/privacy" className="text-purple-500">개인정보 처리방침</Link>에 동의하게 됩니다.
        </p>

        {/* Guest Link */}
        <div className="mt-4 text-center">
          <Link to="/" className="text-sm text-gray-500">
            둘러보기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
