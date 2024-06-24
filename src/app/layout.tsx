import './globals.css'
// import 'bootstrap/dist/css/bootstrap.min.css'

import { Poppins } from 'next/font/google'
import React from 'react'
import type { Metadata } from 'next'
import { fileTypes } from '@/lib/constants'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'VECTORS',
  description: 'Simple Next.js app has been developed to convert SVG files into different formats like PNG, JPG, and more. It also provides additional useful tools for your convenience.',
  keywords: fileTypes.map(e => e.value),
  authors: {
    name: 'Yousef Husain',
    url: 'https://yousefhusain.com',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={poppins.className}>
        {children}
      </body>
    </html>
  )
}
