'use client'
import '../globals.css'
import { ScriptsSocials } from '../partials/ScriptSocials'
import { useTrackingUTM } from '../hooks/useTrackingUTM'
import { useConversionViewContent } from '../hooks/useViewContent.js'
import { usePathname } from 'next/navigation'

export default function RootLayout({ children }) {
  
  const route = usePathname()
  useConversionViewContent(route)
  useTrackingUTM()
  return (
    <html lang="pt-br">
      <ScriptsSocials/>
      <body className="background">
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}
