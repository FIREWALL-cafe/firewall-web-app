import React, { useState, useEffect } from 'react';
import { getEvents, getEventsPageStrings } from '../lib/sanity';
import { useLanguage } from '../context/LanguageContext';
import EventCard from './EventCard';

/**
 * Events component powered by Sanity CMS
 */
function Events() {
  const { language } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [headings, setHeadings] = useState({
    eventsPageHeading: 'Events',
    eventsPageHeadingZh: '活动',
    eventsIntroText: 'FIREWALL Cafe has appeared at venues and events around the world',
  });

  useEffect(() => {
    async function fetchStrings() {
      try {
        const strings = await getEventsPageStrings(language);
        if (strings && (strings.eventsPageHeading || strings.eventsPageHeadingZh)) {
          setHeadings({
            eventsPageHeading: strings.eventsPageHeading || 'Events',
            eventsPageHeadingZh: strings.eventsPageHeadingZh || '活动',
            eventsIntroText: strings.eventsIntroText || 'FIREWALL Cafe has appeared at venues and events around the world',
          });
        }
      } catch (_) {}
    }
    fetchStrings();
  }, [language]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const data = await getEvents();
        setEvents(data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [language]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">{language === 'en' ? 'Loading events...' : '加载活动中...'}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">
          {language === 'en' ? `Error loading events: ${error}` : `加载活动时出错: ${error}`}
        </div>
      </div>
    );
  }

  return (
    <section className="flex overflow-hidden flex-col bg-white">
      <div className="flex flex-col justify-center items-center py-32 w-full max-md:py-24 px-8">
        <div className="flex flex-col items-center w-full max-w-[1080px]">
          <div className="font-bitmap-song font-display-03 text-center mb-8">
            <h1 className="leading-tight text-black">{headings.eventsPageHeading}</h1>
            <div className="leading-tight text-red-600">{headings.eventsPageHeadingZh}</div>
          </div>
          <p className="text-xl text-center text-gray-600 mb-12">
            {headings.eventsIntroText}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {events.map((event) => (
              <EventCard
                key={event._id}
                link={`/events/${event.slug.current}`}
                title={(language === 'zh' && event.titleZh) || event.title}
                date={event.date}
                location={event.location?.name || event.location}
                image={event.images?.[0]?.src || event.images?.[0]}
                imageHover={event.images?.[1]?.src || event.images?.[0]?.src || event.images?.[0]}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Events;
