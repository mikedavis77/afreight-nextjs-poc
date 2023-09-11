import React from "react";
import { InstantSearchResults } from "../../components/algolia/InstantSearchResults";
import { InstantSearchSSRProvider, getServerState } from 'react-instantsearch';
import { renderToString } from 'react-dom/server';
import singletonRouter from 'next/router';
import { createInstantSearchRouterNext } from 'react-instantsearch-router-nextjs';

// const routerBase = history();
// const customRouter = {
//   ...routerBase,
//   createUrl(routeState) {
//     const mapping = routerBase.createURL(routeState);
//     console.log('mapping', mapping)
//     mapping.replace('query', 'term');
//     return mapping;
//   },
//   parseUrl(params) {

//     console.log('params', params)
//     const url = routerBase.parseUrl(params);
//     return url;
//   }
// }

/**
 * Main Page Prototype.
 * @returns
 */
export default function SearchPage({ serverState, serverUrl }) {
  return <div className="page_container">
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearchResults
        routing={{ router: createInstantSearchRouterNext({ singletonRouter, serverUrl: serverUrl }) }}
        />
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