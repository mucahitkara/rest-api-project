'use client';

import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, type, leftIcon, rightIcon, className = '', ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5 ml-1">{label}</label>
        )}
        <div className="relative group">
          {leftIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]/50 z-10 pointer-events-none group-focus-within:text-blue-500 transition-colors">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            type={inputType}
            className={`
              w-full px-4 py-3 rounded-xl
              bg-[var(--bg-primary)] border border-[var(--border-subtle)]
              text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50
              focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/40
              transition-all duration-200
              ${leftIcon ? 'pl-11' : ''}
              ${isPassword || rightIcon ? 'pr-12' : ''}
              ${error ? 'border-red-500/30 focus:ring-red-500/10' : ''}
              ${className}
            `}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          ) : (
            rightIcon && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]/50">
                {rightIcon}
              </div>
            )
          )}
        </div>
        {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
        {hint && !error && <p className="mt-1.5 text-xs text-slate-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
