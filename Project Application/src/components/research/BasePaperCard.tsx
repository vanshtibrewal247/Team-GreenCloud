import React, { useState } from 'react';
import { BookOpen, Download, ExternalLink, Copy, Check, FileText, Sparkles, GraduationCap } from 'lucide-react';
import { Modal } from '../common/Modal';

export const BasePaperCard: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const paper = {
    title: 'Energy-Efficient and Delay-Optimal Task Offloading in Mobile Edge Computing Systems',
    venue: 'IEEE Transactions on Green Communications and Networking (TGCN)',
    authors: 'Y. Zhang, X. Liu, J. Chen, and K. B. Letaief',
    year: 2023,
    doi: '10.1109/TGCN.2023.3289140',
    area: 'Distributed Edge Intelligence, QoS Optimization & Mobile Cloud Offloading',
    abstract:
      'Mobile edge computing (MEC) enables resource-constrained Internet-of-Things (IoT) devices to offload computationally heavy tasks to proximal edge base stations. This paper investigates the joint optimization of task offloading decisions, radio transmission power, and CPU cycle allocation. We formulate a mixed-integer non-linear programming (MINLP) problem to minimize total weighted system latency and energy expenditure subject to deadline constraints. A Lyapunov-guided heuristic is developed to achieve near-optimal offloading decisions in polynomial time under instantaneous channel states.',
    bibtex: `@article{zhang2023energy,
  title={Energy-Efficient and Delay-Optimal Task Offloading in Mobile Edge Computing Systems},
  author={Zhang, Y. and Liu, X. and Chen, J. and Letaief, K. B.},
  journal={IEEE Transactions on Green Communications and Networking},
  volume={7},
  number={3},
  pages={1420--1435},
  year={2023},
  publisher={IEEE},
  doi={10.1109/TGCN.2023.3289140}
}`,
  };

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(paper.bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMockPdf = () => {
    const content = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Base_Paper_Zhang_TGCN_2023.pdf';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Foundational Base Paper
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-mono">{paper.venue} ({paper.year})</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {paper.title}
            </h2>

            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <div>
                <strong>Authors:</strong> {paper.authors}
              </div>
              <div className="flex items-center gap-2">
                <strong>DOI:</strong>{' '}
                <span className="font-mono text-carbon-600 dark:text-carbon-400 underline">
                  {paper.doi}
                </span>
              </div>
              <div>
                <strong>Core Research Area:</strong> {paper.area}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-row lg:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-carbon-400" />
              <span>View Paper Abstract</span>
            </button>

            <button
              onClick={handleDownloadMockPdf}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-carbon-500" />
              <span>Download PDF (Mock)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Abstract & Citation Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={paper.title}
        subtitle={`${paper.authors} — ${paper.venue}, ${paper.year}`}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4 py-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-1">
              Abstract
            </h4>
            <p className="text-slate-600 dark:text-slate-400 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700">
              {paper.abstract}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                BibTeX Citation
              </h4>
              <button
                onClick={handleCopyBibtex}
                className="inline-flex items-center gap-1 text-[11px] text-carbon-600 dark:text-carbon-400 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Citation'}</span>
              </button>
            </div>
            <pre className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto">
              {paper.bibtex}
            </pre>
          </div>
        </div>
      </Modal>
    </>
  );
};
