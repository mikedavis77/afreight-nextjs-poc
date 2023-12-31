import { useContext, useMemo } from "react";
import { Breadcrumb, ClearRefinements, CurrentRefinements, DynamicWidgets, RangeInput, SortBy, ToggleRefinement, useSearchBox } from "react-instantsearch";
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
import { QUERY_UPDATE_EVT, insightsConfig, pubsub, searchClient, searchConfig } from "../../lib/algoliaConfig";
import { HitComponent } from "./HitComponent";
import { CategoryPageSuggestions } from "./CategoryPageSuggestions";
import { RatingMenu } from "./RatingMenu";
import { FacetWidgetPanel, FacetWidgetPanelAF, FallbackFacetWidget, transformDynamicFacets } from "./DynamicFacetsWidgets";
import { SearchContext } from "./Layout";
import NearBytoggle from "./NearbyToggle";
import AlgoliaColorFamily from "./AlgoliaColorFamily";

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

// /**
//  * Insights Middleware for events propagation.
//  * @returns
//  */
// export function InsightsMiddleware() {
//   const { addMiddlewares } = useInstantSearch();

//   useEffect(() => {
//     return addMiddlewares(insightsMiddleware);
//   }, [addMiddlewares]);

//   return null;
// }


/**
 * Returns the hierarchical menu
 * @param {*} extraSearchParams
 * @returns
 */
function calculateRoot(extraSearchParams) {
  const filter = extraSearchParams.filters ? extraSearchParams.filters.replace('categoryPageId:', '').replace(/'/g, '') : null;
  if (filter) {
    const parts = filter.split(' > ');
    if (parts.length >= 1) {
      return parts[0];
    }
    return filter.toLowerCase();
  }
  return filter;
}

/**
 * Main InstantSearch results component (receives query from Autocomplete Search Bar).
 */
export const InstantSearchResults = ({ routing, extraSearchParams = {}, skipGeo = false }) => {
  // Obtain GeoLocation from website
  const { selectedGeo, geoLocationRadius } = useContext(SearchContext);
  let geoOverrides = { aroundLatLng: `${selectedGeo.lat}, ${selectedGeo.long}`, aroundRadius: geoLocationRadius };
  if (skipGeo) {
    geoOverrides = false;
  }

  //aroundLatLng={`${selectedGeo.lat}, ${selectedGeo.long}`}
  return (
    <div className="search-is">
      <span className="search-is__app-id">
        {`<InstantSearch App> (${searchConfig.recordsIndex})`}{" "}
      </span>

      <InstantSearch
        searchClient={searchClient}
        indexName={searchConfig.recordsIndex}
        routing={routing}
        insights={insightsConfig}
      >
        <Breadcrumb
          attributes={[
            'hierarchicalCategories.lvl0',
            'hierarchicalCategories.lvl1',
            'hierarchicalCategories.lvl2',
            'hierarchicalCategories.lvl3',
          ]}
        />
        <Configure {...extraSearchParams} hitsPerPage={24} analyticsTags={['web-search']} {...geoOverrides} />
        <CustomSearchBox indexId={searchConfig.recordsIndex} />
        <CategoryPageSuggestions router={routing} />
        <main>
          <div className="menu">
            <DynamicWidgets facets={['*']} fallbackComponent={FallbackFacetWidget} transformItems={transformDynamicFacets}>
              <FallbackFacetWidget
                attributes={[
                  "hierarchicalCategories.lvl0",
                  "hierarchicalCategories.lvl1",
                  "hierarchicalCategories.lvl2",
                  "hierarchicalCategories.lvl3",
                ]}
                separator=" > "
                showMore={true}
                rootPath={calculateRoot(extraSearchParams)}
              />
              <FacetWidgetPanel attribute={"currPrice.price"}>
                <RangeInput attribute="currPrice.price" />
              </FacetWidgetPanel>
              <FacetWidgetPanel attribute={"customAttributes.depth"}>
                <RangeInput attribute="customAttributes.depth" />
              </FacetWidgetPanel>
              <FacetWidgetPanel attribute={"customAttributes.capacity"}>
                <RangeInput attribute="customAttributes.capacity" />
              </FacetWidgetPanel>
              <FacetWidgetPanel attribute={"customAttributes.height"}>
                <RangeInput attribute="customAttributes.height" />
              </FacetWidgetPanel>
              <FacetWidgetPanel attribute={"customAttributes.width"}>
                <RangeInput attribute="customAttributes.width" />
              </FacetWidgetPanel>
              <FacetWidgetPanel attribute={"customAttributes.Mattress Thickness"}>
                <RangeInput attribute="customAttributes.Mattress Thickness" />
              </FacetWidgetPanel>
              <FacetWidgetPanelAF attribute={"attributes.Color Family"}>
                <AlgoliaColorFamily attribute={"attributes.Color Family"} />
              </FacetWidgetPanelAF>
              <FacetWidgetPanel attribute={"averageRating"}>
                <RatingMenu attribute="averageRating" />
              </FacetWidgetPanel>

              <FacetWidgetPanel attribute={"openBox"}>
                <ToggleRefinement attribute="openBox" />
              </FacetWidgetPanel>

            </DynamicWidgets>
          </div>
          <div className="results">
            <div className="ais-extra-filters">
              <div className="ais-near-by">
                <NearBytoggle label="Near By Only: " />
              </div>
              <div className="ais-sort-by">
                <span>Sort By:</span>
                <SortBy items={searchConfig.sortByIndices} />
              </div>
            </div>
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

