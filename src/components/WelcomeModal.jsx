import React, { useState, useEffect } from 'react';
import logoOnly from '../assets/icons/logo_only.svg';
import closeIcon from '../assets/icons/close_large.svg';
import arrowRightAlt from '../assets/icons/arrow_right_alt.svg';

function WelcomeModal({ open, onClose, onStart, onSkip }) {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (open) setAnimKey(k => k + 1);
  }, [open]);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[110] bg-black/30" onClick={onClose} />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[120] bg-white border border-black rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] overflow-hidden"
        style={{ width: 'min(500px, calc(100vw - 32px))' }}
        key={animKey}
      >
        {/* X close button */}
        <button
          onClick={onClose}
          className="animate-fade-slide-in absolute top-6 right-6 z-10"
          style={{ animationDelay: '1.9s' }}
          aria-label="Close"
        >
          <img src={closeIcon} alt="" className="size-[28px] object-contain" />
        </button>

        <div className="flex flex-col items-center gap-8 pt-14 pb-8 px-10">
          {/* "Welcome to" */}
          <p
            className="animate-fade-slide-in font-bitmap-song text-[20px] text-[#8d969e] leading-none"
            style={{ animationDelay: '0.3s' }}
          >
            Welcome to
          </p>

          {/* Logo + brand name */}
          <div
            className="animate-fade-slide-in flex items-center gap-4"
            style={{ animationDelay: '0.8s' }}
          >
            <img src={logoOnly} alt="" className="h-[64px] w-auto shrink-0" />
            <div className="flex flex-col leading-none">
              <span className="font-bitmap-song text-[40px] text-black">FIREWALL</span>
              <span className="font-bitmap-song text-[40px] text-black">
                Cafe <span className="text-[#e81717]">防火墙</span>
              </span>
            </div>
          </div>

          {/* "Here's how it works..." */}
          <p
            className="animate-fade-slide-in font-bitmap-song text-[24px] text-[#484e55] leading-none"
            style={{ animationDelay: '1.4s' }}
          >
            Here's how it works...
          </p>

          {/* Action buttons */}
          <div
            className="animate-fade-slide-in flex items-center justify-between w-full pt-2"
            style={{ animationDelay: '1.9s' }}
          >
            <button
              onClick={onSkip}
              className="flex items-center justify-center h-[40px] px-4 text-[#484e55] text-[17px] font-medium hover:text-black transition-colors"
            >
              Skip
            </button>
            <button
              onClick={onStart}
              className="flex items-center gap-1 h-[40px] px-4 bg-black border border-black rounded-[4px] text-white text-[17px] font-medium hover:bg-neutral-800 transition-colors"
            >
              Start
              <img src={arrowRightAlt} alt="" className="size-6" style={{ filter: 'brightness(0) invert(1)' }} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default WelcomeModal;
