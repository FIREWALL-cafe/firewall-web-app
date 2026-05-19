import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuLink from './MenuLink';
import SubscribeForm from './SubscribeForm';
import Drawer from 'react-modern-drawer';
import { useMediaQuery } from 'react-responsive';
import { useLanguage } from '../context/LanguageContext';
import { getNavigationSettings, getSiteAssets, urlFor } from '../lib/sanity';
import { getDefault } from '../constants/uiDefaults';
import 'react-modern-drawer/dist/index.css';

// Static imports as fallbacks
import logo from '../assets/icons/logo_name.svg';
import logoMobile from '../assets/icons/logo_only.svg';
import NavMenu from '../assets/icons/nav-menu.svg';
import Close from '../assets/icons/close_large.svg';

import ArchiveIcon from '../assets/icons/Archive.png';
import CommentaryIcon from '../assets/icons/expert-commentary.png';
import EventsIcon from '../assets/icons/events.png';
import PressIcon from '../assets/icons/press.png';
import AboutIcon from '../assets/icons/logo_only.svg';
import SupportIcon from '../assets/icons/support.png';
import ContactIcon from '../assets/icons/envelope.svg';
import TimelineIcon from '../assets/icons/Timeline.png';

// Icon mapping for Sanity CMS
const ICON_MAP = {
  Archive: ArchiveIcon,
  Commentary: CommentaryIcon,
  Events: EventsIcon,
  Press: PressIcon,
  About: AboutIcon,
  Support: SupportIcon,
  Contact: ContactIcon,
  Timeline: TimelineIcon,
};

// Default fallback menu items
const DEFAULT_MENU_LINKS = [
  { to: '/archive', title: 'Query Archive', icon: ArchiveIcon },
  { to: '/editorial', title: 'Expert Commentary', icon: CommentaryIcon },
  { to: '/events', title: 'Events', icon: EventsIcon },
  { to: '/press', title: 'Press', icon: PressIcon },
  { to: '/about', title: 'About', icon: AboutIcon },
  { to: '/support', title: 'Support Us', icon: SupportIcon },
  { to: '/contact', title: 'Contact', icon: ContactIcon },
  { to: '/timeline', title: 'Timeline', icon: TimelineIcon },
];

