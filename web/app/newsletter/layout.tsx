import React from 'react'
import { Header } from './@components/Header'

export default function RootLayout ({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-gray-100">
      <Header />
      {children}
    </div>
  )
}
