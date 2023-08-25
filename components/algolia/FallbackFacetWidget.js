import { HierarchicalMenu, RefinementList } from "react-instantsearch-hooks-web";
import { friendlyAttributeName } from "../../lib/algoliaConfig";


/**
 * Use this widget to render your facets
 * @param {*} props
 * @returns
 */
export function FallbackFacetWidget(props) {
  const { attributes, attribute } = props;
  if (attributes) {
    return <div attributes={attributes} className="is-facet">
      <h3 className="is-facet__label">{friendlyAttributeName(attributes[0]).toUpperCase()}</h3>
    <HierarchicalMenu {...props} />
    </div>
  }

  if (attribute && !attribute.includes('.lvl')) {
    return <div attribute={attribute} className="is-facet">
      <h3 className="is-facet__label">{friendlyAttributeName(attribute).toUpperCase()}</h3>
      <RefinementList {...props} />
    </div>
  }
}

/**
 * Use this function to modify the way in which your facets are rendered
 * (For exmaple removing empty facets)
 */
export function transformDynamicFacets(items, props) {
  console.log('results', props)
  return items;
}