function Navigation() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuLinks, setMenuLinks] = useState(DEFAULT_MENU_LINKS);
  const [searchPlaceholder, setSearchPlaceholder] = useState(getDefault('navigation', 'searchPlaceholder', language));
  const [newsletterTitle, setNewsletterTitle] = useState(getDefault('navigation', 'newsletterTitle', language));
  const [newsletterSubtitle, setNewsletterSubtitle] = useState(getDefault('navigation', 'newsletterSubtitle', language));
  const [siteAssets, setSiteAssets] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const isIphone = useMediaQuery({ maxWidth: 420 });
  const isVerySmallScreen = useMediaQuery({ maxWidth: 320 });
  const isContactPage = location.pathname === '/contact';

  // Fetch site assets from Sanity CMS
  useEffect(() => {
    async function loadSiteAssets() {
      try {
        const assets = await getSiteAssets();
        if (assets) {
          setSiteAssets(assets);
        }
      } catch (error) {
        console.error('Failed to load site assets:', error);
      }
    }

    loadSiteAssets();
  }, []);

  // Fetch navigation settings from Sanity CMS
  useEffect(() => {
    async function loadNavigationSettings() {
      try {
        const settings = await getNavigationSettings(language);

        if (settings && settings.menuItems) {
          const items = settings.menuItems
            .filter(item => item.visible !== false)
            .map(item => ({
              to: item.path,
              title: item.label,
              icon: ICON_MAP[item.icon] || AboutIcon,
            }));

          setMenuLinks(items);
          setSearchPlaceholder(settings.searchPlaceholder || getDefault('navigation', 'searchPlaceholder', language));
          setNewsletterTitle(settings.newsletterTitle || getDefault('navigation', 'newsletterTitle', language));
          setNewsletterSubtitle(settings.newsletterSubtitle || getDefault('navigation', 'newsletterSubtitle', language));
        }
      } catch (error) {
        console.error('Failed to load navigation settings:', error);
        // Language-aware fallbacks
        setSearchPlaceholder(getDefault('navigation', 'searchPlaceholder', language));
        setNewsletterTitle(getDefault('navigation', 'newsletterTitle', language));
        setNewsletterSubtitle(getDefault('navigation', 'newsletterSubtitle', language));
      }
    }

    loadNavigationSettings();
  }, [language]);

  const toggleDrawer = () => {
    setIsOpen(prevState => !prevState);
  };

  const handleSearchSubmit = e => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsOpen(false); // Close the drawer
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Clear the search input
    }
  };

  const handleSearchKeyDown = e => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  return (
    <div
      id="navigation"
      className={`w-full is-full-width-content ${isContactPage ? 'bg-gray-100' : ''}`}
    >
      <div className="w-full max-w-[1280px] mx-auto px-8 py-5">
        <div className="flex justify-between items-center w-full">
          <div className="flex gap-3">
            <Link to="/">
              {isVerySmallScreen ? (
                <img
                  src={siteAssets?.logoIcon ? urlFor(siteAssets.logoIcon).width(40).url() : logoMobile}
                  alt="Logo"
                />
              ) : (
                <img
                  src={siteAssets?.logoFull ? urlFor(siteAssets.logoFull).width(200).url() : logo}
                  alt="Logo"
                />
              )}
            </Link>
          </div>
          <div className="flex items-center relative">
            <button
              onClick={toggleDrawer}
              className="flex items-center justify-center bg-red-600 size-[36px] rounded-[4.5px]"
            >
              <img
                src={siteAssets?.menuIcon ? urlFor(siteAssets.menuIcon).width(24).url() : NavMenu}
                alt="Menu"
                className="w-6 h-6 object-contain"
              />
            </button>
            <Drawer
              open={isOpen}
              onClose={toggleDrawer}
              direction="right"
              className="navDrawer"
              style={{
                transitionDuration: '500ms',
                top: '40px',
                right: '0px',
                transform: 'translate3d(100%, 0px, 0px)',
                height: 'calc(100vh - 40px)',
                width: isIphone ? '100%' : '50%',
              }}
            >
              <nav className="flex flex-col h-full w-full bg-white">
                <div className="flex justify-between items-center px-8 py-5">
                  <Link to="/">
                    {isVerySmallScreen ? (
                      <img
                        src={siteAssets?.logoIcon ? urlFor(siteAssets.logoIcon).width(40).url() : logoMobile}
                        alt="Logo"
                      />
                    ) : (
                      <img
                        src={siteAssets?.logoFull ? urlFor(siteAssets.logoFull).width(200).url() : logo}
                        alt="Logo"
                      />
                    )}
                  </Link>
                  <button
                    className="flex items-center justify-center border border-gray-300 rounded h-10 w-10"
                    aria-label="Close"
                    onClick={toggleDrawer}
                  >
                    <img
                      src={siteAssets?.closeLargeIcon ? urlFor(siteAssets.closeLargeIcon).width(24).url() : Close}
                      alt=""
                      className="w-6 h-6 object-contain"
                    />
                  </button>
                </div>

                {/* Search Bar */}
                <div className="px-6 mb-4">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      placeholder={searchPlaceholder}
                      className="w-full px-4 py-3 border-b-2 border-gray-300 bg-transparent text-gray-600 placeholder-gray-400 focus:outline-none focus:border-red-600"
                    />
                    <button
                      type="submit"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:text-red-600 transition-colors"
                    >
                      <svg
                        className="w-6 h-6 text-gray-400 hover:text-red-600 transition-colors"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </button>
                  </form>
                </div>

                {/* Navigation Links */}
                <div className="flex flex-col flex-1 px-6">
                  {menuLinks.map((link, index) => (
                    <MenuLink key={index} link={link} toggleDrawer={toggleDrawer} />
                  ))}
                </div>

                {/* Subscribe Form */}
                <div className="px-6 pb-8">
                  <div className="mb-6">
                    <div className="text-lg font-medium text-black">
                      {newsletterTitle}
                    </div>
                    {newsletterSubtitle && (
                      <div className="text-lg font-medium text-red-500">{newsletterSubtitle}</div>
                    )}
                  </div>
                  <SubscribeForm
                    inputClassName="flex-1 px-4 py-3 border border-gray-300 rounded-l bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:border-red-600"
                    buttonClassName="px-8 py-3 bg-white border border-red-600 text-red-600 rounded-r hover:bg-red-50 transition-colors"
                  />
                </div>
              </nav>
            </Drawer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
