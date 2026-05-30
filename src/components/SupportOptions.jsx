import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getSupportPageStrings } from '../lib/sanity';
import Support from '../assets/icons/support.png';
import SupportGray from '../assets/icons/support_grayscale.png';
import Sponsor from '../assets/icons/sponsor.png';
import SponsorGray from '../assets/icons/sponsor_grayscale.png';
import Donation from '../assets/icons/donation.png';
import DonationGray from '../assets/icons/donation_grayscale.png';
import FeatureCards from './FeatureCards';

const DEFAULTS = [
  {
    titleEn: 'Make a donation',
    titleZh: '进行信用卡捐赠',
    description: 'Support us directly with a credit card donation.',
    iconSrc: DonationGray,
    iconSrcHover: Donation,
    bgColor: 'bg-blue-500',
    textColor: 'text-white',
    borderColor: 'border-solid border-blue-500',
    url: 'https://www.nyfa.org/#button=45138',
  },
  {
    titleEn: 'Become a sponsor',
    titleZh: '成为赞助商',
    description: 'Get in touch to learn about recurring donations, and how you can support our long term vision.',
    iconSrc: SponsorGray,
    iconSrcHover: Sponsor,
    bgColor: 'bg-blue-200',
    textColor: 'text-black',
    borderColor: 'border-solid border-blue-500',
    url: 'https://www.nyfa.org/#button=45138',
  },
  {
    titleEn: 'Other ways to support',
    titleZh: '以其他方式支持',
    description: "Have an idea? We'd love to hear about it.",
    iconSrc: SupportGray,
    iconSrcHover: Support,
    bgColor: 'bg-white',
    textColor: 'text-black',
    borderColor: 'border-solid border-blue-500',
    url: '/contact',
  },
];

function SupportOptions() {
  const { language } = useLanguage();
  const [strings, setStrings] = useState({});

  useEffect(() => {
    async function load() {
      try {
        const data = await getSupportPageStrings(language);
        setStrings(data);
      } catch (_) {}
    }
    load();
  }, [language]);

  const supportFeatures = DEFAULTS.map((item, i) => {
    const n = i + 1;
    const titleEn = strings[`supportOption${n}HeadingEn`] || item.titleEn;
    const titleZh = strings[`supportOption${n}HeadingZh`] || item.titleZh;
    const description = strings[`supportOption${n}Description`] || item.description;

    return {
      title: titleEn,
      chineseTitle: {
        text: titleZh,
        color: i === 0 ? 'text-black' : 'text-red-600',
      },
      description,
      iconSrc: item.iconSrc,
      iconSrcHover: item.iconSrcHover,
      bgColor: item.bgColor,
      textColor: item.textColor,
      borderColor: item.borderColor,
      url: item.url,
    };
  });

  return (
    <section className="w-full pb-8 md:pb-16">
      <FeatureCards features={supportFeatures} />
    </section>
  );
}

export default SupportOptions;
