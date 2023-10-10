import { Highlight } from "react-instantsearch";
import { searchConfig, storeInfoForAfterEvents } from "../../lib/algoliaConfig";
import singletonRouter from 'next/router';
import Rating from "./Rating";
import { useContext } from "react";
import { SearchContext } from "./Layout";
import { calculateDistance } from "../../lib/common";

/**
 * Shows the variants info in the console.
 * @param {*} variants
 */
function extractVariantsInfo(variants, hit) {
  // Find corrresponding tab
  if (hit.boxCondition === "Open-Box") {
    const newVariant = variants.find(variant => {
      return variant.boxCondition === "New";
    })
    if (newVariant) {
      console.log('ProductTab(New)', newVariant);
    } else {
      console.log('No ProductTab(New)');
    }
  } else {
    const newVariant = variants.find(variant => {
      return variant.boxCondition === "Open-Box";
    })
    if (newVariant) {
      console.log('ProductTab(Open-Box))', newVariant);
    } else {
      console.log('No ProductTab(Open-Box)');
    }
  }
  // Extract colors
  let colors = {};
  // Add hit color
  if (hit.colorCodeMap) {
    Object.keys(hit.colorCodeMap).forEach(color => {
      // preserving order as they come sorted by distance
      if (!Object.keys(colors).includes(color)) {
        colors[color] = {
          color: color,
          colorCode: hit.colorCodeMap[color],
          url: hit.productUrl
        }
      }
    });
  }
  variants.forEach(variant => {
    if(variant.colorCodeMap) {
      Object.keys(variant.colorCodeMap).forEach(color => {
        // preserving order as they come sorted by distance
        if (!Object.keys(colors).includes(color)) {
          colors[color] = {
            color: color,
            colorCode: variant.colorCodeMap[color],
            url: variant.productUrl
          }
        }
      })
    }
  });
  if (Object.keys(colors).length > 1) {
    console.log('Colors', colors)
  } else {
    console.log('No other colors found');
  }
}

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
        <span> ${`${hit.currPrice.dollars}.${hit.currPrice.cents}`}</span>
      </div>
      <div className="hit-description">
      </div>
      <p className='product-actions'>
        <button className="variants-btn" onClick={() => extractVariantsInfo(hit._variants, hit)}>{`Variants (${hit._variants.length})`
        }</button>
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
