import { useState, useRef, useEffect } from 'react';
import { Snackbar, Alert, TextField, Autocomplete, CircularProgress, InputAdornment, Typography } from "@mui/material"
import { EspecialidadesAtendidas } from '../partials/EspecialidadesAtendidas'
import { useMutation } from '@tanstack/react-query'
import { MedicoCarousel } from '../partials/CarroselMédico.js'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import { EspecialidadesUnidades } from '../partials/EspecialidadesUnidade'

import axios from 'axios'
import Image from "next/image";
import Logo from '../public/logo.png'
import DeleteIcon from '@mui/icons-material/Delete'
import secureLocalStorage from 'react-secure-storage'
import { usePathname } from 'next/navigation.js';
import { parse } from 'date-fns'
import { Api2 } from '../config.js'
import { config } from '../config.js'
import { PacienteFaltando } from '../partials/PacientesFaltando.jsx'

const ContentUnidade = () => {
  const [especialidade, setEspecialidade] = useState('')
  const [inicio, setInicio] = useState('')
  const [fim, setFim] = useState('')
  const [InicioMedicos, setInicioMedicos] = useState('')
  const [FimMedicos, setFimMedicos] = useState('')
  const [valorTotal, setValorTotal] = useState('')
  const [valorConsulta, setValorConsulta] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [horasMedicas, setHorasMedicas] = useState('')
  const [atendimentos, setAtendimentos] = useState('')
  const [medicos, setMedicosDisponiveis] = useState('')
  const [custo, setCusto] = useState('')
  const [consolidado, setConsolidado] = useState('')
  const [objectData, setObjectData] = useState([])
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [on, setOn] = useState(true)
  const [reset, setReset] = useState(false)
  const [agendamentoOn, setAgendamentoOn] = useState(false)
  const [okCasosClinicos, setOkCasosClinicos] = useState(false)
  const [messageUnidade, setMessageUnidade] = useState('')
  const [messageErr, setMessageErr] = useState('')
  const [position, setPosition] = useState({
    vertical: 'top',
    horizontal: 'center'
  })
  const [pacienteFaltando, setPacienteFaltando] = useState(null)
  const [onPopup, setOnPopup] = useState(false)
  const [pacientes, setPacientes] = useState([])

  const { vertical, horizontal } = position

  const currencySymbol = 'R$'
  
  const id = secureLocalStorage.getItem('id')

  const NameUnidadeSaude = typeof window !== 'undefined' ? secureLocalStorage.getItem('NomeUnidade') : false
  
  const OriginalUnidadeUnidade = NameUnidadeSaude ? NameUnidadeSaude : ''

  const Route = usePathname()

  const CreateRequestMutation = useMutation(async (valueRequest) => {
    const response = await axios.post(`${Api2.apiBaseUrl}/api2/process-planilha/${id}`, valueRequest)
    return response.data
  },{
    onSuccess:(data) => {
      const CPFSPacientes = data.map((data) => data.CPF)
      PostConsolidado(CPFSPacientes)
      setMessageUnidade(`${OriginalUnidadeUnidade}, Nós acabamos de informar todos os Pacientes da sua planilha que voce esta procurando médico para eles!`)
    }
  })

  const CreateConsolidado = useMutation(async (valueRequest) => {
    const response = await axios.post(`${Api2.apiBaseUrl}/api2/get-consolidado`, valueRequest)
    console.log(response.data)
    return response.data
  },{
    onSuccess: () => {
      setOkCasosClinicos(false)
    },
    onError: (err) => {
      setMessageErr(err.response.data.error)
      setSnackbarMessage(err.response.data.error)
      handleSnackBarOpen()
      setVisibileButton(true)
      setVisiblePlan(false)
      console.error(err.response.data.error)  
    }
  })

  const NotificationConfirmationDoctorAndPatient = useMutation(async (valueRequest) => {
    const response = await axios.post(`${Api2.apiBaseUrl}/api2/notification-doctors-and-patients`, valueRequest)
    return response.data
  },{
    onSuccess: () => {
      PostFilaDeEspera()
    }
  })

  const RequestFilaDeEspera = useMutation(async () => {
    const valueRequest = {
      id: id,
      NomeUnidade: OriginalUnidadeUnidade
    }
    const response = await axios.post(`${config.apiBaseUrl}/api/get-wait-list`, valueRequest)
    return response.data
  },{
    onSuccess:(data) => {
      const { UltimosPacientesEspera } = data
      const UltimosPacientes = UltimosPacientesEspera.ListDeEspera
      setPacientes(UltimosPacientes)
      setPacienteFaltando(UltimosPacientes.length)
    }
  })

  useEffect
