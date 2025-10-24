import React, { useState, useEffect } from 'react';
import { getEvents } from '../lib/sanity';
import EventCard from './EventCard';

/**
 * Events component powered by Sanity CMS
 *
 * This is a drop-in replacement for the existing Events component.
 * To use: replace the import in your route from './Events' to './EventsSanity'
 */
function EventsSanity() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data = await getEvents();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading events...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error loading events: {error}</div>
      </div>
    );
  }

  return (
    <section className="flex overflow-hidden flex-col bg-white">
      <div className="flex flex-col justify-center items-center py-32 w-full max-md:py-24">
        <div className="flex flex-col items-center w-full max-w-[1080px]">
          <h1 className="text-5xl font-medium text-center mb-8">Events</h1>
          <p className="text-xl text-center text-gray-600 mb-12">
            FIREWALL Cafe has appeared at venues and events around the world
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

export default EventsSanity;
