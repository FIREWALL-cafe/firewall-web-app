import React from 'react';

// Warning flag on a pole, in the site's amber warning palette by default.
const FlagWarningIcon = ({
  width = 20,
  height = 20,
  fill = '#F59E0B',
  stroke = '#92400E',
  className = '',
  'aria-label': ariaLabel = 'Warning flag',
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
    aria-label={ariaLabel}
    className={className}
    data-tooltip-id={tooltipId}
    data-tooltip-content={tooltipContent}
    data-tooltip-place={tooltipPlace}
    {...props}
  >
    {/* Flag cloth */}
    <path
      d="M6 4 H19 L15.8 8.25 L19 12.5 H6 Z"
      fill={fill}
      stroke={stroke}
      strokeWidth="1"
      strokeLinejoin="round"
    />
    {/* Pole */}
    <rect x="5" y="3" width="1.8" height="18" rx="0.9" fill={stroke} />
  </svg>
);

export default FlagWarningIcon;
