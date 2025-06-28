import './globals.css'
import type { Metadata } from 'next'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'Majdoor - Connect Workers with Employers',
  description: 'A platform connecting skilled workers with employers, facilitating job opportunities and career growth.',
  keywords: ['jobs', 'workers', 'employment', 'hiring', 'career'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}