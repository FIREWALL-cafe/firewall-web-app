import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AssistantButton from './AssistantButton';
import HelpWizard from './HelpWizard';
import SearchTutorialModal from './SearchTutorialModal';
import MenuLink from './MenuLink';
import LanguageSwitcher from './LanguageSwitcher';
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
import NavMenu from '../assets/icons/menu-default.svg';
import Close from '../assets/icons/close_large.svg';

import SearchIcon from '../assets/icons/search-grayscale.png';
import ArchiveIcon from '../assets/icons/Archive_grayscale.png';
import CommentaryIcon from '../assets/icons/expert-commentary_grayscale.png';
import EventsIcon from '../assets/icons/events_grayscale.png';
import PressIcon from '../assets/icons/press_grayscale.png';
import AboutIcon from '../assets/icons/about_grayscale.png';
import AboutColorIcon from '../assets/icons/about.png';
import SupportIcon from '../assets/icons/support_grayscale.png';
import ContactIcon from '../assets/icons/contact_grayscale.png';
import TimelineIcon from '../assets/icons/Timeline_grayscale.png';

import SearchColorIcon from '../assets/icons/search-color.png';
import ArchiveColorIcon from '../assets/icons/Archive.png';
import CommentaryColorIcon from '../assets/icons/expert-commentary.png';
import EventsColorIcon from '../assets/icons/events.png';
import PressColorIcon from '../assets/icons/press.png';
import SupportColorIcon from '../assets/icons/support.png';
import ContactRedIcon from '../assets/icons/contact.png';
import TimelineColorIcon from '../assets/icons/Timeline.png';

// Icon mapping for Sanity CMS
const ICON_MAP = {
  Search: SearchIcon,
  Archive: ArchiveIcon,
  Commentary: CommentaryIcon,
  Events: EventsIcon,
  Press: PressIcon,
  About: AboutIcon,
  Support: SupportIcon,
  Contact: ContactIcon,
  Timeline: TimelineIcon,
};

const HOVER_ICON_MAP = {
  Search: SearchColorIcon,
  Archive: ArchiveColorIcon,
  Commentary: CommentaryColorIcon,
  Events: EventsColorIcon,
  Press: PressColorIcon,
  About: AboutColorIcon,
  Support: SupportColorIcon,
  Contact: ContactRedIcon,
  Timeline: TimelineColorIcon,
};

// Default fallback menu items
const DEFAULT_MENU_LINKS = [
  { to: '/search', title: 'Search', icon: SearchIcon, hoverIcon: SearchColorIcon },
  { to: '/archive', title: 'Query Archive', icon: ArchiveIcon, hoverIcon: ArchiveColorIcon },
  { to: '/editorial', title: 'Expert Commentary', icon: CommentaryIcon, hoverIcon: CommentaryColorIcon },
  { to: '/events', title: 'Events', icon: EventsIcon, hoverIcon: EventsColorIcon },
  { to: '/press', title: 'Press', icon: PressIcon, hoverIcon: PressColorIcon },
  { to: '/about', title: 'About', icon: AboutIcon, hoverIcon: AboutColorIcon },
  { to: '/support', title: 'Support Us', icon: SupportIcon, hoverIcon: SupportColorIcon },
  { to: '/contact', title: 'Contact', icon: ContactIcon, hoverIcon: ContactRedIcon },
  { to: '/timeline', title: 'Timeline', icon: TimelineIcon, hoverIcon: TimelineColorIcon },
];

