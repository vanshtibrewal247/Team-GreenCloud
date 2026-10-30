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
      name: 'Vansh Tiberiwal',
      rollNo: '2024UIT3019',
      role: 'Data Curation & Frontend Developer',
      badge: 'Data Curation & Frontend Developer',
      institution: 'Department of Information Technology',
      avatarUrl:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
      bio: 'Contributing to the EDGE²CO research initiative through dataset curation and frontend development. Focuses on preparing and organizing research datasets and developing interactive web interfaces for visualizing edge-cloud computing and carbon-aware scheduling results.',
      responsibilities: [
        'Collecting, cleaning and organizing datasets required for edge-cloud workload analysis.',
        'Performing data preprocessing, validation and curation for machine learning experiments.',
        'Developing frontend components and interactive dashboards for the research platform.',
        'Integrating charts and visualizations to communicate simulation and forecasting results.',
        'Collaborating on frontend architecture and improving the usability of the application.',
      ],
      focusAreas: [
        'Data Curation',
        'Data Preprocessing',
        'React Development',
        'Data Visualization',
        'Frontend Engineering',
      ],
      social: {
        github: 'https://github.com/vanshtibrewal247',
        linkedin: '',
        email: 'vansh.tiberiwal.ug24@nsut.ac.in',
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {members.map((m) => (
          <div
            key={m.id}
            className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
          >
            <div className="space-y-4">
              {/* Top Order & Badge */}
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-2xl font-extrabold text-slate-300 dark:text-slate-700 shrink-0">
                  {m.order}
                </span>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-carbon-50 dark:bg-carbon-950/60 text-carbon-700 dark:text-carbon-300 border border-carbon-200 dark:border-carbon-800 text-right leading-tight">
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
