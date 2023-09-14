import Link from "next/link";
import { AutocompleteSearchBar } from "./AutocompleteSearchBar";

/**
 * Main Layout
 * @param {} param0
 * @returns
 */
const Layout = ({ children }) => {
  return (
    <div className="main_container">
      <div className="top-header">
        <Link href="/" className="home-link">
          {"⌂ Home"}
        </Link>
        <button>GEO LOCATION</button>
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
  );
};

export default Layout;