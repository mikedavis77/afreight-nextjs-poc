/**
 * Gets query params from the current URL (Client Side Only)
 */
export function getQueryParam(param) {
  if (typeof window == 'undefined') {
    return '';
  }
  // get the query parameters from the URL
  const urlParams = new URLSearchParams(window.location.search);

  // get the value of the parameter
  const value = urlParams.get(param);
  // if the parameter is not set, return null
  if (value === null) {
    return '';
  } else {
    return value;
  }
}

/**
 * Updates the value of a query param in the URL
 */
export function updateUrlParameter(key, value) {
  // Get the current URL search params
  let searchParams = new URLSearchParams(window.location.search);

  // Update or add the parameter
  searchParams.set(key, value);

  // Build the new URL with the updated search params
  let newUrl = window.location.origin + window.location.pathname + '?' + searchParams.toString();

  // Replace the current URL with the new URL
  window.history.replaceState({ path: newUrl }, '', newUrl);
}

/**
 * Calculate distance
 * @param {*} lat1
 * @param {*} lon1
 * @param {*} lat2
 * @param {*} lon2
 * @param {*} unit
 * @returns
 */
export function calculateDistance(lat1, lon1, lat2, lon2, unit='M') {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in miles
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Formats a given string by capitalizing the first letter of each word and replacing hyphens with spaces.
 * @param {string} input - The input string to format.
 * @returns {string} The formatted string.
 * @example
 * const input = "appliances > refrigerators-freezers > french-door-refrigerator";
 * const output = formatString(input);
 * console.log(output); // "Appliances > Refrigerators Freezers > French Door Refrigerator"
 */
export function friendlyCategoryName(input) {
  return input
    .split(">")
    .map(segment =>
      segment
        .trim()
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .join(" > ");
}