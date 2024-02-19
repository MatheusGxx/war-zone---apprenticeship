'use client'
import '../globals.css'
import { 
   ReuniaoAcabandoProvider,
   ReceitaSimplesProvider, 
   ReceitaControladaProvider, 
   AtestadoProvider,
   ExameProvider
} from '../context/context'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
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