import React from 'react';
import TimeDisplay from './TimeDisplay';
import LanguageSwitcher from './LanguageSwitcher';

function Header() {
  return (
    <header className="bg-red-600 h-[40px] is-full-width-content relative z-[103]">
      <div className="w-full max-w-[1280px] mx-auto px-8 h-full flex justify-between items-center font-body-03-medium">
        <TimeDisplay />
        <LanguageSwitcher />
      </div>
    </header>
  );
}

export default Header;
