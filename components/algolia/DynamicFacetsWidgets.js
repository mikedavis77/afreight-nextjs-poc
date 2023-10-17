import  { HierarchicalMenu, RefinementList } from "react-instantsearch";
import { friendlyAttributeName } from "../../lib/algoliaConfig";
import { MinItemsRefinmentList } from "./MinItemsRefinmentList";

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
  else if (!attribute.includes('hierarchical')) {
    return <MinItemsRefinmentList {...props} minItems={4}/>
  }

  return <></>;
}

/**
 * Use this function to modify the way in which your facets are rendered
 * (For exmaple removing empty facets)
 */
export function transformDynamicFacets(items, {results}) {
  const filteredFacets = items.filter(facet => {
    if (facet.includes('hierarchicalCategories')) {
      return true;
    }
    // Only show facets that have results
    return Object.keys(results._rawResults[0].facets).some((facetObj) => {
      return facet.includes(facetObj);
    })

  });
  return filteredFacets;
}

/**
 * Function that adds a label when rendering a facet widget.
 * @param {*} param0
 * @returns
 */
export function FacetWidgetPanel({attribute, children}) {
  return <div attribute={attribute} className="is-facet">
    <h3 className="is-facet__label">{friendlyAttributeName(attribute).toUpperCase()}</h3>
    {children}
  </div>
}