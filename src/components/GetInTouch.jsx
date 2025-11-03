import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getContactPageStrings } from '../lib/sanity';
import ContactForm from './ContactForm';
import logoMobile from '../assets/icons/logo_only.svg';

const GetInTouch = () => {
  const { language } = useLanguage();
  const [uiStrings, setUiStrings] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch UI strings from Sanity on mount and language change
  useEffect(() => {
    async function loadStrings() {
      try {
        setLoading(true);
        const strings = await getContactPageStrings(language);
        setUiStrings(strings);
      } catch (error) {
        console.error('Failed to load contact page strings:', error);
        // Fallback to hardcoded English strings
        setUiStrings({
          contactPageHeading: 'Get in touch',
          contactPageHeadingZh: '联系我们',
        });
      } finally {
        setLoading(false);
      }
    }

    loadStrings();
  }, [language]);

  if (loading) {
    // Loading skeleton
    return (
      <section className="flex flex-col justify-center items-center py-32 w-full bg-gray-100 max-md:py-24">
        <div className="chinese flex flex-col px-2 md:px-0 md:pr-20 max-w-full w-[692px]">
          <div className="animate-pulse space-y-6">
            <div className="h-16 bg-gray-200 rounded w-1/2"></div>
            <div className="h-12 bg-gray-200 rounded w-2/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  // Split Chinese heading into individual characters for vertical display
  const chineseChars = (uiStrings.contactPageHeadingZh || '联系我们').split('');

  return (
    <section className="flex flex-col justify-center items-center py-32 w-full bg-gray-100 max-md:py-24">
      <div className="chinese flex flex-col px-2 md:px-0 md:pr-20 max-w-full w-[692px]">
        <div className="flex gap-4 md:gap-10 items-start md:items-center justify-center md:justify-start">
          <img
            loading="lazy"
            src={logoMobile}
            className="object-contain aspect-square w-[52px]"
            alt="Logo"
          />
          <div className="flex flex-col md:block">
            <h1 className="font-display-04 font-bitmap-song md:font-display-02 leading-tight tracking-[2.16px]">
              {uiStrings.contactPageHeading || 'Get in touch'}
            </h1>
            <div className="font-display-04 font-bitmap-song md:font-display-02 leading-tight tracking-[2.16px] text-red-600 md:hidden">
              {uiStrings.contactPageHeadingZh || '联系我们'}
            </div>
          </div>
        </div>

        {/* Desktop: Chinese text vertical beside form */}
        <div className="flex flex-col md:flex-row md:flex-wrap gap-6 md:gap-10 mt-6 md:mt-2 items-start">
          <div className="hidden md:block text-[56px] font-medium leading-tight tracking-[2.16px] text-red-600">
            {chineseChars.map((char, index) => (
              <React.Fragment key={index}>
                {char}
                {index < chineseChars.length - 1 && <br />}
              </React.Fragment>
            ))}
          </div>
          <div className="w-full md:flex-1">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;
