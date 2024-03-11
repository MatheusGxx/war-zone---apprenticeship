'use client'
import { useState } from 'react'
import Image from 'next/image'
import Logo from '../public/logo.png'
import SecondLogo from '../public/Logo2.png'
import { config } from '../config.js'
import { TextField, CircularProgress, Snackbar, Alert } from '@mui/material'
import { useRouter, usePathname } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import IconBack from '../partials/IconBack.js'
import axios from 'axios'
import secureLocalStorage from 'react-secure-storage'

const Login = ({
  title,
  ImagemLateral,
  MessageButton,
  secondRoute,
  treeRoute,
  plataform,
  apelido,
}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const router = useRouter()
  const route = usePathname()

  const { mutate: login, isLoading } = useMutation(async (valueRequest) => {
    const response = await axios.post(`${config.apiBaseUrl}/api/login`, valueRequest)
    return response.data
  }, {
    onSuccess: (data) => {
      const {
        token,
        NomeMedico,
        AreaAtuacao,
        CRMM,
        ModelidUserLogged,
        FotoMedico,
        TypeDoctor,
        NomePaciente,
        DoencaPaciente,
        FotoPaciente,
        NomeUnidade,
        FotoUnidade,
      } = data

      switch (route) {
        case '/welcome/login-medico':
          const tokenStorage = secureLocalStorage.getItem('token')
          const ModelidUser = secureLocalStorage.getItem('id')
          const NomeMedicoStorage = secureLocalStorage.getItem('NomeMedico')
          const AreadeAtuacaoStorage = secureLocalStorage.getItem('AreadeAtuacao')
          const CRMStorage = secureLocalStorage.getItem('CRMMedico')
          const FotoStorageMedico = secureLocalStorage.getItem('FotoMedico')
          const TypeDoctorStorage = secureLocalStorage.getItem('TypeDoctor')

          if (tokenStorage && ModelidUser && NomeMedicoStorage && AreadeAtuacaoStorage && CRMStorage && FotoStorageMedico && TypeDoctorStorage) {
            console.log('Médico já está autenticado no interconsulta =/')
          } else {
            secureLocalStorage.setItem('token', token)
            secureLocalStorage.setItem(`id`, ModelidUserLogged)
            secureLocalStorage.setItem('NomeMedico', NomeMedico)
            secureLocalStorage.setItem('AreadeAtuacao', AreaAtuacao)
            secureLocalStorage.setItem('CRMMedico', CRMM)
            secureLocalStorage.setItem('FotoMedico', FotoMedico)
            secureLocalStorage.setItem('TypeDoctor', TypeDoctor)
          }
          break

        case '/welcome/login-paciente':
          const tokenStoragePaciente = secureLocalStorage.getItem('token')
          const ModelidUserPaciente = secureLocalStorage.getItem('id')
          const NomeStoragePaciente = secureLocalStorage.getItem('NomePaciente')
          const Doenca = secureLocalStorage.getItem('Doenca')
          const FotoStoragePaciente = secureLocalStorage.getItem('FotoPaciente')

          if (tokenStoragePaciente && ModelidUserPaciente && NomeStoragePaciente && Doenca && FotoStoragePaciente) {
            console.log('Usuário já está autenticado no interconsulta =/')
          } else {
            secureLocalStorage.setItem('token', token)
            secureLocalStorage.setItem(`id`, ModelidUserLogged)
            secureLocalStorage.setItem('NomePaciente', NomePaciente)
            secureLocalStorage.setItem('Doenca', DoencaPaciente)
            secureLocalStorage.setItem('FotoPaciente', FotoPaciente)
            secureLocalStorage.setItem('RegisterSucessPatient', 'cadastroFinalizado')
          }
          break

        case '/welcome/login-unidade':
          const tokenStorageUnidade = secureLocalStorage.getItem('token')
          const ModelidUserUnidade = secureLocalStorage.getItem('id')
          const NomeStorageUnidade = secureLocalStorage.getItem('NomeUnidade')
          const FotoStorageUnidade = secureLocalStorage.getItem('FotoUnidade')

          if (tokenStorageUnidade && ModelidUserUnidade && NomeStorageUnidade && FotoStorageUnidade) {
            console.log('Usuário já está autenticado no interconsulta =/')
          } else {
            secureLocalStorage.setItem('token', token)
            secureLocalStorage.setItem(`id`, ModelidUserLogged)
            secureLocalStorage.setItem('NomeUnidade', NomeUnidade)
            secureLocalStorage.setItem('FotoUnidade', FotoUnidade)
          }
      }
    },
  })

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email === '' || password === '') {
      setSnackbarMessage(`${apelido} Você precisa preencher todos os dados de Login para poder entrar!`)
      handleSnackBarOpen()
    } else {
      login({ email, password, route })
    }
  }

  return (
    <>
      <main className='flex'>
        <section className='w-1/2
