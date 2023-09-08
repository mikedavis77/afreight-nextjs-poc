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
      <Link href="/">
        {"⌂ Home"}
      </Link>
      <header>
        <AutocompleteSearchBar />
      </header>
      <div className="page_container">
        <div className=" page_content" >
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};

export default Layout;