function Navigation() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [menuLinks, setMenuLinks] = useState(DEFAULT_MENU_LINKS);
  const [newsletterTitle, setNewsletterTitle] = useState(getDefault('navigation', 'newsletterTitle', language));
  const [newsletterSubtitle, setNewsletterSubtitle] = useState(getDefault('navigation', 'newsletterSubtitle', language));
  const [siteAssets, setSiteAssets] = useState(null);

  const location = useLocation();
  const isMobile = useMediaQuery({ maxWidth: 768 });
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
              hoverIcon: HOVER_ICON_MAP[item.icon] || AboutIcon,
            }));

          setMenuLinks(items);
          setNewsletterTitle(settings.newsletterTitle || getDefault('navigation', 'newsletterTitle', language));
          setNewsletterSubtitle(settings.newsletterSubtitle || getDefault('navigation', 'newsletterSubtitle', language));
        }
      } catch (error) {
        console.error('Failed to load navigation settings:', error);
        setNewsletterTitle(getDefault('navigation', 'newsletterTitle', language));
        setNewsletterSubtitle(getDefault('navigation', 'newsletterSubtitle', language));
      }
    }

    loadNavigationSettings();
  }, [language]);

  const toggleDrawer = () => {
    setIsOpen(prevState => !prevState);
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
          <div className="flex items-center gap-2 relative">
            <AssistantButton onClick={() => setWizardOpen(true)} />
            <button
              onClick={toggleDrawer}
              className="flex items-center justify-center size-[36px]"
            >
              <img
                src={siteAssets?.menuIcon ? urlFor(siteAssets.menuIcon).width(36).url() : NavMenu}
                alt="Menu"
                className="size-[36px] object-contain"
              />
            </button>
            <Drawer
              open={isOpen}
              onClose={toggleDrawer}
              direction="right"
              className="navDrawer"
              style={{
                transitionDuration: '500ms',
                right: '0px',
                transform: 'translate3d(100%, 0px, 0px)',
                width: isMobile ? '100%' : '480px',
              }}
            >
              <nav className="flex flex-col h-full w-full bg-white">
                {/* Red bar with language switcher */}
                <div className={`${isMobile ? 'h-[48px] px-6' : 'h-[40px] px-8'} bg-red-600 flex items-center justify-end shrink-0`}>
                  <LanguageSwitcher />
                </div>

                {/* Drawer header: logo + close button */}
                <div className={`flex justify-between items-center ${isMobile ? 'px-6 py-5' : 'px-8 py-5'}`}>
                  <Link to="/" onClick={toggleDrawer}>
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
                    className="flex items-center justify-center size-[36px]"
                    aria-label="Close"
                    onClick={toggleDrawer}
                  >
                    <img
                      src={siteAssets?.closeLargeIcon ? urlFor(siteAssets.closeLargeIcon).width(36).url() : Close}
                      alt=""
                      className="w-full h-full object-contain"
                    />
                  </button>
                </div>

                {/* Navigation Links */}
                <div className={`flex flex-col flex-1 overflow-y-auto ${isMobile ? 'px-6 pt-6 pb-16' : 'p-8'}`}>
                  {menuLinks.map((link, index) => (
                    <MenuLink key={index} link={link} toggleDrawer={toggleDrawer} isMobile={isMobile} />
                  ))}
                </div>

                {/* Divider */}
                <hr className={`border-t border-[#b9c0c7] ${isMobile ? 'mx-6' : 'mx-8'} shrink-0`} />

                {/* Subscribe Form */}
                <div className={`${isMobile ? 'px-6 pt-6 pb-6' : 'px-8 pt-8 pb-8'}`}>
                  <div className="mb-6">
                    <div className="font-bitmap-song text-[28px] leading-[1.5] text-black">
                      {newsletterTitle}
                    </div>
                    {newsletterSubtitle && (
                      <div className="font-bitmap-song text-[28px] leading-[1.5] text-[#e81717]">{newsletterSubtitle}</div>
                    )}
                  </div>
                  <SubscribeForm
                    placeholder="Email 电子邮件"
                    containerClassName="flex items-center w-full bg-[#fbfbfc] border border-[#b9c0c7] rounded-[4px] overflow-hidden"
                    inputClassName="flex-1 px-4 py-3 bg-transparent text-[#2e3238] placeholder-[#8d969e] focus:outline-none border-0 outline-none"
                    buttonClassName="px-6 py-3 bg-white border border-[#e81717] text-[#e81717] rounded-[4px] shrink-0 hover:bg-red-50 transition-colors"
                  />
                </div>
              </nav>
            </Drawer>
            <HelpWizard
              open={wizardOpen}
              onClose={() => setWizardOpen(false)}
              onStartTutorial={() => { setWizardOpen(false); setTutorialOpen(true); }}
            />
            <SearchTutorialModal open={tutorialOpen} onClose={() => setTutorialOpen(false)} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navigation;
