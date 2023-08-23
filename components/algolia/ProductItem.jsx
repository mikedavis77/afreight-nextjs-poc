export function ProductItem({ hit, components, navigator }) {
  return (
    <div className="aa-ItemWrapper" onClick={() => {
      console.log('Here you can redirect to your item url...');
      // Use navigator to make sure Algolia sends the corresponding click events.
      alert(`Triggering Navigation to ${hit.url}`);
      navigator.navigate({ itemUrl: hit.url });
    }}>
      <div className="aa-ItemContent">
        <div className="aa-ItemIcon aa-ItemIcon--picture aa-ItemIcon--alignTop">
          <img src={hit.image_urls[0]} alt={hit.name} width="40" height="40" />
        </div>

        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <components.Highlight hit={hit} attribute="name" />
          </div>
          <div className="aa-ItemContentDescription">
            By <strong>{hit.brand}</strong> in{' '}
            {/* <strong>{hit.categories[0]}</strong> */}
          </div>
        </div>
      </div>
    </div>
  );
}