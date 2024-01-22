'use client'
import '../globals.css'
import Image from 'next/image'
import Logo2 from '../public/Logo2.png'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()

export default function RootLayout({ children }) {
 return (
    <html lang="pt-br">
      <body className='background'>
        <QueryClientProvider client={queryClient}>

        <div className='min-h-screen sm:flex justify-center sm:items-center sm:flex-col lg:flex lg:justify-center lg:items-center lg:flex-col xl:flex xl:justify-center xl:items-center xl:flex-col'>

          <div className='flex justify-center p-12'>
            <Image
                src={Logo2}
                alt="Logo2"
                height={10}
                width={400}
                />
          </div>

          {children}

          </div>

        </QueryClientProvider>
       </body>
    </html>
  )
}
