import { ReactNode } from 'react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] bg-mesh flex flex-col items-center justify-center p-4 overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />
      
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}
