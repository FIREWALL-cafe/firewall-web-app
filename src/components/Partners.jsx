import React, { useState, useEffect } from 'react';
import { getPartners, getPartnersPageStrings } from '../lib/sanity';
import { useLanguage } from '../context/LanguageContext';

/**
 * Partners component powered by Sanity CMS
 */
function Partners() {
  const { language } = useLanguage();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [strings, setStrings] = useState({
    partnersPageHeading: 'Partners',
    partnersPageHeadingZh: '合作伙伴',
    partnersIntroText: 'Special thanks for the support of these gracious partners.',
  });

  useEffect(() => {
    async function fetchStrings() {
      try {
        const data = await getPartnersPageStrings('en');
        if (data && (data.partnersPageHeading || data.partnersPageHeadingZh)) {
          setStrings({
            partnersPageHeading: data.partnersPageHeading || 'Partners',
            partnersPageHeadingZh: data.partnersPageHeadingZh || '合作伙伴',
            partnersIntroText: data.partnersIntroText || 'Special thanks for the support of these gracious partners.',
          });
        }
      } catch (_) {}
    }
    fetchStrings();
  }, []);

  useEffect(() => {
    async function fetchPartners() {
      try {
        setLoading(true);
        const data = await getPartners();
        setPartners(data || []);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch partners:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPartners();
  }, [language]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">{language === 'en' ? 'Loading partners...' : '加载合作伙伴中...'}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">
          {language === 'en' ? `Error loading partners: ${error}` : `加载合作伙伴时出错: ${error}`}
        </div>
      </div>
    );
  }

  return (
    <section className="flex overflow-hidden justify-center items-start pb-16 w-full bg-white max-md:pb-24 max-md:max-w-full">
      <div className="flex flex-wrap flex-1 shrink gap-10 justify-center w-full basis-0 min-w-[240px] max-md:max-w-full">
        <div className="flex flex-col flex-1 shrink my-auto text-2xl basis-0 min-w-[240px] max-md:max-w-full">
          <div className="font-bitmap-song mt-10">
            <h1 className="md:text-[56px] text-3xl font-medium leading-[58px] text-black max-md:text-4xl max-md:leading-[54px]">
              {strings.partnersPageHeading}
            </h1>
            <div className="md:text-[56px] text-3xl font-medium leading-[58px] text-red-600 max-md:text-4xl max-md:leading-[54px]">
              {strings.partnersPageHeadingZh}
            </div>
          </div>

          <p className="mt-6 text-xl text-gray-600">
            {strings.partnersIntroText}
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

export default Partners;
