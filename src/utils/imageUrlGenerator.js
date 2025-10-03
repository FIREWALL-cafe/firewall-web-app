/**
 * Generates a URL for an image, using proxy when configured or in production
 * @param {string} imageUrl - The original image URL
 * @param {boolean} isBaidu - Whether the image is from Baidu
 * @param {boolean} hasBaiduResults - Whether there are any Baidu results available
 * @param {string} censoredImage - The fallback image for censored content
 * @returns {string} The generated image URL
 */
export const generateImageUrl = (
  imageUrl,
  isBaidu = false,
  hasBaiduResults = true,
  censoredImage = null
) => {
  // Handle case where an object is passed instead of a string
  // This maintains backward compatibility with existing component code
  const url = typeof imageUrl === 'object' && imageUrl?.imageUrl ? imageUrl.imageUrl : imageUrl;

  // Handle placeholder objects with null imageUrl (when Baidu search failed)
  if (url === null || url === undefined) {
    return censoredImage;
  }

  if (isBaidu && !hasBaiduResults) {
    return censoredImage;
  }

  // Use proxy if configured via environment variable
  // This ensures images work correctly in Vercel dev environment
  // if (process.env.REACT_APP_PROXY_IMAGES === 'true') {
  //   return `/proxy-image?url=${encodeURIComponent(url)}`;
  // }

  // Only use direct URL if explicitly disabled
  return url;
};
