import { Highlight } from "react-instantsearch";
import { searchConfig, storeInfoForAfterEvents } from "../../lib/algoliaConfig";
import singletonRouter from 'next/router';
import Rating from "./Rating";
import { useContext } from "react";
import { SearchContext } from "./Layout";
import { calculateDistance } from "../../lib/common";

/**
 * Hit component used to render product cards (InstantSearch).
 * @param {*} param0
 * @returns
 */
export const HitComponent = ({ hit, sendEvent }) => {
  const { selectedGeo } = useContext(SearchContext);
  const distance = calculateDistance(selectedGeo.lat, selectedGeo.long, hit._geoloc.lat, hit._geoloc.lng);
  function handleObjectClick(item) {
    if (typeof document !== 'undefined') {
      storeInfoForAfterEvents({
        queryId: item.__queryID,
        objectIDs: [item.objectID],
        positions: [item.__position],
        indexName: item.__indexName,
      });
      singletonRouter.push(`${searchConfig.productPdpPathPrefix}/${item.slug}/${item.objectID}`)
    }
  }
  return (<div className="hit">
    {distance * 1609 < searchConfig.geoLocationRadius  && <span className="nearby-flag">Near by</span>}
    <div className="hit-picture" onClick={() => handleObjectClick(hit)}>
      <img src={`${hit.stockimage}`} alt={hit.produtName} width={100} height={100} />
    </div>
    <div className="hit-content">
      <div className="aa-ItemId" onClick={() => handleObjectClick(hit)}>{hit.objectID}</div>
      <div>
        <Highlight attribute="produtName" hit={hit} onClick={() => handleObjectClick(hit)} />
      </div>
      <div className="hit-type">
        <Rating value={hit.averageRating} />
      </div>
      <div className="hit-type">
        <span>Store: {hit.storeId}</span>
      </div>
      <div className="hit-type">
        <span>Condition: {hit.invType}</span>
      </div>
      <div className="hit-description">
        <span> Distance: {parseFloat(distance).toFixed(2)} mi</span>
      </div>
      <div className="hit-description">
        <span> ${hit.salePrice}</span>
      </div>
      <p className='product-actions'>
        <button className="conversion-btn"
          onClick={(ev) => {
            ev.preventDefault();
            sendEvent('conversion', hit, 'Product Ordered');
            ev.stopPropagation();
          }}>Add to cart</button>
      </p>
    </div>
  </div>)
};
