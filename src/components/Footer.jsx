import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getFooterStrings } from '../lib/sanity';
import { getDefault } from '../constants/uiDefaults';
import logo from '../assets/icons/logo_name.svg';
import Facebook from '../assets/icons/facebook_red.svg';
import Youtube from '../assets/icons/youtube_red.svg';
import Instagram from '../assets/icons/instagram_red.svg';

function Footer() {
  const { language } = useLanguage();
  const [footerStrings, setFooterStrings] = useState({});

  // Fetch footer strings from Sanity on mount and language change
  useEffect(() => {
    async function loadFooterStrings() {
      try {
        const strings = await getFooterStrings(language);
        setFooterStrings(strings);
      } catch (error) {
        console.error('Failed to load footer strings:', error);
        // Language-aware fallback
        setFooterStrings({
          navLinkAbout: getDefault('footer', 'navLinkAbout', language),
          navLinkPress: getDefault('footer', 'navLinkPress', language),
          navLinkEvents: getDefault('footer', 'navLinkEvents', language),
          navLinkSearch: getDefault('footer', 'navLinkSearch', language),
          navLinkArchive: getDefault('footer', 'navLinkArchive', language),
          navLinkEditorial: getDefault('footer', 'navLinkEditorial', language),
          navLinkPartner: getDefault('footer', 'navLinkPartner', language),
          navLinkContact: getDefault('footer', 'navLinkContact', language),
        });
      }
    }

    loadFooterStrings();
  }, [language]);

  return (
    <footer className="w-full bg-white pt-[120px] pb-[180px] is-large-width-content">
      <div className="mx-auto w-full">
        <div className="flex justify-between items-start gap-20 md:flex-row flex-col">
          <div className="flex-shrink-0">
            <Link to="/">
              <img src={logo} alt="Logo" />
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-8 md:gap-10 justify-end font-body-02">
            <div className="flex flex-col gap-2 md:gap-4 text-red-600 iphone:w-[180px] w-[130px]">
              <Link to="/about">
                {footerStrings.navLinkAbout || getDefault('footer', 'navLinkAbout', language)}
              </Link>
              <Link to="/press">
                {footerStrings.navLinkPress || getDefault('footer', 'navLinkPress', language)}
              </Link>
              <Link to="/events">
                {footerStrings.navLinkEvents || getDefault('footer', 'navLinkEvents', language)}
              </Link>
            </div>

            <div className="flex flex-col gap-2 md:gap-4 text-red-600 iphone:w-[180px] w-[130px]">
              <Link to="/search">
                {footerStrings.navLinkSearch || getDefault('footer', 'navLinkSearch', language)}
              </Link>
              <Link to="/archive">
                {footerStrings.navLinkArchive || getDefault('footer', 'navLinkArchive', language)}
              </Link>
              <Link to="/editorial">
                {footerStrings.navLinkEditorial || getDefault('footer', 'navLinkEditorial', language)}
              </Link>
            </div>

            <div className="flex flex-col gap-2 md:gap-4 text-red-600 iphone:w-[200px] w-[130px]">
              <div className="flex flex-col gap-2 text-red-600">
                <Link to="/support">
                  {footerStrings.navLinkPartner || getDefault('footer', 'navLinkPartner', language)}
                </Link>
                <Link to="/contact">
                  {footerStrings.navLinkContact || getDefault('footer', 'navLinkContact', language)}
                </Link>
              </div>

              <div className="flex gap-2 md:gap-4 mt-2">
                <Link to="https://www.facebook.com/firewallcafe" aria-label="Facebook">
                  <img src={Facebook} alt="Facebook logo" className="w-6" />
                </Link>
                <Link
                  to="https://www.youtube.com/channel/UCMTAKSSmI9iKD7a3GB1JIrA"
                  aria-label="Youtube"
                >
                  <img src={Youtube} alt="Youtube logo" className="w-6" />
                </Link>
                <Link to="http://instagram.com/firewallcafe" aria-label="Instagram">
                  <img src={Instagram} alt="Instagram logo" className="w-6" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
