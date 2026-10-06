import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { EdgeRegion, RegionId } from '../../types/simulation';
import { REGIONS } from '../../services/carbonService';

interface AddRegionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddRegion: (region: EdgeRegion) => void;
}

export const AddRegionModal: React.FC<AddRegionModalProps> = ({
  isOpen,
  onClose,
  onAddRegion,
}) => {
  const [name, setName] = useState('Secondary Edge Cluster');
  const [region, setRegion] = useState<RegionId>('bengaluru');
  const [serverCount, setServerCount] = useState(3);
  const [cpuMips, setCpuMips] = useState(3000);
  const [ramGb, setRamGb] = useState(8);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRegion({
      id: `region-${Date.now()}`,
      name,
      region,
      serverCount,
      cpuMips,
      ramGb,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Distributed Edge Region"
      subtitle="Expand your multi-region edge topology to test geographic carbon migration."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 py-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Cluster Identifier
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-carbon-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Geographic Location & Grid
          </label>
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionId)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-carbon-500"
          >
            {Object.values(REGIONS).map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.avgCarbonIntensity} gCO₂/kWh)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Nodes (1-10)
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={serverCount}
              onChange={(e) => setServerCount(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              CPU (MIPS)
            </label>
            <input
              type="number"
              step={500}
              min={1000}
              max={8000}
              value={cpuMips}
              onChange={(e) => setCpuMips(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              RAM (GB)
            </label>
            <select
              value={ramGb}
              onChange={(e) => setRamGb(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            >
              <option value={4}>4 GB</option>
              <option value={8}>8 GB</option>
              <option value={16}>16 GB</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-xs font-semibold text-white bg-carbon-600 hover:bg-carbon-700 rounded-xl shadow-md shadow-carbon-600/20"
          >
            Add Cluster
          </button>
        </div>
      </form>
    </Modal>
  );
};
