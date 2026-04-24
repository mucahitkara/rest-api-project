'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FiUser, FiMail, FiLock, FiZap } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { toast } from 'sonner';

interface RegisterFormProps {
  onSwitchMode: (mode: 'login') => void;
}

export default function RegisterForm({ onSwitchMode }: RegisterFormProps) {
  const router = useRouter();
  const { register } = useAuthStore();
  const [form, setForm] = useState({ firstName: '', lastName: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.username || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (result.success) {
      toast.success('Account created successfully!');
      router.replace('/dashboard');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  const update = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="w-full animate-in">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Create account</h1>
        <p className="text-[var(--text-secondary)] mt-1">Join LuminaFX and start transacting</p>
      </div>

      <div className="bg-[var(--bg-secondary)] border border-[var(--border-subtle)] rounded-3xl p-10 shadow-xl shadow-blue-500/5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              value={form.firstName}
              onChange={update('firstName')}
              placeholder="John"
              leftIcon={<FiUser size={16} />}
            />
            <Input
              label="Last Name"
              value={form.lastName}
              onChange={update('lastName')}
              placeholder="Smith"
            />
          </div>

          <Input
            label="Email address"
            type="email"
            value={form.username}
            onChange={update('username')}
            placeholder="you@example.com"
            autoComplete="email"
            leftIcon={<FiMail size={16} />}
          />

          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={update('password')}
            placeholder="Min 8 characters"
            autoComplete="new-password"
            hint="Must contain uppercase, lowercase and a number"
            leftIcon={<FiLock size={16} />}
          />

          <Button type="submit" fullWidth loading={loading} size="lg" className="mt-1 text-white">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[var(--text-secondary)] text-sm">
            Already have an account?{' '}
            <button 
              onClick={() => onSwitchMode('login')}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
