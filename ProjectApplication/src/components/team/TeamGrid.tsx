import React from 'react';
import { TeamMember } from '../../types/team';
import { Mail, GraduationCap, Award, BookOpen } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/SocialIcons';

export const TeamGrid: React.FC = () => {
  const members: TeamMember[] = [
    {
      id: 'member-1',
      order: '01',
      name: 'Pratikshit singh',
      rollNo: '2024UIT3004',
      role: 'Data Engineering & Curation Lead',
      badge: 'Data Curator & Architect',
      institution: 'Dept. of Information Technology',
      avatarUrl:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      bio: 'Leading the multi-source empirical data engineering pipeline for GreenCloud. Retrieved, curated, and verified CAISO 5-minute carbon intensity traces, Alibaba cluster workload logs, and IoT hardware specifications to construct the master evaluation dataset.',
      responsibilities: [
        'Retrieval and verification of CAISO & 9-region carbon intensity traces',
        'Curation of Alibaba GPU cluster traces (7,539 tasks) and server capacity profiles',
        'Design, alignment, and sanity validation of the 77-column master dataset',
      ],
      focusAreas: ['Data Curation', 'Trace Engineering', 'Empirical Data Validation'],
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        email: 'pratikshit.singh@research.edu',
        scholar: 'https://scholar.google.com',
      },
    },
    {
      id: 'member-2',
      order: '02',
      name: 'Himesh kumar Meena',
      rollNo: '2024UIT3077',
      role: 'ML Forecasting & Predictive Modeling Lead',
      badge: 'ML & Forecasting Specialist',
      institution: 'Dept. of Information Technology',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      bio: 'Engineering the machine learning and forecasting pipeline. Focused on time-series forecasting models (ARIMA, Prophet, LSTM) for grid emissions, predictive scheduling algorithms, and preventive carbon-spike mitigation logic.',
      responsibilities: [
        'Development and evaluation of carbon intensity forecasting models (ARIMA / LSTM)',
        'Predictive scheduling algorithms and preventive carbon-spike mitigation',
        'Forecast error sensitivity analysis (RMSE vs carbon reduction metrics)',
      ],
      focusAreas: ['Machine Learning', 'Time-Series Forecasting', 'Preventive Scheduling'],
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        email: 'himesh.meena@research.edu',
      },
    },
    {
      id: 'member-3',
      order: '03',
      name: 'Vansh Tiberiwal',
      rollNo: '2024UIT3019',
      role: 'Simulation, Systems & Full-Stack Lead',
      badge: 'Systems & Simulation Lead',
      institution: 'Dept. of Information Technology',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      bio: 'All-rounder systems specialist overseeing end-to-end discrete-event simulation, baseline orchestrators, and full-stack interactive platform development, along with contributing to trace data curation.',
      responsibilities: [
        'EdgeCloudSim simulation framework configuration and discrete-event engine design',
        'Implementation of heuristic baselines (Reactive, Naive) and Oracle bounds',
        'Full-stack interactive dashboard development and trace integration support',
      ],
      focusAreas: ['Discrete-Event Simulation', 'EdgeCloudSim', 'Full-Stack Architecture'],
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        email: 'vansh.tiberiwal@research.edu',
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {members.map((m) => (
          <div
            key={m.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Top Order & Badge */}
              <div className="flex items-center justify-between">
                <span className="font-mono text-2xl font-extrabold text-slate-300 dark:text-slate-700">
                  {m.order}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-carbon-50 dark:bg-carbon-950/60 text-carbon-700 dark:text-carbon-300 border border-carbon-200 dark:border-carbon-800">
                  {m.badge}
                </span>
              </div>

              {/* Profile Image & Name */}
              <div className="flex items-center gap-4 pt-1">
                <div className="relative">
                  <img
                    src={m.avatarUrl}
                    alt={m.name}
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-carbon-500/30 group-hover:ring-carbon-500 transition-all shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-carbon-500 border-2 border-white dark:border-slate-900 flex items-center justify-center text-white">
                    <GraduationCap className="w-3 h-3" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-carbon-600 dark:group-hover:text-carbon-400 transition-colors">
                    {m.name}
                  </h3>
                  {m.rollNo && (
                    <div className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-carbon-700 dark:text-carbon-300 bg-carbon-50 dark:bg-carbon-950/70 px-2 py-0.5 rounded-md border border-carbon-200 dark:border-carbon-800 my-1">
                      <span>Roll No:</span>
                      <span className="font-bold">{m.rollNo}</span>
                    </div>
                  )}
                  <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {m.role}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {m.institution}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal pt-1">
                {m.bio}
              </p>

              {/* Responsibilities list */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Core Responsibilities:
                </span>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  {m.responsibilities.map((r, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-carbon-500 font-bold shrink-0 text-[11px]">▪</span>
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Focus Areas Pill Tags */}
              <div className="pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {m.focusAreas.map((f, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Social Links Footer */}
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <a
                  href={m.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="GitHub Profile"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a
                  href={m.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <LinkedinIcon className="w-4 h-4" />
                </a>
                <a
                  href={`mailto:${m.social.email}`}
                  className="p-2 rounded-xl text-slate-500 hover:text-carbon-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label="Send Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>

              <span className="text-[11px] font-mono text-slate-400 font-medium">
                Research Contributor
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
