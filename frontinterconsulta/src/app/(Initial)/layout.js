import '../globals.css';

export const metadata = {
  title: 'Interconsulta',
  description: 'Interconsulta a melhor plataforma de telemedicina',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <head>
        <meta name="google-site-verification" content="tlq8ailaemzEIRqWZ7IGaWgEqFTe16r4NQLmNp160wU" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-9BND46GSNV"></script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-9BND46GSNV');
          `}
        </script>
        <script async src="https://www.googletagmanager.com/gtag/js?id=AW-11476579486"></script>
        <script>
          {
            `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', 'AW-11476579486');
            `
          }
        </script>
        <meta name="facebook-domain-verification" content="u1pxl4m3s5llr0711fkbma7ls4fzjv" />
      </head>
      <body className="background">
        <div>
          {children}
        </div>
      </body>
    </html>
  );
}
