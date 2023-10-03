import { useContext, useState } from "react";
import { SearchContext } from "./Layout";
import { searchConfig } from "../../lib/algoliaConfig";

const NearBytoggle = ({ label }) => {

  const { geoLocationRadius, setGeoLocationRadius } = useContext(SearchContext);
  const [checked, setChecked] = useState(geoLocationRadius !== 'all');

  const toggleNearBy = () => {
    if (checked) {
      setChecked(false);
      setGeoLocationRadius('all');
    }
    else {
      setChecked(true);
      setGeoLocationRadius(searchConfig.geoLocationRadius)
    }
  }

  return (
    <div className="container">
      {label}{" "}
      <div className="toggle-switch">
        <input type="checkbox" className="checkbox"
          name={label} id={label} checked={checked} onChange={toggleNearBy}/>
        <label className="label" htmlFor={label}>
          <span className="inner" />
          <span className="switch" />
        </label>
      </div>
    </div>
  );
};

export default NearBytoggle;
