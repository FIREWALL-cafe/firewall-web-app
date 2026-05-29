import React, { useEffect, useState } from 'react';
import EventCard from './EventCard';
import { getEvents, getEventsPageStrings, urlFor } from '../lib/sanity';
import { useLanguage } from '../context/LanguageContext';

function PastEvents() {
  const { language } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headings, setHeadings] = useState({
    pastEventsPageHeading: 'Past events',
    pastEventsPageHeadingZh: '过去的活动',
  });

  useEffect(() => {
    async function fetchStrings() {
      try {
        const strings = await getEventsPageStrings('en');
        if (strings && (strings.pastEventsPageHeading || strings.pastEventsPageHeadingZh)) {
          setHeadings({
            pastEventsPageHeading: strings.pastEventsPageHeading || 'Past events',
            pastEventsPageHeadingZh: strings.pastEventsPageHeadingZh || '过去的活动',
          });
        }
      } catch (_) {}
    }
    fetchStrings();
  }, []);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await getEvents();

        // Transform Sanity data to match EventCard props
        const transformedEvents = data.map(event => ({
          image: event.cardImageDefault ? urlFor(event.cardImageDefault).width(400).url() : null,
          imageHover: event.cardImageHover ? urlFor(event.cardImageHover).width(400).url() : null,
          title: (language === 'zh' && event.titleZh) || event.title,
          date: event.date,
          location: event.location?.name || null,
          link: `/events/${event.slug?.current || event.slug}`,
        }));

        setEvents(transformedEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [language]);

  const heading = (
    <div className="font-bitmap-song self-center">
      <h2 className="font-display-04 leading-tight text-black max-md:text-4xl">
        {headings.pastEventsPageHeading}
      </h2>
      <div className="font-display-04 leading-tight text-red-600 max-md:text-4xl">
        {headings.pastEventsPageHeadingZh}
      </div>
    </div>
  );

  if (loading) {
    return (
      <section className="flex flex-col items-center px-2 md:px-14 pt-12 pb-16 w-full border-t border-solid bg-slate-100 border-t-neutral-300 max-md:pb-24 is-full-width-content">
        <div className="flex flex-col w-full max-w-[1280px] mx-auto">
          {heading}
          <div className="mt-12 text-center">Loading events...</div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col items-center px-2 md:px-14 pt-12 pb-16 w-full border-t border-solid bg-slate-100 border-t-neutral-300 max-md:pb-24 is-full-width-content">
        <div className="flex flex-col w-full max-w-[1280px] mx-auto">
          {heading}
          <div className="mt-12 text-center text-red-600">{error}</div>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col items-center px-2 md:px-14 pt-12 pb-16 w-full border-t border-solid bg-slate-100 border-t-neutral-300 max-md:pb-24 is-full-width-content">
      <div className="flex flex-col w-full max-w-[1280px] mx-auto">
        {heading}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12 w-full max-md:mt-10 justify-items-center">
          {events.length > 0 ? (
            events.map((event, index) => <EventCard key={index} {...event} />)
          ) : (
            <div className="col-span-full text-center">No events available</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default PastEvents;
