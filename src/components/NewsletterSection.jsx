import React, { useState, useEffect } from 'react';
import SubscribeSection from './SubscribeSection';
import { getHomepageImages } from '../lib/sanity';
import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from '../lib/sanity';

// Fallback static images
import SubscribeA from '../assets/images/subscribe-a-desktop.jpg';
import SubscribeAMobile from '../assets/images/subscribe-a-mobile.jpg';
import SubscribeB from '../assets/images/subscribe-b-desktop.jpg';
import SubscribeBMobile from '../assets/images/subscribe-b-mobile.jpg';
import SubscribeC from '../assets/images/subscribe-c-desktop.jpg';
import SubscribeCMobile from '../assets/images/subscribe-c-mobile.jpg';
import SubscribeD from '../assets/images/subscribe-d-desktop.jpg';
import SubscribeDMobile from '../assets/images/subscribe-d-mobile.jpg';
import SubscribeE from '../assets/images/subscribe-e-desktop.jpg';
import SubscribeEMobile from '../assets/images/subscribe-e-mobile.jpg';

const staticImages = {
  subscribeA: { desktop: SubscribeA, mobile: SubscribeAMobile },
  subscribeB: { desktop: SubscribeB, mobile: SubscribeBMobile },
  subscribeC: { desktop: SubscribeC, mobile: SubscribeCMobile },
  subscribeD: { desktop: SubscribeD, mobile: SubscribeDMobile },
  subscribeE: { desktop: SubscribeE, mobile: SubscribeEMobile },
  usHeadlines: { desktop: SubscribeD, mobile: SubscribeDMobile },
};

const builder = imageUrlBuilder(sanityClient);

function NewsletterSection({ image, title }) {
  const [sanityImages, setSanityImages] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadImages() {
      try {
        setLoading(true);
        const homepageImages = await getHomepageImages();
        setSanityImages(homepageImages);
      } catch (error) {
        console.error('Failed to load newsletter images:', error);
        setSanityImages(null); // Will fallback to static images
      } finally {
        setLoading(false);
      }
    }

    loadImages();
  }, []);

  // Map image prop to Sanity field name
  const imageMap = {
    subscribeA: 'newsletterImageA',
    subscribeB: 'newsletterImageB',
    subscribeC: 'newsletterImageC',
    subscribeD: 'newsletterImageD',
    subscribeE: 'newsletterImageE',
    usHeadlines: 'newsletterImageD', // Same as D
  };

  const sanityFieldName = imageMap[image];
  const sanityImageSet = sanityImages?.[sanityFieldName];

  // Helper to generate Sanity image URLs with proper sizing
  const getSanityImageUrl = (imageObj, width) => {
    if (!imageObj) return null;
    return builder
      .image(imageObj)
      .width(width)
      .auto('format')
      .quality(85)
      .url();
  };

  return (
    <section className="flex flex-col md:flex-row w-full overflow-hidden is-full-width-content">
      <div className="flex w-full md:w-1/2 order-2 md:order-1 bg-newsletter">
        <SubscribeSection title={title} />
      </div>
      <div className="flex w-full md:w-1/2 h-[300px] md:h-auto order-1 md:order-2">
        {loading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse"></div>
        ) : sanityImageSet ? (
          <picture className="w-full h-full">
            <source
              media="(max-width: 1079px)"
              srcSet={getSanityImageUrl(sanityImageSet.mobile, 800)}
            />
            <source
              media="(min-width: 1080px)"
              srcSet={getSanityImageUrl(sanityImageSet.desktop, 1200)}
            />
            <img
              src={getSanityImageUrl(sanityImageSet.desktop, 1200)}
              alt={sanityImageSet.alt || 'Newsletter image'}
              className="w-full h-full object-cover object-center"
            />
          </picture>
        ) : (
          <picture className="w-full h-full">
            <source media="(max-width: 1079px)" srcSet={staticImages[image].mobile} />
            <source media="(min-width: 1080px)" srcSet={staticImages[image].desktop} />
            <img
              src={staticImages[image].desktop}
              alt="Newsletter image"
              className="w-full h-full object-cover object-center"
            />
          </picture>
        )}
      </div>
    </section>
  );
}

export default NewsletterSection;
