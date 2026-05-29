import React, { useState, useEffect } from 'react';
import { getEventsPageStrings } from '../lib/sanity';

import Events from '../assets/icons/events.png';

function UpcomingEvents() {
  const [headings, setHeadings] = useState({
    eventsPageHeading: 'Upcoming events',
    eventsPageHeadingZh: '即将举行的活动',
    eventsIntroText: 'Explore our events, including exhibitions, screenings, and talks. These gatherings engage a global audience and further the mission of FIREWALL Cafe.',
  });

  useEffect(() => {
    async function load() {
      try {
        const strings = await getEventsPageStrings('en');
        if (strings && (strings.eventsPageHeading || strings.eventsPageHeadingZh)) {
          setHeadings({
            eventsPageHeading: strings.eventsPageHeading || 'Upcoming events',
            eventsPageHeadingZh: strings.eventsPageHeadingZh || '即将举行的活动',
            eventsIntroText: strings.eventsIntroText || 'Explore our events, including exhibitions, screenings, and talks. These gatherings engage a global audience and further the mission of FIREWALL Cafe.',
          });
        }
      } catch (_) {}
    }
    load();
  }, []);

  return (
    <section className="flex flex-col justify-center items-center px-2 md:px-14 py-32 max-md:py-24 w-full is-medium-width-content">
      <div className="flex flex-col w-full max-w-[1080px] max-md:max-w-full items-center">
        <div className="font-bitmap-song flex flex-col items-center max-w-full w-[588px]">
          <div className="flex flex-row items-center gap-4">
            <img src={Events} alt="" className="object-contain w-[51px]" />
            <h2 className="self-stretch my-auto md:font-display-01 font-display-03 leading-tight text-black">
              {headings.eventsPageHeading}
            </h2>
          </div>
          <div className="mt-2 md:font-display-01 font-display-03 leading-tight text-red-600">
            {headings.eventsPageHeadingZh}
          </div>
        </div>
        <p className="mt-5 text-xl text-center max-md:max-w-full">
          {headings.eventsIntroText}
        </p>
      </div>
    </section>
  );
}

export default UpcomingEvents;
