'use client'
import '../../../globals.css'

import NavReunião from '../../../components/NavReuniao'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="background overflow-y-hidden">
        <QueryClientProvider client={queryClient}>
          <NavReunião/>
          {children} 
        </QueryClientProvider>
      </body>
    </html>
  )
} 