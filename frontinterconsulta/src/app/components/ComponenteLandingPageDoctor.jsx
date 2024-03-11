'use client'
import { useState, useEffect } from 'react'
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Rating,
  Link as ScrollLink,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { config } from '../config.js'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import DoneIcon from '@mui/icons-material/Done'
import Image from 'next/image'
import Logo from '../public/logo.png'
import Star from '../public/star.png'
import LogoGoogle from '../public/logoGoogle.png'
import AgendamentoConsulta from '../partials/Agendamento.js'
import NotLogged from '../partials/NotLoggedPopUp'
import { secureLocalStorage } from 'react-secure-storage'
import { usePathname, useRouter } from 'next/navigation'
import { useQuery, useMutation } from '@tanstack/react-query'
import axios from 'axios'
import StarIcon from '@mui/icons-material/Star'
import { AvaliacoesCarousel } from '../partials/CarrouselAvaliations'
import { Link as RouterLink } from 'react-router-dom'
import Tempo from '../public/Tempo (2).png'
import Custo from '../public/Custo (1).png'
import { EndRegisterPatient } from '../partials/PopUpEndCadastroPaciente.jsx'
import { useEndRegister } from '../context/context.js'

export const ComponentLandingPageDoctor = ({ params }) => {
  const [especialista, setEspecialista] = useState(null)
  const [recomendacoes, setRecomendacoes] = useState(null)
  const [paciente, setPaciente] = useState(null)
  const [token, setToken] = useState(null)
  const [agendamentoDialogOpen, setAgendamentoDialogOpen] = useState(false)
  const [notLogged, setNotLogged] = useState(false)
  const [readOnlyMode, setReadOnlyMode] = useState(true)
  const [idMedico, setidMedico] = useState(null)
  const [avaliacoes, setAvaliacoes] = useState([])
  const [quantidadeAvaliacoess, setQuantidadeAvaliacoes] = useState(null)
  const [doencaAtendidas, setDoencaAtendida] = useState([])
  const [ferramentasTerapeuticas, setFerramentasTerapeuticas] = useState(null)
  const [endRegister, setEndRegister] = useState(false)
  const [isValid, setIsValid] = useState(null)
  const { registerEndOk } = useEndRegister()

  const pathname = usePathname()
  const router = useRouter()

  const idLocal = secureLocalStorage.getItem('id')
  const id = idLocal || ''

  const RegisterSucessPatient = secureLocalStorage.getItem('RegisterSucessPatient')

  const VerifyDataPatient = useMutation(
    async (valueRequest) => {
      try {
        const response = await axios.post(`${config.apiBaseUrl}/api/verify-data-patient`, valueRequest)
        setIsValid(response.data.valid)
        return response.data.valid
      } catch (error) {
        console.error('Error in VerifyDataPatient:', error)
      }
    }
  )

  useEffect(() => {
    const Token = secureLocalStorage.getItem('token')
    setToken(Token)
  }, [])

  const RequestEspecialista = async () => {
    const response = await axios.get(`${config.apiBaseUrl}/api/get-especialista/${params}`)
    setidMedico(response.data.ModelEspecialista._id)
    const avaliacoes = response.data.ModelEspecialista.Avaliacoes || []
    setAvaliacoes(avaliacoes)

    const FerramentasTerapeuticas = response.data.ModelEspecialista.FerramentasTerapeuticas[0]
    const FerramentasFormatadas = FerramentasTerapeuticas.split(',').join(', ')
    setFerramentasTerapeuticas(FerramentasFormatadas)

    const DoencasAndSintomasDoctor = response.data.ModelEspecialista.DoencasAndSintomas

    const QueryDoencaOurSintomasDoctor = DoencasAndSintomasDoctor.find(
      (data) => data.Doenca === Doenca || data.Sintomas.includes(Doenca)
    )

    setDoencaAtendida(QueryDoencaOurSintomasDoctor)

    const quantidadeAvaliacoes = avaliacoes.length
    setQuantidadeAvaliacoes(quantidadeAvaliacoes)
    return response.data.ModelEspecialista
  }

  const RequestRecomendaçoes = async () => {
    const response = await axios.get(`${config.apiBaseUrl}/api/get-recomendacoes/${params}`)
    return response.data.QueryEspecialidadesDB
  }

  const RequestPaciente = async () => {
    const response = await axios.get(`${config.apiBaseUrl}/api/get-paciente/${id}`)
    return response.data.ModelPaciente
  }

  const queryKey = ['Especialista', especialista]
  const { data: ModelEspecialista, isFetching, isError, isSuccess } = useQuery(
    queryKey,
    () => RequestEspecialista(especialista)
  )

  const queryKeyRecomendaçoes = ['Recomendaçoes', recomendacoes]
  const { data: QueryEspecialidadesDB, isFetching: isFetchingRecomendacoes, isError: isErrorRecomendacoes
