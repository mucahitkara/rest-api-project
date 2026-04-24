'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import { useAuthStore } from '@/store/authStore';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

type AuthMode = 'login' | 'register' | 'forgot';

function AuthContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isAuthenticated, isLoading, initializeAuth } = useAuthStore();
  const [mode, setMode] = useState<AuthMode>('login');

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    const m = searchParams.get('mode');
    if (m === 'register' || m === 'forgot' || m === 'login') {
      setMode(m as AuthMode);
    }
  }, [searchParams]);

  const handleSwitchMode = (newMode: AuthMode) => {
    setMode(newMode);
    // Update URL without refresh to keep things clean
    const url = new URL(window.location.href);
    url.searchParams.set('mode', newMode);
    window.history.pushState({}, '', url.toString());
  };

  if (isLoading) {
    return <LoadingSpinner text="Security check..." />;
  }

  if (isAuthenticated) return null;

  return (
    <div className="w-full max-w-lg mx-auto transform transition-all duration-300 ease-in-out">
      {mode === 'login' && <LoginForm onSwitchMode={handleSwitchMode} />}
      {mode === 'register' && <RegisterForm onSwitchMode={handleSwitchMode} />}
      {mode === 'forgot' && <ForgotPasswordForm onSwitchMode={handleSwitchMode} />}
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<LoadingSpinner text="Preparing authentication..." />}>
      <AuthContent />
    </Suspense>
  );
}
