'use client'
import '../globals.css'
import Header from '../components/Header.js'
import Nav from '../components/Nav.js'
import Footer from '../components/Footer.js'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HistoricoProvider, RegisterEndProvider } from '../context/context'
import { useEffect } from 'react'
import secureLocalStorage from 'react-secure-storage'
const queryClient = new QueryClient()

export default function RootLayout({ children }) {
  
  const id = secureLocalStorage.getItem('id')
  const NomeMedico = secureLocalStorage.getItem('NomeMedico')


  useEffect(() => {
    let idleTimer;
    
    const handleMouseMove = (event) => {
      // Resetar o temporizador se houver movimento do mouse
      clearTimeout(idleTimer);
    
      // Iniciar um novo temporizador para 5 segundos
      idleTimer = setTimeout(() => {
        // Usuario Ausente

        //request online false
      }, 5000) // 5 segundos em milissegundos
    
      // Imprimir as coordenadas do mouse
      const { clientX, clientY } = event

      if(NomeMedico){
       //request online true
      }
    };
    
    // Adicione um ouvinte para o evento de movimento do mouse
    document.addEventListener('mousemove', handleMouseMove);
    
    // Limpe o ouvinte quando o componente for desmontado
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(idleTimer)
    };
  }, []);
  

  return (
    <html lang="pt-br">
      <body className="background">
        <HistoricoProvider>
          <RegisterEndProvider>
              <QueryClientProvider client={queryClient}>
                <div className="min-h-screen flex flex-col">
                  <Header/>
                  <Nav/>
                    {children}
                  <Footer/>
                </div>
              </QueryClientProvider>
          </RegisterEndProvider>
        </HistoricoProvider>
      </body>
    </html>
  )
}

