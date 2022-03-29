import '../styles/globals.css'
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <style global jsx>
        {`
          body {
            background: #FBFBFB;
          }
        `}
      </style>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp
