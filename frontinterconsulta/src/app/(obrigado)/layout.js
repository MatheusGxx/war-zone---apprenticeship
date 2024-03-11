'use client'
import '../globals.css'
import Image from 'next/image'
import Logo2 from '../public/Logo2.png'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ScriptsSocials } from '../partials/ScriptSocials'
const queryClient = new QueryClient()

export default function RootLayout({ children }) {
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
