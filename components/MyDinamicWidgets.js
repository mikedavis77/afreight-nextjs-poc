import { HierarchicalMenu, RefinementList, useDynamicWidgets, useHierarchicalMenu, useRefinementList } from "react-instantsearch-hooks-web";
import PriceRangePicker from './PriceRangePicker';

/**
 * Main Dynamics widget
 * @param {*} param0
 * @returns
 */
export const MyDynamicWidgets = () => {
  // Get all the Available refinements and render them.
  const { attributesToRender } = useDynamicWidgets({ facets: ['*'] });

  // Get all the Available refinements and render them.
  let hierarchicalAdded = false;
  // Array to collect the rendering facets objects.
  const organizedFacets = [
  ];
  // Iterates over active Facets and loads the corresponding React Component
  const attributesToRenderTemp = [
    "skuProperties.hierarchicalCategories.lvl0",
    "skuProperties.hierarchicalCategories.lvl1",
    "skuProperties.hierarchicalCategories.lvl2",
    "skuProperties.hierarchicalCategories.lvl3",
    "skuProperties.hierarchicalCategories.lvl4",
    "skuProperties.attributes.marca",
    "skuProperties.seller.sellerName",
    "skuProperties.prices.brlDefault.salePrice",
    "skuProperties.prices.ptsDefault.salePrice"
  ];
  attributesToRenderTemp.forEach((facetName, index) => {
    if (facetName.startsWith('skuProperties.hierarchicalCategories')) {
      if (!hierarchicalAdded) {
        hierarchicalAdded = true;
        organizedFacets.push({
          attributes: [
            'skuProperties.hierarchicalCategories.lvl0',
            'skuProperties.hierarchicalCategories.lvl1',
            'skuProperties.hierarchicalCategories.lvl2',
            'skuProperties.hierarchicalCategories.lvl3'
          ],
          type: HierarchicalMenuWrapper,
          title: 'Categories',
          key: `${facetName}`,
          rootPath: null,
        });
      }
    }

    // skuProperties.prices.brlDefault.salePrice case
    else if (facetName === 'skuProperties.prices.brlDefault.salePrice') {
      organizedFacets.push({
        attribute: facetName, type: PriceRangePicker, title: 'Price ($)', key: `${facetName}`
      });
    }
    // skuProperties.prices.ptsDefault.salePrice
    else if (facetName === 'skuProperties.prices.ptsDefault.salePrice') {
      organizedFacets.push({
        attribute: facetName, type: PriceRangePicker, title: 'Price (points)', key: `${facetName}`
      });
    }

    // Disjunctive facets
    else if (['cor', 'marca'].includes(facetName.split('.').pop())) {
      organizedFacets.push({
        attribute: facetName,
        type: RefinementList,
        title: `${facetName.split('.').pop()}`,
        key: `${facetName}-${index}`,
        searchable: true,
        searchablePlaceholder: `${facetName.split('.').pop()}`,
      });
    }
    // add more cases
    else if (!facetName.startsWith('skuProperties.hierarchicalCategories')) {
      organizedFacets.push({
        attribute: facetName, type: RefinementListWrapper, title: `${facetName.split('.').pop()} (single)`, key: `${facetName}-${index}`, operator: 'and'
      });
    }
  });
  return <div className='facets-container'>
    {organizedFacets.map(facet => {
      const DynamicComponent = facet.type;
      const facetProps = { ...facet };
      delete facetProps.type;
      return <DynamicComponent {...facetProps} key={facet.key} />
    })}
  </div>
}

const RefinementListWrapper = (props) => {
  const {
    items,
  } = useRefinementList(props);
  return <div className="facet">
    {items.length > 0 && <span className="facet-name">{props.title}</span>}
    <RefinementList {...props} />
  </div>
}

const HierarchicalMenuWrapper = (props) => {
  return <div className="facet">
    <span className="facet-name">{props.title}</span>
    <HierarchicalMenu {...props} />
  </div>
}