/**
 * Converts snake_case strings to human readable format
 * @param {string} locationKey - The string to format (e.g., "new_york_city")
 * @returns {string} Formatted string (e.g., "New York City")
 */
export const formatLocationName = locationKey => {
  if (!locationKey) return locationKey;
  return locationKey
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
