import React from 'react';
import { GraduationCap, Award, MapPin, Globe, Sparkles } from 'lucide-react';

export const LabBanner: React.FC = () => {
  return (
    <div className="rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-10 relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono text-carbon-600 dark:text-carbon-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Academic Affiliation</span>
          </div>

          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
            Distributed Systems & Sustainable Computing Laboratory
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl font-normal">
            Our research group investigates the intersection of edge-cloud architectures, renewable energy integration, and machine learning-assisted systems optimization. We collaborate across engineering departments to deliver verifiable, reproducible green computing artifacts.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Campus Technology Hub</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-500" />
              <span>Sponsored Research Grant 2025–2026</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
          <div className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] font-mono">
            Open Source Lab Commitments
          </div>
          <ul className="space-y-1.5 text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>100% reproducible simulation scripts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Public dataset traces & open API models</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-500 font-bold">✓</span>
              <span>Open for academic review & peer contributions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
