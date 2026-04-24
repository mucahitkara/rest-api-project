'use client';

import { useBalance } from '@/hooks/useBalance';
import { CURRENCIES } from '@/constants/currencies';
import { formatCurrency } from '@/utils/formatters';
import Card from '@/components/ui/Card';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { FiTrendingUp, FiRefreshCw, FiCopy, FiChevronRight } from 'react-icons/fi';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import Link from 'next/link';

export default function WalletsPage() {
  const { data, isLoading, refetch } = useBalance();
  const queryClient = useQueryClient();

  const totalUSD = data?.balances?.USD || 0;
  const nonZero = CURRENCIES.filter((c) => (data?.balances?.[c.value] || 0) > 0).length;

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Wallets</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Manage your {CURRENCIES.length} currency wallets</p>
        </div>
        <button
          onClick={() => { refetch(); queryClient.invalidateQueries({ queryKey: ['balance'] }); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-all text-sm shadow-sm"
        >
          <FiRefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="col-span-2 md:col-span-1">
          <p className="text-[var(--text-secondary)] text-xs font-medium mb-1">USD Balance</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{formatCurrency(totalUSD, 'USD')}</p>
        </Card>
        <Card>
          <p className="text-[var(--text-secondary)] text-xs font-medium mb-1">Active Wallets</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{nonZero}<span className="text-[var(--text-secondary)]/60 text-sm font-normal">/{CURRENCIES.length}</span></p>
        </Card>
        <Card>
          <p className="text-[var(--text-secondary)] text-xs font-medium mb-1">Supported</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{CURRENCIES.length} <span className="text-[var(--text-secondary)]/60 text-sm font-normal">currencies</span></p>
        </Card>
      </div>

      {/* Wallets Grid */}
      {isLoading ? (
        <LoadingSpinner text="Loading balances..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CURRENCIES.map((currency) => {
            const balance = data?.balances?.[currency.value] || 0;
            const hasBalance = balance > 0;
            return (
              <Link
                key={currency.value}
                href={`/wallets/${currency.value}`}
                className={`block transition-all ${!hasBalance ? 'opacity-50' : ''}`}
              >
                <Card
                  padding="md"
                  hover
                  className="h-full group/card"
                >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{currency.flag}</span>
                    <div>
                      <p className="text-[var(--text-primary)] font-semibold text-sm">{currency.label}</p>
                      <p className="text-[var(--text-secondary)] text-xs">{currency.value}</p>
                    </div>
                  </div>
                  {hasBalance ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-500/15 flex items-center justify-center">
                      <FiTrendingUp size={13} className="text-emerald-400" />
                    </div>
                  ) : (
                    <FiChevronRight size={20} className="text-[var(--text-secondary)] group-hover/card:translate-x-1 transition-transform" />
                  )}
                </div>
                  <div className="flex flex-col gap-3">
                    <div>
                      <p className={`text-xl font-bold ${hasBalance ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]/40'}`}>
                        {formatCurrency(balance, currency.value)}
                      </p>
                      <p className="text-[var(--text-secondary)]/60 text-xs mt-1">
                        {hasBalance ? 'Available balance' : 'Empty wallet'}
                      </p>
                    </div>

                    {data?.walletNumbers?.[currency.value] && (
                      <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between group/number">
                        <div>
                          <p className="text-[var(--text-secondary)]/50 text-[10px] uppercase font-bold tracking-wider mb-0.5">Wallet Number</p>
                          <p className="text-[var(--text-primary)] font-mono text-xs tracking-widest">
                            {data.walletNumbers[currency.value].match(/.{1,4}/g)?.join(' ')}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(data.walletNumbers[currency.value]);
                            toast.success(`Copied ${currency.value} wallet number`);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-all opacity-0 group-hover/number:opacity-100"
                        >
                          <FiCopy size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}

      <p className="text-slate-600 text-xs text-center">
        💡 Use the Exchange tab to convert between currencies
      </p>
    </div>
  );
}
