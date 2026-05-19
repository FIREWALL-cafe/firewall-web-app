import React from 'react';
import { Link } from 'react-router-dom';
import Location from '../assets/icons/location_on.svg';

function EventCard({ image, imageHover, link, title, date, location }) {
  return (
    <article className="flex overflow-hidden flex-col self-stretch my-auto w-full rounded border border-black border-solid min-h-[440px]">
      <div className="w-full h-[220px] overflow-hidden">
        <Link to={link} className="block w-full h-full">
          <img
            src={image}
            alt={title}
            onMouseOver={e => (e.currentTarget.src = imageHover)}
            onMouseOut={e => (e.currentTarget.src = image)}
            className="w-full h-[220px] object-cover"
            style={{ display: 'block' }}
          />
        </Link>
      </div>
      <div className="flex flex-col justify-between px-5 py-6 w-full bg-white min-h-[220px]">
        <h3 className="flex-1 text-lg leading-8 text-black text-ellipsis">{title}</h3>
        <div className="flex flex-col w-full text-zinc-400">
          <div className="flex gap-1 items-start self-start">
            <time>{date}</time>
          </div>

          {location && (
            <div className="flex gap-2 items-center mt-2 w-full">
              <img
                src={Location}
                alt=""
                className="object-contain shrink-0 self-stretch my-auto w-5 aspect-square"
              />
              <div className="flex-1 shrink self-stretch my-auto basis-0">{location}</div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default EventCard;
