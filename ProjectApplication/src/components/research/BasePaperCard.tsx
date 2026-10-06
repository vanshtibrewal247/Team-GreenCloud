import React, { useState } from 'react';
import {
  BookOpen,
  Download,
  Copy,
  Check,
} from 'lucide-react';
import { Modal } from '../common/Modal';

export const BasePaperCard: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const paper = {
    title:
      'Dynamic Carbon-Aware Hybrid Task Offloading for Collaborative Edge-Cloud Computing',

    venue:
      '2026 IEEE Wireless Communications and Networking Conference (WCNC)',

    authors:
      'Pin-Chun Chen, Li-Hsing Yen, Yan-Wei Chen, Ze-Yu Jin, and Chien-Chao Tseng',

    year: 2026,

    doi:
      '10.1109/WCNC65185.2026.11555269',

    area:
      'Carbon-Aware Edge-Cloud Computing, Task Offloading & Workload Optimization',

    abstract:
      'Collaborative edge-cloud computing is an emerging paradigm that balances processing efficiency and user experience by offloading edge workloads to the cloud (i.e., vertical offloading). Adding the option of horizontal offloading (i.e., edge-to-edge offloading) can further enhance the flexibility of this architecture. However, prior work ignored temporal and spatial variations in carbon emissions when making offloading decisions. Our study aims to jointly optimize the carbon footprint and the balance of edge servers’ workloads, which is challenged by dynamic workload arrivals to edge servers and time-and-location-varying carbon intensity (CI). We propose an online algorithm Lyapunov optimization framework to configure offloading workload and transmission power for mixed vertical and horizontal offloading. Simulations based on historical CI data reveal that the proposed algorithm can efficiently reduce carbon footprint while balancing queue backlogs among edge and cloud servers.',

    bibtex: `@inproceedings{chen2026dynamic,
  title={Dynamic Carbon-Aware Hybrid Task Offloading for Collaborative Edge-Cloud Computing},
  author={Chen, Pin-Chun and Yen, Li-Hsing and Chen, Yan-Wei and Jin, Ze-Yu and Tseng, Chien-Chao},
  booktitle={2026 IEEE Wireless Communications and Networking Conference (WCNC)},
  year={2026},
  publisher={IEEE},
  doi={10.1109/WCNC65185.2026.11555269}
}`,
  };

  const handleCopyBibtex = () => {
    navigator.clipboard.writeText(paper.bibtex);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleDownloadPdf = () => {
    const link = document.createElement('a');

    link.href = '/Cloud-Computing-Base-Research-Paper.pdf';
    link.download =
      'Forecast-Driven Carbon-Aware Task Offloading in Edge-Cloud Computing.pdf';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm relative overflow-hidden">

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">

          {/* Paper Information */}
          <div className="space-y-3 max-w-3xl">

            <div className="flex flex-wrap items-center gap-2">

              <span className="text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                Foundational Base Paper
              </span>

              <span className="text-xs text-slate-400">
                •
              </span>

              <span className="text-xs text-slate-500 font-mono">
                {paper.venue} ({paper.year})
              </span>

            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
              {paper.title}
            </h2>

            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">

              <div>
                <strong>Authors:</strong>{' '}
                {paper.authors}
              </div>

              <div className="flex items-center gap-2">
                <strong>DOI:</strong>

                <span className="font-mono text-carbon-600 dark:text-carbon-400 underline">
                  {paper.doi}
                </span>
              </div>

              <div>
                <strong>Core Research Area:</strong>{' '}
                {paper.area}
              </div>

            </div>

          </div>

          {/* Action Buttons */}
          <div className="flex flex-row lg:flex-col gap-2.5 shrink-0">

            <button
              onClick={() => setModalOpen(true)}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <BookOpen className="w-4 h-4 text-carbon-400" />

              <span>
                View Paper Abstract
              </span>
            </button>

            <button
              onClick={handleDownloadPdf}
              className="flex-1 lg:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-all shadow-sm"
            >
              <Download className="w-4 h-4 text-carbon-500" />

              <span>
                Download PDF
              </span>
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

        <div className="space-y-5 py-2 text-xs leading-relaxed text-slate-700 dark:text-slate-300">

          {/* Abstract */}
          <div>

            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px] mb-2">
              Abstract
            </h4>

            <p className="text-slate-600 dark:text-slate-400 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700 leading-relaxed">
              {paper.abstract}
            </p>

          </div>

          {/* BibTeX */}
          <div>

            <div className="flex items-center justify-between mb-2">

              <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                BibTeX Citation
              </h4>

              <button
                onClick={handleCopyBibtex}
                className="inline-flex items-center gap-1 text-[11px] text-carbon-600 dark:text-carbon-400 hover:underline"
              >

                {copied ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}

                <span>
                  {copied ? 'Copied' : 'Copy Citation'}
                </span>

              </button>

            </div>

            <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto whitespace-pre">
              {paper.bibtex}
            </pre>

          </div>

        </div>

      </Modal>
    </>
  );
};