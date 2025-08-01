import type { AppProps } from 'next/app'
import { appWithTranslation } from 'next-i18next'
import '@/styles/globals.css'
import Head from 'next/head'

function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default appWithTranslation(App) 