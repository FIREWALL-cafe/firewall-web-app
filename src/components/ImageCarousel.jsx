import React, { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import cloudAlert from '../assets/icons/cloud_alert.svg';
import googleLogo from '../assets/icons/Google-logo_long.svg';
import baiduLogo from '../assets/icons/baidu_logo_long.svg';
import CarouselLeft from '../assets/icons/carousel-left.svg';
import CarouselRight from '../assets/icons/carousel-right.svg';
import QuestionIcon from './icons/QuestionIcon';
import SoftCensorshipIcon from './icons/SoftCensorshipIcon';
import BrokenImagePadding from '../assets/icons/broken-image-placeholder_padding.svg';
import CensoredBrokenImage from '../assets/icons/censored-image-placeholder_padding.svg';
import { isStateMedia } from '../lib/stateMedia';
import { useStateMediaDomains } from '../hooks/useStateMediaDomains';

const getDisplayUrl = url => {
  try {
    return new URL(url).hostname;
  } catch {
    return (url || '').slice(0, 40);
  }
};

const hostOf = url => {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
};

// Baidu results sourced from state-media/government sites get a warning triangle.
const StateMediaWarning = ({ source, extraDomains }) =>
  isStateMedia(hostOf(source), extraDomains) ? (
    <SoftCensorshipIcon
      className="absolute bottom-1 right-1 z-[5] drop-shadow"
      data-tooltip-id="tooltip-soft-censorship"
      data-tooltip-content="Soft censorship: this result comes from a Chinese state-media or government website."
      data-tooltip-place="top"
    />
  ) : null;

// Result entries are { image, source }: `image` is the file URL to display,
// `source` is the web page it was found on (may be null → non-clickable).
// Tolerate legacy plain-string entries as a fallback.
const imageOf = result => (typeof result === 'string' ? result : result?.image);
const sourceOf = result => (typeof result === 'string' ? null : result?.source);

// Hover badge that is the one clickable way to open a result's original page.
// Plain clicks on images only select them; this keeps visitors on the site.
const SourceLink = ({ source, className = '' }) =>
  source ? (
    <a
      href={source}
      target="_blank"
      rel="noopener noreferrer"
      onClick={e => e.stopPropagation()}
      title={`Open original page: ${source}`}
      className={`absolute bottom-0 right-0 hidden group-hover:block bg-black/70 hover:bg-black/90 hover:underline text-white text-[10px] px-1.5 py-0.5 truncate z-10 ${className}`}
    >
      {getDisplayUrl(source)} ↗
    </a>
  ) : null;

function ImageCarousel({ images, searchId, isLoading = false, isBanned = false, onRetry }) {
  const [currentIndex, setCurrentIndex] = useState(null); // Start with no selection
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const extraStateMediaDomains = useStateMediaDomains();

  const baiduEmpty =
    !isLoading &&
    !isBanned &&
    !images?.baiduResults?.length &&
    (images?.googleResults?.length ?? 0) > 0;

  // Server-side verdict from api/lib/censorship.js: an empty Baidu answer that
  // looks like suppression rather than a connection failure.
  const baiduCensored = baiduEmpty && images?.censorship?.verdict === 'hard_censored';

  const handleOnError = (e, isBaidu = false) => {
    if (isBaidu && images?.baiduResults?.length === 0) {
      e.target.src = CensoredBrokenImage;
    } else {
      e.target.src = BrokenImagePadding;
    }
  };

  const resultCount = Math.max(
    images?.googleResults?.length ?? 0,
    images?.baiduResults?.length ?? 0
  );

  const goToNext = () => {
    if (currentIndex !== null && resultCount > 0) {
      setCurrentIndex(prevIndex => (prevIndex + 1) % resultCount);
    }
  };

  const goToPrevious = () => {
    if (currentIndex !== null && resultCount > 0) {
      setCurrentIndex(prevIndex => (prevIndex - 1 + resultCount) % resultCount);
    }
  };

  const handleThumbnailClick = index => {
    setCurrentIndex(index);
    // Only open lightbox on iPhone screens
    const isIphoneScreen = window.innerWidth <= 420;
    if (isIphoneScreen) {
      setIsLightboxOpen(true);
    }
  };

  // Create slides array for the lightbox with pairs of images
  const slides = images?.googleResults?.map((googleImage, index) => ({
    google: imageOf(googleImage),
    baidu: imageOf(images.baiduResults?.[index]),
    alt: `Image Pair ${index + 1}`,
  }));

  return (
    <div className="w-full max-w-screen-xl mx-auto relative">
      <Tooltip id="tooltip-soft-censorship" border={'1px solid #e60011'} />
      {/* Search ID in top left corner */}
      {searchId && (
        <div className="absolute top-2 left-2 z-10 bg-black/60 text-white px-2 py-1 rounded text-xs font-mono">
          ID: {searchId}
        </div>
      )}
      {/* Headers - Always show when loading or when images are available */}
      {(isLoading || images?.googleResults?.length > 0) && (
        <div className="flex flex-col ipad-portrait:flex-row">
          {/* Mobile Headers */}
          <div className="flex flex-row w-full ipad-portrait:hidden">
            <div id="google-header" className="flex items-center px-8 pb-4 w-1/2">
              <img src={googleLogo} alt="Google" className="w-16 pt-4" />
              <QuestionIcon
                fill="#77B5F0"
                className="w-8 h-8 pt-4"
                data-tooltip-id="tooltip-google"
                data-tooltip-content="Results from US based Google images."
                data-tooltip-place="top"
              />
              <Tooltip id="tooltip-google" border={'1px solid #e60011'} />
            </div>
            <div id="baidu-header" className="flex items-center px-8 pb-4 w-1/2">
              <img src={baiduLogo} alt="Baidu" className="w-16 pt-4" />
              <QuestionIcon
                fill="#ef4444"
                className="w-8 h-8 pt-4"
                data-tooltip-id="tooltip-baidu"
                data-tooltip-content="Results from China based Baidu images."
                data-tooltip-place="top"
              />
              <Tooltip id="tooltip-baidu" border={'1px solid #e60011'} />
            </div>
          </div>

          {/* Google Section */}
          <div className="w-full ipad-portrait:w-1/2 ipad-portrait:pb-5 ipad-portrait:border-r border-red-300">
            <div
              id="google-header-md"
              className="hidden ipad-portrait:flex justify-between items-center px-8 pb-8 pt-4"
            >
              <img src={googleLogo} alt="Google" className="w-28" />
              <QuestionIcon
                fill="#77B5F0"
                className="w-6 h-6"
                data-tooltip-id="tooltip-google"
                data-tooltip-content="Results from US based Google images."
                data-tooltip-place="top"
              />
              <Tooltip id="tooltip-google" border={'1px solid #e60011'} />
            </div>
            {/* Carousel - Only show when an image is selected */}
            {currentIndex !== null && (
              <div
                id="google-carousel"
                className="relative justify-center items-center h-[320px] hidden ipad-portrait:flex"
              >
                {!isLoading && (
                  <div className="absolute left-0 h-full w-[60px] flex justify-center items-center">
                    <button
                      onClick={goToPrevious}
                      className="h-full w-full flex justify-center items-center"
                      aria-label="Previous image"
                    >
                      <img src={CarouselLeft} alt="Previous" className="w-12 h-12" />
                    </button>
                  </div>
                )}
                <div className="flex-1 min-w-0 h-full flex justify-center items-center pl-[60px] pr-8">
                  {isLoading ? (
                    <Skeleton height={320} width="80%" />
                  ) : (
                    images?.googleResults?.[currentIndex] &&
                    (() => {
                      const result = images.googleResults[currentIndex];
                      const source = sourceOf(result);
                      return (
                        <div className="group relative h-full max-w-full flex items-center justify-center">
                          <img
                            src={imageOf(result)}
                            className="object-contain max-h-full max-w-full shadow-[2px_2px_3px_rgba(0,0,0,0.3)]"
                            onError={handleOnError}
                            alt={`Google search result ${currentIndex + 1}`}
                          />
                          <SourceLink source={source} className="max-w-xs" />
                        </div>
                      );
                    })()
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Baidu Section */}
          <div className="w-full ipad-portrait:w-1/2 ipad-portrait:pb-5 bg-neutral-100">
            <div
              id="baidu-header-md"
              className="hidden ipad-portrait:flex justify-between items-center px-8 pb-8 pt-4"
            >
              <img src={baiduLogo} alt="Baidu" className="w-28" />
              <QuestionIcon
                fill="#ef4444"
                className="w-6 h-6"
                data-tooltip-id="tooltip-baidu"
                data-tooltip-content="Results from China based Baidu images."
                data-tooltip-place="top"
              />
              <Tooltip id="tooltip-baidu" border={'1px solid #e60011'} />
            </div>
            {/* Carousel - Only show when an image is selected */}
            {currentIndex !== null && (
              <div
                id="baidu-carousel"
                className="relative justify-center items-center pl-8 h-[320px] hidden ipad-portrait:flex"
              >
                <div className="flex-1 min-w-0 h-full flex justify-center items-center pr-[60px]">
                  {isLoading ? (
                    <Skeleton height={320} width="80%" />
                  ) : isBanned ? (
                    <img
                      src={CensoredBrokenImage}
                      className="object-contain max-h-full max-w-full"
                      alt="Search term is banned in China"
                    />
                  ) : (
                    images?.baiduResults?.[currentIndex] &&
                    (() => {
                      const result = images.baiduResults[currentIndex];
                      const source = sourceOf(result);
                      return (
                        <div className="group relative h-full max-w-full flex items-center justify-center">
                          <img
                            src={imageOf(result)}
                            className="object-contain max-h-full max-w-full shadow-[2px_2px_3px_rgba(0,0,0,0.3)]"
                            onError={e => handleOnError(e, true)}
                            alt={`Baidu search result ${currentIndex + 1}`}
                          />
                          <StateMediaWarning source={source} extraDomains={extraStateMediaDomains} />
                          <SourceLink source={source} className="max-w-xs" />
                        </div>
                      );
                    })()
                  )}
                </div>
                {!isLoading && !baiduEmpty && (
                  <div className="absolute right-0 h-full w-[60px] flex justify-center items-center">
                    <button
                      onClick={goToNext}
                      className="h-full w-full flex justify-center items-center"
                      aria-label="Next image"
                    >
                      <img src={CarouselRight} alt="Next" className="w-12 h-12" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Thumbnails */}
      <div className="flex flex-row">
        <div className="w-1/2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4 border-r border-red-300">
          {isLoading
            ? Array(9)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden">
                    <Skeleton height="100%" width="100%" />
                  </div>
                ))
            : images?.googleResults?.map((image, index) => {
                const source = sourceOf(image);
                return (
                  <div
                    key={index}
                    className={`group relative aspect-square overflow-visible w-full ${
                      currentIndex !== null && currentIndex === index
                        ? 'opacity-60 bg-[#0084CC]'
                        : 'opacity-100 bg-transparent'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleThumbnailClick(index)}
                      className="block w-full h-full overflow-hidden p-0 border-0 appearance-none bg-transparent"
                      aria-label={`Select Google result ${index + 1}`}
                    >
                      <img
                        src={imageOf(image)}
                        className="w-full h-full object-cover"
                        onError={handleOnError}
                        alt={`Google thumbnail ${index + 1}`}
                      />
                    </button>
                    <SourceLink source={source} className="max-w-full" />
                    {currentIndex !== null && currentIndex === index && (
                      <div className="absolute inset-[-4px] border border-blue-600 rounded-[6px] bg-blue-300/30 pointer-events-none" />
                    )}
                  </div>
                );
              })}
        </div>
        <div
          className={`w-1/2 bg-neutral-100 ${baiduEmpty ? 'flex items-center justify-center p-8' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4'}`}
        >
          {baiduEmpty ? (
            baiduCensored ? (
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <img src={CensoredBrokenImage} alt="" className="w-24 h-24" />
                <h3 className="text-xl font-bold text-neutral-800">Possibly Censored</h3>
                <div className="flex items-center gap-1.5 text-sm text-neutral-500">
                  <span>Baidu returned no results for this search</span>
                  <QuestionIcon
                    fill="#8d969e"
                    className="w-4 h-4 flex-shrink-0"
                    data-tooltip-id="tooltip-baidu-censored"
                    data-tooltip-content="Baidu answered normally but returned an empty result set while Google found results — a strong signal that this term is censored on Baidu. This is an automated assessment, not a definitive label."
                    data-tooltip-place="top"
                  />
                  <Tooltip id="tooltip-baidu-censored" border={'1px solid #e60011'} />
                </div>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="mt-2 px-8 py-2 border border-neutral-400 rounded text-neutral-700 hover:bg-neutral-200 transition-colors text-sm"
                  >
                    Retry
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <img src={cloudAlert} alt="" className="w-16 h-16" />
                <h3 className="text-xl font-bold text-neutral-800">Unable to Connect</h3>
                <div className="flex items-center gap-1.5 text-sm text-neutral-500">
                  <span>We were unable to complete your search</span>
                  <QuestionIcon
                    fill="#8d969e"
                    className="w-4 h-4 flex-shrink-0"
                    data-tooltip-id="tooltip-baidu-error"
                    data-tooltip-content="Baidu search results could not be retrieved. This may be a temporary connection issue."
                    data-tooltip-place="top"
                  />
                  <Tooltip id="tooltip-baidu-error" border={'1px solid #e60011'} />
                </div>
                {onRetry && (
                  <button
                    onClick={onRetry}
                    className="mt-2 px-8 py-2 border border-neutral-400 rounded text-neutral-700 hover:bg-neutral-200 transition-colors text-sm"
                  >
                    Retry
                  </button>
                )}
              </div>
            )
          ) : isLoading ? (
            Array(9)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="relative aspect-square overflow-hidden">
                  <Skeleton height="100%" width="100%" />
                </div>
              ))
          ) : isBanned ? (
            Array(9)
              .fill(0)
              .map((_, index) => (
                <div key={index} className="relative aspect-square overflow-hidden">
                  <img
                    src={CensoredBrokenImage}
                    className="w-full h-full object-cover"
                    alt="Search term is banned in China"
                  />
                </div>
              ))
          ) : (
            images?.baiduResults?.map((image, index) => {
              const source = sourceOf(image);
              return (
                <div
                  key={index}
                  className={`group relative aspect-square overflow-visible w-full ${
                    currentIndex !== null && currentIndex === index
                      ? 'opacity-60 bg-red-900'
                      : 'opacity-100 bg-transparent'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleThumbnailClick(index)}
                    className="block w-full h-full overflow-hidden p-0 border-0 appearance-none bg-transparent"
                    aria-label={`Select Baidu result ${index + 1}`}
                  >
                    <img
                      src={imageOf(image)}
                      className="w-full h-full object-cover"
                      onError={e => handleOnError(e, true)}
                      alt={`Baidu thumbnail ${index + 1}`}
                    />
                  </button>
                  <StateMediaWarning source={source} extraDomains={extraStateMediaDomains} />
                  <SourceLink source={source} className="max-w-full" />
                  {currentIndex !== null && currentIndex === index && (
                    <div className="absolute inset-[-4px] border border-red-600 rounded-[6px] bg-red-300/30 pointer-events-none" />
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        index={currentIndex || 0}
        slides={slides}
        carousel={{ imageFit: 'cover' }}
        className="iphone:block hidden"
        render={{
          slide: ({ slide }) => (
            <div className="flex flex-row w-full">
              {/* Google Section */}
              <div className="w-1/2 relative flex flex-col items-center justify-center bg-white">
                <div className="flex flex-col items-center justify-center aspect-square overflow-hidden">
                  <img
                    src={slide.google}
                    className="w-full h-full p-2 object-cover shadow-[2px_2px_3px_rgba(0,0,0,0.3)]"
                    onError={handleOnError}
                    alt="Google search result"
                  />
                </div>
                <div className="flex justify-between w-full pl-2 mt-4">
                  <img src={googleLogo} alt="Google" className="w-12" />
                  <QuestionIcon
                    fill="#77B5F0"
                    className="w-4 h-4 mr-2"
                    data-tooltip-id="tooltip-google"
                    data-tooltip-content="Results from US based Google images."
                    data-tooltip-place="top"
                  />
                  <Tooltip id="tooltip-google" border={'1px solid #e60011'} />
                </div>
              </div>

              {/* Baidu Section */}
              <div className="w-1/2 relative flex flex-col items-center justify-center bg-neutral-100 border-l border-red-300">
                <div className="flex flex-col items-center justify-center aspect-square overflow-hidden">
                  {isBanned ? (
                    <img
                      src={CensoredBrokenImage}
                      className="w-full h-full p-2 object-contain"
                      alt="Search term is banned in China"
                    />
                  ) : slide.baidu ? (
                    <img
                      src={slide.baidu}
                      className="w-full h-full p-2 object-cover shadow-[2px_2px_3px_rgba(0,0,0,0.3)]"
                      onError={e => handleOnError(e, true)}
                      alt="Baidu search result"
                    />
                  ) : null}
                </div>
                <div className="flex justify-between w-full pl-2 mt-4">
                  <img src={baiduLogo} alt="Baidu" className="w-12 pt-1" />
                  <QuestionIcon
                    fill="#ef4444"
                    className="w-4 h-4 mr-4"
                    data-tooltip-id="tooltip-baidu"
                    data-tooltip-content="Results from China based Baidu images."
                    data-tooltip-place="left"
                  />
                  <Tooltip id="tooltip-baidu" border={'1px solid #e60011'} />
                </div>
              </div>
            </div>
          ),
        }}
        styles={{
          container: { backgroundColor: 'rgba(0, 0, 0, 0.9)' },
          root: {
            '--yarl__color_backdrop': 'rgba(0, 0, 0, 0.9)',
            '--yarl__slide_width': '100%',
            '--yarl__slide_height': '100%',
            '--yarl__slide_padding': '0',
          },
          thumbnails: { '--yarl__thumbnails_thumbnail_border_radius': '0.5rem' },
          thumbnail: { '--yarl__thumbnail_border_radius': '0.5rem' },
          slide: { padding: '0', width: '100%', height: '100%' },
          slide_container: { padding: '0', width: '100%', height: '100%' },
          slide_image: { padding: '0', width: '100%', height: '100%' },
          slide_image_container: { padding: '0', width: '100%', height: '100%' },
        }}
      />
    </div>
  );
}

export default ImageCarousel;
