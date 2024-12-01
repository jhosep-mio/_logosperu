'use client'
import React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import { GoogleTagManager } from '@next/third-parties/google'
import { AuthProvider } from '@/public/components/shared/context/AuthProvider'
// import { AuthProvider } from '@/public/components/shared/context/AuthProvider'
const inter = Inter({ subsets: ['latin'] })

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          integrity="sha512-SnH5WK+bZxgPHs44uWIX+LLJAJ9/2PkPKZ5QiAj6Ta86w+fsb2TkcmfRyVX3pBnMFcV7oQPJkl9QevSCWr3W6A=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className={inter.className}>
        <GoogleTagManager gtmId='GTM-55CG66SB'/>
        <AuthProvider>
            <main className="bg-black">{children}</main>
        </AuthProvider>
      </body>
    </html>
  )
}
