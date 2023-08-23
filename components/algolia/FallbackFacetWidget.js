import { HierarchicalMenu, RefinementList } from "react-instantsearch-hooks-web";
import { friendlyAttributeName } from "../../lib/algoliaConfig";

export function FallbackFacetWidget(props) {
  const { attributes, attribute } = props;

  if (attributes) {
    return <div {...props} className="is-facet">
      <h3 className="is-facet__label">{friendlyAttributeName(attributes[0]).toUpperCase()}</h3>
    <HierarchicalMenu {...props} />
    </div>
  }

  if (attribute && !attribute.includes('.lvl')) {
    return <div {...props} className="is-facet">
      <h3 className="is-facet__label">{friendlyAttributeName(attribute).toUpperCase()}</h3>
      <RefinementList {...props} />
    </div>
  }

}