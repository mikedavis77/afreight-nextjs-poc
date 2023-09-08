import React from "react";
import { InstantSearchResults } from "../../components/algolia/InstantSearchResults";

/**
 * Main Page Prototype.
 * @returns
 */
export default function SearchPage() {
  return <div className="page_container">
    <InstantSearchResults />
  </div>
}