'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import Button from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  confirmLabel?: string;
  onConfirm?: () => void;
  confirmLoading?: boolean;
  confirmVariant?: 'primary' | 'danger';
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  confirmLabel = 'Confirm',
  onConfirm,
  confirmLoading = false,
  confirmVariant = 'primary',
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-[var(--bg-secondary)] border border-[var(--border-subtle)] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-subtle)]">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2>
          <button
            onClick={onClose}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors p-1 rounded-lg hover:bg-[var(--bg-primary)]"
          >
            <FiX size={20} />
          </button>
        </div>
        <div className="p-6">{children}</div>
        {onConfirm && (
          <div className="flex gap-3 p-6 pt-0">
            <Button variant="ghost" onClick={onClose} fullWidth>
              Cancel
            </Button>
            <Button
              variant={confirmVariant}
              onClick={onConfirm}
              loading={confirmLoading}
              fullWidth
            >
              {confirmLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
