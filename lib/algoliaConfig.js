// Getting Dependencies from window
import aa from 'search-insights';
import algoliasearch from 'algoliasearch/lite';
import PubSub from "pubsub-js";

const environment = process.env.NODE_ENV || false;
// Algolia Credentials
const appId = 'SGF0RZXAXL';
const apiKey = '0ac0c3b165eb3773097eca1ac25d8fdd';

// Sent Payloads
const sentPayloads = new Set();


// Initializing Search Client
const clientBase = algoliasearch(appId, apiKey);
// Override search Method for advance usage
export const searchClient = { ...clientBase, ...clientProxy(clientBase) };

// Insights Analytics Client Initialization
if (typeof window !== "undefined") {
  let userToken = getCookie('_ALGOLIA');
  // Set token for both Authenticated or unauthenticated users.
  if (userToken) {
    aa("init", { appId, apiKey, useCookie: true, userToken });
  } else {
    aa("init", { appId, apiKey, useCookie: true });
    aa('getUserToken', {}, (err, userToken) => {
      if (err) {
        console.error(err);
        return;
      }
      setCookie('_ALGOLIA', userToken);
    });
  }
}



// Insights Client
export const insightsClient = aa;

// Insights Object Configuration for InstnatSearch
export const insightsConfig = {
  insightsClient: aa,
  onEvent: (event, aa) => {
    const { insightsMethod, payload, widgetType, eventType } = event;

    // Convert the payload object to a string for Set comparison
    const payloadString = JSON.stringify(payload);
    // Send the event to Algolia if it hasn't been sent before
    if (insightsMethod && !sentPayloads.has(payloadString)) {
      aa(insightsMethod, payload);
      sentPayloads.add(payloadString);
    }
  }
};


// Configure your indices here
export const searchConfig = preProcessConfig({
  catalogId: "products",
  catalogLabel: "All Products",
  recordsIndex: "qa_ProductCatalog",
  nonResultsIndex: "qa_ProductCatalog",
  querySuggestionsIndex: "qa_ProductCatalog_query_suggestions",
  sortByIndices: [
    { label: 'Featured', value: 'qa_ProductCatalog' },
    { label: 'Price (asc)', value: 'qa_ProductCatalog_price_asc' },
    { label: 'Price (desc)', value: 'qa_ProductCatalog_price_desc' }
  ],
  // The URL used for the search results page.
  searchPagePath: "/algolia/search",
  productPdpPathPrefix: '/algolia/pdp',
  categoryPlpPathPrefix: '/algolia/c',
  autocompleteTags: {
    recordsSearch: ['autocomplete-search'],
    nonResults: ['autocomplete-non-results'],
  },
  instantSearchTags: {
    recordsSearch: ['ais-results-page', 'test-facets-sort'],
    nonResults: ['ais-non-results-page', 'test-facets-sort'],
  },
  attributeLabels: {
    'currPrice.price': 'Price',
    'hierarchicalCategories': "Catalog",
    'invType': 'Condition',
    'price.on_sales': 'Promos',
    'averageRating': 'Rating',
    'available_sizes': 'Sizes',
    'attributes.brand': 'Brand',
    'attributes.Color Family': 'colors',
    'attributes.br_width': 'Width',
    'attributes.br_height': 'Height',
    'attributes.br_depth': 'Depth',
    'attributes.br_capacity': 'Capacity',
    'storeInfo.storeLocation': 'Store Location',
  },
  // Radius (75 mi)
  geoLocationRadius: 75 * 1609,
  // Geo options for testing using locatopns. The first one is the default value.
  geoLocationOptions: [
    { name: 'BroadView, Il (60153)', lat: 41.87535477, long: -87.84103394 },
    { name: 'Austin, TX (78750)', lat: 30.41, long: -97.80 }
  ],
});

// Initialize indexDictionary
let indexDict = {};

// Calculate map for shortening URL
searchConfig.sortByIndices.forEach((indexName, i) => {
  indexDict[indexName.value] = `i${i}`;
});

// Variable for storing extra URL params
let extraUrlParams = {};

