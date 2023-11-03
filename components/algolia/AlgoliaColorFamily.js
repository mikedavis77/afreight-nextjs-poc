import { useRefinementList } from 'react-instantsearch';
import { colorCodes } from '../../lib/common';

const AlgoliaColorFamily = (props) => {
  const {
    items,
    // hasExhaustiveItems,
    // createURL,
    refine,
    sendEvent,
    // searchForItems,
    // isFromSearch,
    // canRefine,
    // canToggleShowMore,
    // isShowingMore,
    // toggleShowMore,
  } = useRefinementList(props);

  return (
    <ul attribue={props.attribute}>
      {items.map((item) => {
        return (
          <li key={item.label} className={`ais-RefinementList-item ${item.isRefined ? 'ais-RefinementList-item--selected' : ''}`}>
            {/* <Link href={createURL(item.value)}> */}
            <label className="ais-RefinementList-label">
              <input
                className="ais-RefinementList-checkbox mr-2"
                type="checkbox"
                value={item.value}
                checked={item.isRefined}
                onChange={() => {
                  sendEvent('click', item.value);
                  refine(item.value);
                }}
              />
              <span className="ais-RefinementList-labelText capitalize">
                {item.value}
              </span>

              <span
                className="align-middle ml-1 inline-block rounded-full w-3 h-3 leading-5 border border-black"
                style={{
                  background: colorCodes
                    ? colorCodes[item?.value?.toLowerCase()]
                    : '#fff',
                  width: 15,
                  height: 15,
                }}
              />
              <span className="ais-RefinementList-count ml-2 text-gray-500 border px-2 py-.5 rounded-full hidden">
                {item.count}
              </span>
            </label>
            {/* </Link> */}
          </li>
        );
      })}
    </ul>
  );
};

export default AlgoliaColorFamily;