import React from 'react';
import FlagWarningIcon from './FlagWarningIcon';

// Amber warning flag marking a Baidu result sourced from a Chinese
// state-media or government website ("soft censorship").
const SoftCensorshipIcon = ({ className = '', ...props }) => (
  <FlagWarningIcon
    aria-label="Soft censorship warning"
    className={`${className} cursor-help`}
    {...props}
  />
);

export default SoftCensorshipIcon;
