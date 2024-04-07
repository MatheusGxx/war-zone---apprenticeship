'use client'
import ObrigadoPaciente from '@/app/components/ObrigadoPaciente'
import ObrigadoMédico from '@/app/components/ObrigadoMédico'
import secureLocalStorage from 'react-secure-storage'
import { useSearchParams } from 'next/navigation'

const Obrigado = () =>{

  const params = useSearchParams()
   
  const IdentificadorPacienteCelular = params.get('idC')
  const IdentificadorPosConsultaMedico = secureLocalStorage.getItem('EndMedico') 
  const IdentificadorPosConsultaPaciente = secureLocalStorage.getItem('EndPaciente') || IdentificadorPacienteCelular

  return(
    <>
      <div className=''> 
       {IdentificadorPosConsultaMedico && <ObrigadoMédico/> }
       {IdentificadorPosConsultaPaciente && <ObrigadoPaciente/> }
       
       {!IdentificadorPosConsultaMedico && !IdentificadorPosConsultaPaciente &&
       <>
       <div className='min-h-screen flex justify-center items-center'>
         <h1 className='font-semibold text-blue-500 text-xl text-center'> Ops Infelizmente ou voce nao esta logado ou voce nao veio de uma Consulta para acessar essa pagina =/</h1>
       </div>
       </>
       }
   
      </div>

    </>
  )
}

export default Obrigado