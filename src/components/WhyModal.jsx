import React from 'react';
import visibilityOff from '../assets/icons/visibility_off.svg';
import brokenImage from '../assets/icons/broken-image.png';
import cloudAlert from '../assets/icons/cloud_alert.svg';

const ROWS = [
  {
    icon: visibilityOff,
    label: '删减版',
    title: 'Image Censored',
    description: 'An image has been censored by Baidu',
  },
  {
    icon: brokenImage,
    title: 'Linked Image Broken',
    description: 'An image failed to save because of a technical error',
  },
  {
    icon: cloudAlert,
    title: 'Unable to contact Baidu',
    description: 'We were unable to complete your search for any number of reasons.',
  },
];

function WhyModal({ open, onClose }) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[110] bg-black/30" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[120] bg-white border border-black rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] overflow-hidden"
        style={{ width: 'min(500px, calc(100vw - 32px))' }}
      >
        <div className="flex flex-col items-center gap-[26px] pt-12 pb-6 px-8">
          <h2 className="font-bitmap-song text-[36px] leading-tight text-black text-center">
            Why am I seeing this?
          </h2>

          <div className="flex flex-col w-full">
            {ROWS.map((row, i) => (
              <React.Fragment key={row.title}>
                <div className="flex items-center h-[75px] bg-white rounded-[8px] overflow-hidden">
                  <div className="flex flex-col items-center justify-center gap-0.5 bg-[#f5f7f9] rounded-[8px] shrink-0 w-[72px] h-[72px]">
                    <img src={row.icon} alt="" className="w-9 h-9 object-contain" />
                    {row.label && (
                      <span className="text-[10px] font-semibold tracking-wide text-[#e81717]">
                        {row.label}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 px-4 py-3 flex-1 min-w-0">
                    <p className="font-semibold text-[15px] text-black leading-none">{row.title}</p>
                    <p className="text-[13px] text-[#484e55] leading-[1.5]">{row.description}</p>
                  </div>
                </div>
                {i < ROWS.length - 1 && <hr className="border-[#dde3e8]" />}
              </React.Fragment>
            ))}
          </div>

          <button
            onClick={onClose}
            className="flex items-center justify-center w-full h-[68px] text-[#8d969e] text-[17px] font-medium hover:text-[#484e55] transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </>
  );
}

export default WhyModal;
