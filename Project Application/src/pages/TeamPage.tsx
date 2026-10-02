import React from 'react';
import { TeamGrid } from '../components/team/TeamGrid';
import { HowWeWork } from '../components/team/HowWeWork';
import { LabBanner } from '../components/team/LabBanner';
import { ArrowRight } from 'lucide-react';

interface TeamPageProps {
  onNavigateToTry: () => void;
}

export const TeamPage: React.FC<TeamPageProps> = ({ onNavigateToTry }) => {
  return (
    <div className="py-8 sm:py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Meet the Team
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
          The people building the project. Combining backgrounds in distributed computing, machine learning, and environmental sustainability.
        </p>
      </div>

      {/* 3 Profile Cards */}
      <TeamGrid />

      {/* How We Work Process */}
      <HowWeWork />

      {/* University / Lab Banner */}
      <LabBanner />

      {/* Bottom CTA */}
      <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Explore Our Experimental Framework
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Test the algorithms engineered by our team in the interactive simulation workbench.
        </p>
        <button
          onClick={onNavigateToTry}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-carbon-600 hover:bg-carbon-700 text-white text-xs font-semibold shadow-md shadow-carbon-600/25 transition-all"
        >
          <span>Launch Simulation Lab</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
