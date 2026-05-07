"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import Card from "@/components/ui/Card";
import { CURRENCIES } from "@/constants/currencies";
import { FiUser, FiMail, FiInfo, FiShield } from "react-icons/fi";

export default function ProfilePage() {
  const { user } = useAuthStore();
  const router = useRouter();

  if (!user) return null;

  const initials =
    `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="space-y-6 animate-in max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-(--text-primary)">Profile</h1>
        <p className="text-(--text-secondary) text-sm mt-1">
          Manage your account information
        </p>
      </div>

      {/* User Card */}
      <Card padding="lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-blue-500/30 shrink-0">
            {initials}
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-(--text-primary)">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-(--text-secondary) text-sm mt-1">
              {user.username}
            </p>
            <div className="flex items-center gap-1.5 mt-2 justify-center sm:justify-start">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-emerald-600 font-medium text-xs">
                Active account
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Account Info */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-(--border-subtle)">
          <h3 className="text-sm font-semibold text-(--text-primary) flex items-center gap-2">
            <FiUser size={14} />
            Account Information
          </h3>
        </div>
        {[
          { label: "First Name", value: user.firstName },
          { label: "Last Name", value: user.lastName },
          { label: "Email", value: user.username, icon: FiMail },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between px-6 py-4 border-b border-(--border-subtle) last:border-b-0"
          >
            <span className="text-(--text-secondary) text-sm">{label}</span>
            <span className="text-(--text-primary) text-sm font-medium">
              {value}
            </span>
          </div>
        ))}
      </Card>

      {/* App Info */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-(--border-subtle)">
          <h3 className="text-sm font-semibold text-(--text-primary) flex items-center gap-2">
            <FiInfo size={14} />
            Application
          </h3>
        </div>
        {[
          { label: "Version", value: "1.0.0" },
          {
            label: "Supported Currencies",
            value: `${CURRENCIES.length} currencies`,
          },
          {
            label: "Exchange Provider",
            value: "National Bank of Poland (NBP)",
          },
          { label: "Transaction Limits", value: "$10,000 / $50,000 daily" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between px-6 py-4 border-b border-(--border-subtle) last:border-b-0"
          >
            <span className="text-(--text-secondary) text-sm">{label}</span>
            <span className="text-(--text-primary) text-sm font-medium">
              {value}
            </span>
          </div>
        ))}
      </Card>

      {/* Security */}
      <Card padding="none">
        <div className="px-6 py-4 border-b border-(--border-subtle)">
          <h3 className="text-sm font-semibold text-(--text-primary) flex items-center gap-2">
            <FiShield size={14} />
            Security
          </h3>
        </div>
        {[
          { label: "Authentication", value: "JWT + Refresh Token" },
          { label: "Password", value: "bcrypt (10 rounds)" },
          { label: "Session", value: "1 hour access / 7 days refresh" },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between px-6 py-4 border-b border-(--border-subtle) last:border-b-0"
          >
            <span className="text-(--text-secondary) text-sm">{label}</span>
            <span className="text-(--text-secondary) text-sm">{value}</span>
          </div>
        ))}
      </Card>

      <p className="text-center text-(--text-secondary)/60 text-xs font-medium uppercase tracking-[0.2em]">
        LuminaFX © 2026 · Multi-currency digital wallet
      </p>
    </div>
  );
}
