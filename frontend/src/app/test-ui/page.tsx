'use client';

import { useState } from 'react';
import { FiDollarSign, FiGlobe, FiCreditCard } from 'react-icons/fi';
import Dropdown, { DropdownOption } from '@/components/ui/Dropdown';

export default function TestUIPage() {
  const [selectedCurrency, setSelectedCurrency] = useState('USD');

  const currencyOptions: DropdownOption[] = [
    { 
      value: 'USD', 
      label: 'US Dollar', 
      icon: <FiDollarSign />, 
      description: 'Default currency for all transactions' 
    },
    { 
      value: 'EUR', 
      label: 'Euro', 
      icon: <FiGlobe />, 
      description: 'European Union official currency' 
    },
    { 
      value: 'GBP', 
      label: 'British Pound', 
      icon: <FiCreditCard />, 
      description: 'United Kingdom currency' 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 p-12 text-white">
      <div className="max-w-4xl mx-auto space-y-12">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-violet-500 bg-clip-text text-transparent">
            UI Component Testing
          </h1>
          <p className="text-slate-400 mt-2">Verifying new and updated components</p>
        </div>

        {/* Dropdown Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-white/10 pb-2">Dropdown Component</h2>
          <div className="max-w-md bg-white/5 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl">
            <Dropdown
              label="Select Currency"
              options={currencyOptions}
              value={selectedCurrency}
              onChange={setSelectedCurrency}
              placeholder="Choose your currency"
            />
            <div className="mt-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <p className="text-sm text-blue-300">
                Selected Value: <span className="font-bold text-white">{selectedCurrency}</span>
              </p>
            </div>
          </div>
        </section>

        {/* Link to Auth Pages */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold border-b border-white/10 pb-2">Navigation Check</h2>
          <div className="flex gap-4">
            <a href="/login" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              View Updated Login
            </a>
            <a href="/register" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
              View Updated Register
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
