'use client'
import '../globals.css'
import Header from '../components/Header.js'
import Nav from '../components/Nav.js'
import Footer from '../components/Footer.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RegisterEndProvider, ProviderHorariosDoctor, BloodProvider, } from '../context/context'
import { ScriptsSocials } from '../partials/ScriptSocials'
import { usePathname } from 'next/navigation'
import { useTrackingUTM } from '../hooks/useTrackingUTM'
import { useConversionViewContent } from '../hooks/ConversionFacebook/useViewContent.js'
import { useViewContentGoogleAds } from '../hooks/ConversionGoogle/useConversionViewContentGoogleAds'

const queryClient = new QueryClient()

export default function RootLayout({ children }) {
  
  const route = usePathname()
  useConversionViewContent(route)
  useViewContentGoogleAds(route)
  useTrackingUTM()
  
  return (
    <html lang="pt-br">
      <ScriptsSocials/>
      <body className="background">
       
          <RegisterEndProvider>
          <ProviderHorariosDoctor>
              <BloodProvider>
              <QueryClientProvider client={queryClient}>
                <div className="min-h-screen flex flex-col">
                  <Header/>
                  <Nav/>
                    {children}
                  <Footer/>
                </div>
              </QueryClientProvider>
              </BloodProvider>
            </ProviderHorariosDoctor>
          </RegisterEndProvider>

      </body>
    </html>
  )
}

