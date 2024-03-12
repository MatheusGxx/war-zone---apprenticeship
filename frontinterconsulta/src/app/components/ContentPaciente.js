'use client'
import { Autocomplete, TextField } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from "next/navigation";
import { useState, useEffect } from 'react'
import axios from 'axios';
import Image from "next/image";
import iconNull from '../public/IconNull.png'
import Logo from '../public/logo.png'
import AgendamentoConsulta from "../partials/Agendamento";
import secureLocalStorage from 'react-secure-storage'
import Rating from '@mui/material/Rating'
import { useEndRegister } from '../context/context.js'
import { config } from '../config.js'
import { ComponenteAudio } from "../partials/ComponentAudio"
import { useBlood } from "../context/context.js"
import { PopUpBlood } from "../partials/PopUpBlood"

const ContentPaciente = () => {
  const [selectedDoenca, setSelectedDoenca] = useState('')
  const [especialidade, setEspecialidade] = useState(null)
  const [nameProfissional, setNomeProfissional] = useState(null)
  const [medicoSlug, setMedicoSlug] = useState(null)
  const [Horarios, setHorarios] = useState(null)
  const [idMedico, setIDMedico] = useState(null)
  const [idDoctor, setIDDoctor] = useState(null)
  const [token, setToken] = useState('')
  const [logged, setLogged] = useState(false)
  const [shouldShowPopup, setShouldShowPopup] = useState(false)
  const [poolingDoctor, setPoolingDoctor] = useState('')
  const [readOnlyMode, setReadOnlyMode] = useState(true)
  const [sintomasandDoencas, setSintomasAndDoencas] = useState(null)
  const [valorConsulta, setValorConsulta] = useState(null)
  const [fotoMedico, setFotoMedico] = useState(null)
  const [avaliacoesDoctor, setAvaliacoesDoctor] = useState(null)
  const [endRegister, setEndRegister] = useState(false)
  const [isValid, setIsValid] = useState(null)
  const { blood } = useBlood()

  const queryClient = useQueryClient()
  const { registerEndOk } = useEndRegister()

  const DoencaLocal = secureLocalStorage.getItem('Doenca')
  const DoencaLabel = DoencaLocal || 'Doenças e Sintomas'
  const DoencaRouteDinamic = DoencaLocal || ''

  const Router = useRouter()

  const idLocal = secureLocalStorage.getItem('id')
  const id = idLocal || ''

  const RegisterSucessPatient = secureLocalStorage.getItem('RegisterSucessPatient')

  const InitialContant = secureLocalStorage.getItem('InitialContact')

  const VerifyDataPatient = useMutation(
    async (valueRequest) => {
      try {
        const response = await axios.post(`${config.apiBaseUrl}/api/verify-data-patient`, valueRequest)
        setIsValid(response.data.valid)
        return response.data.valid
      } catch (error) {
        console.error('Error in VerifyDataPatient:', error);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('sintomas-doencas')
      }
    }
  )

  useEffect(() => {
    const Token = secureLocalStorage.getItem('id')
    setToken(Token)
  }, [])

  useEffect(() => {
    if (DoencaLocal) {
      const body = {
        doenca: DoencaRouteDinamic,
      }
      CreateRequestMutation.mutateAsync(body)
    }
  }, [DoencaLocal, DoencaLabel])

  useEffect(() => {
    if (selectedDoenca !== '') {
      const body = {
        doenca: selectedDoenca,
        id: id
      }

      CreateRequestMutation.mutateAsync(body).then((data) => {
        const NewDoenca = data?.NewDoenca
        secureLocalStorage.removeItem('Doenca')
        secureLocalStorage.setItem('Doenca', NewDoenca || '')
        setShouldShowPopup(false)
      }).catch((error) => {
        console.error('Error:', error)
      })
    }
  }, [selectedDoenca])

  useEffect(() => {
    getSintomasAndDoencas.refetch()
  }, [])

  useEffect(() => {
  }, [logged])

  useEffect(() => {
    const UpdateDataPatient = async () => {
      if (!RegisterSucessPatient) {
        await VerifyDataPatient.mutateAsync({ id: id });
      }
    };
  
    UpdateDataPatient();
  }, [RegisterSucessPatient])

  const CreateRequestMutation = useMutation(
    async (valueRequest) => {
      const response = await axios.post(`${config.apiBaseUrl}/api/especialidades`, valueRequest);
      const ids = response.data.ModelPaciente.map(item => item._id)
      setIDDo
