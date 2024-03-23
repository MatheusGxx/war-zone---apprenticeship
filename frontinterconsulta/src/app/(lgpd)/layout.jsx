'use client'
import '../globals.css'
import { ScriptsSocials } from '../partials/ScriptSocials'

export default function RootLayout({ children }) {

  return (
    <html lang="pt-br">
      <ScriptsSocials/>
      <body className='background'>
         {children}
      </body>
    </html>
  )
}

