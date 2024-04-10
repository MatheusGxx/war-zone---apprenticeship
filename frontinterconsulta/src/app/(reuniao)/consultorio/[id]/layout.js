'use client'
import '../../../globals.css'

import NavReunião from '../../../components/NavReuniao'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useConversionViewContent } from '../../../hooks/ConversionFacebook/useViewContent.js'
import { useViewContentGoogleAds } from '../../../hooks/ConversionGoogle/useConversionViewContentGoogleAds.js'
import { usePathname } from 'next/navigation'
import { useTrackingUTM } from '@/app/hooks/useTrackingUTM'
import { ScriptsSocials } from '@/app/partials/ScriptSocials'

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
          <NavReunião/>
          {children} 
        </QueryClientProvider>
      </body>
    </html>
  )
} 