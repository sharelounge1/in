import { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
}

export const Header = ({
  title,
  showBack = false,
  leftContent,
  rightContent,
  className = '',
}: HeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <header
      className={`flex items-center justify-between px-5 py-4 bg-white border-b border-border-light sticky top-0 z-50 ${className}`}
    >
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="p-1 text-text-secondary hover:text-text-primary transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        )}
        {leftContent}
      </div>

      {title && (
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
      )}

      <div className="flex items-center gap-3">
        {rightContent}
      </div>
    </header>
  );
};
