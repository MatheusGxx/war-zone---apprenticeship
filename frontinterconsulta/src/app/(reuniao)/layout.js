'use client'
import '../globals.css'
import { ReuniaoAcabandoProvider } from '../context/context'

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="background">
        <ReuniaoAcabandoProvider>
            <div className="">
              {children}
            </div> 
        </ReuniaoAcabandoProvider> 
      </body>
    </html>
  )
} 