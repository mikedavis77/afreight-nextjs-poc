import { useRefinementList } from 'react-instantsearch';

export function MinItemsRefinmentList(props) {
  const {
    minItems,
    items,
    refine,
    sendEvent,
  } = useRefinementList(props);

  // Hide facet
  if (minItems > items.length) {
    return <></>
  }

  return (
    <div className='ais-RefinementList'>
      <ul className='ais-RefinementList-list'>
        {items.map(item => (
          <li key={item.label} className='ais-RefinementList-item'>
            <label className="ais-RefinementList-label">
              <input
                className='ais-RefinementList-checkbox'
                type="checkbox"
                checked={item.isRefined}
                onChange={() => {
                  sendEvent('click', item.value);
                  refine(item.value);
                }
                }
              />
              <span className='ais-RefinementList-labelText'>{item.label}</span>
              <span className='ais-RefinementList-count'> ({item.count})</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}