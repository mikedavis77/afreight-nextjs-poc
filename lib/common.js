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