import { Highlight } from "react-instantsearch";
import { searchConfig, storeInfoForAfterEvents } from "../../lib/algoliaConfig";
import singletonRouter from 'next/router';

export const HitComponent = ({ hit, sendEvent }) => {
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
    <div className="hit-picture" onClick={() => handleObjectClick(hit)}>
      <img src={`${hit.stockimage}`} alt={hit.produtName} width={100} height={100} />
    </div>
    <div className="hit-content">
      <div className="aa-ItemId" onClick={() => handleObjectClick(hit)}>{hit.objectID}</div>
      <div>
        <Highlight attribute="produtName" hit={hit} onClick={() => handleObjectClick(hit)} />
      </div>
      <div className="hit-type">
        <span>Store: {hit.storeId}</span>
      </div>
      <div className="hit-type">
        <span>Condition: {hit.invType}</span>
      </div>
      <div className="hit-description">
        {/* <span> - {hit.rating} stars</span> */}
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
