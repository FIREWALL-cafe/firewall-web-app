import React from 'react';
import CloseIcon from '../assets/icons/close.svg';

export default function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 h-8 px-3 py-1 border border-black rounded bg-[#eff2f5] text-[17px] text-black">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="flex items-center hover:opacity-70 transition-opacity"
        aria-label={`Remove ${label} filter`}
      >
        <img src={CloseIcon} alt="" className="w-6 h-6 object-contain" />
      </button>
    </span>
  );
}
