import { Html, Head, Main, NextScript } from 'next/document'
import { DocumentProps } from 'next/document'

export default function Document({ __NEXT_DATA__ }: DocumentProps) {
  // Get the locale from Next.js data
  const locale = __NEXT_DATA__.locale || 'en'
  
  return (
    <Html lang={locale} data-scroll-behavior="smooth">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 