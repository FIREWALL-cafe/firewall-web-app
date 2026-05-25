import React from 'react';
import Spinner from '../assets/spinner.svg';

function SearchProgressIndicator({ isActive, progress, caption, isRedStage = false }) {
  if (!isActive) return null;

  const pct = Math.min(Math.max(progress, 0), 1) * 100;
  const fillColor = isRedStage ? '#DC2626' : '#2563EB';

  return (
    <div role="status" aria-live="polite" className="w-full max-w-2xl mx-auto mt-3">
      <div className="relative h-[10px] bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width,background-color] duration-500 ease-out"
          style={{ width: `${pct}%`, backgroundColor: fillColor }}
        />
      </div>
      <div className="mt-2 flex items-center gap-2 text-neutral-700">
        <img src={Spinner} alt="" aria-hidden="true" className="w-4 h-4 animate-spin" />
        <span className="font-bitmap-song text-[13px]">{caption}</span>
      </div>
    </div>
  );
}

export default SearchProgressIndicator;
