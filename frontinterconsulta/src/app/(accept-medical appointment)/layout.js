'use client'
import '../globals.css'
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

