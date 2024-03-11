import '../globals.css'
import { ScriptsSocials } from '../partials/ScriptSocials'

export const metadata = {
  title: 'Interconsulta',
  description: 'Interconsulta a melhor plataforma de telemedicina',
};

export default function RootLayout({ children }) {
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
