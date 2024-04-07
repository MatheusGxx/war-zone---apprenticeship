'use client'
import '../globals.css'
import Image from 'next/image'
import Logo2 from '../public/Logo2.png'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ScriptsSocials } from '../partials/ScriptSocials'
import { useTrackingUTM } from '../hooks/useTrackingUTM'
import { useConversionViewContent } from '../hooks/useViewContent.js'
import { usePathname } from 'next/navigation'


const queryClient = new QueryClient()

export default function RootLayout({ children }) {

  const route = usePathname()
  useConversionViewContent(route)
  useTrackingUTM()
  
 return (
    <html lang="pt-br">
      <ScriptsSocials/>
      <body className='background'>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
       </body>
    </html>
  )
}
