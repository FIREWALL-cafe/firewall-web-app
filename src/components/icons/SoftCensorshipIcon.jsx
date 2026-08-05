import React from 'react';

// Amber warning triangle marking a Baidu result sourced from a Chinese
// state-media or government website ("soft censorship").
const SoftCensorshipIcon = ({
  width = 20,
  height = 20,
  className = '',
  'data-tooltip-id': tooltipId,
  'data-tooltip-content': tooltipContent,
  'data-tooltip-place': tooltipPlace,
  ...props
}) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    aria-label="Soft censorship warning"
    className={`${className} cursor-help`}
    data-tooltip-id={tooltipId}
    data-tooltip-content={tooltipContent}
    data-tooltip-place={tooltipPlace}
    {...props}
  >
    <path
      d="M12 2.5 L23 21 H1 Z"
      fill="#F59E0B"
      stroke="#92400E"
      strokeWidth="1"
      strokeLinejoin="round"
    />
    <rect x="11" y="9" width="2" height="6.5" rx="1" fill="#451A03" />
    <rect x="11" y="17" width="2" height="2" rx="1" fill="#451A03" />
  </svg>
);

export default SoftCensorshipIcon;
