import React from 'react';
import CloseIcon from '../assets/icons/close_large.svg';

export default function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 border border-neutral-300 rounded text-sm bg-white">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="ml-1 flex items-center opacity-60 hover:opacity-100 transition-opacity"
        aria-label={`Remove ${label} filter`}
      >
        <img src={CloseIcon} alt="" className="w-3 h-3 object-contain" />
      </button>
    </span>
  );
}
