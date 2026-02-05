import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono, Fredoka } from 'next/font/google'

import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })
const _fredoka = Fredoka({ subsets: ['latin'], variable: '--font-fredoka' })

export const metadata: Metadata = {
  title: 'Birthday Invite',
  description: 'You\'re invited to a special birthday celebration',
  icons: {
    icon: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning style={{ '--font-fredoka': _fredoka.style.fontFamily } as React.CSSProperties}>
      <body className="font-fredoka antialiased" suppressHydrationWarning>{children}</body>
    </html>
  )
}
