import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html>
      <Head>
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
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}