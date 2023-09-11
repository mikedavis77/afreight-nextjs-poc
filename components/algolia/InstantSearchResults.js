import { useMemo } from "react";
import { ClearRefinements, CurrentRefinements, DynamicWidgets, useSearchBox } from "react-instantsearch";
import {
  Hits,
  Configure,
  Pagination,
  InstantSearch,
} from "react-instantsearch";

// Include only the reset
import "instantsearch.css/themes/reset.css";
// or include the full Satellite theme
import "instantsearch.css/themes/satellite.css";
import { QUERY_UPDATE_EVT, insightsClient, pubsub, searchClient, searchConfig } from "../../lib/algoliaConfig";
import { FallbackFacetWidget, transformDynamicFacets } from "./FallBackFacetWidget";
import { HitComponent } from "./HitComponent";
import { CategoryPageSuggestions } from "./CategoryPageSuggestions";

/**
 * Virtual SearchBox that receives updates from Autocomplete
 * @param props
 * @returns
 */
function CustomSearchBox({ indexId }) {
  const { refine } = useSearchBox();
  useMemo(() => {
    // Listen to the propagated events and update the app
    pubsub.subscribe(QUERY_UPDATE_EVT, (_msg, data) => {
      if (data.index === indexId) {
        refine(data.query);
      }
    });
  }, [indexId]);

  return <></>;
}

/**
 * Main InstantSearch results component (receives query from Autocomplete Search Bar).
 */
export const InstantSearchResults = ({ routing, extraSearchParams={} }) => {
  // Adding a Search Proxy to make sure only tagged requests are being executed
  // https://www.algolia.com/doc/guides/building-search-ui/going-further/conditional-requests/js/
  const searchClientMod = {
    ...searchClient,
    search(requests) {
      return new Promise((resolve, reject) => {
        // All requests should have clickAnalytics at this point
        if (requests[0].params && requests[0].params.analyticsTags) {
          return searchClient.search(requests).then((res) => {
            console.log('****** [Moment Resolving Search Client]')
            resolve(res);
          });
        } else {
          return {
            results: {
              hits: []
            }
          }
        }

      });

    },
  };

  return (
    <div className="search-is">
      <span className="search-is__app-id">
        {`<InstantSearch App> (${searchConfig.recordsIndex})`}{" "}
      </span>
      <InstantSearch
        searchClient={searchClientMod}
        indexName={searchConfig.recordsIndex}
        //routing={customRouter}
        routing={routing}
        insights={{
          insightsClient: insightsClient,
          insightsInitParams: {
            useCookie: false,
          },
        }}
      >
        <Configure {...extraSearchParams} hitsPerPage={24} analyticsTags={['web-search']} />
        <CustomSearchBox indexId={searchConfig.recordsIndex} />
        <CategoryPageSuggestions router={routing} />
        <main>
          <div className="menu">
            <DynamicWidgets facets={['*']} fallbackComponent={FallbackFacetWidget} transformItems={transformDynamicFacets}>
              <FallbackFacetWidget
                attributes={[
                  "hierarchical_categories.lvl0",
                  "hierarchical_categories.lvl1",
                  "hierarchical_categories.lvl2",
                  "hierarchical_categories.lvl3",
                ]}
                separator=" > "
                showMore={true}
              />
            </DynamicWidgets>
          </div>
          <div className="results">
            <div className="refinements-container">
              <CurrentRefinements transformItems={(items) => {
                return items.map((item) => {
                  if (item.label.includes('hierarchical_categories')) {
                    item.label = 'Category';
                  }
                  return item;
                })
              }} />
              <ClearRefinements />
            </div>
            <Hits hitComponent={HitComponent} />
            <Pagination />
          </div>
        </main>
      </InstantSearch>
    </div>
  );
};

