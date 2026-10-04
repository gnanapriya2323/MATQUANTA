import React, { useState } from 'react';
import { Share2, Lock, Mail, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck, ShoppingCart, Settings } from 'lucide-react';
import type { UserSession, UserRole } from '../types';

interface LoginPageProps {
  onLogin: (user: UserSession) => void;
}

interface MockAccount {
  role: UserRole;
  roleLabel: string;
  email: string;
  password: string;
  name: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MOCK_ACCOUNTS: MockAccount[] = [
  {
    role: 'procurement',
    roleLabel: 'Procurement User',
    email: 'procurement@matquanta.demo',
    password: 'Procurement@123',
    name: 'S. Sharma',
    title: 'Procurement Lead',
    icon: ShoppingCart
  },
  {
    role: 'expert',
    roleLabel: 'Technical Expert',
    email: 'expert@matquanta.demo',
    password: 'Expert@123',
    name: 'Dr. V. Raman',
    title: 'Authorized Domain Expert',
    icon: ShieldCheck
  },
  {
    role: 'admin',
    roleLabel: 'Admin',
    email: 'admin@matquanta.demo',
    password: 'Admin@123',
    name: 'Central Admin',
    title: 'System Administrator',
    icon: Settings
  }
];

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    const matchedAccount = MOCK_ACCOUNTS.find(
      (acc) => acc.email.toLowerCase() === cleanEmail && acc.password === cleanPassword
    );

    if (matchedAccount) {
      onLogin({
        email: matchedAccount.email,
        role: matchedAccount.role,
        name: matchedAccount.name,
        title: matchedAccount.title
      });
    } else {
      setErrorMessage('Invalid User ID or Password. Please use one of the demo credentials below.');
    }
  };

  const handleSelectDemoAccount = (acc: MockAccount) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen w-full bg-[#F5F7FA] flex flex-col justify-center items-center p-4 sm:p-6 font-sans text-[#17202A]">
      <div className="w-full max-w-[420px] space-y-6">
        
        {/* Main Clean White Login Card */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-7 sm:p-9 space-y-6">
          
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex w-12 h-12 rounded-2xl bg-[#06B6D4] text-[#17202A] items-center justify-center shadow-md shadow-cyan-500/20 mb-1">
              <Share2 className="w-6 h-6 stroke-[2.4]" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-[#17202A]">
              MATQUANTA
            </h1>
            <p className="text-xs font-semibold text-[#06B6D4] tracking-wider uppercase">
              National Material Harmonization
            </p>
            <p className="text-xs text-[#64748B] pt-0.5">
              Sign in to access unified catalog and cross-CPSE master intelligence
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#17202A] mb-1.5">
                User ID / Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="name@matquanta.demo"
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl text-xs text-[#17202A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#17202A] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-[#F5F7FA] border border-[#E2E8F0] rounded-xl text-xs text-[#17202A] placeholder-[#64748B] focus:outline-none focus:ring-2 focus:ring-[#06B6D4] focus:bg-white transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#17202A] p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#06B6D4] hover:bg-cyan-600 text-white font-bold rounded-xl text-xs shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 mt-2"
            >
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Demo Accounts Quick-Select Helper */}
          <div className="pt-4 border-t border-[#E2E8F0] space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-[#64748B] font-medium">
              <span>Demo Accounts (Click to fill):</span>
            </div>

            <div className="space-y-1.5">
              {MOCK_ACCOUNTS.map((acc) => {
                const Icon = acc.icon;
                const isCurrent = email === acc.email;
                return (
                  <button
                    key={acc.role}
                    type="button"
                    onClick={() => handleSelectDemoAccount(acc)}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all text-xs ${
                      isCurrent
                        ? 'border-[#06B6D4] bg-cyan-50/60 text-[#17202A]'
                        : 'border-[#E2E8F0] bg-slate-50/60 hover:bg-slate-100/80 text-[#17202A]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-white border border-[#E2E8F0] flex items-center justify-center text-[#06B6D4] shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-[11px] text-[#17202A]">{acc.roleLabel}</div>
                        <div className="text-[10px] text-[#64748B] font-mono truncate">{acc.email}</div>
                      </div>
                    </div>
                    <span className="text-[10px] text-[#06B6D4] font-semibold underline shrink-0 ml-2">
                      Auto-fill
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[11px] text-[#64748B]">
          MATQUANTA • Ministry of Heavy Industries & Public Enterprises
        </p>
      </div>
    </div>
  );
};
