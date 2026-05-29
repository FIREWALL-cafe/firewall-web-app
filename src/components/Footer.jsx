import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getFooterStrings, getSiteAssets, urlFor } from '../lib/sanity';

// Static fallbacks
import logo from '../assets/icons/logo_name.svg';
import Facebook from '../assets/icons/facebook_red.svg';
import Youtube from '../assets/icons/youtube_red.svg';
import Instagram from '../assets/icons/instagram_red.svg';

const FALLBACK_LINK_GROUPS = [
  {
    links: [
      { label: 'About', path: '/about' },
      { label: 'Press', path: '/press' },
      { label: 'Events', path: '/events' },
    ],
  },
  {
    links: [
      { label: 'Search', path: '/search' },
      { label: 'Search Archive', path: '/archive' },
      { label: 'Expert Commentary', path: '/editorial' },
    ],
  },
  {
    links: [
      { label: 'Partner with us', path: '/support' },
      { label: 'Contact', path: '/contact' },
    ],
  },
];

const FALLBACK_SOCIAL_LINKS = [
  { platform: 'instagram', url: 'http://instagram.com/firewallcafe' },
  { platform: 'facebook', url: 'https://www.facebook.com/firewallcafe' },
  { platform: 'youtube', url: 'https://www.youtube.com/channel/UCMTAKSSmI9iKD7a3GB1JIrA' },
];

const SOCIAL_ICONS = {
  instagram: { src: Instagram, alt: 'Instagram' },
  facebook: { src: Facebook, alt: 'Facebook' },
  youtube: { src: Youtube, alt: 'YouTube' },
};

function isExternal(path) {
  return path?.startsWith('http://') || path?.startsWith('https://');
}

function Footer() {
  const { language } = useLanguage();
  const [linkGroups, setLinkGroups] = useState(FALLBACK_LINK_GROUPS);
  const [socialLinks, setSocialLinks] = useState(FALLBACK_SOCIAL_LINKS);
  const [siteAssets, setSiteAssets] = useState(null);

  useEffect(() => {
    async function loadSiteAssets() {
      try {
        const assets = await getSiteAssets();
        if (assets) setSiteAssets(assets);
      } catch (_) {}
    }
    loadSiteAssets();
  }, []);

  useEffect(() => {
    async function loadFooter() {
      try {
        const data = await getFooterStrings(language);
        if (data.linkGroups?.length) setLinkGroups(data.linkGroups);
        if (data.socialLinks?.length) setSocialLinks(data.socialLinks);
      } catch (_) {}
    }
    loadFooter();
  }, [language]);

  const getSocialIcon = (platform) => {
    if (platform === 'instagram' && siteAssets?.instagramIcon)
      return urlFor(siteAssets.instagramIcon).width(24).url();
    if (platform === 'facebook' && siteAssets?.facebookIcon)
      return urlFor(siteAssets.facebookIcon).width(24).url();
    if (platform === 'youtube' && siteAssets?.youtubeIcon)
      return urlFor(siteAssets.youtubeIcon).width(24).url();
    return SOCIAL_ICONS[platform]?.src;
  };

  return (
    <footer className="w-full bg-white pt-[120px] pb-[180px] is-large-width-content">
      <div className="mx-auto w-full">
        <div className="flex justify-between items-start gap-20 md:flex-row flex-col">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/">
              <img
                src={siteAssets?.logoFull ? urlFor(siteAssets.logoFull).width(200).url() : logo}
                alt="Logo"
              />
            </Link>
          </div>

          {/* Link groups */}
          <div className="flex flex-col md:flex-row gap-8 md:gap-10 justify-end font-body-02">
            {linkGroups.map((group, gi) => (
              <div key={gi} className="flex flex-col gap-2 md:gap-4 text-red-600 iphone:w-[180px] w-[130px]">
                {group.links.map((link, li) => (
                  isExternal(link.path) ? (
                    <a
                      key={li}
                      href={link.path}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link key={li} to={link.path}>
                      {link.label}
                    </Link>
                  )
                ))}

                {/* Social icons in last group */}
                {gi === linkGroups.length - 1 && socialLinks.length > 0 && (
                  <div className="flex gap-2 md:gap-4 mt-2">
                    {socialLinks.map((social, si) => {
                      const icon = getSocialIcon(social.platform);
                      const alt = SOCIAL_ICONS[social.platform]?.alt || social.platform;
                      return (
                        <a
                          key={si}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={alt}
                        >
                          {icon && <img src={icon} alt={`${alt} logo`} className="w-6" />}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
