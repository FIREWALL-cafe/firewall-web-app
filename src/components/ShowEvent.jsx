import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ArrowLeft from './icons/ArrowLeft';
import EventDetail from './EventDetail';
import { getEventBySlug } from '../lib/sanity';

function ShowEvent() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvent() {
      try {
        setLoading(true);
        const data = await getEventBySlug(eventId);
        setEvent(data);
      } catch (err) {
        console.error('Failed to fetch event:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading event...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error loading event: {error}</div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {event ? (
        <>
          <div className="mx-auto px-14 pt-14 max-md:px-5 text-red-600">
            <Link to="/events" className="flex items-center gap-2">
              <ArrowLeft
                color="currentColor"
                className="object-contain shrink-0 w-6 aspect-square"
              />
              Back to Events
            </Link>
          </div>
          <div className="mx-auto">
            <EventDetail event={event} />
          </div>
        </>
      ) : (
        <p className="p-14 text-center">Event not found.</p>
      )}
    </div>
  );
}

export default ShowEvent;
