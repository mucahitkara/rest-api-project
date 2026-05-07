'use client';

import { useAuthStore } from '@/store/authStore';
import { useBalance } from '@/hooks/useBalance';
import { useTransactions } from '@/hooks/useTransactions';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { CURRENCIES } from '@/constants/currencies';
import Card from '@/components/ui/Card';
import CurrencyBadge from '@/components/ui/CurrencyBadge';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import Link from 'next/link';
import { FiArrowRight, FiRefreshCw, FiSend, FiCreditCard, FiArrowDownLeft, FiArrowUpRight } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi2';
import { PiHandWaving } from 'react-icons/pi';

const quickActions = [
  { label: 'Wallets', href: '/wallets', icon: FiCreditCard, color: 'from-blue-500 to-blue-600' },
  { label: 'Exchange', href: '/exchange', icon: FiRefreshCw, color: 'from-violet-500 to-violet-600' },
  { label: 'Send Money', href: '/transfer', icon: FiSend, color: 'from-emerald-500 to-emerald-600' },
];

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { data, isLoading: balancesLoading } = useBalance();
  const balances = data?.balances;
  const { data: transactions, isLoading: txLoading } = useTransactions();

  const totalUSD = balances?.USD || 0;
  const recentTxs = transactions?.slice(0, 5) || [];

  const topWallets = CURRENCIES.filter((c) => (balances?.[c.value] || 0) > 0).slice(0, 4);

  return (
    <div className="space-y-8 animate-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-3xl font-bold text-(--text-primary)">
            Hello, {user?.firstName}
          </h1>
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-400/10 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.15)] animate-wave">
            <PiHandWaving size={24} />
          </div>
          <HiSparkles className="text-amber-400 animate-pulse delay-100" size={20} />
        </div>
        <p className="text-(--text-secondary) text-sm font-medium opacity-80">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Balance Hero */}
      <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-blue-600 to-violet-700 p-6 md:p-8 shadow-xl shadow-blue-900/30">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>
        <div className="relative z-10">
          <p className="text-blue-100 text-sm font-medium mb-2">USD Balance</p>
          {balancesLoading ? (
            <div className="h-12 bg-white/20 rounded-lg w-48 animate-pulse" />
          ) : (
            <p className="text-4xl md:text-5xl font-bold text-white">
              {formatCurrency(totalUSD, 'USD')}
            </p>
          )}
          <p className="text-blue-200 text-xs mt-2">Your primary wallet</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-(--text-primary) mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 gap-4">
          {quickActions.map(({ label, href, icon: Icon, color }) => (
            <Link key={href} href={href}>
              <Card hover padding="md" className="text-center group">
                <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-105 transition-transform`}>
                  <Icon size={20} className="text-white" />
                </div>
                <p className="text-(--text-primary) text-sm font-medium">{label}</p>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Active Wallets */}
      {topWallets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-(--text-primary)">Active Wallets</h2>
            <Link href="/wallets" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 transition-colors">
              View all <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {topWallets.map((currency) => (
              <Card key={currency.value} padding="sm">
                <div className="text-2xl mb-1">{currency.flag}</div>
                <p className="text-(--text-secondary) text-xs">{currency.value}</p>
                <p className="text-(--text-primary) font-semibold text-sm mt-0.5">
                  {formatCurrency(balances?.[currency.value] || 0, currency.value)}
                </p>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-(--text-primary)">Recent Transactions</h2>
          <Link href="/transactions" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 transition-colors font-medium">
            View all <FiArrowRight size={14} />
          </Link>
        </div>

        {txLoading ? (
          <LoadingSpinner />
        ) : recentTxs.length === 0 ? (
          <Card padding="md" className="text-center py-10">
            <p className="text-(--text-secondary) text-sm">No transactions yet</p>
            <p className="text-(--text-secondary)/60 text-xs mt-1">Your activity will appear here</p>
          </Card>
        ) : (
          <Card padding="none">
            {recentTxs.map((tx, i) => (
              <div
                key={tx._id}
                className={`flex items-center justify-between p-4 ${i !== recentTxs.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'send' ? 'bg-red-500/15' : 'bg-blue-500/15'}`}>
                    {tx.type === 'send' ? (
                      <FiArrowUpRight size={16} className="text-red-400" />
                    ) : (
                      <FiArrowDownLeft size={16} className="text-blue-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-(--text-primary) text-sm font-medium">{tx.targetName}</p>
                    <p className="text-(--text-secondary) text-xs">{formatDate(tx.date)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <CurrencyBadge code={tx.currency} size="sm" />
                  <p className={`text-sm font-semibold mt-0.5 ${tx.type === 'send' ? 'text-red-400' : 'text-emerald-400'}`}>
                    {tx.type === 'send' ? '-' : '+'}{formatCurrency(tx.amount, tx.currency)}
                  </p>
                </div>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
