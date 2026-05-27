import React, { useState, useEffect, useRef } from 'react';
import mugImage from '../assets/icons/assistant-mug.png';

function AssistantButton({ onClick }) {
  const [animate, setAnimate] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (localStorage.getItem('hasSeenWizard')) return;

    const trigger = () => {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 300);
    };

    const cancel = () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };

    timeoutRef.current = setTimeout(() => {
      trigger();
      intervalRef.current = setInterval(trigger, 60000);
    }, 5000);

    window.addEventListener('wizard-dismissed', cancel);
    return () => {
      cancel();
      window.removeEventListener('wizard-dismissed', cancel);
    };
  }, []);

  return (
    <button
      onClick={onClick}
      className="assistant-btn flex items-center justify-center h-[36px] w-[56px] rounded-full bg-[#f5f7f9] border border-[#dde3e8] hover:border-[#b9c0c7] transition-colors"
      aria-label="Open Help"
    >
      <img
        src={mugImage}
        alt=""
        className={`h-[26px] w-auto${animate ? ' animate-assistant-wiggle' : ''}`}
      />
    </button>
  );
}

export default AssistantButton;
