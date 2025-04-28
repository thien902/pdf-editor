import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import DonationButton from '@/components/DonationButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Next.js App',
  description: 'Built with Next.js 14',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">
          {children}
          <footer className="w-full py-6 bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <p className="text-sm text-gray-600 text-center">
                  If you find our service helpful, please consider supporting us to help maintain and improve it.
                </p>
                <DonationButton />
              </div>
            </div>
          </footer>
        </main>
      </body>
    </html>
  )
}
