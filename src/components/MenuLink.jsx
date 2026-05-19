import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function MenuLink({ link, toggleDrawer }) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = e => {
    e.preventDefault();
    toggleDrawer();
    navigate(link.to);
  };

  const currentIcon = isHovered && link.hoverIcon ? link.hoverIcon : link.icon;

  return (
    <Link
      to={link.to}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex gap-4 items-center py-3 w-full"
    >
      <div className="size-10 flex items-center justify-center shrink-0">
        {currentIcon && (
          <img src={currentIcon} alt="" className="w-full h-full object-contain" />
        )}
      </div>
      <span className="font-bitmap-song text-[28px] text-[#2e3238] flex-1">{link.title}</span>
      {isHovered && (
        <svg
          className="shrink-0 text-[#e81717]"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  );
}

export default MenuLink;
