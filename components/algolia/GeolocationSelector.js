import { useContext, useState } from "react";
import { SearchContext } from "./Layout";
import { searchConfig } from "../../lib/algoliaConfig";

/**
 * Geolocation Selector
 * @param {*} props
 * @returns
 */
export function GeolocationSelector() {
  // Get context
  const { selectedGeo, setSelectedGeo } = useContext(SearchContext);

  const [selectedOption, setSelectedOption] = useState(selectedGeo);
  // Handle selection
  const handleSelectChange = (event) => {
    setSelectedGeo(searchConfig.geoLocationOptions[event.target.value]);
    setSelectedOption(event.target.value);
    console.log('Selected Geo', searchConfig.geoLocationOptions[event.target.value])
  };

  return <div className="geo-selector">
    <select value={selectedOption} onChange={handleSelectChange}>
      {searchConfig.geoLocationOptions.map((geoOpt, index) => (
        <option key={geoOpt.name} value={index} >{geoOpt.name}</option>
      ))}
    </select>
  </div>
}