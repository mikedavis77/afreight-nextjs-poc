import { useRefinementList } from 'react-instantsearch';
import { friendlyAttributeName } from '../../lib/algoliaConfig';


export function MinItemsRefinmentList(props) {
  const { minItems, attribute } = props;
  const {
    items,
    refine,
    sendEvent,
  } = useRefinementList(props);

  if (minItems >= items.length) {
    return <></>
  }
  return (
    <div attribute={attribute} className="is-facet">
      <h3 className="is-facet__label">{friendlyAttributeName(attribute).toUpperCase()}</h3>
      <div className='ais-RefinementList'>
        <ul className='ais-RefinementList-list'>
          {items.map(item => (
            <li key={item.label} className={`ais-RefinementList-item ${item.isRefined ? 'ais-RefinementList-item--selected' : ''}`}>
              <label className="ais-RefinementList-label">
                <input
                  className='ais-RefinementList-checkbox'
                  type="checkbox"
                  checked={item.isRefined}
                  onChange={() => {
                    console.log(item);
                    sendEvent('click', item.value);
                    refine(item.value);
                  }}
                />
                <span className='ais-RefinementList-labelText'>{item.label}</span>
                <span className='ais-RefinementList-count'> ({item.count})</span>
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}