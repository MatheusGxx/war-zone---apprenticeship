'use client'
import { useEffect } from 'react'
import Image from 'next/image'
import Logo from '../public/logo.png'
import Link from 'next/link'
import secureLocalStorage from 'react-secure-storage'
import { useRouter } from 'next/navigation'

const Home = () => {
  
  const RedirectNavigation = useRouter()
  const Paciente = secureLocalStorage.getItem('NomePaciente')

  useEffect(() => {
     if(Paciente){
       RedirectNavigation.push('/especialistas-disponiveis')
     }    
  },[])
  
  return (
    <>
    <div className='min-h-screen flex flex-col justify-center items-center gap-5 w-full'>

        <h1 className='font-bold text-2xl text-blue-700'> Seja bem vindo ao Interconsulta V1</h1>
        <Image src={Logo} width={100} height={100} className='animate-spin-slow'/>

        <Link href="/welcome" className='w-full flex justify-center items-center'>
        <button className='p-2 bg-blue-700 rounded-full w-1/3 sm:w-1/2'> 
        <p className="font-bold text-white"> Começar Experiencia  </p>
        </button>
        </Link>

     <h1 className='text-center'>
      Todos os Direitos reservados © 2024<br/>

      Negócios Digitais LTDA<br/>
      CPNJ 39.775.137/0001-53<br/>
      Este site não faz parte do site do Facebook ou Facebook Inc.<br/>
      Além disso, este site não é endossado pelo Facebook de forma alguma.<br/>
      Facebook é uma marca comercial da Facebook Inc.<br/><br/>

      Aviso Legal:<br/>
      "Nenhuma informação contida nesse produto deve ser interpretada como uma<br/>afirmação da obtenção de resultados. Qualquer referência ao desempenho<br/> passado ou potencial de uma estratégia abordada no conteúdo não é, e não<br/> deve ser interpretada como uma recomendação ou como garantia de qualquer<br/> resultado específico"<br/>
     </h1>

     <footer>
      <h1 className='text-center'>
         Desenvolvido por: Negócios Digitais LTDA Copyright © 2024 Negócios Digitais LTDA. Todos os direitos reservados | <Link href="/privacidade"> <span className='font-semibold text-blue-500 cursor-pointer'> Política de Privacidade  </span> </Link>
      </h1>
     </footer>
     
    </div> 
    </>
  )
}

export default Home