'use client';

import { CURRENCIES } from '@/constants/currencies';

interface CurrencyBadgeProps {
  code: string;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function CurrencyBadge({ code, showLabel = false, size = 'md' }: CurrencyBadgeProps) {
  const currency = CURRENCIES.find((c) => c.value === code);
  if (!currency) return <span className="text-slate-400 text-sm">{code}</span>;

  const sizes = {
    sm: 'text-xs gap-1 px-2 py-0.5',
    md: 'text-sm gap-1.5 px-3 py-1',
    lg: 'text-base gap-2 px-4 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium ${sizes[size]}`}
    >
      <span>{currency.flag}</span>
      <span>{currency.value}</span>
      {showLabel && <span className="text-[var(--text-secondary)]">· {currency.label}</span>}
    </span>
  );
}