// Router Options designed to keep extra queries
export const routerOptions = {
  createURL({ qsModule, location, routeState }) {
    let paramsSize = 0;
    const { origin, pathname, hash, search } = location;
    // Calculate query String for Algolia UIState
    let queryString = qsModule.stringify(routeState);
    const searchParams = new URLSearchParams(search);
    paramsSize = searchParams.size;

    searchParams.forEach((value, key) => {
      const paramKey = key.split('[')[0];
      if (typeof indexDict[paramKey] === 'undefined') {
        extraUrlParams[key] = value;
      }
    });

    // remove brand to avoid conflicts
    delete extraUrlParams['brand_'];

    const suffix = Object.keys(extraUrlParams).length > 0 && queryString.length > 0 ? `&` : '';
    const extraParamsStr = Object.keys(extraUrlParams).length > 0 ? Object.keys(extraUrlParams).map(key => (`${key}=${extraUrlParams[key]}`)).join('&') + suffix : '';
    if (paramsSize === 0 && queryString.length === 0) {
      return `${origin}${pathname}`;
    }
    return `${origin}${pathname}?${extraParamsStr}${queryString}${hash}`;
  },
  parseURL({ qsModule, location }) {
    const { search } = location
    const routeState = qsModule.parse(location.search.slice(1));
    // Calculating and storing extra URL variables
    const searchParams = new URLSearchParams(search);
    searchParams.forEach((value, key) => {
      const paramKey = key.split('[')[0];
      if (typeof indexDict[paramKey] === 'undefined') {
        extraUrlParams[key] = value;
      }
    });
    // console.log('routeState', routeState)
    return routeState;
  },
}

// Export channel subscription
export const pubsub = PubSub;
// Constant for Events pub-sub
export const QUERY_UPDATE_EVT = "QUERY_UPDATE_EVT";

/**
 * Controls configuration for local development ease
 * @param {} config
 */
function preProcessConfig(config) {
  if (environment === 'development') {
    return {
      ...config,
    }
  }
  return config;
}

/**
 * Returns friendly name if available in the config
 * @param {} attribute
 * @returns
 */
export function friendlyAttributeName(attribute) {
  if (searchConfig.attributeLabels[attribute]) {
    return searchConfig.attributeLabels[attribute];
  } else if (attribute.includes('.lvl')) {
    const hierarchicalAttribute = attribute.split('.lvl')[0];
    return friendlyAttributeName(hierarchicalAttribute);
  }
  else if (attribute.startsWith('attributes')) {
    return attribute.replace('attributes.', '');
  }
  return attribute;
}

/**
 * Stores the query info for after search events
 * @param {*} object
 */
export function storeInfoForAfterEvents(object) {
  localStorage.setItem('lastAlgoliaQueyInfo', JSON.stringify(object));
}

/**
 * Stores the query info for after search events
 * @returns
 */
export function getInfoForAfterEvents() {
  return JSON.parse(localStorage.getItem('lastAlgoliaQueyInfo'));
}

/**
 * Remove user token if available
 * @param {[]} requests
 */
function cleanUserToken(requests) {
  requests.forEach(req => {
    try {
      delete req.params.userToken;
      return req;
    }
    catch (e) {
      return req
    }
  })
}

/**
 * Advance Algolia client config overrider.
 * @param {*} clientBase
 * @returns
 */
function clientProxy(clientBase) {
  return {
    search: async (requests) => {
      // user Token cleaner
      cleanUserToken(requests);
      const results = await clientBase.search(requests);
      // Detect if is the resultsPage case
      if (requests.length > 0 && requests[0].params && requests[0].params.analyticsTags && requests[0].params.analyticsTags.includes('web-search')) {
        // obtain the objectIds from the query.
        if (results.results && results.results[0]) {
          const hits = results.results[0].hits;
          // Calculate queries based on results
          const variantsQueries = hits.map((hit) => {
            const parentQuery = requests[0];
            // Clean unnecesary paramreters
            delete parentQuery.params.userToken;
            delete parentQuery.params.highlightPostTag;
            delete parentQuery.params.highlightPreTag;
            delete parentQuery.params.maxValuesPerFacet;
            return {
              ...parentQuery,
              params: {
                ...parentQuery.params,
                clickAnalytics: false,
                analytics: false,
                distinct: false,
                filters: `NOT objectID:${hit.objectID} AND deDuplicationId:${hit.deDuplicationId}`,
                facets: [],
                analyticsTags: ['variants-search'],
                hitsPerPage: 1000,
                attributesToHighlight: [],
              }
            }
          });

          const variantsResults = await clientBase.search(variantsQueries);
          if (variantsResults.results) {
            // set variants as part of the initial hits result
            variantsResults.results.forEach((variant_result, index) => {
              hits[index]['_variants'] = variant_result.hits;
            });
          }
        }
      }
      return results;
    }
  };
}

/**
 * Returns cookie based on name
 * @param {} name
 * @returns null if not found, otherwise the cookie value
 */
function getCookie(name) {
  const cname = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(cname) == 0) {
      return c.substring(cname.length, c.length);
    }
  }
  return null;
}

function setCookie(name, value) {
  const date = new Date();
  date.setTime(date.getTime() + (100 * 365 * 24 * 60 * 60 * 1000)); // 100 years in the future
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}