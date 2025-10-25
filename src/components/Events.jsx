import React, { useState, useEffect } from 'react';
import { getLocalizedEvents, getEvents } from '../lib/sanity';
import { useLanguage } from '../context/LanguageContext';
import EventCard from './EventCard';

/**
 * Events component powered by Sanity CMS with localization support
 * Falls back to non-localized events if localized schema is empty
 */
function Events() {
  const { language } = useLanguage();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);

        // Fetch both localized and regular events in parallel
        const [localizedData, regularData] = await Promise.all([
          getLocalizedEvents(language),
          getEvents(),
        ]);

        let allEvents;

        if (language === 'zh') {
          // For Chinese, only show localized events
          allEvents = localizedData || [];
          console.log(`Chinese view: showing ${allEvents.length} localized events only`);
        } else {
          // For English, show localized events + non-localized events (which are assumed to be English)
          const localizedSlugs = new Set(
            (localizedData || []).map(event => event.slug?.current || event.slug)
          );

          // Filter out regular events that have been localized
          const nonLocalizedEvents = (regularData || []).filter(
            event => !localizedSlugs.has(event.slug?.current || event.slug)
          );

          // Combine localized events with non-localized events
          allEvents = [...(localizedData || []), ...nonLocalizedEvents];

          console.log(`English view: ${localizedData?.length || 0} localized + ${nonLocalizedEvents.length} non-localized = ${allEvents.length} total`);
        }

        setEvents(allEvents);
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
      <div className="flex flex-col justify-center items-center py-32 w-full max-md:py-24">
        <div className="flex flex-col items-center w-full max-w-[1080px]">
          <h1 className="text-5xl font-medium text-center mb-8">
            {language === 'en' ? 'Events' : '活动'}
          </h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            {language === 'en'
              ? 'FIREWALL Cafe has appeared at venues and events around the world'
              : 'FIREWALL Cafe 已在世界各地的场所和活动中亮相'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {events.map((event) => (
              <EventCard
                key={event._id}
                link={`/events/${event.slug.current}`}
                title={event.title}
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
