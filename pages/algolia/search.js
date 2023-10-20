import React from "react";
import crypto from 'crypto';

import { InstantSearchResults } from "../../components/algolia/InstantSearchResults";
import { InstantSearchSSRProvider, getServerState } from 'react-instantsearch';
import { renderToString } from 'react-dom/server';
import singletonRouter from 'next/router';
import { createInstantSearchRouterNext } from 'react-instantsearch-router-nextjs';
import { routerOptions } from "../../lib/algoliaConfig";
import { needsForwarding, translateURLToAlgoliaFormat } from "../../lib/common";

/**
 * Main Page Prototype.
 * @returns
 */
export default function SearchPage({ serverState, serverUrl }) {
  return <div className="page_container">
    <InstantSearchSSRProvider {...serverState}>
      <InstantSearchResults
        routing={{ router: createInstantSearchRouterNext({ singletonRouter, serverUrl: serverUrl, routerOptions: routerOptions }) }}
        />
    </InstantSearchSSRProvider>
  </div>
}

/**
 * SSR
 * @param {*} param0
 * @returns
 */
export async function getServerSideProps({ req, res }) {
  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;

  // check redirects
  if (needsForwarding(req.url)) {
    return translateURLToAlgoliaFormat(req.url)
  }

  // Calculate user-token via server
  let clientUserToken = req.cookies._ALGOLIA || null;
  // Set cookie if not found
  if (clientUserToken === null) {
    clientUserToken = 's__' + crypto.randomUUID();
    res.setHeader('Set-Cookie', `_ALGOLIA=${clientUserToken}; Path=/;`)
  }

  const serverState = await getServerState(<SearchPage serverUrl={serverUrl} />, { renderToString });

  return {
    props: {
      serverState,
      serverUrl,
    },
  };
}