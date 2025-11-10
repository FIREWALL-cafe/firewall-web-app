import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SubscribeForm from './SubscribeForm';
import { useLanguage } from '../context/LanguageContext';
import { getHomepageStrings } from '../lib/sanity';
import { getDefault } from '../constants/uiDefaults';

function SubscribeSection({ title }) {
  const location = useLocation();
  const { language } = useLanguage();
  const [uiStrings, setUiStrings] = useState({});
  const isContactPage = location.pathname === '/contact';

  useEffect(() => {
    async function loadStrings() {
      try {
        const strings = await getHomepageStrings(language);
        setUiStrings(strings);
      } catch (error) {
        console.error('Failed to load homepage strings:', error);
        // Language-aware fallback
        setUiStrings({
          newsletterHeading: getDefault('homepage', 'newsletterHeading', language),
          newsletterSubheading: getDefault('homepage', 'newsletterSubheading', language),
          newsletterEmailPlaceholder: getDefault('homepage', 'newsletterEmailPlaceholder', language),
          newsletterSubscribeButton: getDefault('homepage', 'newsletterSubscribeButton', language),
        });
      }
    }
    loadStrings();
  }, [language]);

  const subscriptionTitle = title || uiStrings.newsletterHeading || getDefault('homepage', 'newsletterHeading', language);

  return (
    <div
      className={`flex flex-col w-full pb-4 md:pb-0 ${isContactPage ? 'md:w-1/2' : ''} h-full ${
        isContactPage ? 'bg-white' : 'bg-newsletter'
      }`}
    >
      <div
        className={`flex flex-col items-center ${
          isContactPage ? 'justify-center' : ''
        } w-full h-full px-2 md:px-8 lg:px-12`}
      >
        <div className={`flex flex-col w-full ${isContactPage ? 'max-w-[500px]' : 'max-w-2xl'}`}>
          <div
            className={`flex flex-col mt-3 md:mt-24 w-full md:text-xl ${
              isContactPage ? 'text-black' : 'text-white'
            }`}
          >
            <div>
              <div id="mc_embed_shell">
                <div id="mc_embed_signup">
                  <div className={isContactPage ? '' : 'py-8 md:py-12'}>
                    <div className="relative">
                      <h2
                        className={`font-display-04 font-bitmap-song ${
                          isContactPage ? 'text-black' : 'text-white'
                        }`}
                      >
                        {subscriptionTitle}
                      </h2>
                      <div className="mc-field-group space-y-2">
                        <span className="block mt-6 mb-8 font-body-02">
                          {uiStrings.newsletterSubheading ||
                            getDefault('homepage', 'newsletterSubheading', language)}
                        </span>
                        <SubscribeForm
                          className="w-full"
                          inputClassName={
                            isContactPage
                              ? 'flex-1 text-black px-4 py-3 min-h-[56px] border border-gray-300 rounded-l'
                              : 'flex-1 text-black p-2 min-h-[56px] border-r border-red-600'
                          }
                          buttonClassName={
                            isContactPage
                              ? 'whitespace-nowrap justify-center min-h-[56px] text-red-600 px-6 py-3 border border-red-600 rounded-r bg-white hover:bg-red-50 transition-colors'
                              : 'whitespace-nowrap justify-center min-h-[56px] text-red-600 p-2'
                          }
                          placeholder={uiStrings.newsletterEmailPlaceholder || getDefault('homepage', 'newsletterEmailPlaceholder', language)}
                          buttonText={uiStrings.newsletterSubscribeButton || getDefault('homepage', 'newsletterSubscribeButton', language)}
                        />
                      </div>
                      <div className="hidden optionalParent mt-4">
                        <div className="clear foot flex flex-col md:flex-row items-center gap-4">
                          <p className="my-2 md:my-auto">
                            <a
                              href="http://eepurl.com/i3XcbM"
                              title="Mailchimp - email marketing made easy and fun"
                              className="block w-full md:w-auto"
                            >
                              <span className="inline-block bg-transparent rounded">
                                <img
                                  className="refferal_badge w-[180px] md:w-[220px] h-auto"
                                  src="https://digitalasset.intuit.com/render/content/dam/intuit/mc-fe/en_us/images/intuit-mc-rewards-text-dark.svg"
                                  alt="Intuit Mailchimp"
                                />
                              </span>
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SubscribeSection;
