'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FiHome,
  FiCreditCard,
  FiRefreshCw,
  FiSend,
  FiClock,
  FiUser,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: FiHome },
  { href: '/wallets', label: 'Wallets', icon: FiCreditCard },
  { href: '/exchange', label: 'Exchange', icon: FiRefreshCw },
  { href: '/transfer', label: 'Send Money', icon: FiSend },
  { href: '/transactions', label: 'Transactions', icon: FiClock },
  { href: '/profile', label: 'Profile', icon: FiUser },
];

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export default function Sidebar({ userName, userEmail, onClose, isCollapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="h-full flex flex-col bg-[var(--bg-secondary)] relative shadow-sm">
      {/* Collapse Toggle Button — only on desktop-like contexts */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-blue-500 shadow-sm z-50 transition-all hover:scale-110"
        >
          {isCollapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
        </button>
      )}

      {/* Logo Area */}
      <div className={`p-6 border-b border-[var(--border-subtle)] overflow-hidden transition-all duration-300 ${isCollapsed ? 'px-4 flex justify-center' : ''}`}>
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3 group whitespace-nowrap">
          <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 h-0 hidden' : ''}`}>
            <span className="text-[var(--text-primary)] font-bold text-lg leading-none tracking-tight">LuminaFX</span>
            <p className="text-[var(--text-secondary)] text-xs">Digital Wallet</p>
          </div>
          {isCollapsed && (
            <div className="w-9 h-9 flex items-center justify-center font-bold text-blue-600 text-xl">L</div>
          )}
        </Link>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navLinks.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              title={isCollapsed ? label : ''}
              className={`
                flex items-center rounded-xl text-sm font-medium
                transition-all duration-150 group overflow-hidden
                ${isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'}
                ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-sm shadow-blue-500/5'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--text-primary)]/5'
                }
              `}
            >
              <Icon
                size={18}
                className={`
                  transition-colors shrink-0
                  ${isActive ? 'text-blue-500' : 'text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]'}
                `}
              />
              {!isCollapsed && <span className="transition-opacity duration-300">{label}</span>}
              {!isCollapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer */}
      {userName && (
        <div className={`p-4 border-t border-[var(--border-subtle)] transition-all duration-300 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'gap-3 px-2'}`}>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md shadow-blue-500/10 hover:ring-2 hover:ring-blue-100 transition-all">
              {userName.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-300">
                <p className="text-[var(--text-primary)] text-sm font-medium truncate">{userName}</p>
                <p className="text-[var(--text-secondary)] text-xs truncate">{userEmail}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
