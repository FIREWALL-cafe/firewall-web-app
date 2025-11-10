import React from 'react';
import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from '../../lib/sanity';

const builder = imageUrlBuilder(sanityClient);

function urlFor(source) {
  return builder.image(source);
}

/**
 * SanityImage - A component for rendering optimized images from Sanity CMS
 *
 * @param {Object} image - Sanity image object with asset reference
 * @param {string} alt - Alt text for accessibility
 * @param {number} width - Target width in pixels
 * @param {number} height - Target height in pixels
 * @param {string} className - CSS classes to apply
 * @param {boolean} responsive - Generate responsive srcSet (default: true)
 * @param {number} quality - Image quality 0-100 (default: 90)
 * @param {Object} ...props - Additional props passed to img element
 */
function SanityImage({
  image,
  alt,
  width = 800,
  height,
  className = '',
  responsive = true,
  quality = 90,
  ...props
}) {
  if (!image) {
    console.warn('SanityImage: No image provided');
    return null;
  }

  // Build the main image URL
  let imageBuilder = urlFor(image)
    .width(width)
    .auto('format')
    .quality(quality);

  if (height) {
    imageBuilder = imageBuilder.height(height);
  }

  const imageUrl = imageBuilder.url();

  // Generate responsive srcSet if enabled
  const srcSet = responsive
    ? `
      ${urlFor(image).width(Math.round(width * 0.5)).auto('format').quality(quality).url()} ${Math.round(width * 0.5)}w,
      ${urlFor(image).width(width).auto('format').quality(quality).url()} ${width}w,
      ${urlFor(image).width(Math.round(width * 1.5)).auto('format').quality(quality).url()} ${Math.round(width * 1.5)}w
    `.trim()
    : undefined;

  return (
    <img
      src={imageUrl}
      srcSet={srcSet}
      sizes={responsive ? `(max-width: 768px) 100vw, ${width}px` : undefined}
      alt={alt || image.alt || ''}
      className={className}
      loading="lazy"
      {...props}
    />
  );
}

export default SanityImage;
