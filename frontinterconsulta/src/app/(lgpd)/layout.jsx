'use client'
import '../globals.css'
import { ScriptsSocials } from '../partials/ScriptSocials'
import { useTrackingUTM } from '../hooks/useTrackingUTM'
import { useConversionViewContent } from '../hooks/ConversionFacebook/useViewContent.js'
import { useViewContentGoogleAds } from '../hooks/ConversionGoogle/useConversionViewContentGoogleAds'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }) {

   const route = usePathname()
   useConversionViewContent(route)
   useViewContentGoogleAds(route)
   useTrackingUTM()
   
  return (
    <html lang="pt-br">
      <ScriptsSocials/>
      <body className='background'>
         {children}
      </body>
    </html>
  )
}

