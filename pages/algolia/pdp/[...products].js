import { getInfoForAfterEvents, insightsClient, searchClient, searchConfig } from "../../../lib/algoliaConfig";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Rating from "../../../components/algolia/Rating";

export async function getServerSideProps({ query }) {
  const { products } = query;
  const objectId = products.pop();

  const index = searchClient.initIndex(searchConfig.recordsIndex);
  const product = await index.getObject(objectId);


  return {
    props: {
      hit: product
    }
  }
}

/**
 * Product Detail Page
 * @param {} param0
 * @returns
 */
function ProductDetailPage({ hit }) {

  const handleConvertionAfterSearch = () => {
    const storedInfo = getInfoForAfterEvents();
    if (storedInfo && storedInfo.queryId) {
      insightsClient('convertedObjectIDsAfterSearch', {
        index: storedInfo.indexName,
        eventName: 'pdp_add_to_cart',
        queryID: storedInfo.queryId,
        objectIDs: storedInfo.objectIDs
      });
    }
  }

  const handleClickAfterSearch = () => {
    const storedInfo = getInfoForAfterEvents();
    if (storedInfo && storedInfo.queryId) {
      insightsClient('clickedObjectIDsAfterSearch', {
        index: storedInfo.indexName,
        eventName: 'pdp_click',
        queryID: storedInfo.queryId,
        objectIDs: storedInfo.objectIDs,
        positions: storedInfo.positions,
      });
    }
  }
  if (!hit.productHoverImageUrl) {
    hit.productHoverImageUrl = hit.productImageUrl;
  }
  return (
    <>
      <div className="pdp-hit">
        <div className="pdp-hit-content">
          <div className="pdp-note">
            <p>Products data shoudln't come from Algolia. We are using <strong>getObject()</strong> for demo purposes. Don't use this approach in production.</p>
          </div>
          <div>
            <h1>{hit.productTitle}</h1>
            <h2>{hit.attributes.brand}</h2>
          </div>
          <div className="pdp-hit-pictures">
            <Carousel showArrows={true} showThumbs={true} axis={"horizontal"} centerMode="false" autoPlay={true} emulateTouch={true} onClickItem={handleClickAfterSearch} onClickThumb={handleClickAfterSearch}>
              {[hit.productImageUrl, hit.productHoverImageUrl].filter(u => u.length ).map((url, index) => (
                <div key={index}>
                  <img src={url} alt={`Image ${index}`} />
                  <p className="legend">{hit.currPrice.displayPrice}</p>
                </div>
              ))}
            </Carousel>
          </div>
          <div className="pdp-hit-type">
            <Rating value={hit.averageRating} />
          </div>
          <div className="pdp-hit-type">
            <span>{hit.invType} {hit.attributes['Color Family'] ? `(${hit.attributes['Color Family']})` : ""}</span>
          </div>
          <p className='product-actions'>
            <button className="conversion-btn"
              onClick={(ev) => {
                handleConvertionAfterSearch();
              }}>Add to cart</button>
          </p>
        </div>
      </div>
    </>

  );
}

export default ProductDetailPage;