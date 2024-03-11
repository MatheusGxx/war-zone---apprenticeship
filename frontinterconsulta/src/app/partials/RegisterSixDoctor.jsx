import { useState } from 'react'
import {
  TextField,
  Button,
  Snackbar,
  Alert,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
} from '@mui/material'
import Image from 'next/image'
import Logo from '../public/logo.png'

export const RegisterSixDoctor = ({
  currentStep,
  setCurrentStep,
  cnpjMedico,
  setCPNJMedico,
  cpfMedico,
  setCPFMedico,
  razaoSocialEmpresa,
  setRazaoSocialEmpresa,
  nomeFantasia,
  setNomeFantasia,
  enderecoMedico,
  setEnderecoMedico,
  bairro,
  setBairro,
  cidade,
  setCidade,
  estado,
  setEstado,
  cepMedico,
  setCEPMedico,
  emailContador,
  setEmailContador,
  numeroContador,
  setNumeroContador,
}) => {
  const [errorMessage, setErrorMessage] = useState('')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

  const hasEmptyFields = () => {
    const fields = [
      cnpjMedico,
      cpfMedico,
      razaoSocialEmpresa,
      nomeFantasia,
      enderecoMedico,
      bairro,
      cidade,
      estado,
      cepMedico,
      emailContador,
      numeroContador,
    ]

    return fields.some((field) => field.trim() === '')
  }

  const handleNextClick = () => {
    if (hasEmptyFields()) {
      setErrorMessage('Por favor, preencha todos os campos.')
      setSnackbarOpen(true)
    } else {
      setCurrentStep((prevStep) => (prevStep < 7 ? prevStep + 1 : prevStep))
    }
  }

  const handleBackClick = () => {
    setCurrentStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep))
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  return (
    <>
      <h1 className="text-blue-500 text-center"> Ficha de Cadastro </h1>

      <TextField
        variant="standard"
        label="CPNJ"
        InputProps={{
          sx: { borderBottom: '1px solid blue' },
        }}
        type="text"
        required
        onChange={(e) => setCPNJMedico(e.target.value)}
        value={cnpjMedico}
      />

      <TextField
        variant="standard"
        label="CPF"
        InputProps={{
          sx: { borderBottom: '1px solid blue' },
        }}
        type="text"
        required
        onChange={(e) => setCPFMedico(e.target.value)}
        value={cpfMedico}
      />

      <TextField
        variant="standard"
        label="Razão Social"
        InputProps={{
          sx: { borderBottom: '1px solid blue' },
        }}
        type="text"
        required
        onChange={(e) => setRazaoSocialEmpresa(e.target.value)}
        value={razaoSocialEmpresa}
      />

      <TextField
        variant="standard"
        label="Nome Fantasia"
        InputProps={{
          sx: { borderBottom: '1px solid blue' },
        }}
        type="text"
        required
        onChange={(e) => setNomeFantasia(e.target.value)}
        value={nomeFantasia}
      />

      <TextField
        variant="standard"
        label="Endereço"
        InputProps={{
          sx: { borderBottom: '1px solid blue' },
        }}
        type="text"
        required
        onChange={(e) => setEnderecoMedico(e.target.value)}
        value={enderecoMedico}
      />

      <TextField
        variant="standard"
        label="Bairro"
        InputProps={{
          sx: { borderBottom: '1px solid blue' },
        }}
        type="text"
        required
        onChange={(e) => setBairro(e.target.value)}
        value={bairro}
      />

      <TextField
        variant="standard"
        label="Cidade"
        InputProps={{
          sx: { borderBottom: '1px solid blue' },
        }}
        type="text"
        required
        onChange={(e) => setCidade(e.target.value)}
        value={cidade}
      />

      <TextField
        variant="standard"
        label="Estado"
        InputProps={{
          sx: { borderBottom: '1px solid blue' },
        }}
        type="text"
        required
        onChange={(e) => setEstado(e.target.value)}
        value={estado}
      />

      <TextField
        variant="standard"
        label="CEP"
        InputProps={{
          sx: { borderBottom: '1px solid blue' },
        }}
        type="number"
        required
        onChange={(e) => setCEPMedico(e.target.value)}
        value={cepMedico}
      />

      <TextField
        variant="standard"
        label="Email Contador"
        InputProps={{
          sx: { borderBottom: '1px solid blue' },
        }}
        type="text"
        required
        onChange={(e) => setEmailContador(e.target.value)}
        value={emailContador}
      />

      <TextField
        variant="standard"
        label="Numero Contador"
        InputProps={{
          sx: { borderBottom: '1px solid blue' },
        }}

