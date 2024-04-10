'use client'
import '../globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RegisterEndProvider } from '../context/context'
import { ScriptsSocials } from '../partials/ScriptSocials'
import { useTrackingUTM } from '../hooks/useTrackingUTM'
import { useConversionViewContent } from '../hooks/ConversionFacebook/useViewContent.js'
import { useViewContentGoogleAds } from '../hooks/ConversionGoogle/useConversionViewContentGoogleAds'
import { usePathname } from 'next/navigation'

const queryClient = new QueryClient()

export default function RootLayout({ children }) {

   const route = usePathname()

   useConversionViewContent(route)
   useViewContentGoogleAds(route)
   useTrackingUTM()
   
  return (
    <html lang="pt-br">
      <ScriptsSocials/>
      <body>
        <RegisterEndProvider>
          <QueryClientProvider client={queryClient}>
                {children}
          </QueryClientProvider>
        </RegisterEndProvider>
      </body>
    </html>
  )
}

