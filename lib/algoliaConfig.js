// Getting Dependencies from window
import aa from 'search-insights';
import algoliasearch from 'algoliasearch/lite';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';
import PubSub from "pubsub-js";

const environment = process.env.NODE_ENV || false;
// Algolia Credentials
const appId = 'SGF0RZXAXL';
const apiKey = '92a97e0f8732e61569c6aa4c2b383308';

// Initializing Search Client
const clientBase = algoliasearch(appId, apiKey);
export const searchClient = { ...clientBase, ...clientProxy(clientBase) };

// Insights Analytics Client Initialization
aa("init", { appId, apiKey, useCookie: true });
// Set token for both Authenticated or unauthenticated users.
// aa('setUserToken', 'ma-user-999');

// Insights Client
export const insightsClient = aa;

// create and export middleware
export const insightsMiddleware = createInsightsMiddleware({ insightsClient: aa });

// Configure your indices here
export const searchConfig = preProcessConfig({
  catalogId: "products",
  catalogLabel: "All Products",
  recordsIndex: "prod_ECOM",
  nonResultsIndex: "prod_ECOM",
  querySuggestionsIndex: "prod_ECOM_query_suggestions",
  extraSortByIndices: [
    { label: 'Price (asc)', value: 'prod_ECOM_price_asc' },
    { label: 'Price (desc)', value: 'prod_ECOM_price_desc' }
  ],
  // The URL used for the search results page.
  searchPagePath: "/algolia/search",
  autocompleteTags: {
    recordsSearch: ['autocomplete-search'],
    nonResults: ['autocomplete-non-results'],
  },
  instantSearchTags: {
    recordsSearch: ['ais-results-page', 'test-facets-sort'],
    nonResults: ['ais-non-results-page', 'test-facets-sort'],
  },
  attributeLabels: {
    'price.value': 'Price',
    'hierarchical_categories': "Catalog",
    'color.original_name': 'Colors',
    'price.on_sales': 'Promos',
    'reviews.rating': 'Avg. Customer Review'
  }
});

// Export channel subscription
export const pubsub = PubSub;
// Constant for Events pub-sub
export const QUERY_UPDATE_EVT = "QUERY_UPDATE_EVT";

/**
 * Advance Algolia client config overrider.
 * @param {*} clientBase
 * @returns
 */
function clientProxy(clientBase) {
  return {
    search(requests) {
      const refinedRequests = requests.map(request => {
        // Get the non-results query from instant search and remove the instantSearch inherited tags
        if (request.indexName == searchConfig.noResultsIndex && request.params && request.params.ruleContexts) {
          const isNonResultsTagged = request.params.ruleContexts.find(context => searchConfig.instantSearchTags.nonResults.includes(context));
          if (isNonResultsTagged) {
            request.params.ruleContexts = request.params.ruleContexts.filter(context => {
              return !searchConfig.instantSearchTags.recordsSearch.includes(context);
            })
          }
        }
        return request;
      })
      return clientBase.search(refinedRequests);
    }
  };
}

/**
 * Configure overrides.
 * Used in this case to inject catalog page filter
 */
export function overrideConfig(initialConfig) {
  console.log(window.location.pathname)
  const currentPath = window.location.pathname;
  // Detecting Catalog Page
  if (currentPath.startsWith('/catalog/')) {
    // Simple parser for example purposes
    const pathSections = currentPath.split('/')
    const category = (pathSections[2].charAt(0).toUpperCase() + pathSections[2].slice(1)).split('.')[0];

    initialConfig['filters'] = initialConfig.filters ? `${initialConfig.filters} AND category_page_id:'${category}'` : `category_page_id:'${category}'`;
    console.log('initalConfig.filters', initialConfig.filters)
  }
  return initialConfig;
}

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
  return attribute;
}