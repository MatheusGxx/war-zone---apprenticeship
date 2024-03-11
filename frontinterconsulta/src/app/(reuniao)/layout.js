'use client'

import '../globals.css'
import ScriptsSocials from '../partials/ScriptSocials'
import ReuniaoAcabandoProvider from '../context/ReuniaoAcabandoContext'
import ReceitaSimplesProvider from '../context/ReceitaSimplesContext'
import ReceitaControladaProvider from '../context/ReceitaControladaContext'
import AtestadoProvider from '../context/AtestadoContext'
import ExameProvider from '../context/ExameContext'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <ScriptsSocials />
      </head>
      <body className="background">
        <ReuniaoAcabandoProvider>
          <ReceitaSimplesProvider>
            <ReceitaControladaProvider>
              <AtestadoProvider>
                <ExameProvider>
                  {children}
                </ExameProvider>
              </AtestadoProvider>
            </ReceitaControladaProvider>
          </ReceitaSimplesProvider>
        </ReuniaoAcabandoProvider>
      </body>
    </html>
  )
}
