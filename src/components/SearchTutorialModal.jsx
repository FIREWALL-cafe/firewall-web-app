import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import searchHeaderIcon from '../assets/icons/search-tutorial-header-icon.png';
import archiveIcon from '../assets/icons/search-tutorial-archive-icon.png';
import arrowDown from '../assets/icons/search-tutorial-arrow-down.svg';
import cachedIcon from '../assets/icons/search-tutorial-cached.svg';
import apple1 from '../assets/icons/search-tutorial-apple-1.png';
import apple2 from '../assets/icons/search-tutorial-apple-2.png';
import logoE from '../assets/icons/search-tutorial-logo-e.png';
import gIcon from '../assets/icons/search-tutorial-g-icon.svg';
import baiduTabIcon from '../assets/icons/search-tutorial-baidu-tab-icon.svg';
import googleLogo from '../assets/icons/Google-logo_long.svg';
import baiduLogo from '../assets/icons/baidu_logo_long.svg';
import visibilityOff from '../assets/icons/visibility_off.svg';
import visibility from '../assets/icons/visibility.svg';
import thumbUp from '../assets/icons/thumb_up.svg';
import thumbDown from '../assets/icons/thumb_down.svg';
import lostInTranslation from '../assets/icons/lost_in_translation.svg';
import arrowRightAlt from '../assets/icons/arrow_right_alt.svg';
import closeIcon from '../assets/icons/close_large.svg';

function SearchScreen() {
  return (
    <div className="px-[52px] pt-6 pb-8 flex flex-col gap-4">
      {/* Google + Baidu cards */}
      <div className="flex gap-6 items-center justify-center">
        <div className="flex items-center justify-center bg-[#fbfbfc] border-2 border-[#e8edf1] rounded-[10px] px-3 py-4 w-[136px] h-[62px]">
          <img src={googleLogo} alt="Google" className="h-[30px] w-auto" />
        </div>
        <div className="flex items-center justify-center bg-[#fbfbfc] border-2 border-[#e8edf1] rounded-[10px] px-3 py-4 w-[136px] h-[62px]">
          <img src={baiduLogo} alt="Baidu" className="h-[30px] w-auto" />
        </div>
      </div>

      {/* Arrow down */}
      <div className="flex justify-center">
        <img src={arrowDown} alt="" className="h-[51px] w-auto" />
      </div>

      {/* Search input mockup */}
      <div className="relative h-[81px] w-full border border-[#e81717] rounded-[2px]">
        {/* Tab */}
        <div className="absolute top-[5px] left-[10px] flex items-center gap-[5px] bg-white px-[6px] py-[2px]">
          <img src={gIcon} alt="" style={{ width: 17, height: 17 }} />
          <img src={baiduTabIcon} alt="" style={{ width: 17, height: 17 }} />
          <span className="text-[#e81717] text-[15px] font-medium tracking-[0.3px]">Search</span>
        </div>
        {/* Input */}
        <div className="absolute top-[34px] left-[8px] right-[8px] flex items-center justify-between bg-white border border-[#dde3e8] rounded-[2px] px-3 py-[5px]">
          <div className="flex items-center gap-[7px] text-[15px] min-w-0">
            <span className="text-[#1f2124] shrink-0">Fruit of fortune</span>
            <span className="text-[#dde3e8] shrink-0">|</span>
            <span className="text-[#8d969e] shrink-0">发财果</span>
          </div>
          <svg className="size-[23px] shrink-0 ml-2" fill="#8d969e" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>
      </div>

      {/* Translating indicator */}
      <div className="flex items-center gap-[5px]">
        <img src={cachedIcon} alt="" className="size-[22px]" />
        <span className="font-bitmap-song text-[18px] text-[#484e55]">Translating...</span>
      </div>

      {/* Body text */}
      <p className="text-[20px] text-black text-center leading-[1.35] mt-1">
        Search <strong>Google</strong> and <strong>Baidu</strong>{' '}
        <strong>images</strong> simultaneously to compare results.
      </p>
    </div>
  );
}

const VOTE_BUTTONS = [
  { icon: visibilityOff, label: 'Censored', active: true },
  { icon: visibility, label: 'Not Censored', active: false },
  { icon: thumbUp, label: 'Good translation', active: false },
  { icon: thumbDown, label: 'Bad translation', active: false },
  { icon: lostInTranslation, label: 'Lost in Translation', active: false },
];

