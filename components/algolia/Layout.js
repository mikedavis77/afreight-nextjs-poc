import Link from "next/link";
import { AutocompleteSearchBar } from "./AutocompleteSearchBar";
import { createContext, useState } from "react";
import { searchConfig } from "../../lib/algoliaConfig";
import { GeolocationSelector } from "./GeolocationSelector";

// Search Context
export const SearchContext = createContext({ geoLocationRadius: searchConfig.geoLocationRadius, selectedGeo: searchConfig.geoLocationOptions[0] });
/**
 * Main Layout
 * @param {} param0
 * @returns
 */
const Layout = ({ children }) => {
  // Store Geo Location
  const [selectedGeo, setSelectedGeo] = useState(searchConfig.geoLocationOptions[0])
  const [geoLocationRadius, setGeoLocationRadius] = useState(searchConfig.geoLocationRadius);
  // geoLocation
  return (
    <SearchContext.Provider value={{ geoLocationRadius, selectedGeo, setSelectedGeo, setGeoLocationRadius }} >
      <div className="main_container">
        <div className="top-header">
          <Link href="/" className="home-link">
            {"⌂ Home"}
          </Link>
          <GeolocationSelector />
        </div>
        <header>
          <AutocompleteSearchBar />
        </header>
        <div className="page_container">
          <div className=" page_content" >
            <main>{children}</main>
          </div>
        </div>
        <footer>
          <div>
            See{' '}
            <a className='underline' href="https://github.com/jscontreras/nextjs-algolia-dual">
              source code
            </a>{' '}
            on GitHub
          </div>
        </footer>
      </div>
    </SearchContext.Provider>
  );
};

export default Layout;