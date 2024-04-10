'use client'
import '../globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ScriptsSocials } from '../partials/ScriptSocials'
import { usePathname } from 'next/navigation'
import { useConversionViewContent } from '../hooks/ConversionFacebook/useViewContent.js'
import { useViewContentGoogleAds } from '../hooks/ConversionGoogle/useConversionViewContentGoogleAds'
import { useTrackingUTM } from '../hooks/useTrackingUTM'

const queryClient = new QueryClient()

export default function RootLayout({ children }) {

  const route = usePathname()
  useConversionViewContent(route)
  useViewContentGoogleAds(route)
  useTrackingUTM()

  return (
    <html lang="pt-br">
      <ScriptsSocials/>
      <body className="background overflow-y-hidden">
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen flex flex-col">
              {children}
          </div>
        </QueryClientProvider>
      </body>
    </html>
  )
}
