'use client'
import Image from "next/image"
import Logo from '../public/logo.png'
import secureLocalStorage from 'react-secure-storage'
import Link from 'next/link'

const ObrigadoMédico = () =>{

  const NomeMedicoLocal = secureLocalStorage.getItem('NomeMedico')
  const NomeMedico = NomeMedicoLocal || ''

  const HandleClickDoctor = async () => {
    secureLocalStorage.removeItem('EndMedico')
  }
  return(
    <>
     <div className='flex justify-center gap-52 pt-11'>

     <div className='flex flex-col gap-10'>

       <h1 className="font-bold text-4xl leading-tight sm:text-center md:text-center lg:text-center xl:text-center"> {NomeMedico} Obrigado por Utilizar<br/>os serviços do <span className="text-blue-500">#Interconsulta</span> <br/> nao perca mais tempo<br/> salve mais vidas clicando<br/> no botao abaixo.</h1>

       <div className="sm:flex sm:justify-center sm:items-center md:flex justify-center md:items-center lg:flex lg:justify-center lg:items-center xl:flex xl:justify-center xl:items-center">
        <Link href="/agenda" className="w-full">
        <button 
        className="w-72 h-12 rounded-full bg-indigo-950 text-white font-bold animate-pulse"
        onClick={HandleClickDoctor}
        >
           Encontre mais pacientes
         </button>
        </Link>
       </div>
       
     </div>

     <Image src={Logo} alt='LogoInterconsulta' height={40} width={300} className='animate-spin-slow sm:hidden md:hidden lg:hidden xl:hidden'/>
    </div>

    </>
  )
}

export default ObrigadoMédico