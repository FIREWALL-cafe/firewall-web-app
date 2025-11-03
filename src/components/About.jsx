import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getAboutPageStrings } from '../lib/sanity';
import Artist from './Artist';
import CallToAction from './CallToAction';
import Contributors from './Contributors';
import AboutHero from '../assets/images/about-hero.jpg';

function About() {
  const { language } = useLanguage();
  const [uiStrings, setUiStrings] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch UI strings from Sanity on mount and language change
  useEffect(() => {
    async function loadStrings() {
      try {
        setLoading(true);
        const strings = await getAboutPageStrings(language);
        setUiStrings(strings);
      } catch (error) {
        console.error('Failed to load about page strings:', error);
        // Fallback to hardcoded English strings
        setUiStrings({
          aboutPageHeading: 'What do we lose in the dark?',
          aboutPageHeadingZh: '我们在黑暗中失去了什么?',
          aboutPageIntro: 'FIREWALL Cafe exists to advocate for freedom of speech for the netizens around the world. Our goal is to investigate online censorship by comparing the disparities of Google searches in western nations versus Baidu searches in China. We aim to increase public awareness and dialogue about Internet freedom. We believe that power, if left unchallenged, inevitably leads to abuse.',
          aboutRedSectionHeading: 'FIREWALL came face to face with that abuse in 2016.',
          aboutRedSectionHeadingZh: '防火墙在 2016 年就遭遇过这种滥用。',
          aboutRedSectionBody: 'A pivotal moment occurred during our inaugural show in New York City in 2016 around our "Networked Feminism" roundtable. We faced interference from Chinese state authorities and this incident was covered by The Washington Post. The repercussions propelled the art project on an international exhibition tour, setting new stages for dialogue and understanding across borders.',
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
      <div className="flex overflow-hidden flex-col justify-center w-full bg-white">
        <div className="container mx-auto px-2 md:px-4 py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-16 bg-gray-200 rounded w-3/4 mx-auto"></div>
            <div className="h-12 bg-gray-200 rounded w-2/3 mx-auto"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="flex overflow-hidden flex-col justify-center w-full bg-white">
        <div className="flex flex-col items-end container mx-auto px-2 md:px-4 py-12">
          <div className="flex flex-col w-full">
            <div className="flex flex-col items-center">
              <div className="ipad-landscape:font-display-01 font-bitmap-song font-display-03 flex flex-col items-center text-center">
                <h1 className="leading-tight tracking-[2.16px]">
                  {uiStrings.aboutPageHeading || 'What do we lose in the dark?'}
                </h1>
                <div className="mt-2 leading-tight text-red-600 tracking-[2.16px]">
                  {uiStrings.aboutPageHeadingZh || '我们在黑暗中失去了什么?'}
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-10 justify-center mt-10 font-body-01">
              <div className="flex flex-col flex-1 basis-[300px] md:order-1 order-2">
                <p className="mb-4">
                  {uiStrings.aboutPageIntro ? (
                    <>
                      <span className="font-medium">FIREWALL Cafe</span> {uiStrings.aboutPageIntro.replace('FIREWALL Cafe ', '')}
                    </>
                  ) : (
                    <>
                      <span className="font-medium">FIREWALL Cafe</span> exists to advocate for freedom
                      of speech for the netizens around the world. Our goal is to investigate online
                      censorship by comparing the disparities of Google searches in western nations
                      versus Baidu searches in China. We aim to increase public awareness and dialogue
                      about Internet freedom. We believe that power, if left unchallenged, inevitably
                      leads to abuse.
                    </>
                  )}
                </p>
              </div>
              <div className="flex-shrink-0 w-full max-w-lg md:order-2 order-1">
                <img
                  src={AboutHero}
                  alt="Illustration related to the topic"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="firewall-incident-width" className="bg-red-600 is-full-width-content">
        <div className="max-w-[1080px] mx-auto px-2 md:px-4 py-12">
          <div className="flex flex-col md:flex-row iphone:items-center gap-12">
            <div className="font-display-03 font-bitmap-song text-center md:text-left md:w-1/2">
              <h2 className="leading-tight text-white mt-12">
                {uiStrings.aboutRedSectionHeading || 'FIREWALL came face to face with that abuse in 2016.'}
              </h2>
              <div className="mt-2 leading-tight">
                {uiStrings.aboutRedSectionHeadingZh || '防火墙在 2016 年就遭遇过这种滥用。'}
              </div>
            </div>
            <div className="flex overflow-hidden flex-col justify-center md:w-1/2 w-full">
              <div className="flex flex-col mx-auto py-12 w-full font-body-01 text-white">
                {uiStrings.aboutRedSectionBody || 'A pivotal moment occurred during our inaugural show in New York City in 2016 around our "Networked Feminism" roundtable. We faced interference from Chinese state authorities and this incident was covered by The Washington Post. The repercussions propelled the art project on an international exhibition tour, setting new stages for dialogue and understanding across borders.'}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Artist />
      <Contributors />
      <CallToAction />
    </>
  );
}

export default About;
