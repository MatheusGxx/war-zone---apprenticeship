'use client'
import '../globals.css'
import { 
   ReuniaoAcabandoProvider,
   ReceitaSimplesProvider, 
   ReceitaControladaProvider, 
   AtestadoProvider,
   ExameProvider
} from '../context/context'
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
      <body className="background">
        <ReuniaoAcabandoProvider>
          <ReceitaSimplesProvider>
            <ReceitaControladaProvider>
              <AtestadoProvider>
                <ExameProvider>
                <div className="">
                    {children}
                </div> 
                </ExameProvider>
              </AtestadoProvider>
            </ReceitaControladaProvider>
          </ReceitaSimplesProvider>
        </ReuniaoAcabandoProvider> 
      </body>
    </html>
  )
} 