import React from 'react';
import arrowRightAlt from '../assets/icons/arrow_right_alt.svg';

function ContentDisclaimerModal({ open, onAccept, onReject }) {
  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[110] bg-black/30" onClick={onReject} />
      <div
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[120] bg-white border border-black rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] overflow-hidden"
        style={{ width: 'min(500px, calc(100vw - 32px))' }}
      >
        <div className="flex flex-col pt-8 px-8">
          <h2 className="font-semibold text-[24px] leading-[1.2] text-black">
            You may see explicit content from other users.
          </h2>
          <p className="mt-6 text-[15px] leading-[1.5] text-black">
            <strong>Your consent is required to continue. </strong>
            By accepting the{' '}
            <span className="underline">terms and conditions</span>
            , you acknowledge that FIREWALL Cafe is not responsible for what you search for, or what you see.
          </p>
        </div>
        <div className="flex items-center justify-between px-8 py-6">
          <button
            onClick={onReject}
            className="flex items-center justify-center h-[40px] px-2 text-[#484e55] text-[17px] font-medium hover:text-black transition-colors"
          >
            Reject
          </button>
          <button
            onClick={onAccept}
            className="flex items-center gap-1 h-[40px] px-4 bg-black border border-black rounded-[4px] text-white text-[17px] font-medium hover:bg-neutral-800 transition-colors"
          >
            Accept
            <img src={arrowRightAlt} alt="" className="size-6" style={{ filter: 'brightness(0) invert(1)' }} />
          </button>
        </div>
      </div>
    </>
  );
}

export default ContentDisclaimerModal;
