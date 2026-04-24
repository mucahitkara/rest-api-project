'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBalance } from '@/hooks/useBalance';
import { useNbpRates } from '@/hooks/useNbpRates';
import { CURRENCIES } from '@/constants/currencies';
import { formatCurrency } from '@/utils/formatters';
import { getConvertedAmount } from '@/lib/nbp';
import { apiService } from '@/lib/api';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useQueryClient } from '@tanstack/react-query';
import { FiRefreshCw, FiArrowDown, FiInfo } from 'react-icons/fi';
import { toast } from 'sonner';

export default function ExchangePage() {
  const searchParams = useSearchParams();
  const initialFrom = searchParams.get('from') || 'USD';

  const { data, isLoading: balLoading } = useBalance();
  const balances = data?.balances;
  const { data: rates, isLoading: ratesLoading } = useNbpRates();
  const queryClient = useQueryClient();

  const [fromCurrency, setFromCurrency] = useState(initialFrom);
  const [toCurrency, setToCurrency] = useState(initialFrom === 'EUR' ? 'USD' : 'EUR');
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [calculating, setCalculating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const calcSeq = useRef(0);

  const usdRate = rates?.find((r) => r.currency === 'USD')?.rate;

  useEffect(() => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) { setToAmount(''); return; }
    const seq = ++calcSeq.current;
    setCalculating(true);
    getConvertedAmount(parseFloat(fromAmount), fromCurrency, toCurrency, usdRate)
      .then((v) => { if (seq === calcSeq.current) setToAmount(v.toFixed(2)); })
      .catch(() => { if (seq === calcSeq.current) setToAmount(''); })
      .finally(() => { if (seq === calcSeq.current) setCalculating(false); });
  }, [fromAmount, fromCurrency, toCurrency, usdRate]);

  useEffect(() => {
    if (fromCurrency === toCurrency) {
      const next = CURRENCIES.find((c) => c.value !== fromCurrency)?.value || 'EUR';
      setToCurrency(next);
    }
  }, [fromCurrency, toCurrency]);

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount('');
  };

  const handleExchange = async () => {
    setSubmitting(true);
    try {
      await apiService.exchange({
        fromCurrency,
        toCurrency,
        fromAmount: parseFloat(fromAmount),
        toAmount: parseFloat(toAmount),
      });
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      toast.success(`Broadcasting exchange: ${formatCurrency(parseFloat(fromAmount), fromCurrency)} → ${formatCurrency(parseFloat(toAmount), toCurrency)}`);
      setFromAmount('');
      setToAmount('');
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Exchange failed');
    } finally {
      setSubmitting(false);
      setShowModal(false);
    }
  };

  const available = balances?.[fromCurrency] || 0;
  const canExchange =
    fromAmount && toAmount && !calculating && parseFloat(fromAmount) > 0 && parseFloat(fromAmount) <= available && fromCurrency !== toCurrency;

  const currencyOptions: DropdownOption[] = CURRENCIES.map((c) => ({
    value: c.value,
    label: `${c.flag} ${c.value}`,
    description: c.label,
  }));

  return (
    <div className="space-y-6 animate-in max-w-xl">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Exchange</h1>
        <p className="text-[var(--text-secondary)] text-sm mt-1">Convert between currencies at live NBP rates</p>
      </div>

      {/* From */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-[var(--text-primary)]">From Wallet</p>
          <span className="text-xs text-[var(--text-secondary)]">Available: {formatCurrency(available, fromCurrency)}</span>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <Dropdown
            value={fromCurrency}
            onChange={setFromCurrency}
            options={currencyOptions.filter((o) => o.value !== toCurrency)}
            className="md:w-48"
          />
          <div className="flex-1">
            <Input
              type="number"
              value={fromAmount}
              onChange={(e) => setFromAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        {available > 0 && (
          <button onClick={() => setFromAmount(available.toString())} className="mt-2 text-xs text-blue-600 hover:text-blue-700 transition-colors font-medium">
            Use max ({formatCurrency(available, fromCurrency)})
          </button>
        )}
        {fromAmount && parseFloat(fromAmount) > available && (
          <p className="mt-2 text-xs text-red-400">Insufficient balance</p>
        )}
      </Card>

      {/* Swap */}
      <div className="flex justify-center">
        <button
          onClick={swap}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <FiArrowDown size={18} className="text-white" />
        </button>
      </div>

      {/* To */}
      <Card>
        <p className="text-sm font-semibold text-[var(--text-primary)] mb-4">To Wallet</p>
        <div className="flex flex-col md:flex-row gap-4">
          <Dropdown
            value={toCurrency}
            onChange={setToCurrency}
            options={currencyOptions.filter((o) => o.value !== fromCurrency)}
            className="md:w-48"
          />
          <div className="flex-1 relative group">
            <input
              type="text"
              value={calculating ? 'Calculating...' : toAmount}
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-subtle)] text-[var(--text-primary)] placeholder-[var(--text-secondary)]/50 focus:outline-none text-sm font-medium"
              placeholder="0.00"
            />
            {calculating && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <LoadingSpinner size="sm" />
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-[var(--text-secondary)] mt-2">
          Current: {formatCurrency(balances?.[toCurrency] || 0, toCurrency)}
        </p>
      </Card>

      {/* Rates note */}
      <div className="flex items-start gap-2 text-[var(--text-secondary)]/60 text-xs">
        <FiInfo size={13} className="mt-0.5 shrink-0" />
        <span>
          {ratesLoading ? 'Loading live rates...' : 'Rates via National Bank of Poland (NBP) API. UZS & INR use approximate rates.'}
        </span>
      </div>

      {/* Live rates */}
      {rates && rates.length > 0 && (
        <Card padding="sm">
          <div className="flex items-center gap-2 mb-3">
            <FiRefreshCw size={13} className="text-blue-600" />
            <p className="text-xs font-semibold text-[var(--text-primary)]">Live Rates (vs PLN)</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {rates.map((r) => {
              const cur = CURRENCIES.find((c) => c.value === r.currency);
              return (
                <div key={r.currency} className="flex items-center justify-between text-xs bg-[var(--bg-primary)] border border-[var(--border-subtle)] rounded-lg px-3 py-2">
                  <span className="text-[var(--text-secondary)]">{cur?.flag} {r.currency}</span>
                  <span className="text-blue-600 font-semibold">{r.rate.toFixed(4)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Button
        fullWidth
        size="lg"
        onClick={() => setShowModal(true)}
        disabled={!canExchange}
      >
        {fromCurrency} → {toCurrency} Exchange
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm Exchange"
        confirmLabel="Exchange"
        onConfirm={handleExchange}
        confirmLoading={submitting}
      >
        <div className="space-y-3 text-sm">
          <div className="bg-[var(--bg-primary)] rounded-xl p-4 space-y-2 border border-[var(--border-subtle)]">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">You send</span>
              <span className="text-[var(--text-primary)] font-semibold">{formatCurrency(parseFloat(fromAmount || '0'), fromCurrency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">You receive</span>
              <span className="text-emerald-600 font-semibold">{formatCurrency(parseFloat(toAmount || '0'), toCurrency)}</span>
            </div>
          </div>
          <p className="text-[var(--text-secondary)] text-xs text-center">Exchange rates are locked at confirmation time.</p>
        </div>
      </Modal>
    </div>
  );
}
