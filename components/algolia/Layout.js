import { AutocompleteSearchBar } from "./AutocompleteSearchBar";

/**
 * Main Layout
 * @param {} param0
 * @returns
 */
const Layout = ({ children }) => {
  return (
    <>
      <header>
        <AutocompleteSearchBar />
      </header>
      <main>{children}</main>
    </>
  );
};

export default Layout;