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
      setTimeout(() => setAnimate(false), 400);
    };

    timeoutRef.current = setTimeout(() => {
      trigger();
      intervalRef.current = setInterval(trigger, 60000);
    }, 5000);

    return () => {
      clearTimeout(timeoutRef.current);
      clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center h-[36px] w-[56px] rounded-full bg-[#f5f7f9] border border-[#dde3e8] hover:border-[#b9c0c7] transition-colors${animate ? ' animate-assistant-wiggle' : ''}`}
      aria-label="Open Help"
    >
      <img src={mugImage} alt="" className="h-[26px] w-auto" />
    </button>
  );
}

export default AssistantButton;
