import { Highlight } from 'react-instantsearch-hooks-web';

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
        <Highlight attribute="type" hit={hit} />
      </div>
      <div className="hit-description">
        {/* <span> - {hit.rating} stars</span> */}
        <span> - ${hit.price.value}</span>
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
