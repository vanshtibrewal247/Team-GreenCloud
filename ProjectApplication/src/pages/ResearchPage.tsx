import React from 'react';
import { BasePaperCard } from '../components/research/BasePaperCard';
import { WhyPaperSection } from '../components/research/WhyPaperSection';
import { BaselineArchitectureFlow } from '../components/research/BaselineArchitectureFlow';
import { PaperAnalysisCards } from '../components/research/PaperAnalysisCards';
import { ApproachComparison } from '../components/research/ApproachComparison';
import { ContributionPillars } from '../components/research/ContributionPillars';
import { ResearchResultsShowcase } from '../components/research/ResearchResultsShowcase';
import { StatisticalTestingSection } from '../components/research/StatisticalTestingSection';
import { ArrowRight } from 'lucide-react';

interface ResearchPageProps {
  onNavigateToTry: () => void;
}

export const ResearchPage: React.FC<ResearchPageProps> = ({ onNavigateToTry }) => {
  return (
    <div className="py-8 sm:py-12 space-y-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Research Basis
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
          From existing research to our proposed approach. Bridging Lyapunov heuristic baselines with multi-horizon predictive carbon scheduling.
        </p>
      </div>

      {/* 6.1 Base Paper */}
      <BasePaperCard />

      {/* 6.2 Why This Paper? */}
      <WhyPaperSection />

      {/* 6.3 Understanding the Paper */}
      <BaselineArchitectureFlow />

      {/* 6.4 What Did They Do? */}
      <PaperAnalysisCards />

      {/* 6.5 Our Approach Comparison */}
      <ApproachComparison />

      {/* 6.6 Our Contribution (01 - 04) */}
      <ContributionPillars />

      {/* 6.7 Results & Benchmarks */}
      <ResearchResultsShowcase />

      {/* 6.8 Empirical Statistical Validation & Hypothesis Testing */}
      <StatisticalTestingSection />

      {/* Bottom Sandbox CTA */}
      <div className="rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">
          Experience the Theoretical Model in Action
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
          Test our predictive multi-objective algorithm directly inside the Simulation Lab with customized network delay matrices and variable regional carbon intensities.
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
