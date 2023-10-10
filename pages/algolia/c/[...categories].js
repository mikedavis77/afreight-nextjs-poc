import React from "react";
import { InstantSearchSSRProvider, getServerState } from 'react-instantsearch';
import { renderToString } from 'react-dom/server';
import { InstantSearchResults } from "../../../components/algolia/InstantSearchResults";
import singletonRouter from 'next/router';
import { createInstantSearchRouterNext } from 'react-instantsearch-router-nextjs';

/**
 * Router Options
 */
const routerOptions = {
  createURL({ qsModule, location, routeState }) {
    const { origin, pathname, hash } = location;
    const queryString = qsModule.stringify(routeState);
    return `${origin}${pathname}?${queryString}${hash}`;
  },
  parseURL({ qsModule, location }) {
    return qsModule.parse(location.search.slice(1));
  },
}

/**
 * Main Page Prototype.
 * @returns
 */
export default function Category({ serverState, serverUrl, extraSearchParams }) {
  return <div className="page_container">
    <InstantSearchSSRProvider {...serverState}>
      <header>
        <h2 className="category-title"> Category Page: {`[${extraSearchParams.filters}] `}</h2>
      </header>
      <InstantSearchResults
        routing={{ router: createInstantSearchRouterNext({ singletonRouter, serverUrl: serverUrl, routerOptions:routerOptions }) }}
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
  const { categories } = query;
  let categoryPageIdFilter = categories.map((str) => (str.charAt(0).toUpperCase() + str.slice(1)));
  if (isNaN(categories[categories.lendth - 1])) {
    categoryPageIdFilter.pop();
  }
  categoryPageIdFilter = categoryPageIdFilter.join(" > ");
  const filters = `categoryPageId:'${categoryPageIdFilter}'`;
  const extraSearchParams = { filters: filters };
  const serverState = await getServerState(<Category serverUrl={serverUrl} extraSearchParams={extraSearchParams} />, { renderToString });

  return {
    props: {
      serverState,
      serverUrl,
      extraSearchParams,
    },
  };
}