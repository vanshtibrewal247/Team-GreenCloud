import React from 'react';
import { TeamMember } from '../../types/team';
import { Mail, GraduationCap } from 'lucide-react';
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
      bio: 'Leading project coordination and technical integration for the EDGE²CO Research Lab. Spearheading machine learning model development across multi-model forecasting architectures and engineering the responsive web platform experience.',
      responsibilities: [
        'Coordinating project milestones, technical deliverables, and research paper documentation across lab members.',
        'Training and evaluating time-series forecasting models (Random Forest, HistGradientBoosting, XGBoost, and LSTM) for regional carbon emissions.',
        'Developing the FastAPI inference microservice (ml_service.py) to bridge Python machine learning models with the simulation testbed.',
        'Designing and engineering the modern web frontend using React, TypeScript, and Tailwind CSS for interactive parameter exploration.',
        'Evaluating prediction accuracy across models using statistical metrics (MAPE, RMSE) to assess reliability under grid fluctuations.',
      ],
      focusAreas: [
        'Team Leadership',
        'Time-Series Forecasting',
        'FastAPI & ML Ops',
        'React & TypeScript',
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
      name: 'Pratikshit Singh',
      rollNo: '2024UIT3004',
      role: 'Data Curation & Verification Lead',
      badge: 'Data Curation & Verification Lead',
      institution: 'Department of Information Technology',
      avatarUrl:
        'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
      bio: 'Responsible for sourcing, verifying and integrating all empirical datasets used by the simulation, and spearheading the carbon-intensity forecasting module.',
      responsibilities: [
        'Sourced 4 public datasets directly from primary origins: CAISO grid fuel mix (gridstatus), Alibaba GPU Trace 2020, Intel Berkeley IoT sensors, and SPEC.org/AWS server benchmarks.',
        'Computed grid carbon intensity from fuel mix using IPCC AR5 lifecycle emission factors.',
        'Built reproducible master dataset (7,539 tasks × 77 columns, 0 missing cells) validating all joins and re-deriving 4,500 values with 0 mismatches.',
        'Verified primary documents and corrected baseline errors: server power (432 W measured), AWS pricing ($5.376/h), GPU count units, and raw hourly regional readings.',
        'Documented dataset provenance, assumptions, data dictionary, and verification reports (data_sources.md, verification_report.md).',
      ],
      focusAreas: [
        'Data Curation',
        'Empirical Verification',
        'Carbon Accounting',
        'Master Trace Pipeline',
        'Carbon Forecasting',
      ],
      social: {
        github: 'https://github.com/pratikshitcodes',
        linkedin: '',
        email: 'pratikshit.singh.ug24@nsut.ac.in',
      },
    },
    {
      id: 'member-3',
      order: '03',
      name: 'Vansh Tibrewal',
      rollNo: '2024UIT3019',
      role: 'Simulation & Full-Stack Developer',
      badge: 'Simulation & Full-Stack Developer',
      institution: 'Department of Information Technology',
      avatarUrl:
        'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
      bio: "Responsible for re-implementing the base paper's simulation setup (Chen et al., IEEE WCNC 2026), building the interactive web dashboard using React and TypeScript, and running replay experiments using the paper's original parameters.",
      responsibilities: [
        "Re-implementing the base paper's DWPA simulation setup and 7 benchmark algorithms directly using the paper's defined parameters.",
        'Developing the client-side simulation testbed, reactive topology visualizer, and Recharts analytics dashboard in React and TypeScript.',
        'Assisting with workload trace ingestion, dataset parameter mapping, and input configuration formatting for the simulation runner.',
        'Building automated unit and integration test suites (53 tests across 8 suites) ensuring strict queue flow conservation and system stability.',
        'Displaying multi-metric simulation outputs including carbon footprint, queue backlog distributions, and edge-cloud utilization.',
      ],
      focusAreas: [
        'Base Paper Re-implementation',
        'React & TypeScript',
        'Simulation Testbed',
        'Data Curation Support',
        'Component Testing',
      ],
      social: {
        github: 'https://github.com/vanshtibrewal247',
        linkedin: '',
        email: 'vansh.tibrewal.ug24@nsut.ac.in',
      },
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
        {members.map((m) => (
          <div
            key={m.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 p-6 sm:p-8 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full group"
          >
            <div className="space-y-4">
              {/* Top Order & Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-2xl font-extrabold text-slate-300 dark:text-slate-700 shrink-0">
                  {m.order}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full text-right leading-tight transition-all bg-carbon-50 dark:bg-carbon-950/60 text-carbon-700 dark:text-carbon-300 border border-carbon-200 dark:border-carbon-800">
                  {m.badge}
                </span>
              </div>

              {/* Profile Image & Name */}
              <div className="flex items-center gap-4 pt-1">
                <div className="relative group/avatar">
                  <img
                    src={m.avatarUrl}
                    alt={m.name}
                    className="w-16 h-16 rounded-2xl object-cover transition-all duration-300 shadow-md ring-2 ring-carbon-500/30 group-hover:ring-carbon-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-md bg-carbon-500">
                    <GraduationCap className="w-3 h-3 text-white" />
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
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md transition-all bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
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
