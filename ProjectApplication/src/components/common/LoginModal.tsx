import React, { useState } from 'react';
import { Modal } from './Modal';
import { ShieldCheck, GraduationCap, Mail, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from './SocialIcons';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sso' | 'credentials'>('sso');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="EDGE²CO Research Portal Login"
      subtitle="Sign in to save custom simulation parameters, upload private traces, and sync cluster telemetry."
      maxWidth="max-w-md"
    >
      {isSubmitted ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 bg-carbon-100 dark:bg-carbon-900/40 text-carbon-600 dark:text-carbon-400 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Authenticated Demo Session</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Welcome, Guest Researcher. Sandbox mode enabled.
          </p>
        </div>
      ) : (
        <div className="space-y-4 py-2">
          {/* Tabs */}
          <div className="grid grid-cols-2 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('sso')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'sso'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Academic SSO
            </button>
            <button
              onClick={() => setActiveTab('credentials')}
              className={`py-2 rounded-lg transition-all ${
                activeTab === 'credentials'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Researcher ID
            </button>
          </div>

          {activeTab === 'sso' ? (
            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => {
                  setIsSubmitted(true);
                  setTimeout(() => {
                    setIsSubmitted(false);
                    onClose();
                  }, 1500);
                }}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors shadow-sm"
              >
                <GraduationCap className="w-4 h-4 text-indigo-600" />
                Sign in with University Eduroam / InCommon
              </button>

              <button
                onClick={() => {
                  setIsSubmitted(true);
                  setTimeout(() => {
                    setIsSubmitted(false);
                    onClose();
                  }, 1500);
                }}
                className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-xs font-medium text-slate-800 dark:text-slate-200 transition-colors shadow-sm"
              >
                <GithubIcon className="w-4 h-4 text-slate-900 dark:text-white" />
                Sign in with GitHub
              </button>

              <div className="pt-2 text-[11px] text-center text-slate-400">
                <span>Demo mode: authentication is mock-only.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Institutional Email (.edu / .ac.in)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    defaultValue="researcher@university.edu"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-carbon-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Lab Passkey
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    defaultValue="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-carbon-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-carbon-600 hover:bg-carbon-700 text-white text-xs font-semibold transition-all shadow-md shadow-carbon-600/20"
              >
                Sign In to Sandbox
              </button>
            </form>
          )}
        </div>
      )}
    </Modal>
  );
};
