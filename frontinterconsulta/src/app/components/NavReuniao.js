'use client'
import { useEffect, useState } from 'react'
import Logo2 from '../public/Logo2.png'
import Image from 'next/image'
import Avatar from '@mui/material/Avatar'
import secureLocalStorage from 'react-secure-storage'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useTimer } from 'react-timer-hook'
import { useRouter } from "next/navigation"
import { UseReuniaoAcabando } from '../context/context'
import { EndReuniaoDoctor } from './PopUpEndReuniaoDoctor'
import { config } from '../config.js'

const NavReunião = () => {

  const [tempoConsulta, setTempoConsulta] = useState(null)
  const [popTrue, setPopTrue] = useState(false)
  const [newTimer, setNewTimer] = useState(null)
  const [minutesConsulta, setMinutesConsulta] = useState('')
  const [secondsConsulta, setSecondsConsulta] = useState('')
  const [startConsulta, setStart] = useState('')
  const { setReuniaoAcabando }  = UseReuniaoAcabando()

  const FotoMedico = secureLocalStorage.getItem('FotoMedico')
  const FotoPaciente = secureLocalStorage.getItem('FotoPaciente')
  const FotoUnidade = secureLocalStorage.getItem('FotoUnidade')
  const IdentificadorLocalConsulta = secureLocalStorage.getItem('ConsultaPacienteParticular')
  const IdentificadorConsulta = IdentificadorLocalConsulta || ''
  const idLocal = secureLocalStorage.getItem('id')
  const id = idLocal || ''

  const Router = useRouter()

  const NameMédico = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomeMedico') : false

  const NomeMédico = NameMédico || ''

  const NamePacienteLocal = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomePaciente') : false

  const NomePaciente = NamePacienteLocal || '' 

  const expiryTimestamp = new Date();
  expiryTimestamp.setMinutes(expiryTimestamp.getMinutes() + (tempoConsulta || 6));

  const { minutes, seconds, start } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      if (NomeMédico) {
        setPopTrue(true)
      }
    },
  });

  const HandleConsulta = async  () => {
    setStart(true)
    start()
  }

  if(minutes <= 4){
    //setReuniaoAcabando(true)
  }

  return(
    <>
    <nav className='container flex justify-end items-center
    gap-3 border-b border-blue-500 border-l border-r rounded-b-lg p-3'>

   {startConsulta &&
       <>
   {NomeMédico && minutes ?
      <>
       <div className='p-2'>
       <span className='text-xl text-blue-600'>{String(minutes).padStart(2, '0')}:</span>
       <span className='text-xl text-blue-600'>{String(seconds).padStart(2, '0')}</span>
       </div> 
      </> 
      : minutesConsulta <= 4 ?
       <>
        <div className='p-2'>
       <span className='text-xl text-red-600'>{String(minutes).padStart(2, '0')}:</span>
       <span className='text-xl text-red-600'>{String(seconds).padStart(2, '0')}</span>
       </div> 
       </> 
       : 
       null
     }
       </>
     }

     {!startConsulta && NomeMédico &&
      <>
      
      </>
     }

      <div className='pt-2 flex'>
          <div  className='mt-[-10px] cursor-pointer flex gap-8 mr-5' >
              <Avatar 
              style={{ width: 40, height: 40 }} 
              src={`${config.apiBaseUrl}/${FotoMedico ? FotoMedico : FotoPaciente ? FotoPaciente : FotoUnidade ? FotoUnidade : null}`}/>
            <div className='flex justify-center items-center'>
               <h1 className='font-bold'> {NomeMédico ? NomeMédico : NomePaciente ? NomePaciente : null} </h1>
            </div>
         </div>
     </div>

    </nav>

    {popTrue && NomeMédico
    ?
     <EndReuniaoDoctor nomeDoctor={NomeMédico}/> 
    : null
    }
    </>
  )
}

export default NavReunião
