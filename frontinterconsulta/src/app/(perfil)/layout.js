'use client'
import '../globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RegisterEndProvider } from '../context/context'

const queryClient = new QueryClient()

export default function RootLayout({ children }) {

  return (
    <html lang="pt-br">
      <body>
        <RegisterEndProvider>
          <QueryClientProvider client={queryClient}>
                {children}
          </QueryClientProvider>
        </RegisterEndProvider>
      </body>
    </html>
  )
}

