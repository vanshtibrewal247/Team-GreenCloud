import React from 'react';
import { Cloud, Leaf, Mail, ArrowUpRight, GraduationCap } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './SocialIcons';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Left Column: Brand */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-carbon-600 to-cloud-600 flex items-center justify-center text-white shadow-md shadow-carbon-600/20">
                <Cloud className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight">
                  EDGE<sup className="text-carbon-600 dark:text-carbon-400 font-bold">2</sup>CO
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Carbon-Aware Edge-Cloud Intelligence
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              A university research initiative engineering predictive, multi-objective workload offloading strategies. Balancing milli-second latency QoS with regional electric grid decarbonization.
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <GraduationCap className="w-4 h-4 text-carbon-500" />
              <span>Department of Computer Science & Engineering • Sustainable Computing Group</span>
            </div>
          </div>

          {/* Middle Column: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Platform Navigation
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {[
                { id: 'home', label: 'Home' },
                { id: 'try', label: 'Try (Simulator)' },
                { id: 'research', label: 'Research Basis' },
                { id: 'datasets', label: 'Datasets & Tools' },
                { id: 'team', label: 'The Team' },
              ].map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => {
                      setActiveTab(link.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-carbon-600 dark:hover:text-carbon-400 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Column: Research Links & Contact */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Connect & Source
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-carbon-600 dark:hover:text-carbon-400 transition-colors"
                >
                  <GithubIcon className="w-4 h-4 text-slate-700 dark:text-slate-300" />
                  <span>GitHub Repository</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-carbon-600 dark:hover:text-carbon-400 transition-colors"
                >
                  <LinkedinIcon className="w-4 h-4 text-blue-600" />
                  <span>LinkedIn Network</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="mailto:research@edge2co.org"
                  className="inline-flex items-center gap-2 hover:text-carbon-600 dark:hover:text-carbon-400 transition-colors"
                >
                  <Mail className="w-4 h-4 text-amber-500" />
                  <span>research@edge2co.org</span>
                </a>
              </li>
            </ul>

            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-carbon-50 dark:bg-carbon-950/60 text-carbon-700 dark:text-carbon-400 border border-carbon-200/50 dark:border-carbon-800/50">
                <Leaf className="w-3 h-3" />
                EdgeCloudSim v3.4 Compatible
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© 2026 EDGE²CO Research Project. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="font-medium text-carbon-600 dark:text-carbon-400">
              Built for research and experimentation.
            </span>
            <span>•</span>
            <button
              onClick={() => {
                setActiveTab('research');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="hover:underline"
            >
              Academic Citation (BibTeX)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
