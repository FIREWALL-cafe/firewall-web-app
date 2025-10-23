import React, { useState, useEffect } from 'react';
import { getPartners } from '../lib/sanity';

/**
 * Partners component powered by Sanity CMS
 *
 * This is a drop-in replacement for the existing Partners component.
 * To use: replace the import in your route from './Partners' to './PartnersSanity'
 */
function PartnersSanity() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPartners() {
      try {
        const data = await getPartners();
        setPartners(data);
      } catch (err) {
        console.error('Failed to fetch partners:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading partners...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error loading partners: {error}</div>
      </div>
    );
  }

  return (
    <section className="flex overflow-hidden justify-center items-start pb-16 w-full bg-white max-md:pb-24 max-md:max-w-full">
      <div className="flex flex-wrap flex-1 shrink gap-10 justify-center w-full basis-0 min-w-[240px] max-md:max-w-full">
        <div className="flex flex-col flex-1 shrink my-auto text-2xl basis-0 min-w-[240px] max-md:max-w-full">
          <h1 className="mt-10 md:text-[56px] text-3xl font-medium leading-[58px] text-black max-md:text-4xl max-md:leading-[54px]">
            Partners
          </h1>

          <p className="mt-6 text-xl text-gray-600">
            Special thanks for the support of these gracious partners.
          </p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.map((partner) => (
              <div key={partner._id} className="flex flex-col p-6 bg-gray-50 rounded-lg">
                <h3 className="text-2xl font-medium mb-3">
                  <a
                    href={partner.url}
                    className="text-blue-600 hover:text-blue-800"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {partner.name}
                  </a>
                </h3>
                <p className="text-base text-gray-600">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PartnersSanity;
