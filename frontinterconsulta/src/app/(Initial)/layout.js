import '../globals.css'

export const metadata = {
  title: 'Interconsulta',
  description: 'Interconsulta a melhor plataforma de telemedicina',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
       <meta name="google-site-verification" content="tlq8ailaemzEIRqWZ7IGaWgEqFTe16r4NQLmNp160wU" />
      </head>
      <body className="background">
        <div>
          {children}
        </div>
      </body>
    </html>
  )
} 