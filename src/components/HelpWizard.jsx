import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import mugImage from '../assets/icons/assistant-mug.png';
import iflIcon from '../assets/icons/ifl.png';
import SearchIcon from '../assets/icons/search-grayscale.png';
import ArchiveIcon from '../assets/icons/Archive_grayscale.png';
import cloudAlert from '../assets/icons/cloud_alert.svg';
import logoOnly from '../assets/icons/logo_only.svg';
import QuestionIcon from './icons/QuestionIcon';

const FALLBACK_TERMS = [
  'Tiananmen Square', 'Taiwan independence', 'Uyghur', 'Hong Kong protests',
  'Liu Xiaobo', 'Falun Gong', 'VPN China', 'Xi Jinping criticism',
  'Tibet freedom', 'Ai Weiwei', 'Dalai Lama', 'Winnie the Pooh',
];

async function fetchRollTerm() {
  try {
    const randomPage = Math.floor(Math.random() * 30) + 1;
    const res = await fetch(`/api/searches?page_size=10&page=${randomPage}`);
    const data = await res.json();
    const results = data.results || data.searches || [];
    if (results.length) {
      const item = results[Math.floor(Math.random() * results.length)];
      const term = item.search_query || item.query || item.search_term || '';
      if (term) return term;
    }
  } catch (_) {}
  return FALLBACK_TERMS[Math.floor(Math.random() * FALLBACK_TERMS.length)];
}

function WizardCard({ icon, title, subtitle, onClick, iconBg = 'bg-[#f5f7f9]' }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full min-h-[64px] bg-white border border-[#b9c0c7] rounded-[8px] overflow-hidden text-left hover:bg-[#f5f7f9] transition-colors shrink-0"
    >
      <div className={`flex items-center justify-center self-stretch ${iconBg} p-3 shrink-0 w-[64px]`}>
        <img src={icon} alt="" className="w-10 h-10 object-contain" />
      </div>
      <div className="flex flex-col gap-1 px-4 py-3 min-w-0">
        <span className="font-semibold text-[15px] text-black leading-none">{title}</span>
        {subtitle && <span className="text-[13px] text-[#484e55] leading-[1.2]">{subtitle}</span>}
      </div>
    </button>
  );
}

function RollInput({ rolledTerm, onRoll, isRolling, onCopy }) {
  return (
    <div className="flex items-center gap-2.5 h-12 shrink-0">
      <div className="flex-1 flex items-center justify-between bg-[#eff2f5] px-3 py-2 rounded h-full overflow-hidden">
        <span className={`text-[15px] leading-[1.5] truncate flex-1 min-w-0 ${rolledTerm ? 'text-black' : 'text-[#8d969e] italic'}`}>
          {rolledTerm || 'Generate a term'}
        </span>
        <button
          onClick={onCopy}
          disabled={!rolledTerm}
          className="shrink-0 ml-2 disabled:opacity-30 hover:opacity-70 transition-opacity"
          aria-label="Copy term"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM15 5H8C6.9 5 6.01 5.9 6.01 7L6 21C6 22.1 6.89 23 7.99 23H19C20.1 23 21 22.1 21 21V11L15 5ZM8 21V7H14V12H19V21H8Z" fill="#8d969e"/>
          </svg>
        </button>
      </div>
      <button
        onClick={onRoll}
        disabled={isRolling}
        className="flex items-center gap-1.5 bg-[#e81717] text-white px-4 h-full rounded text-[17px] font-medium shrink-0 hover:bg-[#c01010] transition-colors disabled:opacity-60"
        aria-label="Roll a term"
      >
        <img src={iflIcon} alt="" className="w-6 h-6" />
        Roll
      </button>
    </div>
  );
}

