import { useContext } from "react";
import { searchConfig, storeInfoForAfterEvents } from "../../lib/algoliaConfig";
import singletonRouter from 'next/router';
import { SearchContext } from "./Layout";
import { calculateDistance } from "../../lib/common";

export function ProductItem({ hit, components }) {
  const { selectedGeo } = useContext(SearchContext);
  const distance = calculateDistance(selectedGeo.lat, selectedGeo.long, hit._geoloc.lat, hit._geoloc.lng);
  return (
    <div className="aa-ItemWrapper" onClick={() => {
      storeInfoForAfterEvents({
        queryId: hit.__autocomplete_queryID,
        objectIDs: [hit.objectID],
        positons: [hit.__position],
        indexName: hit.__autocomplete_indexName
      });
      singletonRouter.push(`${searchConfig.productPdpPathPrefix}/${hit.slug}/${hit.objectID}`);
    }}>
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop hit">
          <img src={hit.productImageUrl} alt={hit.productTitle} width="40" height="40" />
          {distance * 1609 < searchConfig.geoLocationRadius && <span className="nearby-flag">Near by</span>}
        </div>

        <div className="aa-ItemContentBody">
          <div className="aa-ItemId">{hit.objectID}</div>
          <div className="aa-ItemContentTitle">
            <components.Highlight hit={hit} attribute="productTitle" />
          </div>
          <div className="hit-description">
            <span> Distance: {parseFloat(distance).toFixed(2)} mi</span>
          </div>
        </div>
      </div>
    </div>
  );
}