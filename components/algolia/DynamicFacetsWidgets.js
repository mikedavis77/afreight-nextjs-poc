import { HierarchicalMenu, RefinementList, useConnector } from "react-instantsearch";
import { friendlyAttributeName } from "../../lib/algoliaConfig";
import { MinItemsRefinmentList } from "./MinItemsRefinmentList";
import { useState } from "react";
import connectRange from 'instantsearch.js/es/connectors/range/connectRange';
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
    return <MinItemsRefinmentList {...props} minItems={2} />
  }

  return <></>;
}

/**
 * Use this function to modify the way in which your facets are rendered
 * (For exmaple removing empty facets)
 */
export function transformDynamicFacets(items, { results }) {
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
export function FacetWidgetPanel({ attribute, children }) {
  return <div attribute={attribute} className="is-facet">
    <h3 className="is-facet__label">{friendlyAttributeName(attribute).toUpperCase()}</h3>
    {children}
  </div>
}
/**
 * AFreight panel function
 * @param {} param0
 * @returns
 */

export function FacetWidgetPanelAF({ attribute, children }) {
  const [expanded, expandedSetter] = useState(true);

  if (
    attribute === 'customAttributes.depth' ||
    attribute === 'customAttributes.capacity' ||
    attribute === 'customAttributes.height' ||
    attribute === 'customAttributes.width' ||
    attribute === 'customAttributes.Mattress Thickness'
  ) {
    const { canRefine } = useConnector(connectRange, {
      attribute,
    });

    if (!canRefine) {
      return <></>;
    }
  }
  return (
    <li className="is-facet block leading-loose">
      <button
        id={`id-${attribute}`}
        className="block w-full text-left p-2 border-gray-300 border-b border-t hover:bg-gray-100"
        aria-expanded={expanded}
        aria-controls={`facet-group--${attribute}`}
        onClick={() => expandedSetter(!expanded)}
      >
        <span translate="no">{friendlyAttributeName(attribute)}</span>
        <i
          className={`float-right pt-2 fas ${expanded ? 'fa-minus' : 'fa-plus'
            }`}
          aria-hidden="true"
        />
      </button>
      {expanded && (
        <div
          role="group"
          aria-labelledby={`facet-group--${attribute}`}
          id={`facet-group--${attribute}`}
          className="bg-slate-50 p-2 leading-loose"
        >
          {children}
        </div>
      )}
    </li>
  );
}
