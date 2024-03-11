'use client'
import '../globals.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ScriptsSocials from '../partials/ScriptSocials'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <ScriptsSocials />
      </head>
      <body className="background overflow-y-hidden">
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen flex flex-col">{children}</div>
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
        </QueryClientProvider>
      </body>
    </html>
  )
}
