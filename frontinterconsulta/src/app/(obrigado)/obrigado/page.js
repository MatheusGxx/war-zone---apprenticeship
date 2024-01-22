'use client'
import ObrigadoPaciente from '@/app/components/ObrigadoPaciente'
import ObrigadoMédico from '@/app/components/ObrigadoMédico'
import secureLocalStorage from 'react-secure-storage'
const Obrigado = () =>{

  const IdentificadorPosConsultaMedico = secureLocalStorage.getItem('EndMedico')
  const IdentificadorPosConsultaPaciente = secureLocalStorage.getItem('EndPaciente')
 
   
  return(
    <>
      <div className='flex flex-col'> 
      
       {IdentificadorPosConsultaMedico && <ObrigadoMédico/> }
       {IdentificadorPosConsultaPaciente&& <ObrigadoPaciente/> }
   
      </div>

    </>
  )
}

export default Obrigado