'use client'
import '../globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

export default function RootLayout({ children }) {

  return (
    <html lang="pt-br">
      <body>
        <QueryClientProvider client={queryClient}>
              {children}
        </QueryClientProvider>
      </body>
    </html>
  )
}

