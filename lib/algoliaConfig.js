// Getting Dependencies from window
import aa from 'search-insights';
import algoliasearch from 'algoliasearch/lite';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';
import PubSub from "pubsub-js";

const environment = process.env.NODE_ENV || false;
// Algolia Credentials
const appId = 'SGF0RZXAXL';
const apiKey = '0ac0c3b165eb3773097eca1ac25d8fdd';

// Sent Payloads
const sentPayloads = new Set();


// Initializing Search Client
export const searchClient = algoliasearch(appId, apiKey);


// Insights Analytics Client Initialization
aa("init", { appId, apiKey, useCookie: true });
// Set token for both Authenticated or unauthenticated users.
// aa('setUserToken', 'ma-user-999');

// Insights Client
export const insightsClient = aa;

// create and export middleware
export const insightsMiddleware = createInsightsMiddleware({
  insightsClient: aa, onEvent: (event, aa) => {
    const { insightsMethod, payload, widgetType, eventType } = event;

    // Convert the payload object to a string for Set comparison
    const payloadString = JSON.stringify(payload);

    // Send the event to Algolia if it hasn't been sent before
    if (insightsMethod && !sentPayloads.has(payloadString)) {
      aa(insightsMethod, payload);
      sentPayloads.add(payloadString);
    }
  }
});

// Configure your indices here
export const searchConfig = preProcessConfig({
  catalogId: "products",
  catalogLabel: "All Products",
  recordsIndex: "qa_ProductCatalog",
  nonResultsIndex: "qa_ProductCatalog",
  querySuggestionsIndex: "qa_ProductCatalog_query_suggestions",
  sortByIndices: [
    { label: 'Featured', value: 'qa_ProductCatalog' },
    // { label: 'Price (asc)', value: 'qa_ProductCatalog' },
    // { label: 'Price (desc)', value: 'qa_ProductCatalog' }
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
    'salePrice': 'Price',
    'hierarchicalCategories': "Catalog",
    'invType': 'Condition',
    'price.on_sales': 'Promos',
    'averageRating': 'Rating',
    'available_sizes': 'Sizes',
    'attributes.brand': 'Brand',
    'attributes.Color Family': 'colors',
  },
  // Radius (75 mi)
  geoLocationRadius: 750 * 1609,
  // Geo options for testing using locatopns. The first one is the default value.
  geoLocationOptions: [
    { name: 'BroadView, Il (60153)', lat: 41.87535477, long: -87.84103394 },
    { name: 'Austin, TX (78750)', lat: 30.41, long: -97.80 }
  ]
});

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