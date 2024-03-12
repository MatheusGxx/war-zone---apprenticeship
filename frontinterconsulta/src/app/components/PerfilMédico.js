import Logo from '../public/logo.png'
import Image from 'next/image';
import axios from 'axios'
import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { useQuery } from "@tanstack/react-query"
import AgendamentoConsulta from '../partials/Agendamento.js'
import { usePathname, useRouter } from 'next/navigation';
import { NotLogged } from '../partials/NotLoggedPopUp'
import secureLocalStorage from 'react-secure-storage'
import Rating from '@mui/material/Rating'
import { config } from '../config.js'

export default function PerfilMédico({ params }) {
  const [especialista, setEspecialista] = useState('')
  const [recomendacoes, setRecomendacoes] = useState('')
  const [paciente, setPaciente] = useState('')
  const [agendamentoDialogOpen, setAgendamentoDialogOpen] = useState(false)
  const [token, setToken ] = useState('')
  const [notLogged, setNotLogged] = useState(false)
  const [idMedico, setidMedico] = useState(null)
  const [readOnlyMode, setReadOnlyMode] = useState(true)

  const router = useRouter()
  const pathname = usePathname()

  const tokenRef = useRef(secureLocalStorage.getItem('token'))
  const idRef = useRef(secureLocalStorage.getItem('id'))
  const doencaRef = useRef(secureLocalStorage.getItem('Doenca'))

  useEffect(() => {
    setToken(tokenRef.current)
    setidMedico(params)
  }, [params])

  useEffect(() => {
    idRef.current = secureLocalStorage.getItem('id')
    doencaRef.current = secureLocalStorage.getItem('Doenca')
  }, [])

  const RequestEspecialista = useCallback(async () => {
    const response = await axios.get(`${config.apiBaseUrl}/api/get-especialista/${params}`)
    return response.data.ModelEspecialista
  }, [params])

  const RequestRecomendaçoes = async () => {
    const response = await axios.get(`${config.apiBaseUrl}/api/get-recomendacoes/${params}`)
    return response.data.QueryEspecialidadesDB
  }

  const RequestPaciente = async () => {
    const response = await axios.get(`${config.apiBaseUrl}/api/get-paciente/${idRef.current}`)
    return response.data.ModelPaciente
  }

  const { data: ModelEspecialista, isFetching: isFetchingEspecialista, isError: isErrorEspecialista, error: errorEspecialista } = useQuery(['Especialista', especialista], () => RequestEspecialista(), {
    retry: false,
    onError: (error) => {
      console.error(error)
    }
  })

  const { data: QueryEspecialidadesDB, isFetching: isFetchingRecomendacoes, isError: isErrorRecomendacoes, error: errorRecomendacoes } = useQuery(['Recomendaçoes', recomendacoes], () => RequestRecomendaçoes(), {
    retry: false,
    onError: (error) => {
      console.error(error)
    }
  })

  const { data: ModelPaciente, isSuccess: SucessPaciente } = useQuery(['Paciente', paciente], () => RequestPaciente(), {
    retry: false,
    onError: (error) => {
      console.error(error)
    }
  })

  const avaliacoes = ModelEspecialista?.Avaliacoes || [];

  const HandleNavigation = useCallback((slug2) => {
    router.push(`/especialistas-disponiveis/${slug2}`);
  }, [router])

  const HandleOpenDialog = () => {
    if (token !== null) {
      setAgendamentoDialogOpen(!agendamentoDialogOpen)
    } else {
      setNotLogged(!notLogged)
    }
  }

  return (
    <>
      <main className="flex-1 bg-blue-100 flex flex-col gap-8 lg:p-4 justify-center items-center w-full">

        <div className='flex justify-center items-center w-full'>

          <div className='flex items-center mt-5 justify-between w-3/4 sm:flex sm:flex-col sm:gap-8 md:flex md:flex-col md:gap-8 lg:flex lg:justify-center lg:gap-20 lg:w-full'>

            <div>
              <h2 className="text-2xl text-blue-900 font-bold whitespace-nowrap">Perfil Especialista</h2>
              <div className="border-b-2 border-blue-500  w-4/5  pt-3"></div>
            </div>

            <button className='w-48 h-10 text-sm bg-green-500 pb-1 rounded-full font-bold text-white sm:h-10 sm:w-48 md:w
