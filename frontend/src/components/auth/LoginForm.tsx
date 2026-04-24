'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FiMail, FiLock, FiZap } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'sonner';
import Link from 'next/link';

interface LoginFormProps {
  onSwitchMode: (mode: 'register' | 'forgot') => void;
}

export default function LoginForm({ onSwitchMode }: LoginFormProps) {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Successfully logged in!');
      router.replace('/dashboard');
    } else {
      toast.error(result.message || 'Login failed');
    }
  };

  return (
    <div className="w-full animate-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Welcome back</h1>
        <p className="text-[var(--text-secondary)] mt-1">Sign in to your LuminaFX account</p>
      </div>

      {/* Form Card */}
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-3xl p-10 shadow-xl shadow-blue-500/5">
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            leftIcon={<FiMail size={18} />}
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Your password"
            autoComplete="current-password"
            leftIcon={<FiLock size={18} />}
          />

          <div className="flex justify-end mt-[-8px]">
            <button
              type="button"
              onClick={() => onSwitchMode('forgot')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2 text-white">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[var(--text-secondary)] text-sm">
            Don&apos;t have an account?{' '}
            <button 
              onClick={() => onSwitchMode('register')}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
