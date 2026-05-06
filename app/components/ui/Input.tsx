import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'glass';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  type = 'text',
  className = '',
  variant = 'default',
  ...props
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const isPassword = type === 'password';

  const variants = {
    default: 'bg-white/90 backdrop-blur-sm border-white/30',
    glass: 'glass border-white/30',
  };

  return (
    <div className="space-y-3">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label}
        </label>
      )}
      <div className="relative group">
        {icon && (
          <div className={`absolute left-4 top-1/2 z-50 transform -translate-y-1/2 transition-colors ${isFocused ? 'text-blue-600' : 'text-gray-400'
            }`}>
            {icon}
          </div>
        )}
        <input
          type={isPassword && showPassword ? 'text' : type}
          className={`
            w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-300 text-black
            ${icon ? 'pl-12' : 'px-4'}
            ${variants[variant]}
            ${error
              ? 'border-red-400 focus:ring-red-400 focus:border-red-400 bg-red-50/50'
              : isFocused
                ? 'border-blue-400 focus:ring-blue-400 focus:border-blue-400 shadow-glow'
                : 'border-gray-200 hover:border-gray-300 focus:ring-blue-400 focus:border-blue-400'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            placeholder-gray-400
            ${className}
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-all duration-200 hover:scale-110"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 animate-fade-in flex items-center">
          <span className="w-1 h-1 bg-red-600 rounded-full mr-2"></span>
          {error}
        </p>
      )}
    </div>
  );
};
