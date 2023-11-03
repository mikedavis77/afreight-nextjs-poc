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

/** Color codes for special facet */
export const colorCodes = {
  "white": "#ffffff",
  "stainless steel": "#8d8c92",
  "black": "#000000",
  "baked enamel black": "#000000",
  "beige & bisque": "#ffffe7",
  "red": "#d52d2d",
  "blue": "#2a3e81",
  "specialty": "#dfbf9f",
  "metallic": "#b9b9b9",
  "silver": "#b9b9b9",
  "brown": "#804d3b",
  "gray": "#9c9c9c",
  "metallic silver": "#bdbdbd",
  "black stainless": "#2d2d2d",
  "baked enamel red": "#d52d2d",
  "graphite": "#414141",
  "panel ready": "#af6f37",
  "slate": "#3b3b3b",
  "red/black": "#d52d2d",
  "multi": "#5a554e",
  "purple": "#74317c",
  "orange": "#ff6600",
  "black/platinum": "#000000",
  "biscuit or bisque": "#fff6cd",
  "midnight blue": "#2a5679",
  "titanium": "#bdbdbd",
  "ash": "#b2beb5",
  "barclay brass": "#794723",
  "beige": "#f5f5dc",
  "bennett espresso": "#563f3d",
  "brush steel": "#c8d2d3",
  "burgundy": "#800020",
  "camel": "#c19a6b",
  "cappuccino": "#b39f7a",
  "cardinal red": "#bd2031",
  "charcoal": "#36454f",
  "cherry": "#961515",
  "chocolate": "#7f5c42",
  "chrome": "#dbe4eb",
  "collin": "#424242",
  "coral": "#ff7f50",
  "cream": "#dad9c1",
  "dark brown": "#654321",
  "dark cherry merlot": "#77432a",
  "dove": "#7a7974",
  "dunbrook steel": "#52392b",
  "espresso": "#67564e",
  "factory select": "#009688",
  "gold": "#d4af37",
  "green": "#279652",
  "grey": "#9c9c9c",
  "madison bronze": "#5a3109",
  "margo": "#3c3c42",
  "natural": "#ab9e87",
  "navy": "#000080",
  "oiled bronze": "#523315",
  "pewter": "#8e9294",
  "pink": "#ff33c0",
  "quartz": "#51484f",
  "saddle": "#8b4513",
  "smoke": "#738276",
  "sundown black": "#523f3f",
  "tan": "#ab8d4a",
  "teal": "#008080",
  "toffee wood": "#cd7f32",
  "truffle": "#96877f",
  "wine": "#722f37",
  "Cocoa": "#d2961e",
  "Coffee": "#6f4e37",
  "Glass": "#e8f1ff",
  "Ivory": "#fffff0",
  "Light Brown": "#b5651d",
  "Lite": "#fffff7",
  "Metal": "#858585",
  "Oak": "#7d4e2d",
  "Platinum": "#c1beba",
  "Raspberry": "#e30bc9",
  "Sapphire": "#0f52ba",
  "Taupe": "#c0b1a5",
  "Toast": "#a88d6a",
  "Two Tone": "#75161d",
  "Beige & Tan": "#f5edd7",
  "Black Slate": "#000000",
  "Black Steel": "#000000",
  "Clear": "#f7feff",
  "Copper": "#b87333",
  "Dolos Steel": "#9c9c9c",
  "Multi color": "#d1ffc9",
  "Multi-color": "#343833",
  "Multicolored": "#d1ffc9",
  "No": "#c9c9c9",
  "Off white": "#f7f7f7",
  "Off-white": "#f7f7f7",
  "Other": "#3b3531",
  "Reversible": "#000000",
  "Silver/gray": "#9c9c9c",
  "Neutral": "#c1bdb0",
  "yellow": "#fff200",
  "black slate": "#000000",
  "black stainless steel": "#000000",
  "raspberry": "#e30bc9",
  "metal": "#858585",
  "lite": "#fffff7",
  "glass": "#e8f1ff",
  "fingerprint resistant stainless steel": "#a2a2a4",
  "matte black": "#2c2c2c",
  "slate gray": "#8e887e",
  "tuscan stainless steel": "#584a48",
  "chrome shadow": "#626262",
  "diamond gray": "#464646",
  "graphite steel": "#6c6c6a",
  "nickel": "#635f5b",
  "dark oak": "#554e45",
  "sapphire": "#454870",
  "stainless look": "#9e9e9e",
  "platinum": "#494b4d",
  "custom panel(s) required": "#6d6b64",
  "diamond steel": "#e4e4e4",
  "sand": "#d1cdc4",
  "metallic slate": "#686669",
  "bisque": "#f9f0ea",
  "matte white": "#fff",
  "matte black stainless steel": "#000",
  "mocha": "#613922",
  "sunset bronze": "#ae9c84",
  "two tone": "#8f6e4d",
  "stainless": "#8d8c92",
  "pearl": "#edf8ff",
  "coffee": "#66533f",
  "musk": "#b9a79a",
  "champagne": "#ad9994",
  "walnut": "#91846c",
  "black ice": "#312e32",
  "chestnut": "#6f3216",
  "light brown": "#a18b77",
  "phenomena jade": "#4f566c",
  "black/silver": "#838383",
  "black/blue": "#105487",
  "aqua": "#5cd2d2",
  "black/grey": "#000000",
  "brown/white": "#804d3b",
  "platinumbronze": "#888182",
  "cranberryred": "#6d1322",
  "stainless steel finish": "#8d8c92"
}
