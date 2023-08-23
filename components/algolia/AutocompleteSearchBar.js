import {
  autocomplete,
  getAlgoliaResults,
} from "@algolia/autocomplete-js";

import React, { createElement, Fragment, useEffect, useRef } from 'react';
import { createLocalStorageRecentSearchesPlugin } from "@algolia/autocomplete-plugin-recent-searches";
import { createQuerySuggestionsPlugin } from "@algolia/autocomplete-plugin-query-suggestions";
import "@algolia/autocomplete-theme-classic";
import { ProductItem } from "./ProductItem";
import { createAlgoliaInsightsPlugin } from "@algolia/autocomplete-plugin-algolia-insights";
import { getQueryParam, updateUrlParameter } from "../../lib/common";
import { createRoot } from 'react-dom/client';
import { searchConfig, insightsClient, searchClient, pubsub, QUERY_UPDATE_EVT } from "../../lib/algoliaConfig";

// Recent Search Plugin
const recentSearchesPlugin = createLocalStorageRecentSearchesPlugin({
  key: "navbar",
  limit: 3,
});

/**
 * Auotomplete Search Bar
 */
export function AutocompleteSearchBar() {

  // Load default catalog
  const containerRef = useRef(null);
  const panelRootRef = useRef(null);
  const rootRef = useRef(null);

  // Query Suggestions Plugin (variates depending on the selected Index)
  const querySuggestionsPlugin = createQuerySuggestionsPlugin({
    searchClient,
    // Index Name changes based on the dropdown selection
    indexName: searchConfig.querySuggestionsIndex,
    getSearchParams() {
      return {
        hitsPerPage: 3,
      };
    },
  });

  // This Plugin has more options in case you want to forward events to GA4 etc.
  const algoliaInsightsPlugin = createAlgoliaInsightsPlugin({ insightsClient: insightsClient })

  // Rendering autocomplete after component mounts
  useEffect(() => {
    if (!containerRef.current) {
      return undefined;
    }
    const autocompleteInstance = autocomplete({
      container: containerRef.current,
      renderer: { createElement, Fragment, render: () => { } },
      render({ children }, root) {
        if (!panelRootRef.current || rootRef.current !== root) {
          rootRef.current = root;

          panelRootRef.current?.unmount();
          panelRootRef.current = createRoot(root);
        }

        panelRootRef.current.render(children);
      },
      openOnFocus: true,
      insights: true,
      placeholder: "Search for Products",
      onSubmit({ state }) {
        updateUrlParameter(`${searchConfig.recordsIndex}[query]`, state.query);

        // Validate if you are in the searchPage (Otherwise redirect using q param)
        if (window.location.pathname !== searchConfig.searchPagePath) {
          window.location.href = `${searchConfig.searchPagePath}?${searchConfig.recordsIndex}[query]=${state.query}`;
        } else {
          pubsub.publish(QUERY_UPDATE_EVT, {
            query: state.query,
            index: searchConfig.recordsIndex,
          });
        }
      },
      plugins: [
        querySuggestionsPlugin,
        recentSearchesPlugin,
        algoliaInsightsPlugin,
      ],
      getSources({ query }) {
        return [
          {
            sourceId: "products",
            getItems() {
              return getAlgoliaResults({
                searchClient,
                queries: [
                  {
                    // Index Name changes based on the dropdown selection
                    indexName: searchConfig.recordsIndex,
                    query,
                    params: {
                      hitsPerPage: 3,
                      analyticsTags: ['web-autocomplete']
                    },
                  },
                ],
              });
            },
            templates: {
              item({ item, components }) {
                return (
                  <ProductItem
                    hit={item}
                    components={components}
                    navigator={autocompleteInstance.navigator}
                  />
                );
              },
              noResults() {
                return "No products matching.";
              },
            },
          },
        ];
      },
    });
    // Set the query value if available in url (doesn't trigger a search)
    if (getQueryParam(`${searchConfig.recordsIndex}[query]`) !== "") {
      autocompleteInstance.setQuery(getQueryParam(`${searchConfig.recordsIndex}[query]`));
    }
    return () => {
      autocompleteInstance.destroy();
    };
    // Refresh when The index is switched
  });

  return (
    <div id="search-bar" className="search-bar">
      <span className="search-bar__app-id">{`<Search Bar App>`}</span>
      <div ref={containerRef} className="search-bar__search-autocomplete" />
    </div>
  );
}

