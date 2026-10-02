import React, { useState } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  className?: string;
  position?: 'top' | 'bottom' | 'right' | 'left';
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  className = '',
  position = 'top',
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  };

  return (
    <div
      className={`relative inline-flex items-center ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children || (
        <button
          type="button"
          aria-label="More information"
          className="text-slate-400 hover:text-carbon-600 dark:hover:text-carbon-400 focus:outline-none ml-1 transition-colors"
        >
          <Info className="w-3.5 h-3.5" />
        </button>
      )}

      {isVisible && (
        <div
          role="tooltip"
          className={`absolute z-50 px-2.5 py-1.5 text-xs font-normal text-white bg-slate-900/95 dark:bg-slate-800 border border-slate-700/80 rounded-lg shadow-xl whitespace-normal max-w-xs text-center backdrop-blur-sm pointer-events-none transition-opacity duration-150 animate-in fade-in ${positionClasses[position]}`}
        >
          {content}
          <div
            className={`absolute w-2 h-2 bg-slate-900 dark:bg-slate-800 rotate-45 border-slate-700/80 ${
              position === 'top'
                ? 'top-full left-1/2 -translate-x-1/2 -translate-y-1 border-b border-r'
                : position === 'bottom'
                ? 'bottom-full left-1/2 -translate-x-1/2 translate-y-1 border-t border-l'
                : position === 'right'
                ? 'right-full top-1/2 translate-x-1 -translate-y-1/2 border-b border-l'
                : 'left-full top-1/2 -translate-x-1 -translate-y-1/2 border-t border-r'
            }`}
          />
        </div>
      )}
    </div>
  );
};
