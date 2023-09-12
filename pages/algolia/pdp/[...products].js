import { searchClient, searchConfig } from "../../../lib/algoliaConfig";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader

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
  return (
    <>
      <div className="pdp-hit">
        <div className="pdp-hit-content">
          <div className="pdp-note">
            <p>Products data shoudln't come from Algolia. We are using <strong>getObject()</strong> for demo purposes. Don't use this approach in production.</p>
          </div>
          <div>
            <h1>{hit.name}</h1>
          </div>
          <div className="pdp-hit-pictures">
            <Carousel showArrows={true} showThumbs={true} axis={"horizontal"} centerMode="false" autoPlay={true} emulateTouch={true}>
              {hit.image_urls.filter(u => u.length ).map((url, index) => (
                <div key={index}>
                  <img src={url} alt={`Image ${index}`} />
                  <p className="legend">${hit.price.value}</p>
                </div>
              ))}
            </Carousel>
          </div>
          <div className="pdp-hit-type">
            <span>{hit.type}</span>
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
      </div>
    </>

  );
}

export default ProductDetailPage;