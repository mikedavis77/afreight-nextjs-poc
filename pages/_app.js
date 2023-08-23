// pages/_app.js
import "../styles/global.css";
import Head from "next/head";

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Next.js Prototype</title>
        <link
          id="external-css"
          rel="stylesheet"
          type="text/css"
          href="https://fonts.googleapis.com/css?family=Quicksand&amp;display=swap"
          media="all"
        />
        <link
          id="external-css"
          rel="stylesheet"
          type="text/css"
          href="https://fonts.googleapis.com/css?family=Poppins&amp;display=swap"
          media="all"
        />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
