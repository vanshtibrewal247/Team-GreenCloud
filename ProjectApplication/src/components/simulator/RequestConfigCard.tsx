import React, { useMemo } from 'react';
import { Clock, Zap, Sliders, Calendar, Sparkles, BookOpen, RotateCcw } from 'lucide-react';
import { SimConfig, TraceData } from '../../sim/types';
import { autoCalibratePhi } from '../../sim';

interface RequestConfigCardProps {
  config: SimConfig;
  trace: TraceData;
  calibratedV: number;
  onChange: (updated: SimConfig) => void;
  onApplyPaperPreset: () => void;
  onRecalibrateV: () => void;
}

export const RequestConfigCard: React.FC<RequestConfigCardProps> = ({
  config,
  trace,
  calibratedV,
  onChange,
  onApplyPaperPreset,
  onRecalibrateV,
}) => {
  // V slider log bounds: 0.1x to 30x of calibrated V
  const minV = 0.1 * calibratedV;
  const maxV = 30.0 * calibratedV;
  const logMin = Math.log10(minV);
  const logMax = Math.log10(maxV);

  // Current slider percentage [0, 100]
  const currentV = config.v.value;
  const sliderPercent = useMemo(() => {
    if (currentV <= 0) return 0;
    const logCur = Math.log10(currentV);
    const p = ((logCur - logMin) / (logMax - logMin)) * 100;
    return Math.min(100, Math.max(0, p));
  }, [currentV, logMin, logMax]);

  const handleSliderChange = (percent: number) => {
    const logV = logMin + (percent / 100) * (logMax - logMin);
    const nextV = Math.pow(10, logV);
    onChange({
      ...config,
      v: {
        ...config.v,
        value: nextV,
      },
    });
  };

  const handleSlotLengthChange = (hours: 1 | 2 | 4 | 6) => {
    onChange({
      ...config,
      slotLengthHours: hours,
    });
    // Trigger recalibration in parent
    setTimeout(onRecalibrateV, 0);
  };

  const handleArrivalScaleChange = (scale: number) => {
    onChange({
      ...config,
      arrivalScale: {
        ...config.arrivalScale,
        value: scale,
      },
    });
  };

  const handleEmaAlphaChange = (alpha: number) => {
    onChange({
      ...config,
      emaAlpha: {
        ...config.emaAlpha,
        value: alpha,
      },
    });
  };

  const handlePhiChange = (phiVal: number) => {
    onChange({
      ...config,
      phi: {
        ...config.phi,
        value: phiVal,
      },
    });
    setTimeout(onRecalibrateV, 0);
  };

  const handleAutoCalibratePhi = () => {
    const res = autoCalibratePhi(trace, config, 0.65);
    onChange({
      ...config,
      phi: {
        ...config.phi,
        value: res.phi,
      },
    });
    setTimeout(onRecalibrateV, 0);
  };

  const vMultiplier = currentV / (calibratedV || 1);
  const isCalibratedV = Math.abs(vMultiplier - 1.0) < 0.05;

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 pb-3.5 mb-4 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-start gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Workload & Time Configuration
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                Lyapunov Controls
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Slot duration, arrival scaling, CPU cycles/bit, and Lyapunov drift-plus-penalty parameter
            </p>
          </div>
        </div>

        {/* Paper Preset Button */}
        <button
          type="button"
          onClick={onApplyPaperPreset}
          className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-all shrink-0"
          title="Reset to IEEE WCNC 2026 paper simulation parameters (phi=1000, slot=1h, W=1MHz)"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Paper Preset</span>
        </button>
      </div>

      <div className="space-y-4">
        {/* Row 1: Slot Length & Arrival Scale */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Slot Length */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> Slot Length
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                {config.slotLengthHours} hour{config.slotLengthHours > 1 ? 's' : ''} / step
              </span>
            </div>
            <div className="grid grid-cols-4 gap-1.5">
              {([1, 2, 4, 6] as const).map(h => (
                <button
                  key={h}
                  type="button"
                  onClick={() => handleSlotLengthChange(h)}
                  className={`py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    config.slotLengthHours === h
                      ? 'bg-amber-500 text-white border-amber-600 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {h}h
                </button>
              ))}
            </div>
          </div>

          {/* Arrival Scale Multiplier */}
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Arrival Scale Multiplier
              </span>
              <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
                {config.arrivalScale.value.toFixed(1)}x
              </span>
            </div>
            <input
              type="range"
              min="0.2"
              max="3.0"
              step="0.1"
              value={config.arrivalScale.value}
              onChange={e => handleArrivalScaleChange(parseFloat(e.target.value))}
              className="w-full accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>0.2x (Light)</span>
              <span>1.0x (Baseline)</span>
              <span>3.0x (Peak)</span>
            </div>
          </div>
        </div>

        {/* Row 2: Date Range Selector */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-500" /> Trace Hour Range
            </span>
            <span className="text-xs font-mono text-slate-700 dark:text-slate-300">
              Hours {config.startHour} to {config.endHour} ({config.endHour - config.startHour} hrs)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-1">
            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400">Start Hour</label>
              <input
                type="number"
                min="0"
                max={Math.max(0, config.endHour - 10)}
                value={config.startHour}
                onChange={e =>
                  onChange({
                    ...config,
                    startHour: Math.max(0, parseInt(e.target.value) || 0),
                  })
                }
                className="w-full mt-0.5 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-500 dark:text-slate-400">End Hour</label>
              <input
                type="number"
                min={config.startHour + 10}
                max={trace.num_hours}
                value={config.endHour}
                onChange={e =>
                  onChange({
                    ...config,
                    endHour: Math.min(trace.num_hours, parseInt(e.target.value) || trace.num_hours),
                  })
                }
                className="w-full mt-0.5 px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono text-slate-900 dark:text-slate-100"
              />
            </div>
          </div>
        </div>

        {/* Row 3: CPU Cycles per bit (phi) & Auto-calibrate */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Workload Density φ (CPU cycles / bit)
            </span>
            <button
              type="button"
              onClick={handleAutoCalibratePhi}
              className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Auto-Calibrate φ (65% Util)</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="500"
              max="15000"
              step="100"
              value={config.phi.value}
              onChange={e => handlePhiChange(parseInt(e.target.value))}
              className="w-full accent-emerald-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 w-24 text-right">
              {config.phi.value.toLocaleString()} c/b
            </span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Higher φ represents compute-intensive tasks requiring more CPU cycles per byte
          </p>
        </div>

        {/* Row 4: Lyapunov Parameter V Slider */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Lyapunov Parameter V
              </span>
              {isCalibratedV && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Calibrated Baseline
                </span>
              )}
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                {currentV.toExponential(2)} ({vMultiplier.toFixed(2)}x)
              </span>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="100"
            step="0.5"
            value={sliderPercent}
            onChange={e => handleSliderChange(parseFloat(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[10px] text-slate-400">
            <span>0.1x ({minV.toExponential(1)})</span>
            <span
              onClick={() => handleSliderChange(((Math.log10(calibratedV) - logMin) / (logMax - logMin)) * 100)}
              className="cursor-pointer text-emerald-600 dark:text-emerald-400 font-semibold underline decoration-dotted"
              title="Click to reset to calibrated V"
            >
              1.0x Calibrated ({calibratedV.toExponential(2)})
            </span>
            <span>30.0x ({maxV.toExponential(1)})</span>
          </div>

          <div className="p-2 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-[11px] text-amber-800 dark:text-amber-300 leading-snug">
            <p className="font-semibold">
              calibrated so DWPA's average queue is about 15% of one slot's arrivals
            </p>
            <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">
              Hint: low V = shorter queues, high V = lower carbon
            </p>
          </div>
        </div>

        {/* Row 5: EMA Alpha */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              EMA Smoothing Factor (α)
            </span>
            <span className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100">
              {config.emaAlpha.value.toFixed(2)}
            </span>
          </div>
          <input
            type="range"
            min="0.0"
            max="1.0"
            step="0.05"
            value={config.emaAlpha.value}
            onChange={e => handleEmaAlphaChange(parseFloat(e.target.value))}
            className="w-full accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
          />
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
            Exponential moving average coefficient for carbon intensity tracking: k_i(t) = α·C_i(t) + (1-α)·k_i(t-1)
          </p>
        </div>
      </div>
    </div>
  );
};
