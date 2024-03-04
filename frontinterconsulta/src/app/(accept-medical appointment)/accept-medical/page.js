'use client'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { Api2, config } from '@/app/config.js'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Logo from '../../public/logo.png'
import Image from 'next/image'


const AcceptMedicalAppointment = () => {
    const [datadoctor, setDataDoctor] = useState('')
    const [confirmation, setConfirmation] = useState(false)
    const [reject, setReject] = useState(false)

    const searchParams = useSearchParams()
    const NomeUnidade = decodeURIComponent(searchParams.get('response'))
    const NomePatient = decodeURIComponent(searchParams.get('namePatient'))
    const date = decodeURIComponent(searchParams.get('date'))
    const InicioConsulta = decodeURIComponent(searchParams.get('start'))
    const FotoUnidade = decodeURIComponent(searchParams.get('upload'))
    const idConsulta = decodeURIComponent(searchParams.get('id'))

    const UpdateConsultaConfirmation = useMutation(async (valueRequest) => {
      const response = await axios.post(`${Api2.apiBaseUrl}/api2/accept-medical`, valueRequest)
      return response.data
    },{
      onSuccess: () => {
        setConfirmation(true)
      }
    })

    const UpdateConsultaReject = useMutation(async (valueRequest) => {
      const response = await axios.post(`${Api2.apiBaseUrl}/api2/reject-medical`, valueRequest)
      return response.data
    },{
      onSuccess: () => {
        setReject(true)
      }
    })

    useEffect(() => {
      NomeUnidade
      NomePatient
      date
      InicioConsulta,
      FotoUnidade
      idConsulta
    },[])

    return(
        <>
        <div className="min-h-[90vh] flex justify-center items-center flex-col gap-5">
            
       {FotoUnidade ? 
        <Image src={`${config.apiBaseUrl}/${FotoUnidade}`} width={300} height={300} alt="Foto Unidade de Saude"/> :
        <Image alt="Logo Interconsulta" src={Logo} width={40} height={40} className='mr-5 animate-spin-slow'/>
       }
      <h1 className='text-2xl sm:text-xl'> Ola {NomePatient} </h1>
      <h1 className='text-2xl sm:text-lg sm:text-center whitespace-pre-wrap text-center'> 
            Nós do {NomeUnidade}, locamos uma consulta para voce na data de {date} que ira começar as {InicioConsulta}  
      </h1>

      {!confirmation && !reject && 
      <>
     <div className='flex flex-col gap-3 w-full justify-center items-center'>
      <button className='bg-green-500 p-2 rounded-full w-1/2' onClick={async () => await UpdateConsultaConfirmation.mutateAsync({ id: idConsulta, newState: `Confirmada por ${NomePatient}`})}>
        <p className='font-bold text-white'> Aceitar Consulta </p>
      </button>

      <button className='bg-red-500 p-2 rounded-full w-1/2' onClick={async () => await UpdateConsultaReject.mutateAsync({ id: idConsulta, newState: `Cancelada por ${NomePatient}`})}>
        <p className='font-bold text-white'> Recusar Consulta </p>
      </button>
      </div>
      </>
      }    

      {confirmation ? 
      <>
      <h1 className='font-bold text-blue-500 text-xl text-center'>  Parabens {NomePatient} a sua consulta foi confirmada não se esqueça ela ocorra em: {date} as {InicioConsulta}</h1>
      </> : 
      reject ?
       <>
      <h1 className='font-bold text-blue-500 text-xl text-center'> {NomePatient} Infelizmente voce cancelou a sua consulta que iria acontecer {date} =/ </h1>
       </> 
       : null}  
     </div>

        <h1 className='flex items-end justify-end w-full'>
            <Image alt="Logo Interconsulta" src={Logo} width={40} height={40} className='mr-5 animate-spin-slow'/>
       </h1>   
        </>
    )
}

export default AcceptMedicalAppointment