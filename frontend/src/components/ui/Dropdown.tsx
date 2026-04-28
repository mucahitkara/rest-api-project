'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { FiChevronDown } from 'react-icons/fi';

export interface DropdownOption {
  value: string;
  label: string;
  icon?: ReactNode;
  description?: string;
}

interface DropdownProps {
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  disabled?: boolean;
}

export default function Dropdown({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  error,
  disabled = false,
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((opt) => opt.value === value);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5 ml-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full px-4 py-3 rounded-xl
            bg-[var(--bg-secondary)] border border-[var(--border-subtle)]
            text-left text-[var(--text-primary)] transition-all duration-200
            hover:bg-[var(--bg-primary)] flex items-center justify-between
            focus:outline-none focus:ring-2 focus:ring-blue-500/20 shadow-sm
            ${isOpen ? 'ring-2 ring-blue-500/20 border-blue-500/40 shadow-blue-500/5' : ''}
            ${error ? 'border-red-500/30' : ''}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <div className="flex items-center gap-3">
            {selectedOption?.icon && <span className="text-blue-600">{selectedOption.icon}</span>}
            <span className={selectedOption ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}>
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <FiChevronDown 
            className={`text-[var(--text-secondary)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
            size={18} 
          />
        </button>

        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-2 py-2 bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl animate-in fade-in zoom-in duration-200 origin-top overflow-hidden">
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {options.length === 0 ? (
                <div className="px-4 py-3 text-sm text-[var(--text-secondary)] text-center">
                  No options available
                </div>
              ) : (
                options.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`
                      w-full px-4 py-3 text-left flex flex-col gap-0.5
                      transition-colors hover:bg-[var(--bg-primary)]
                      ${value === option.value ? 'bg-blue-50 text-blue-600' : 'text-[var(--text-secondary)]'}
                    `}
                  >
                    <div className="flex items-center gap-3 font-medium">
                      {option.icon && <span>{option.icon}</span>}
                      <span>{option.label}</span>
                    </div>
                    {option.description && (
                      <span className="text-xs text-[var(--text-secondary)]/60 truncate">
                        {option.description}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-400 ml-1">{error}</p>}
    </div>
  );
}
