import { Dialog, DialogTitle, DialogContent } from '@mui/material'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import secureLocalStorage from 'react-secure-storage'
import Logo from '../public/logo.png'
import Logo2 from '../public/Logo2.png'
import Link from 'next/link'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { config } from '../config.js'

export const NotPaciente = ({
  NomeMedico,
  onClose,
  Status,
  idConsulta,
}) => {
  const [open, setOpen] = useState(true)
  const [tempoFaltando, setTempoFaltandoConsulta] = useState(null)
  const [consultaOpen, setConsultaOpen] = useState(null)
  const [notConsulta, setNotConsulta] = useState(false)
  const idConsultaParticular = secureLocalStorage.getItem('ConsultaPacienteParticular')
  const router = useRouter()

  const GenerateLink = useMutation(async (valueRequest) => {
    const response = await axios.post(`${config.apiBaseUrl}/api/generate-link`, valueRequest)
    return response.data
  })

  const handleClose = () => {
    if (onClose) {
      onClose()
    }
    setOpen(false)
  }

  const HandleStartConsulta = async () => {
    try {
      if (!idConsultaParticular) {
        secureLocalStorage.setItem('ConsultaPacienteParticular', idConsulta)
      }
      const body = {
        IdentificadorConsultaParticular: idConsulta,
      };
      const data = await GenerateLink.mutateAsync(body)

      if (data.message) {
        setConsultaOpen('Estamos te Direcionando para a consulta.')
        router.push(data.message)
      }

      if (data.TempoFaltando === 'Consulta Expirada') {
        setTempoFaltandoConsulta(data.TempoFaltando)
        setTimeout(() => {
          handleClose()
        }, 3000)
      } else {
        if (!isNaN(Number(data.TempoFaltando))) {
          setTempoFaltandoConsulta(data.TempoFaltando)
          setNotConsulta(true)
        }
      }

    } catch (error) {
      throw new Error
    }
  }

  const NomePacienteLocal = secureLocalStorage.getItem('NomePaciente')
  const NomePaciente = NomePacienteLocal || ''

  useEffect(() => {
    if (Status.includes('Confirmada')) {
      setTempoFaltandoConsulta(null)
    }
  }, [Status])

  return (
    <>
      <Dialog open={open} onClose={handleClose} className='p-10'>
        <div className='flex flex-col justify-center items-center'>
          <div className='pt-6'>
            <Image
              src={Logo2}
              alt='Segundo Logo Interconsulta'
              width={200}
              height={100}
            />
          </div>
          <DialogTitle className='text-red-600 font-bold'>
            {
              Status.includes('Confirmada') ?
                `Consulta confirmada pelo ${NomeMedico}` :
                Status.includes('Cancelada') ?
                  `Consulta ${Status}` :
                  Status.includes('Atendida') ?
                    `Consulta Atendida por ${NomeMedico}` :
                    `Aguardando Confirmaçao do ${NomeMedico}`
            }
          </DialogTitle>
          <DialogContent>
            {
              Status.includes('Confirmada') ?
                <p className='text-center'> Parabens {NomePaciente}! sua consulta foi confirmada pelo {NomeMedico} clique no botao abaixo para iniciar a consulta </p> :
                Status.includes('Cancelada') ?
                  <p className='text-center'>  {NomePaciente} a sua consulta foi cancelada =/ </p> :
                  Status.includes('Atendida') ?
                    <p className='text-center'>{NomePaciente} sua consulta ja foi atendida pelo {NomeMedico}</p> :
                    <p className='text-center'> {NomePaciente} o {NomeMedico} ainda nao confirmou a sua Consulta aguarde até o mesmo confirmar! </p>
            }
          </DialogContent>
          {
            Status.includes('Confirmada') &&
            <button onClick={() => HandleStartConsulta()} className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">
              {
                tempoFaltando === 'Consulta Expirada' ?
                  <p> {NomePaciente} sua consulta esta Expirada </p> :
                  tempoFaltando ?
                    <p>{NomePaciente} falta {tempoFaltando} minutos, para a sua consulta</p> :
                    consultaOpen ? <p> {NomePaciente} {consultaOpen} </p> :
                    `Ir para a consulta com ${NomeMedico}`
              }
            </button>
          }
          {
            !Status.includes('Confirmada') &&
            <button onClick={() => handleClose()} className="w-11/12 h-12 rounded-full bg-red-600 text-white font-bold">
              {
                Status.includes('Cancelada') ?
                  <Link href="/especialistas-disponiveis">
                
