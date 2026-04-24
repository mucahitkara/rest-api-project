'use client';

import { useState } from 'react';
import { FiMenu, FiX, FiBell } from 'react-icons/fi';
import Sidebar from './Sidebar';

interface NavbarProps {
  userName?: string;
  userEmail?: string;
}

export default function Navbar({ userName, userEmail }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <header className="md:hidden flex items-center justify-between px-4 h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] sticky top-0 z-30">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 transition-colors"
        >
          <FiMenu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
          <span className="text-[var(--text-primary)] font-bold tracking-tight">LuminaFX</span>
        </div>
        <button className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 transition-colors">
          <FiBell size={20} />
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 z-10 p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5 transition-colors"
            >
              <FiX size={20} />
            </button>
            <Sidebar
              userName={userName}
              userEmail={userEmail}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
