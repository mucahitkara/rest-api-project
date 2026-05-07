'use client';

import { useParams, useRouter } from 'next/navigation';
import { useBalance } from '@/hooks/useBalance';
import { useTransactions } from '@/hooks/useTransactions';
import { CURRENCIES } from '@/constants/currencies';
import { formatCurrency, formatDate } from '@/utils/formatters';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CurrencyBadge from '@/components/ui/CurrencyBadge';
import { FiArrowLeft, FiSend, FiRefreshCw, FiCopy, FiArrowUpRight, FiArrowDownLeft } from 'react-icons/fi';
import { toast } from 'sonner';
import Link from 'next/link';

export default function WalletDetailPage() {
  const { currency: currencyCode } = useParams() as { currency: string };
  const router = useRouter();
  const { data, isLoading: balancesLoading } = useBalance();
  const { data: transactions, isLoading: txLoading } = useTransactions();

  const currency = CURRENCIES.find((c) => c.value === currencyCode);
  const balance = data?.balances?.[currencyCode] || 0;
  const walletNumber = data?.walletNumbers?.[currencyCode] || '';

  // Filter transactions for this specific currency
  const filteredTxs = transactions?.filter((tx) => tx.currency === currencyCode) || [];

  if (!currency && !balancesLoading) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-[var(--text-primary)]">Wallet not found</h2>
        <Button onClick={() => router.push('/wallets')} className="mt-4">Back to Wallets</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-blue-600 transition-all shadow-sm"
        >
          <FiArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">{currency?.label} Wallet</h1>
            <span className="text-2xl">{currency?.flag}</span>
          </div>
          <p className="text-[var(--text-secondary)] text-sm">{currencyCode} • LuminaFX Secure Wallet</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Balance Hero */}
          <Card className="bg-gradient-to-br from-blue-600 to-violet-700 border-none relative overflow-hidden p-8 shadow-xl shadow-blue-900/20">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Available Balance</p>
                {balancesLoading ? (
                  <div className="h-10 w-48 bg-white/20 rounded-lg animate-pulse" />
                ) : (
                  <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    {formatCurrency(balance, currencyCode)}
                  </h2>
                )}
              </div>
              
              {walletNumber && (
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 min-w-[240px]">
                  <p className="text-blue-100 text-[10px] uppercase font-bold tracking-widest mb-1">Wallet Identifier</p>
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-white font-mono text-sm tracking-[0.2em]">
                        {walletNumber.match(/.{1,4}/g)?.join(' ')}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(walletNumber);
                        toast.success('Wallet number copied to clipboard');
                      }}
                      className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all"
                      title="Copy Wallet Number"
                    >
                      <FiCopy size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4">
            <Link href={`/transfer?currency=${currencyCode}`}>
              <Card hover className="flex items-center gap-4 py-5 px-6 group">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
                  <FiSend size={22} />
                </div>
                <div>
                  <p className="text-[var(--text-primary)] font-bold">Send Money</p>
                  <p className="text-[var(--text-secondary)] text-xs">Instantly to anyone</p>
                </div>
              </Card>
            </Link>
            <Link href={`/exchange?from=${currencyCode}`}>
              <Card hover className="flex items-center gap-4 py-5 px-6 group">
                <div className="w-12 h-12 rounded-2xl bg-violet-500/10 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform shadow-sm">
                  <FiRefreshCw size={22} />
                </div>
                <div>
                  <p className="text-[var(--text-primary)] font-bold">Exchange</p>
                  <p className="text-[var(--text-secondary)] text-xs">Convert to other</p>
                </div>
              </Card>
            </Link>
          </div>

          {/* Transaction History */}
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Recent {currencyCode} Activity</h3>
            {txLoading ? (
              <LoadingSpinner />
            ) : filteredTxs.length === 0 ? (
              <Card padding="lg" className="text-center py-12">
                <p className="text-[var(--text-secondary)]">No transactions found for this wallet</p>
                <p className="text-[var(--text-secondary)]/50 text-xs mt-1">Activity in this currency will appear here</p>
              </Card>
            ) : (
              <Card padding="none" className="overflow-hidden">
                <div className="divide-y divide-[var(--border-subtle)]">
                  {filteredTxs.map((tx) => (
                    <div key={tx._id} className="p-4 flex items-center justify-between hover:bg-[var(--bg-secondary)]/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'send' ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                          {tx.type === 'send' ? (
                            <FiArrowUpRight size={18} className="text-red-500" />
                          ) : (
                            <FiArrowDownLeft size={18} className="text-emerald-500" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[var(--text-primary)]">
                            {tx.type === 'exchange' && tx.targetName.startsWith('→') 
                              ? `${tx.currency} ${tx.targetName}` 
                              : tx.targetName}
                          </p>
                          <p className="text-[var(--text-secondary)] text-xs">{formatDate(tx.date)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${tx.type === 'send' ? 'text-red-500' : 'text-emerald-500'}`}>
                          {tx.type === 'send' ? '-' : '+'}{formatCurrency(tx.amount, currencyCode)}
                        </p>
                        <p className="text-[var(--text-secondary)]/50 text-[10px] uppercase font-bold tracking-tighter mt-0.5">{tx.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4 uppercase tracking-widest text-[var(--text-secondary)]/60">Wallet Specs</h4>
            <div className="space-y-4">
               <div>
                  <p className="text-xs text-[var(--text-secondary)] mb-1">Currency Code</p>
                  <CurrencyBadge code={currencyCode} size="lg" />
               </div>
               <div>
                  <p className="text-xs text-[var(--text-secondary)] mb-1">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    Active & Secure
                  </span>
               </div>
               <div>
                  <p className="text-xs text-[var(--text-secondary)] mb-1">Supported Regions</p>
                  <p className="text-sm text-[var(--text-primary)] font-medium">Global Access</p>
               </div>
            </div>
          </Card>

          <Card className="bg-slate-900 text-white">
             <h4 className="text-xs font-bold mb-3 uppercase tracking-tighter text-slate-400">Security Tips</h4>
             <ul className="text-xs space-y-2 text-slate-300">
                <li className="flex gap-2"><span>🛡️</span> Only share your wallet number with people you trust.</li>
                <li className="flex gap-2"><span>🔒</span> LuminaFX will never ask for your private key or password.</li>
                <li className="flex gap-2"><span>✅</span> Always verify the recipient's name before sending.</li>
             </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
