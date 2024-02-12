'use client'
import '../globals.css'
import { ReuniaoAcabandoProvider, AtestadoProvider } from '../context/context'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="background">
        <ReuniaoAcabandoProvider>
          <AtestadoProvider>
          <div className="">
              {children}
          </div> 
          </AtestadoProvider>
        </ReuniaoAcabandoProvider> 
      </body>
    </html>
  )
} 