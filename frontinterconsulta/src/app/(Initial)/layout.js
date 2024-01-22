import '../globals.css'

export const metadata = {
  title: 'Interconsulta',
  description: 'Interconsulta a melhor plataforma de telemedicina',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body className="background">
        <div>
          {children}
        </div>
      </body>
    </html>
  )
} 