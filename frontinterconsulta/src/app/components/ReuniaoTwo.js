'use client'
import Image from 'next/image'
import Reuniao from '../public/Reuniao.png'
import Logo2 from '../public/Logo2.png'
import secureLocalStorage from 'react-secure-storage'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { PopUpEndReuniao } from '../partials/popUpEndReuniao.js'
import { useState } from 'react'
import { useRouter } from "next/navigation"
import { Snackbar, Alert } from '@mui/material'
import { config } from '../config.js'

const ReuniaoTwo = () => {
  const [open, setOpen] = useState(false)
  const [nomePaciente, setNomePaciente] = useState('')
  const [nomeMedico, setNomeMedico] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [position, setPosition] = useState({
    vertical: 'top',
    horizontal: 'center'
  })

  const { vertical, horizontal } = position

  const NomeLocalPaciente = secureLocalStorage.getItem('NomePaciente')
  const NomePaciente = NomeLocalPaciente || ''

  const idLocal = secureLocalStorage.getItem('id')
  const id = idLocal || ''

  const IdentificadorLocalConsulta = secureLocalStorage.getItem('ConsultaPacienteParticular')
  const IdentificadorConsulta = IdentificadorLocalConsulta || ''
  const router = useRouter()

  const verifyEndRoomMutation = useMutation(async (valueBody) => {
    const request = await axios.post(`${config.apiBaseUrl}/api/verify-conclusion-room`, valueBody)
    return request.data.Consulta
  })

  const saveConsultaMutation = useMutation(async (valueBody) => {
    const request = await axios.post(`${config.apiBaseUrl}/api/conclusion-room-patient`, valueBody)
    return request.data
  })

  const handleEndConsulta = async () => {
    const body = {
      id,
      IdentificadorConsulta
    }

    try {
      const verifyResponse = await verifyEndRoomMutation.mutateAsync(body)
      const OkMedico = verifyResponse.ConsultasSolicitadasPacientes.flatMap((data) => data.OkMedico)
      const OkPaciente = verifyResponse.ConsultasSolicitadasPacientes.flatMap((data) => data.OkPaciente)

      if (OkMedico.length === 0) {
        setOpen(true)
        setNomeMedico(verifyResponse.ConsultasSolicitadasPacientes.map((data) => data.Solicitado))
      } else if (OkPaciente.length === 0) {
        setOpen(true)
        setNomePaciente(verifyResponse.ConsultasSolicitadasPacientes.map((data) => data.Solicitante))
      } else {
        await saveConsultaMutation.mutateAsync(body)
        secureLocalStorage.setItem('EndPaciente', IdentificadorConsulta)
        secureLocalStorage.removeItem('ConsultaPacienteParticular')
        router.push('/obrigado')
      }
    } catch (error) {
      setSnackbarMessage('Failed to end consultation. Please try again later.')
      setSnackbarOpen(true)
    }
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true)
  }

  return (
    <>
      <div className="w-6/12 flex flex-col justify-center gap-20 items-center lg:gap-44">
        <Image
          src={Reuniao}
          alt="Logo Reuniao"
          height={20}
          width={150}
        />

        {NomePaciente &&
          <h2 className='text-center font-bold text-xl text-blue-900'>Olá {NomePaciente} Seja bem vindo a sua consulta.</h2>
        }

        <button className='w-1/3  h-10 bg-red-500 rounded-full font-bold text-white sm:w-11/12 sm:h-8 md:w-3/4 lg:w-3/4 xl:w-3/4' onClick={handleEndConsulta}> <p className='sm:text-sm text-center'> Finalizar Interconsulta </p></button>

        <div className="sm:w-40 md:w-56 lg:w-60 xl:w-1/4">
          <Image
            src={Logo2}
            alt="Logo Interconsulta"
            height={20}
            width={230}
          />
        </div>
      </div>

      {open &&
        <PopUpEndReuniao
          PersonaNaoclicou={nomeMedico ? nomeMedico : nomePaciente ? nomePaciente : null}
          onClose={() => setOpen(false)}
        />
      }

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={20000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical, horizontal }}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}

export default ReuniaoTwo
