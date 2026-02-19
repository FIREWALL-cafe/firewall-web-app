import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getHomepageStrings, getHomepageImages } from '../lib/sanity';
import { getDefault } from '../constants/uiDefaults';
import ArrowRight from './icons/ArrowRight';
import SanityImage from './common/SanityImage';

function AboutSection() {
  const { language } = useLanguage();
  const [uiStrings, setUiStrings] = useState({});
  const [images, setImages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hoveredImage, setHoveredImage] = useState({ 1: false, 2: false, 3: false });

  // Fetch UI strings and images from Sanity on mount and language change
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        // Load strings and images in parallel
        const [strings, homepageImages] = await Promise.all([
          getHomepageStrings(language),
          getHomepageImages()
        ]);

        setUiStrings(strings);
        setImages(homepageImages);
      } catch (error) {
        console.error('Failed to load homepage data:', error);
        // Language-aware fallback
        setUiStrings({
          aboutMainHeading: getDefault('homepage', 'aboutMainHeading', language),
          aboutMainHeadingZh: getDefault('homepage', 'aboutMainHeadingZh', language),
          aboutIntroParagraph1: getDefault('homepage', 'aboutIntroParagraph1', language),
          aboutIntroParagraph2: getDefault('homepage', 'aboutIntroParagraph2', language),
          aboutButtonText: getDefault('homepage', 'aboutButtonText', language),
          aboutButtonAriaLabel: getDefault('homepage', 'aboutButtonAriaLabel', language),
        });
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [language]);

  const handleMouseEnter = (imageNum) => {
    setHoveredImage(prev => ({ ...prev, [imageNum]: true }));
  };

  const handleMouseLeave = (imageNum) => {
    setHoveredImage(prev => ({ ...prev, [imageNum]: false }));
  };

  if (loading) {
    // Loading skeleton
    return (
      <section className="w-full flex flex-col py-8 md:py-16">
        <div className="flex flex-col md:flex-row gap-10 justify-between">
          <div className="w-full md:w-[55%] order-2 md:order-1">
            <div className="animate-pulse space-y-4">
              <div className="h-12 bg-gray-200 rounded w-3/4"></div>
              <div className="h-8 bg-gray-200 rounded w-2/3"></div>
              <div className="h-24 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
          <div className="w-full md:w-[40%] space-y-4 order-1 md:order-2">
            <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
            <div className="animate-pulse h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col py-8 md:py-16">
      <div className="flex flex-col md:flex-row gap-10 justify-between">
        <div className="w-full md:w-[55%] order-2 md:order-1">
          <div className="font-bitmap-song">
            <h2 className="font-display-04 mb-2">
              <Link to="/about" className="hover:text-neutral-800">
                {uiStrings.aboutMainHeading || getDefault('homepage', 'aboutMainHeading', language)}
              </Link>
            </h2>
            <div className="font-display-04 text-red-600">
              {uiStrings.aboutMainHeadingZh || getDefault('homepage', 'aboutMainHeadingZh', language)}
            </div>
          </div>
          <div className="mt-8 space-y-6 font-body-01">
            <p>
              {uiStrings.aboutIntroParagraph1 || getDefault('homepage', 'aboutIntroParagraph1', language)}
            </p>
            <p>
              {uiStrings.aboutIntroParagraph2 || getDefault('homepage', 'aboutIntroParagraph2', language)}
            </p>
          </div>
          <Link
            to="/about"
            className="mt-8 inline-flex items-center px-6 py-3 font-body-03-medium text-red-600 border border-red-600 rounded hover:bg-red-50 transition-colors"
            aria-label={uiStrings.aboutButtonAriaLabel || getDefault('homepage', 'aboutButtonAriaLabel', language)}
          >
            {uiStrings.aboutButtonText || getDefault('homepage', 'aboutButtonText', language)}
            <ArrowRight fill="#DC2626" className="ml-2 w-6 h-6" />
          </Link>
        </div>

        {images && (
        <div className="w-full md:w-[40%] space-y-4 order-1 md:order-2">
          {/* Image 1 */}
          {images.aboutSectionImage1 && (
          <div
            className="w-full overflow-hidden"
            onMouseEnter={() => handleMouseEnter(1)}
            onMouseLeave={() => handleMouseLeave(1)}
          >
              <SanityImage
                image={
                  hoveredImage[1]
                    ? images.aboutSectionImage1.hover
                    : images.aboutSectionImage1.default
                }
                alt={images.aboutSectionImage1.alt || 'Illustration 1'}
                width={800}
                height={400}
                quality={85}
                className="w-full object-cover aspect-[2]"
              />
          </div>
          )}

          {/* Image 2 */}
          {images.aboutSectionImage2 && (
          <div
            className="w-full overflow-hidden"
            onMouseEnter={() => handleMouseEnter(2)}
            onMouseLeave={() => handleMouseLeave(2)}
          >
              <SanityImage
                image={
                  hoveredImage[2]
                    ? images.aboutSectionImage2.hover
                    : images.aboutSectionImage2.default
                }
                alt={images.aboutSectionImage2.alt || 'Illustration 2'}
                width={800}
                height={400}
                quality={85}
                className="w-full object-cover aspect-[2]"
              />
          </div>
          )}

          {/* Image 3 */}
          {images.aboutSectionImage3 && (
          <div
            className="w-full overflow-hidden"
            onMouseEnter={() => handleMouseEnter(3)}
            onMouseLeave={() => handleMouseLeave(3)}
          >
              <SanityImage
                image={
                  hoveredImage[3]
                    ? images.aboutSectionImage3.hover
                    : images.aboutSectionImage3.default
                }
                alt={images.aboutSectionImage3.alt || 'Illustration 3'}
                width={800}
                height={400}
                quality={85}
                className="w-full object-cover aspect-[2]"
              />
          </div>
          )}
        </div>
        )}
      </div>
    </section>
  );
}

export default AboutSection;
