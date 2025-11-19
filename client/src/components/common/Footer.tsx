import { Link } from 'react-router-dom';

interface FooterProps {
  className?: string;
}

export const Footer = ({ className = '' }: FooterProps) => {
  return (
    <footer className={`bg-background-light py-8 px-5 ${className}`}>
      <div className="max-w-md mx-auto">
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-semibold text-text-primary mb-3">서비스</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-sm text-text-secondary hover:text-primary-start transition-colors"
                >
                  서비스 소개
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-sm text-text-secondary hover:text-primary-start transition-colors"
                >
                  자주 묻는 질문
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-sm text-text-secondary hover:text-primary-start transition-colors"
                >
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-text-primary mb-3">약관</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/terms"
                  className="text-sm text-text-secondary hover:text-primary-start transition-colors"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-text-secondary hover:text-primary-start transition-colors"
                >
                  개인정보처리방침
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-border-light">
          <p className="text-xs text-text-muted text-center">
            &copy; {new Date().getFullYear()} 인플루언서 여행 플랫폼. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
