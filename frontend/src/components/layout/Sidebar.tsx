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
  FiLogOut,
} from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      router.replace('/auth');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <aside className="h-full flex flex-col bg-(--bg-secondary) relative shadow-sm">
      {/* Collapse Toggle Button — only on desktop-like contexts */}
      {onToggle && (
        <button
          onClick={onToggle}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-(--bg-secondary) border border-(--border-subtle) flex items-center justify-center text-(--text-secondary) hover:text-blue-500 shadow-sm z-50 transition-all hover:scale-110"
        >
          {isCollapsed ? <FiChevronRight size={14} /> : <FiChevronLeft size={14} />}
        </button>
      )}

      {/* Logo Area */}
      <div className={`p-6 border-b border-(--border-subtle) overflow-hidden transition-all duration-300 ${isCollapsed ? 'px-4 flex justify-center' : ''}`}>
        <Link href="/dashboard" onClick={onClose} className="flex items-center gap-3 group whitespace-nowrap">
          <div className={`transition-all duration-300 ${isCollapsed ? 'opacity-0 w-0 h-0 hidden' : ''}`}>
            <span className="text-(--text-primary) font-bold text-lg leading-none tracking-tight">LuminaFX</span>
            <p className="text-(--text-secondary) text-xs">Digital Wallet</p>
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
                    : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--text-primary)/5'
                }
              `}
            >
              <Icon
                size={18}
                className={`
                  transition-colors shrink-0
                  ${isActive ? 'text-blue-500' : 'text-(--text-secondary) group-hover:text-(--text-primary)'}
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
        <div className={`p-4 border-t border-(--border-subtle) transition-all duration-300 ${isCollapsed ? 'flex flex-col items-center gap-4' : ''}`}>
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            title={isCollapsed ? 'Sign Out' : ''}
            className={`
              flex items-center gap-3 rounded-xl text-sm font-medium mb-4
              text-red-500 hover:bg-red-50 hover:text-red-600 transition-all duration-200
              ${isCollapsed ? 'justify-center w-10 h-10' : 'px-4 py-2 w-full'}
            `}
          >
            <FiLogOut size={18} className="shrink-0" />
            {!isCollapsed && <span>Sign Out</span>}
          </button>

          <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center' : 'gap-3 px-2'}`}>
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md shadow-blue-500/10 hover:ring-2 hover:ring-blue-100 transition-all">
              {userName.charAt(0).toUpperCase()}
            </div>
            {!isCollapsed && (
              <div className="min-w-0 transition-opacity duration-300">
                <p className="text-(--text-primary) text-sm font-medium truncate">{userName}</p>
                <p className="text-(--text-secondary) text-xs truncate">{userEmail}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
