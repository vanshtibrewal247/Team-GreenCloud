import React from 'react';
import { TeamMember } from '../../types/team';
import { Mail, GraduationCap, Cpu } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../common/SocialIcons';

export const TeamGrid: React.FC = () => {
  const members: TeamMember[] = [
    {
      id: 'member-1',
      order: '01',
      name: 'Himesh Kumar Meena',
      rollNo: '2024UIT3077',
      role: 'Team Lead & ML / Frontend Engineer',
      badge: 'Team Lead & ML / Frontend Engineer',
      institution: 'Department of Information Technology',
      avatarUrl:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      bio: 'Leading the EDGE²CO Research Lab initiative, coordinating project development and contributing to the development of intelligent carbon-aware edge-cloud task offloading solutions. Responsible for ML model development and the frontend experience of the research platform.',
      responsibilities: [
        'Leading overall project coordination and technical development.',
        'Developing and experimenting with machine learning models for task duration prediction and carbon intensity forecasting.',
        'Designing and developing the website frontend using React and TypeScript.',
        'Building intuitive, responsive user interfaces and improving the overall UI/UX experience.',
        'Integrating ML predictions and simulation results into the research platform.',
      ],
      focusAreas: [
        'Team Leadership',
        'Machine Learning',
        'React & TypeScript',
        'UI/UX Development',
        'Carbon-Aware Computing',
      ],
      social: {
        github: 'https://github.com/mr-knight-28',
        linkedin: '',
        email: 'himesh.meena.ug24@nsut.ac.in',
      },
    },
    {
      id: 'member-2',
      order: '02',
      name: 'Vansh Tibrewal',
      rollNo: '2024UIT3019',
      role: 'Simulation Engine Architect & Full-Stack Systems Lead',
      badge: '⚡ Simulation Architect & Systems Lead',
      institution: 'Department of Information Technology',
      avatarUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
      bio: 'Lead architect of the EDGE²CO discrete simulation engine and interactive testbed. Spearheaded the mathematical translation of Lyapunov optimization (DWPA) and 7 benchmark models, multi-hop offloading pipelines, and reactive topology telemetry.',
      responsibilities: [
        'Architecting the in-browser discrete simulation engine executing DWPA and 7 benchmarks across 775 trace hours.',
        'Implementing closed-form Lyapunov and alternating bisection solvers for CPU frequencies and peer/cloud offloading.',
        'Engineering the Reactive Topology Canvas with real-time slot scrubbing, channel fading, and queue telemetry.',
        'Developing the automated Lyapunov V calibration solver and 14-point Pareto trade-off analyzer.',
        'Building dynamic custom workload ingestion with automated validation and multi-model forecast integration.',
      ],
      focusAreas: [
        'Simulation Engine',
        'Lyapunov Optimization',
        'Systems Architecture',
        'Reactive Topology',
        'React & TypeScript',
      ],
      social: {
        github: 'https://github.com/vanshtibrewal247',
        linkedin: '',
        email: 'vansh.tibrewal.ug24@nsut.ac.in',
      },
    },
    {
      id: 'member-3',
      order: '03',
      name: 'Pratikshit Singh',
      rollNo: '2024UIT3004',
      role: 'Data Curation & Backend Developer',
      badge: 'Data Curation & Backend Developer',
      institution: 'Department of Information Technology',
      avatarUrl:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      bio: "Contributing to the EDGE²CO research initiative through dataset curation and backend engineering. Focuses on managing research data, developing backend services and supporting the integration of the application's simulation and machine learning components.",
      responsibilities: [
        'Collecting, organizing and validating datasets used in edge-cloud computing experiments.',
        'Developing backend APIs and server-side application logic.',
        'Designing data-processing workflows for workload and carbon-intensity information.',
        'Supporting integration between the frontend, backend and simulation components.',
        'Contributing to backend architecture, data management and application reliability.',
      ],
      focusAreas: [
        'Data Curation',
        'Backend Development',
        'API Development',
        'Data Processing',
        'System Architecture',
      ],
      social: {
        github: 'https://github.com/pratikshitcodes',
        linkedin: '',
        email: 'pratikshit.singh.ug24@nsut.ac.in',
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {members.map((m) => (
          <div
            key={m.id}
            className={`rounded-3xl bg-white dark:bg-slate-900 border p-6 sm:p-8 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full group ${
              m.id === 'member-2'
                ? 'border-emerald-200/80 dark:border-emerald-800/50 hover:border-emerald-500/80 hover:shadow-emerald-500/10'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="space-y-4">
              {/* Top Order & Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-2xl font-extrabold text-slate-300 dark:text-slate-700 shrink-0">
                  {m.order}
                </span>
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-right leading-tight transition-all ${
                    m.id === 'member-2'
                      ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/80 shadow-sm shadow-emerald-500/10'
                      : 'bg-carbon-50 dark:bg-carbon-950/60 text-carbon-700 dark:text-carbon-300 border border-carbon-200 dark:border-carbon-800'
                  }`}
                >
                  {m.badge}
                </span>
              </div>

              {/* Profile Image & Name */}
              <div className="flex items-center gap-4 pt-1">
                <div className="relative group/avatar">
                  <img
                    src={m.avatarUrl}
                    alt={m.name}
                    className={`w-16 h-16 rounded-2xl object-cover transition-all duration-300 shadow-md ${
                      m.id === 'member-2'
                        ? 'ring-2 ring-emerald-500/70 group-hover:ring-emerald-400 group-hover:scale-105 shadow-emerald-500/20'
                        : 'ring-2 ring-carbon-500/30 group-hover:ring-carbon-500'
                    }`}
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-md ${
                      m.id === 'member-2'
                        ? 'bg-gradient-to-tr from-emerald-600 to-teal-400'
                        : 'bg-carbon-500'
                    }`}
                  >
                    {m.id === 'member-2' ? (
                      <Cpu className="w-3 h-3 text-white animate-pulse" />
                    ) : (
                      <GraduationCap className="w-3 h-3 text-white" />
                    )}
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
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-md transition-all ${
                        m.id === 'member-2'
                          ? 'bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/80 font-medium'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                      }`}
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
                  aria-label={`${m.name}'s GitHub Profile`}
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                {m.social.linkedin ? (
                  <a
                    href={m.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    aria-label={`${m.name}'s LinkedIn Profile`}
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </a>
                ) : (
                  <span
                    className="p-2 rounded-xl text-slate-300 dark:text-slate-600 cursor-not-allowed opacity-60 inline-flex items-center justify-center select-none"
                    aria-label="LinkedIn profile coming soon"
                    title="LinkedIn profile coming soon"
                  >
                    <LinkedinIcon className="w-4 h-4" />
                  </span>
                )}
                <a
                  href={`mailto:${m.social.email}`}
                  className="p-2 rounded-xl text-slate-500 hover:text-carbon-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  aria-label={`Send Email to ${m.name}`}
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
