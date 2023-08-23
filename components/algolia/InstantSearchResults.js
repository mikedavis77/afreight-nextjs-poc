import { useEffect, useState, useMemo } from "react";
import { ClearRefinements, CurrentRefinements, DynamicWidgets, RefinementList, useSearchBox } from "react-instantsearch-hooks-web";
import { history } from 'instantsearch.js/es/lib/routers';
import {
  HierarchicalMenu,
  Hits,
  Configure,
  Pagination,
  InstantSearch,
} from "react-instantsearch-hooks-web";

// import { HitComponent } from "../components/HitComponent";
import { Highlight } from 'react-instantsearch-hooks-web';
// Include only the reset
import "instantsearch.css/themes/reset.css";
// or include the full Satellite theme
import "instantsearch.css/themes/satellite.css";
import { QUERY_UPDATE_EVT, insightsClient, pubsub, searchClient, searchConfig } from "../../lib/algoliaConfig";

const routerBase = history();
const customRouter = {
  ...routerBase,
  createUrl(routeState) {
    const mapping = routerBase.createURL(routeState);
    console.log('mapping', mapping)
    mapping.replace('query', 'term');
    return mapping;
  },
  parseUrl(params) {

    console.log('params', params)
    const url = routerBase.parseUrl(params);
    return url;
  }
}

export const HitComponent = ({ hit, sendEvent }) => (
  <div className="hit">
    <div className="hit-picture">
      <img src={`${hit.image_urls[0]}`} alt={hit.name} width={100} height={100} />
    </div>
    <div className="hit-content">
      <div>
        <Highlight attribute="name" hit={hit} />
      </div>
      <div className="hit-type">
        <Highlight attribute="brand" hit={hit} />
      </div>
      <div className="hit-description">
        <span> ${hit.price.value}</span>
      </div>
      <p className='product-actions'>
        <button className="conversion-btn"
          onClick={() => {
            sendEvent('conversion', hit, 'Product Ordered');
          }}>Add to cart</button>
      </p>
    </div>
  </div>
);

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
        console.log('EXISTE UN LLAMADOOO@@@')
        refine(data.query);
      }
    });
  }, [indexId]);

  return <></>;
}

/**
 * Main InstantSearch results component (receives query from Autocomplete Search Bar).
 */
export const InstantSearchResults = () => {
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

  // Flag to prevent NextJS to execute in server side
  const [clientRender, setClientRender] = useState(false);

  // Using use effect to activate the UI exclusively for client/browser
  useEffect(() => {
    console.log('MAIN INSTANT SEARCH USEEFFECT!!!', clientRender);
    setClientRender(true);
  }, [clientRender])

  // Disabling SSR rendering for NextJS so it emulates a traditional React APP.
  if (!clientRender) {
    return <>
      Not using Server Rendering...
    </>;
  }
  // This will be excuted only via client/browser
  return (
    <div className="search-is">
      <span className="search-is__app-id">
        {`<InstantSearch App> (${searchConfig.recordsIndex})`}{" "}
      </span>
      <InstantSearch
        searchClient={searchClientMod}
        indexName={searchConfig.recordsIndex}
        routing={customRouter}
        insights={{
          insightsClient: insightsClient,
          insightsInitParams: {
            useCookie: false,
          },
        }}
      >
        <Configure hitsPerPage={12} analyticsTags={['web-search']} />
        <CustomSearchBox indexId={searchConfig.recordsIndex} />
        <main>
          <div className="menu">
            <DynamicWidgets facets={['*']}>
              <RefinementList
                attribute="brand"
                classNames={{ root: "brand-facets" }}
              />
              <HierarchicalMenu
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

