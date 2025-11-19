import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, variant = 'default', className = '', ...props }, ref) => {
    const baseStyles = 'bg-white rounded-lg overflow-hidden';
    const variantStyles = {
      default: 'shadow-card',
      bordered: 'border border-border-light',
    };

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

interface CardImageProps extends HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  height?: string;
}

export const CardImage = forwardRef<HTMLDivElement, CardImageProps>(
  ({ src, alt, height = 'h-44', className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`${height} ${className}`} {...props}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }
);

CardImage.displayName = 'CardImage';

interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <div ref={ref} className={`p-4 ${className}`} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={`text-base font-semibold text-text-primary mb-2 ${className}`}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

interface CardSubtitleProps extends HTMLAttributes<HTMLParagraphElement> {}

export const CardSubtitle = forwardRef<HTMLParagraphElement, CardSubtitleProps>(
  ({ children, className = '', ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={`text-sm text-text-secondary ${className}`}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardSubtitle.displayName = 'CardSubtitle';
