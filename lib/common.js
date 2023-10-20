import { searchConfig } from "./algoliaConfig";

/**
 * Gets query params from the current URL (Client Side Only)
 */
export function getQueryParam(param) {
  if (typeof window == 'undefined') {
    return '';
  }
  // get the query parameters from the URL
  const urlParams = new URLSearchParams(window.location.search);

  // get the value of the parameter
  const value = urlParams.get(param);
  // if the parameter is not set, return null
  if (value === null) {
    return '';
  } else {
    return value;
  }
}

/**
 * Updates the value of a query param in the URL
 */
export function updateUrlParameter(key, value) {
  // Get the current URL search params
  let searchParams = new URLSearchParams(window.location.search);

  // Update or add the parameter
  searchParams.set(key, value);

  // Build the new URL with the updated search params
  let newUrl = window.location.origin + window.location.pathname + '?' + searchParams.toString();

  // Replace the current URL with the new URL
  window.history.replaceState({ path: newUrl }, '', newUrl);
}

/**
 * Calculate distance
 * @param {*} lat1
 * @param {*} lon1
 * @param {*} lat2
 * @param {*} lon2
 * @param {*} unit
 * @returns
 */
export function calculateDistance(lat1, lon1, lat2, lon2, unit = 'M') {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in miles
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

/**
 * Formats a given string by capitalizing the first letter of each word and replacing hyphens with spaces.
 * @param {string} input - The input string to format.
 * @returns {string} The formatted string.
 * @example
 * const input = "appliances > refrigerators-freezers > french-door-refrigerator";
 * const output = formatString(input);
 * console.log(output); // "Appliances > Refrigerators Freezers > French Door Refrigerator"
 */
export function friendlyCategoryName(input) {
  return input
    .split(">")
    .map(segment =>
      segment
        .trim()
        .split("-")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    )
    .join(" > ");
}

/**
 * External Facets Mapping
 */
const facetMapping = [
  {
    urlComp: 'brand_',
    facet: 'attributes.Brand',
    group: 'refinementList'
  },
  {
    urlComp: 'builtin_',
    facet: 'attributes.Built In',
    group: 'refinementList'
  },
  {
    urlComp: 'cap_',
    facet: 'attributes.br_capacity',
    group: 'refinementList'
  },
  {
    urlComp: 'cc_',
    facet: 'attributes.California Carb Compliance',
    group: 'refinementList'
  },
  {
    urlComp: 'color_',
    facet: 'attributes.Color Family',
    group: 'refinementList'
  },
  {
    urlComp: 'finish_',
    facet: 'attributes.Finish',
    group: 'refinementList'
  },
  {
    urlComp: 'style_',
    facet: 'attributes.Style',
    group: 'refinementList'
  },
  {
    urlComp: 'shape_',
    facet: 'attributes.Shape',
    group: 'refinementList'
  },
  {
    urlComp: 'bedroom_size_',
    facet: 'attributes.Bedroom Size',
    group: 'refinementList'
  },
  {
    urlComp: 'ht_',
    facet: 'attributes.br_height',
    group: 'refinementList'
  },
  {
    urlComp: 'dpth_',
    facet: 'attributes.br_depth',
    group: 'refinementList'
  },
  {
    urlComp: 'wdth_',
    facet: 'attributes.br_width',
    group: 'refinementList'
  },
  {
    urlComp: 'material_',
    facet: 'attributes.Material',
    group: 'refinementList'
  },
  {
    urlComp: 'mattressesComf_',
    facet: 'attributes.Comfort',
    group: 'refinementList'
  },
  {
    urlComp: 'mattressesThickness_',
    facet: 'attributes.Mattress Thickness',
    group: 'refinementList'
  },
  {
    urlComp: 'mattressesType_',
    facet: 'attributes.Mattress Type',
    group: 'refinementList'
  },
  {
    urlComp: 'mattresssize_',
    facet: 'attributes.Size',
    group: 'refinementList'
  },
  {
    urlComp: 'adjustablebasecompatible_',
    facet: 'attributes.Adjustable Base Compatible',
    group: 'refinementList'
  },
  {
    urlComp: 'mattressinabox_',
    facet: 'attributes.Mattress In a Box',
    group: 'refinementList'
  },
  {
    urlComp: 'ada_compliant_',
    facet: 'attributes.ADA Compliant',
    group: 'refinementList'
  },
  {
    urlComp: 'sprice_',
    facet: 'currPrice.price',
    group: 'refinementList'
  },
  {
    urlComp: 'scdepth_',
    facet: 'attributes.Standard or Counter Depth',
    group: 'refinementList'
  },
  {
    urlComp: 'mrating_',
    facet: 'averageRating',
    group: 'refinementList'
  },
  {
    urlComp: 'range_style_',
    facet: 'attributes.Range Style',
    group: 'refinementList'
  },
  {
    urlComp: 'dining_height_',
    facet: 'attributes.Dining Height',
    group: 'refinementList'
  },
  {
    urlComp: 'cl_',
    facet: 'attributes.Control Location',
    group: 'refinementList'
  },
  {
    urlComp: 'dc_',
    facet: 'attributes.Dry Cycles',
    group: 'refinementList'
  },
  {
    urlComp: 'wcycl_',
    facet: 'attributes.Wash Cycles',
    group: 'refinementList'
  },
  {
    urlComp: 'icem_',
    facet: 'attributes.Ice Maker',
    group: 'refinementList'
  },
  {
    urlComp: 'dispensers_',
    facet: 'attributes.Dispensers',
    group: 'refinementList'
  },
  {
    urlComp: 'defrostyp_',
    facet: 'attributes.Defrost System',
    group: 'refinementList'
  },
  {
    urlComp: 'v_',
    facet: 'attributes.Venting',
    group: 'refinementList'
  },
  {
    urlComp: 'em_',
    facet: 'attributes.Exhaust Method',
    group: 'refinementList'
  },
  {
    urlComp: 'inst_',
    facet: 'attributes.Installation',
    group: 'refinementList'
  },
  {
    urlComp: 'otype_',
    facet: 'attributes.Oven Type',
    group: 'refinementList'
  },
  {
    urlComp: 'csurf_',
    facet: 'attributes.Cooking Surface',
    group: 'refinementList'
  },
  {
    urlComp: 'numo_',
    facet: 'attributes.Number Of Ovens',
    group: 'refinementList'
  },
  {
    urlComp: 'nob_',
    facet: 'attributes.Number Of Burners',
    group: 'refinementList'
  },
  {
    urlComp: 'esc_',
    facet: 'attributes.Energy Star Compliant',
    group: 'refinementList'
  },
  {
    urlComp: 'storeitemcond_',
    facet: 'invType',
    group: 'refinementList'
  },
  {
    urlComp: 'tm_',
    facet: 'attributes.Tub Material',
    group: 'refinementList'
  },
  {
    urlComp: 'dis_',
    facet: 'attributes.Dryer Interior Size',
    group: 'refinementList'
  },
  {
    urlComp: 'flt_store_index_search',
    facet: 'storeInfo.storeLocation',
    group: 'refinementList'
  },
  {
    urlComp: 'skuType',
    facet: 'boxCondition',
    group: 'refinementList'
  },
  {
    urlComp: 'skutype',
    facet: 'boxCondition',
    group: 'refinementList'
  },
];

/**
 * Create dictionary for easier transpiling
 */
let legacyFacetsDict = {}
facetMapping.forEach((legacyFacet) => {
  legacyFacetsDict[legacyFacet.urlComp] = legacyFacet;
});

/**
 * List of legacy params that must be translated into Algolia router URLs.
 */
const mandatoryParams = [
  'mattressesComf_',
  'mattressesThickness_',
  'mattressesType_',
  'mattresssize_',]

/**
 * Determines if a URL needs to be forwarded to Algolia and translated
 * @param {URLSearchParams} queryArgsUrl
 * @returns
 */
export function needsForwarding(urlstr) {
  // check if url params
  const parts = urlstr.split('?');
  if (parts.length > 1) {
    const urlSearchParams = new URLSearchParams(parts[1]);
    for (const value of urlSearchParams.keys()) {
      if (mandatoryParams.includes(value)) {
        return true;
      }
    }
    return false;
  }
  else {
    return false;
  }
}

//qa_ProductCatalog[refinementList][attributes.Brand][0]
//algoliaConfig.js: 137 qa_ProductCatalog[refinementList][attributes.Brand][1]

/**
 * Given a legacy URL query args, return the equivalent Algolia version
 * @param {URLSearchParams} urlSearchParams
 * @returns
 */
export function translateURLToAlgoliaFormat(urlstr) {
  const parts = urlstr.split('?');
  const urlSearchParams = new URLSearchParams(parts[1]);
  for (const param of urlSearchParams.keys()) {
    if (mandatoryParams.includes(param)) {
      const values = urlSearchParams.get(param).split(',');
      values.forEach((val, i) => {
        const fdef = legacyFacetsDict[param];
        urlSearchParams.set(`${searchConfig.recordsIndex}[${fdef.group}][${fdef.facet}][${i}]`, val)
      });
    }
  }

  // clean any legacy param
  [...Object.keys(legacyFacetsDict), 'pno', 'sortBy', 'psize'].forEach(lfacet => {
    urlSearchParams.delete(lfacet);
  });

  const translatedParams = urlSearchParams.toString();
  return {
    redirect: {
      destination: `${parts[0]}?${translatedParams}`,
      permanent: false,
    },
  };
}