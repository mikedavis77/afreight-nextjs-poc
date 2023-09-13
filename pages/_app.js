// pages/_app.js
import Layout from "../components/algolia/Layout";
import "../styles/global.scss";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>American Freight POC</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}
