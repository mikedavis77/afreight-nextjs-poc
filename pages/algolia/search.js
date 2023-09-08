import React from "react";
import { InstantSearchResults } from "../../components/algolia/InstantSearchResults";
import { InstantSearchSSRProvider, getServerState } from 'react-instantsearch';
import { renderToString } from 'react-dom/server';

/**
 * Main Page Prototype.
 * @returns
 */
export default function SearchPage({ serverState, serverUrl }) {
  return <div className="page_container">
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearchResults serverUrl={serverUrl} />
    </InstantSearchSSRProvider>
  </div>
}

/**
 * SSR
 * @param {*} param0
 * @returns
 */
export async function getServerSideProps({ req }) {
  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;

  const serverState = await getServerState(<SearchPage serverUrl={serverUrl} />, { renderToString });

  return {
    props: {
      serverState,
      serverUrl,
    },
  };
}