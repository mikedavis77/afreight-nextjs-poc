import React from "react";
import { InstantSearchSSRProvider, getServerState } from 'react-instantsearch';
import { renderToString } from 'react-dom/server';
import { InstantSearchResults } from "../../../../components/algolia/InstantSearchResults";
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
export default function Category({ serverState, serverUrl, extraSearchParams }) {
  return <div className="page_container">
    <InstantSearchSSRProvider {...serverState}>
      <header>
        <h2 className="category-title"> Context Rule: {`[${extraSearchParams.ruleContexts}] `}</h2>
      </header>
      <InstantSearchResults
        routing={{ router: createInstantSearchRouterNext({ singletonRouter, serverUrl: serverUrl }) }}
        extraSearchParams={extraSearchParams}
      />
    </InstantSearchSSRProvider>
  </div>
}

/**
 * SSR
 * @param {*} param0
 * @returns
 */
export async function getServerSideProps({ req, query }) {
  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;
  const {context} = query;
  const extraSearchParams = { ruleContexts: [context], query:'' };
  const serverState = await getServerState(<Category serverUrl={serverUrl} extraSearchParams={extraSearchParams} />, { renderToString });

  return {
    props: {
      serverState,
      serverUrl,
      extraSearchParams,
    },
  };
}