function ResultsScreen() {
  return (
    <div className="px-8 pt-6 pb-8 flex flex-col gap-5">
      <div className="flex gap-4 items-start">
        {/* Vote buttons column */}
        <div className="flex flex-col gap-2 w-[176px] shrink-0">
          {VOTE_BUTTONS.map(({ icon, label, active }) => (
            <div
              key={label}
              className={`flex items-center gap-[11px] h-[39px] px-[11px] py-[8px] rounded-[4px] border ${
                active ? 'bg-[#eff2f5] border-black' : 'bg-white border-[#b9c0c7]'
              }`}
            >
              <img src={icon} alt="" className="size-[22px] shrink-0" />
              <span className="text-[14px] text-black leading-none">{label}</span>
            </div>
          ))}
        </div>

        {/* Image grid */}
        <div className="flex-1 min-w-0">
          <div className="border border-[#e81717] rounded-[3px] overflow-hidden">
            {/* Header: Google | Baidu */}
            <div className="flex">
              <div className="flex-1 border-r border-[#e81717] px-2 pt-2 pb-1">
                <img src={googleLogo} alt="Google" className="h-5 w-auto" />
              </div>
              <div className="flex-1 px-2 pt-2 pb-1 bg-[#fbfbfc]">
                <img src={baiduLogo} alt="Baidu" className="h-5 w-auto" />
              </div>
            </div>
            {/* Image tiles */}
            <div className="flex border-t border-[#e81717]">
              {/* Google: blue tiles */}
              <div className="flex-1 border-r border-[#e81717] p-2 flex flex-col gap-[3px]">
                <div className="relative bg-[#afe3f0] rounded-[4px] w-full h-[54px] overflow-hidden">
                  <img src={apple2} alt="" className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[30px] w-auto" />
                </div>
                <div className="grid grid-cols-3 gap-[3px]">
                  {Array(9).fill(0).map((_, i) => (
                    <div key={i} className="bg-[#afe3f0] rounded-[3px] aspect-square" />
                  ))}
                </div>
              </div>
              {/* Baidu: red tiles */}
              <div className="flex-1 p-2 bg-[#fbfbfc] flex flex-col gap-[3px]">
                <div className="relative bg-[#ffa4a4] rounded-[4px] w-full h-[54px] overflow-hidden">
                  <img src={apple1} alt="" className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[30px] w-auto" />
                </div>
                <div className="grid grid-cols-3 gap-[3px]">
                  {Array(9).fill(0).map((_, i) => (
                    <div key={i} className="bg-[#ffa4a4] rounded-[3px] aspect-square" />
                  ))}
                </div>
              </div>
            </div>
            {/* Vote strip */}
            <div className="border-t border-[#e81717] px-[9px] py-3">
              <div className="flex gap-[3px]">
                {[0, 1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className={`flex-1 h-[21px] rounded-[4px] border ${
                      i === 0 ? 'bg-[#e8edf1] border-black' : 'bg-[#fbfbfc] border-[#b9c0c7]'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body text */}
      <p className="text-[20px] text-black text-center leading-[1.35]">
        <strong>Vote</strong> on the <strong>image results</strong>, and if you think they are censored or not.
      </p>
    </div>
  );
}

const ARCHIVE_CHIP_ROWS = [
  [{ label: '小熊维尼', red: true }, { label: 'Tank Man', red: false }],
  [{ label: 'Winnie the Pooh', red: false }, { label: '犹', red: true }],
  [{ label: '天安门广场', red: true }, { label: 'June 4', red: false }],
  [{ label: 'Uyghur', red: false }, { label: 'Weak Yuan', red: false }],
];
const ROW_OPACITIES = [1, 0.5, 0.25, 0.15];

function ArchiveRow({ open = false }) {
  const dotColor = open ? '#8d969e' : '#dde3e8';
  return (
    <div className={`flex items-center justify-between px-[6px] ${open ? 'pb-[6px] pt-[4px]' : 'py-[5px] border-b border-[#b9c0c7]'}`}>
      <div className="h-[9px] rounded-[2px] shrink-0" style={{ width: 40, backgroundColor: dotColor }} />
      <div className="h-[9px] rounded-[2px] shrink-0" style={{ width: 26, backgroundColor: dotColor }} />
      <div className="h-[9px] rounded-[2px] shrink-0" style={{ width: 26, backgroundColor: dotColor }} />
      <div className="h-[9px] rounded-[2px] shrink-0" style={{ width: 14, backgroundColor: dotColor }} />
      <svg className="shrink-0" width="12" height="12" fill={dotColor} viewBox="0 0 24 24">
        {open
          ? <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6 1.41 1.41z" />
          : <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
        }
      </svg>
    </div>
  );
}

function ArchiveScreen() {
  return (
    <div className="px-8 pt-6 pb-8 flex flex-col gap-5">
      <div className="flex gap-4 items-start">
        {/* Left: search icon + active chip, then fading chip rows */}
        <div className="flex flex-col gap-2 w-[190px] shrink-0">
          {/* Search icon sits outside the chip */}
          <div className="flex items-center gap-2">
            <svg className="size-[18px] shrink-0 text-[#484e55]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <div className="inline-flex items-center h-[34px] px-[8px] bg-[#eff2f5] border border-black rounded-full">
              <span className="text-[14px] font-medium text-black whitespace-nowrap">Trump China visit</span>
            </div>
          </div>
          {/* Chip rows with decreasing opacity */}
          {ARCHIVE_CHIP_ROWS.map((row, ri) => (
            <div key={ri} className="flex gap-[6px]" style={{ opacity: ROW_OPACITIES[ri] }}>
              {row.map(({ label, red }) => (
                <span
                  key={label}
                  className="inline-flex items-center h-[34px] px-[8px] rounded-full border border-[#b9c0c7]"
                  style={{ color: red ? '#d70000' : '#2e3238' }}
                >
                  <span className="text-[14px] font-medium whitespace-nowrap">{label}</span>
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Right: collapsed/expanded rows + image grid + badge */}
        <div className="flex-1 min-w-0 flex flex-col">
          <ArchiveRow />
          <ArchiveRow />
          <ArchiveRow open />
          {/* Expanded image grid */}
          <div className="border border-[#e81717] rounded-[2px] overflow-hidden">
            <div className="flex">
              <div className="flex-1 border-r border-[#e81717] p-[7px]">
                <div className="grid grid-cols-3 gap-[3px]">
                  {Array(9).fill(0).map((_, i) => (
                    <div key={i} className="bg-[#afe3f0] rounded-[3px] aspect-square" />
                  ))}
                </div>
              </div>
              <div className="flex-1 p-[7px] bg-[#fbfbfc]">
                <div className="grid grid-cols-3 gap-[3px]">
                  {Array(9).fill(0).map((_, i) => (
                    <div key={i} className="bg-[#ffa4a4] rounded-[3px] aspect-square" />
                  ))}
                </div>
              </div>
            </div>
            {/* Vote strip — all 5 unselected */}
            <div className="border-t border-[#e81717] px-[9px] py-[8px]">
              <div className="flex gap-[3px]">
                {[0, 1, 2, 3, 4].map(i => (
                  <div key={i} className="flex-1 h-[21px] rounded-[4px] border bg-[#fbfbfc] border-[#b9c0c7]" />
                ))}
              </div>
            </div>
          </div>
          <ArchiveRow />
          <ArchiveRow />
          {/* Badge */}
          <div className="flex justify-center mt-2">
            <span className="inline-flex items-center h-[34px] px-3 bg-[#eff2f5] border border-[#dde3e8] rounded-full text-[14px] font-semibold text-[#484e55]">
              64 Results
            </span>
          </div>
        </div>
      </div>

      {/* Body text */}
      <p className="text-[20px] text-black text-center leading-[1.35]">
        Browse the <strong>Archive</strong> to see what others searched, and vote on their results.
      </p>
    </div>
  );
}

function SearchTutorialModal({ open, onClose, initialScreen = 0 }) {
  const navigate = useNavigate();
  const [screen, setScreen] = useState(initialScreen);

  useEffect(() => {
    if (open) setScreen(initialScreen);
  }, [open, initialScreen]);

  if (!open) return null;

  const handleNext = () => {
    if (screen === 0) setScreen(1);
    else if (screen === 1) setScreen(2);
    else { navigate('/search'); onClose(); }
  };

  const handleBack = () => {
    if (screen === 2) setScreen(1);
    else if (screen === 1) setScreen(0);
    else onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-[150] bg-black/50" onClick={onClose} />
      <div className="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none">
        <div
          className="relative bg-white border border-black rounded-[8px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.25)] overflow-hidden pointer-events-auto flex flex-col"
          style={{ width: 'min(500px, calc(100vw - 32px))' }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-8 z-10"
            aria-label="Close"
          >
            <img src={closeIcon} alt="" className="size-[28px] object-contain" />
          </button>

          {/* Header */}
          <div className="flex items-center justify-center gap-[11px] pt-8 pb-0">
            {screen === 0 ? (
              <>
                <img src={searchHeaderIcon} alt="" className="size-9" />
                <span className="font-bitmap-song text-[36px] leading-none text-black">Search</span>
              </>
            ) : screen === 1 ? (
              <>
                <img src={logoE} alt="" className="h-7 w-auto" />
                <span className="font-bitmap-song text-[36px] leading-none text-black">Results</span>
              </>
            ) : (
              <>
                <img src={archiveIcon} alt="" className="size-9" />
                <span className="font-bitmap-song text-[36px] leading-none text-black">Archive</span>
              </>
            )}
          </div>

          {/* Screen content */}
          {screen === 0 ? <SearchScreen /> : screen === 1 ? <ResultsScreen /> : <ArchiveScreen />}

          {/* Footer */}
          <div className="flex items-center justify-between px-8 py-6">
            <button
              onClick={handleBack}
              className="flex items-center justify-center h-[40px] w-[108px] border border-[#484e55] rounded-[4px] text-[#484e55] text-[17px] font-medium"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              className={`flex items-center justify-center gap-1 h-[40px] bg-black border border-black rounded-[4px] text-white text-[17px] font-medium ${screen === 2 ? 'px-4' : 'w-[108px]'}`}
            >
              {screen === 2 ? 'Start Searching' : 'Next'}
              <img src={arrowRightAlt} alt="" className="size-6" style={{ filter: 'brightness(0) invert(1)' }} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchTutorialModal;
