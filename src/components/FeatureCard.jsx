import React from 'react';
import { Link } from 'react-router-dom';

function FeatureCard({
  title,
  chineseTitle,
  description,
  iconSrc,
  iconSrcHover,
  bgColor,
  hoverBgColor,
  textColor,
  borderColor,
  url,
}) {
  return (
    <Link
      to={url || '/'}
      className={`block h-full ${bgColor} rounded-lg border ${borderColor} transition-all duration-500 ${
        hoverBgColor || 'hover:brightness-90'
      } group`}
    >
      <div className="flex flex-col p-6 ipad-landscape:p-5 macbook:p-6 h-[400px]">
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col gap-2">
            <h2
              className={`chinese text-2xl md:text-4xl ipad-landscape:text-3xl macbook:text-4xl font-medium ${textColor}`}
            >
              {title}
            </h2>
            <div
              className={`chinese text-2xl md:text-4xl ipad-landscape:text-3xl macbook:text-4xl font-medium ${
                chineseTitle.color
              }`}
            >
              {chineseTitle.text}
            </div>
          </div>
          <div className="flex-shrink-0 w-[52px] h-[52px] ipad-landscape:w-[44px] ipad-landscape:h-[44px] macbook:w-[52px] macbook:h-[52px]">
            <img
              src={iconSrc}
              alt={`${title} icon`}
              data-hover-src={iconSrcHover}
              className="w-full h-full object-contain transition-all duration-500 group-hover:[content:var(--hover-src)]"
              style={{ '--hover-src': `url(${iconSrcHover})` }}
            />
          </div>
        </div>
        <p
          className={`mt-auto text-lg md:text-xl ipad-landscape:text-lg macbook:text-xl leading-relaxed ${textColor}`}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}

export default FeatureCard;