function BackButton({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full h-[68px] text-[#8d969e] text-[17px] font-medium hover:text-[#484e55] transition-colors shrink-0"
    >
      {label}
    </button>
  );
}

function MissionContent() {
  return (
    <div className="flex flex-col gap-[18px]">
      <div className="flex gap-5 items-center">
        <img src={logoOnly} alt="FIREWALL Cafe" className="h-[48px] w-auto shrink-0" />
        <p className="font-bitmap-song text-[32px] leading-none text-black">
          <span className="text-[#e81717]">FIREWALL Cafe</span>{' '}is a digital art project
        </p>
      </div>
      <p className="font-bitmap-song text-[32px] leading-none text-black">
        that shines a light on internet censorship in the U.S. and China.
      </p>
      <p className="font-bitmap-song text-[32px] leading-none text-black">
        <span className="text-[#e81717]">Our mission</span> is to spread awareness about the dangers of technocratic control enabled by emerging technologies.
      </p>
    </div>
  );
}

function HelpWizard({ open, onClose }) {
  const navigate = useNavigate();
  const [branch, setBranch] = useState('default');
  const [screen, setScreen] = useState('main');
  const [rolledTerm, setRolledTerm] = useState('');
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (!open) return;
    const seen = localStorage.getItem('hasSeenWizard');
    setBranch(seen ? 'default' : 'onboarding');
    localStorage.setItem('hasSeenWizard', 'true');
    setScreen('main');
    setRolledTerm('');
  }, [open]);

  const handleRoll = useCallback(async () => {
    setIsRolling(true);
    const term = await fetchRollTerm();
    setRolledTerm(term);
    setIsRolling(false);
  }, []);

  const handleCopy = useCallback(() => {
    if (rolledTerm) navigator.clipboard.writeText(rolledTerm).catch(() => {});
  }, [rolledTerm]);

  const handleCard = useCallback((action) => {
    switch (action) {
      case 'mission': setScreen('mission'); break;
      case 'about':   setScreen('about'); break;
      case 'roll':    setScreen('roll'); break;
      case 'search':  navigate('/search'); onClose(); break;
      case 'archive': navigate('/archive'); onClose(); break;
      default: break;
    }
  }, [navigate, onClose]);

  if (!open) return null;

  const renderDefaultMain = () => (
    <div className="flex flex-col gap-8 px-6 pt-8 pb-7">
      <div className="flex items-center justify-between">
        <button onClick={() => setScreen('about')} className="flex items-center justify-center" aria-label="About Xin">
          <QuestionIcon fill="#000000" className="w-6 h-6" />
        </button>
        <h2 className="font-bitmap-song text-[36px] leading-none text-black text-right">
          How can I help?
        </h2>
      </div>
      <RollInput rolledTerm={rolledTerm} onRoll={handleRoll} isRolling={isRolling} onCopy={handleCopy} />
      <div className="flex flex-col gap-3">
        <WizardCard icon={SearchIcon} title="How to Search" subtitle="Search, compare, and vote" onClick={() => handleCard('search')} />
        <WizardCard icon={ArchiveIcon} title="Using the Archive" subtitle="Browse community results" onClick={() => handleCard('archive')} />
        <WizardCard icon={logoOnly} title="What is FIREWALL Cafe?" subtitle="What we do and why we exist" onClick={() => handleCard('mission')} />
        <WizardCard icon={cloudAlert} title="Why am I seeing this?" subtitle="Why images don't turn up" onClick={() => handleCard('about')} iconBg="bg-[#eff2f5]" />
      </div>
    </div>
  );

  const renderDefaultMission = () => (
    <div className="flex flex-col justify-between h-full px-6 py-8">
      <MissionContent />
      <BackButton label="Back to Menu" onClick={() => setScreen('main')} />
    </div>
  );

  const renderDefaultAbout = () => (
    <div className="flex flex-col justify-between px-6 pt-8 pb-7">
      <div className="flex flex-col gap-8">
        <div className="flex gap-6 items-center">
          <img src={mugImage} alt="" className="h-10 w-auto shrink-0" />
          <p className="font-bitmap-song text-[32px] leading-none text-black flex-1">
            Hi! I'm <span className="text-[#e81717]">Xin</span>, your search assistant.
          </p>
        </div>
        <p className="font-bitmap-song text-[32px] leading-none text-black">
          Anywhere you see a <span className="inline-flex items-center justify-center w-6 h-6 border border-neutral-400 rounded text-[16px] font-sans">?</span>, I'll be there to provide support.
        </p>
        <p className="font-bitmap-song text-[32px] leading-none text-black">
          <span className="text-[#e81717]">Don't know what to search?</span> Surface a relevant topic instantly by rolling a term.
        </p>
      </div>
      <BackButton label="Back to Menu" onClick={() => setScreen('main')} />
    </div>
  );

  const renderOnboardingMain = () => (
    <div className="flex flex-col gap-8 px-6 pt-8 pb-7">
      <div className="flex gap-6 items-center">
        <img src={mugImage} alt="" className="h-10 w-auto shrink-0" />
        <h2 className="font-bitmap-song text-[32px] leading-none text-black flex-1">
          Hi! I'm <span className="text-[#e81717]">Xin</span>, your search assistant.
        </h2>
      </div>
      <p className="font-bitmap-song text-[32px] leading-none text-black">
        I can suggest search terms and explain features. How can I help you get started?
      </p>
      <div className="flex flex-col gap-3">
        <WizardCard icon={logoOnly} title="What is FIREWALL Cafe?" subtitle="What we do and why we exist" onClick={() => handleCard('mission')} />
        <WizardCard icon={SearchIcon} title="How to Search" subtitle="Search, compare, and vote" onClick={() => handleCard('search')} />
        <WizardCard icon={iflIcon} title="Roll a Term" subtitle="Suggest a search to get started" onClick={() => handleCard('roll')} />
      </div>
    </div>
  );

  const renderOnboardingMission = () => (
    <div className="flex flex-col gap-8 px-6 py-8">
      <MissionContent />
      <div className="flex flex-col gap-3">
        <WizardCard icon={SearchIcon} title="How to Search" subtitle="Search, compare, and vote" onClick={() => handleCard('search')} />
        <WizardCard icon={iflIcon} title="Roll a Term" subtitle="Suggest a search to get started" onClick={() => handleCard('roll')} />
      </div>
    </div>
  );

  const renderOnboardingRoll = () => (
    <div className="flex flex-col justify-between px-6 pt-8 pb-7 min-h-[360px]">
      <div className="flex flex-col gap-8">
        <div className="flex gap-6 items-center">
          <img src={mugImage} alt="" className="h-10 w-auto shrink-0" />
          <h2 className="font-bitmap-song text-[32px] leading-none text-black flex-1">
            <span className="text-[#e81717]">Don't know what to search?</span>
          </h2>
        </div>
        <p className="font-bitmap-song text-[32px] leading-none text-black">
          Surface a relevant topic instantly by rolling a term, then click-to-copy to clipboard. Give it a try!
        </p>
        <RollInput rolledTerm={rolledTerm} onRoll={handleRoll} isRolling={isRolling} onCopy={handleCopy} />
      </div>
      <BackButton label="← Main Menu" onClick={() => setScreen('main')} />
    </div>
  );

  const screens = {
    default: { main: renderDefaultMain, mission: renderDefaultMission, about: renderDefaultAbout },
    onboarding: { main: renderOnboardingMain, mission: renderOnboardingMission, roll: renderOnboardingRoll },
  };

  const renderScreen = screens[branch]?.[screen];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div
        className="relative bg-white border border-black rounded-[8px] w-[360px] overflow-y-auto shadow-[0px_0px_8px_0px_rgba(0,17,42,0.15)]"
        style={{ maxHeight: 'min(492px, calc(100vh - 32px))' }}
      >
        {renderScreen?.()}
      </div>
    </div>
  );
}

export default HelpWizard;
