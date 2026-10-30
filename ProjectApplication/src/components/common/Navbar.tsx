import React, { useState, useEffect } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { Menu, X, Cloud, Leaf, ArrowRight } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'try', label: 'Try', highlight: true },
    { id: 'research', label: 'Research Basis' },
    { id: 'datasets', label: 'Datasets & Tools' },
    { id: 'team', label: 'The Team' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/85 dark:bg-slate-950/85 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm py-2.5'
          : 'bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm border-b border-slate-200/40 dark:border-slate-800/40 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-carbon-600 via-emerald-600 to-cloud-600 text-white shadow-md shadow-carbon-600/20 group-hover:scale-105 transition-transform">
              {/* Visual combining edge node, cloud and carbon leaf */}
              <div className="absolute inset-0.5 rounded-[10px] bg-slate-950/20 flex items-center justify-center">
                <div className="relative">
                  <Cloud className="w-5 h-5 text-cloud-200" />
                  <Leaf className="w-3.5 h-3.5 text-carbon-300 absolute -bottom-1 -right-1" />
                  <div className="w-2 h-2 rounded-full bg-amber-400 absolute -top-1 -left-1 ring-1 ring-white/50" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-lg sm:text-xl text-slate-900 dark:text-white group-hover:text-carbon-600 dark:group-hover:text-carbon-400 transition-colors">
                  EDGE<sup className="text-carbon-600 dark:text-carbon-400 text-xs font-bold">2</sup>CO
                </span>
                <span className="text-[10px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded bg-carbon-100 dark:bg-carbon-900/50 text-carbon-700 dark:text-carbon-300 font-semibold border border-carbon-200/50 dark:border-carbon-800/50">
                  Research Lab
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium tracking-tight -mt-0.5 hidden xs:block">
                Carbon-Aware Edge-Cloud Intelligence
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-slate-100/70 dark:bg-slate-900/60 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 focus:outline-none ${
                    isActive
                      ? 'text-white bg-slate-900 dark:bg-slate-800 shadow-sm'
                      : item.highlight
                      ? 'text-carbon-700 dark:text-carbon-400 hover:text-carbon-800 hover:bg-carbon-50 dark:hover:bg-carbon-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                  {item.highlight && !isActive && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-carbon-500 rounded-full animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right side controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <button
              onClick={() => handleNavClick('try')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-carbon-600 to-emerald-600 hover:from-carbon-700 hover:to-emerald-700 text-white text-xs font-semibold shadow-sm shadow-carbon-600/25 transition-all hover:shadow-md hover:scale-[1.02]"
            >
              <span>Simulator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile menu hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile slideout dropdown menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border-t border-slate-200 dark:border-slate-800 mt-3 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-1.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-left ${
                    activeTab === item.id
                      ? 'bg-carbon-50 dark:bg-carbon-950/50 text-carbon-700 dark:text-carbon-300 font-semibold'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.highlight && (
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-carbon-500 text-white font-bold">
                      Interactive
                    </span>
                  )}
                </button>
              ))}

              <div className="pt-3">
                <button
                  onClick={() => handleNavClick('try')}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-carbon-600 to-emerald-600 text-white text-xs font-semibold text-center shadow-sm"
                >
                  <span>Open Simulator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
