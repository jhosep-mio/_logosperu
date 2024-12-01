'use client'
import Script from 'next/script'

export const GoogleTag = () => {
  return (
    <>
      <Script src='https://www.googletagmanager.com/gtag/js?id=G-SW0DL4HLJ2' strategy='afterInteractive' />
      <Script id='google-analytics' strategy='afterInteractive'>
        {`
          window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-SW0DL4HLJ2');

      `}
      </Script>
    </>
  )
}
