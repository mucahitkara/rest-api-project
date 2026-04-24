'use client';

import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Card from '@/components/ui/Card';
import CurrencyBadge from '@/components/ui/CurrencyBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useQueryClient } from '@tanstack/react-query';
import { FiArrowUpRight, FiArrowDownLeft, FiRefreshCw } from 'react-icons/fi';

export default function TransactionsPage() {
  const { data: transactions, isLoading } = useTransactions();
  const queryClient = useQueryClient();

  return (
    <div className="space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Transactions</h1>
          <p className="text-[var(--text-secondary)] text-sm mt-1">
            {transactions ? `${transactions.length} transactions` : 'Your full activity history'}
          </p>
        </div>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['transactions'] })}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] transition-all text-sm shadow-sm"
        >
          <FiRefreshCw size={14} />
          Refresh
        </button>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading transactions..." />
      ) : !transactions || transactions.length === 0 ? (
        <Card padding="lg" className="text-center py-16">
          <p className="text-4xl mb-4">📭</p>
          <p className="text-[var(--text-primary)] font-semibold">No transactions yet</p>
          <p className="text-[var(--text-secondary)] text-sm mt-1">Send money or exchange currencies to get started</p>
        </Card>
      ) : (
        <Card padding="none">
          {/* Table header — desktop */}
          <div className="hidden md:grid grid-cols-5 gap-4 px-6 py-3 border-b border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
            <span>Type</span>
            <span>Amount</span>
            <span>Currency</span>
            <span>Counterparty</span>
            <span>Date</span>
          </div>

          {/* Rows */}
          {transactions.map((tx, i) => (
            <div
              key={tx._id}
              className={`flex flex-col md:grid md:grid-cols-5 gap-2 md:gap-4 px-4 md:px-6 py-4 ${i !== transactions.length - 1 ? 'border-b border-[var(--border-subtle)]' : ''} hover:bg-[var(--bg-primary)] transition-colors`}
            >
              {/* Type badge */}
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'send' ? 'bg-red-500/15' : 'bg-blue-500/15'}`}>
                  {tx.type === 'send'
                    ? <FiArrowUpRight size={15} className="text-red-400" />
                    : <FiArrowDownLeft size={15} className="text-blue-400" />}
                </div>
                <span className={`text-sm font-medium capitalize ${tx.type === 'send' ? 'text-red-400' : 'text-blue-400'}`}>
                  {tx.type}
                </span>
              </div>

              {/* Amount */}
              <div className="flex items-center">
                <span className={`text-sm font-semibold ${tx.type === 'send' ? 'text-red-400' : 'text-emerald-400'}`}>
                  {tx.type === 'send' ? '-' : '+'}{formatCurrency(tx.amount, tx.currency)}
                </span>
              </div>

              {/* Currency */}
              <div className="flex items-center">
                <CurrencyBadge code={tx.currency} size="sm" />
              </div>

              {/* Counterparty */}
              <div className="flex items-center">
                <span className="text-[var(--text-primary)] text-sm truncate">{tx.targetName}</span>
              </div>

              {/* Date */}
              <div className="flex items-center">
                <span className="text-[var(--text-secondary)] text-xs">{formatDate(tx.date)}</span>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}
