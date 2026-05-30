import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function ArticleCard({ image, imageHover, title, date, tag, url }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article className="flex overflow-hidden flex-col shrink self-stretch my-auto w-64 rounded border border-black border-solid h-[400px] min-w-[240px] relative bg-white">
      <Link to={url} target="_blank" className="block">
        <img
          src={isHovered && imageHover ? imageHover : image}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="object-cover w-full h-40 transition-all duration-500 ease-in-out"
          alt={title}
        />
      </Link>
      <div className="flex flex-col justify-between px-5 py-4 w-full flex-1">
        <h3 className="flex-1 text-lg leading-6 text-black line-clamp-4 overflow-hidden">
          <Link to={url} target="_blank">
            {title}
          </Link>
        </h3>
        <div className="flex justify-between items-center mt-4 w-full">
          <time className="text-sm text-zinc-400">{date}</time>
          <Link to={url} target="_blank">
            <svg
              className="w-5 h-5 text-black hover:text-red-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </Link>
        </div>
      </div>
      {tag && (
        <div
          className={`absolute top-4 right-4 gap-2 self-start px-2 py-1 text-base font-medium ${
            tag.color || 'text-red-600'
          } bg-white rounded shadow-sm`}
        >
          {tag.icon && (
            <img
              src={tag.icon}
              alt=""
              className="object-contain shrink-0 self-stretch my-auto w-4 aspect-square"
            />
          )}
          <span>{tag.text}</span>
        </div>
      )}
    </article>
  );
}

export default ArticleCard;
