import React from "react";
import { AutocompleteSearchBar } from "../../components/algolia/AutocompleteSearchBar";
import { InstantSearchResults } from "../../components/algolia/InstantSearchResults";

/**
 * Main Page Prototype.
 * @returns
 */
export default function SearchPage() {
  return <div className="page_container">
    <AutocompleteSearchBar />
    <InstantSearchResults />
  </div>
}