import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'glass' | 'gradient';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  padding = 'md',
  variant = 'default'
}) => {
  const paddingClasses = {
    sm: 'p-5',
    md: 'p-7',
    lg: 'p-9',
  };

  const variants = {
    default: 'bg-white/90 backdrop-blur-sm rounded-2xl shadow-elevated border border-white/20',
    glass: 'glass rounded-2xl shadow-elevated',
    gradient: 'bg-gradient-to-br from-white/80 to-white/60 backdrop-blur-md rounded-2xl shadow-elevated border border-white/30',
  };

  return (
    <div
      className={`
        ${variants[variant]}
        ${paddingClasses[padding]}
        ${className}
        card-hover
      `}
      style={{ animationDelay: '0.1s' }}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = ''
}) => {
  return (
    <div className={`mb-6 ${className}`}>
      {children}
    </div>
  );
};

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
  gradient?: boolean;
}

export const CardTitle: React.FC<CardTitleProps> = ({
  children,
  className = '',
  gradient = false
}) => {
  return (
    <h2 className={`text-3xl font-bold ${gradient ? 'text-gradient' : 'text-gray-900'} ${className}`}>
      {children}
    </h2>
  );
};

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription: React.FC<CardDescriptionProps> = ({
  children,
  className = ''
}) => {
  return (
    <p className={`text-gray-600 mt-2 text-lg ${className}`}>
      {children}
    </p>
  );
};
