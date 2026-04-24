'use client';

import { useState, FormEvent } from 'react';
import { FiMail, FiZap, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'sonner';

interface ForgotPasswordFormProps {
  onSwitchMode: (mode: 'login') => void;
}

export default function ForgotPasswordForm({ onSwitchMode }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    // Mocking API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLoading(false);
    setSubmitted(true);
    toast.success('Reset link sent to your email!');
  };

  if (submitted) {
    return (
      <div className="w-full animate-in flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6 border border-emerald-100 shadow-sm">
          <FiCheckCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)]">Check your email</h2>
        <p className="text-[var(--text-secondary)] mt-2 mb-8">
          We&apos;ve sent a password reset link to <br/>
          <span className="font-semibold text-[var(--text-primary)]">{email}</span>
        </p>
        <Button 
          variant="outline" 
          fullWidth 
          onClick={() => onSwitchMode('login')}
          className="flex items-center justify-center gap-2"
        >
          <FiArrowLeft size={16} />
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full animate-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Reset password</h1>
        <p className="text-[var(--text-secondary)] mt-1">Enter your email to receive a reset link</p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-3xl p-10 shadow-xl shadow-blue-500/5">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            required
            leftIcon={<FiMail size={18} />}
          />

          <Button type="submit" fullWidth loading={loading} size="lg" className="text-white">
            Send Reset Link
          </Button>

          <button
            type="button"
            onClick={() => onSwitchMode('login')}
            className="w-full flex items-center justify-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors py-2"
          >
            <FiArrowLeft size={16} />
            Back to Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
