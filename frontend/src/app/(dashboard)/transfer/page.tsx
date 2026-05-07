'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBalance } from '@/hooks/useBalance';
import { useUsers } from '@/hooks/useUsers';
import { CURRENCIES } from '@/constants/currencies';
import { formatCurrency } from '@/utils/formatters';
import { apiService } from '@/lib/api';
import { UserWithId } from '@/types';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';
import Modal from '@/components/ui/Modal';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { useQueryClient } from '@tanstack/react-query';
import { FiSearch, FiUser, FiCheck } from 'react-icons/fi';
import { toast } from 'sonner';

export default function TransferPage() {
  const queryClient = useQueryClient();
  const { data, isLoading: balancesLoading } = useBalance();
  const balances = data?.balances;
  
  const searchParams = useSearchParams();
  const initialCurrency = searchParams.get('currency') || 'USD';

  const [transferMode, setTransferMode] = useState<'user' | 'number'>('user');
  const [search, setSearch] = useState('');
  const [walletNumber, setWalletNumber] = useState('');
  const [foundRecipient, setFoundRecipient] = useState<{ firstName: string; lastName: string; currency: string } | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserWithId | null>(null);
  const [currency, setCurrency] = useState(initialCurrency);
  const [amount, setAmount] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { data: users, isLoading: usersLoading } = useUsers(debouncedSearch);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (transferMode === 'number' && walletNumber.length === 16) {
      const lookup = async () => {
        setLookupLoading(true);
        try {
          const res = await apiService.lookupByNumber(walletNumber);
          setFoundRecipient(res.data);
          setCurrency(res.data.currency);
          toast.success(`Found recipient: ${res.data.firstName} ${res.data.lastName}`);
        } catch {
          setFoundRecipient(null);
          toast.error('Wallet number not found');
        } finally {
          setLookupLoading(false);
        }
      };
      lookup();
    } else {
      setFoundRecipient(null);
    }
  }, [walletNumber, transferMode]);

  const available = balances?.[currency] || 0;
  const numAmount = parseFloat(amount) || 0;
  const canTransfer = (transferMode === 'user' ? !!selectedUser : !!foundRecipient) && numAmount > 0 && numAmount <= available;

  const currencyOptions: DropdownOption[] = CURRENCIES.map((c) => ({
    value: c.value,
    label: `${c.flag} ${c.value}`,
    description: c.label,
  }));

  const handleTransfer = async () => {
    if (transferMode === 'user' && !selectedUser) return;
    if (transferMode === 'number' && !foundRecipient) return;

    setSubmitting(true);
    try {
      const payload = transferMode === 'user' 
        ? { to: selectedUser!.userid, currency, amount: numAmount }
        : { walletNumber, currency, amount: numAmount };

      await apiService.transfer(payload);
      queryClient.invalidateQueries({ queryKey: ['balance'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      
      const recipientName = transferMode === 'user' 
        ? `${selectedUser!.firstName} ${selectedUser!.lastName}` 
        : `${foundRecipient!.firstName} ${foundRecipient!.lastName}`;
        
      toast.success(`Sent ${formatCurrency(numAmount, currency)} to ${recipientName}`);
      setAmount('');
      setSelectedUser(null);
      setWalletNumber('');
      setFoundRecipient(null);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || 'Transfer failed');
    } finally {
      setSubmitting(false);
      setShowModal(false);
    }
  };

  return (
    <div className="space-y-6 animate-in">
      <div>
        <h1 className="text-2xl font-bold text-(--text-primary)">Send Money</h1>
        <p className="text-(--text-secondary) text-sm mt-1">Transfer to any user on LuminaFX</p>
      </div>

      {/* Recipient Selection */}
      <Card>
        <div className="flex bg-(--bg-primary) p-1 rounded-xl mb-6 border border-(--border-subtle)">
          <button
            onClick={() => setTransferMode('user')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${transferMode === 'user' ? 'bg-white shadow-sm text-blue-600' : 'text-(--text-secondary) hover:text-(--text-primary)'}`}
          >
            Search User
          </button>
          <button
            onClick={() => setTransferMode('number')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${transferMode === 'number' ? 'bg-white shadow-sm text-blue-600' : 'text-(--text-secondary) hover:text-(--text-primary)'}`}
          >
            Wallet Number
          </button>
        </div>

        {transferMode === 'user' ? (
          <>
            <p className="text-sm font-semibold text-(--text-primary) mb-4">Select Recipient</p>
            <div className="mb-4">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name..."
                leftIcon={<FiSearch size={18} />}
              />
            </div>

            {usersLoading ? (
              <LoadingSpinner size="sm" />
            ) : users?.length === 0 ? (
              <p className="text-(--text-secondary) text-sm text-center py-3">No users found</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {users?.map((u) => {
                  const isSelected = selectedUser?.userid === u.userid;
                  return (
                    <button
                      key={u.userid}
                      onClick={() => setSelectedUser(isSelected ? null : u)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${isSelected ? 'bg-blue-50 border border-blue-200 shadow-sm shadow-blue-500/5' : 'bg-(--bg-primary)/50 border border-(--border-subtle) hover:bg-(--bg-primary)'}`}
                    >
                      <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md shadow-blue-500/10">
                        {u.firstName.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-(--text-primary) text-sm font-medium">{u.firstName} {u.lastName}</p>
                        <p className="text-(--text-secondary) text-xs truncate">{u.username}</p>
                      </div>
                      {isSelected && <FiCheck size={16} className="text-blue-500 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-sm font-semibold text-(--text-primary) mb-2">Target Wallet Details</p>
            <Input
              label="16-Digit Wallet Number"
              value={walletNumber.replace(/\s/g, '').match(/.{1,4}/g)?.join(' ') || ''}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                setWalletNumber(raw);
              }}
              placeholder="0000 0000 0000 0000"
              hint="Funds will be sent to the specific currency wallet associated with this number."
              className="font-mono tracking-widest"
              rightIcon={lookupLoading ? <LoadingSpinner size="sm" /> : null}
            />
            {foundRecipient && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center justify-between animate-in fade-in slide-in-from-top-2 shadow-sm shadow-blue-500/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white shadow-sm ring-2 ring-white">
                    <FiUser size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-0.5">Recipient Verified</p>
                    <p className="text-(--text-primary) font-semibold">{foundRecipient.firstName} {foundRecipient.lastName}</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <FiCheck size={14} />
                </div>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Currency & Amount */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-(--text-primary)">Amount</p>
          {transferMode === 'number' && foundRecipient && (
             <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold uppercase ring-1 ring-blue-100 italic">Currency Locked</span>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-3">
          <Dropdown
            value={currency}
            onChange={setCurrency}
            options={currencyOptions}
            className="md:w-48"
            disabled={transferMode === 'number' && !!foundRecipient}
          />
          <div className="flex-1">
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
          </div>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-(--text-secondary)">Available: {formatCurrency(available, currency)}</span>
          {available > 0 && (
            <button onClick={() => setAmount(available.toString())} className="text-blue-600 hover:text-blue-700 transition-colors font-medium">
              Use max
            </button>
          )}
        </div>
        {amount && numAmount > available && (
          <p className="mt-2 text-xs text-red-600 font-medium">Insufficient balance</p>
        )}
      </Card>

      {/* Summary */}
      <Card padding="sm" className="bg-(--bg-primary)/50 border-(--border-subtle)">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-(--text-secondary)">
            <FiUser size={14} />
            <span>Recipient</span>
          </div>
          <span className="text-(--text-primary) font-medium">
            {transferMode === 'user' 
              ? (selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : <span className="text-(--text-secondary)/40">—</span>)
              : (foundRecipient ? `${foundRecipient.firstName} ${foundRecipient.lastName}` : <span className="text-(--text-secondary)/40">—</span>)
            }
          </span>
        </div>
        <div className="flex items-center justify-between text-sm mt-3">
          <span className="text-(--text-secondary)">You&apos;ll send</span>
          <span className="text-(--text-primary) font-semibold">
            {amount ? formatCurrency(numAmount, currency) : <span className="text-(--text-secondary)/40">—</span>}
          </span>
        </div>
      </Card>

      <Button fullWidth size="lg" onClick={() => setShowModal(true)} disabled={!canTransfer}>
        Send Money
      </Button>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm Transfer"
        confirmLabel="Send"
        onConfirm={handleTransfer}
        confirmLoading={submitting}
      >
        <div className="space-y-3 text-sm">
          <div className="bg-(--bg-primary) rounded-xl p-4 space-y-2 border border-(--border-subtle)">
            <div className="flex justify-between">
              <span className="text-(--text-secondary)">To</span>
              <span className="text-(--text-primary) font-semibold">
                {transferMode === 'user' 
                  ? `${selectedUser?.firstName} ${selectedUser?.lastName}` 
                  : `${foundRecipient?.firstName} ${foundRecipient?.lastName}`
                }
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-(--text-secondary)">Amount</span>
              <span className="text-(--text-primary) font-semibold">{formatCurrency(numAmount, currency)}</span>
            </div>
          </div>
          <p className="text-(--text-secondary) text-xs text-center">This action cannot be undone.</p>
        </div>
      </Modal>
    </div>
  );
}
