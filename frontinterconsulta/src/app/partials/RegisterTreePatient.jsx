import React, { useEffect, useState } from 'react'
import {
  TextField,
  Snackbar,
  Alert,
  ArrowForwardIosIcon,
  ArrowBackIosIcon,
} from '@mui/material'
import Logo from '../public/logo.png'
import Image from 'next/image'

export const RegisterTreePatient = ({
  setNomeAcompanhante,
  nomeAcompanhante,
  setTelefoneAcompanhante,
  telefoneAcompanhante,
  setEmailAcompanhante,
  emailAcompanhante,
  setCurrentStep,
  NomePaciente,
}) => {
  const [errors, setErrors] = useState({
    nomeAcompanhante: false,
    telefoneAcompanhante: false,
    emailAcompanhante: false,
  })
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')

  const handleNextClick = () => {
    if (
      !errors.nomeAcompanhante &&
      !errors.telefoneAcompanhante &&
      !errors.emailAcompanhante
    ) {
      setCurrentStep((prevStep) => (prevStep < 5 ? prevStep + 1 : prevStep))
    } else {
      setSnackbarMessage('Por favor, preencha todos os campos corretamente.')
      handleSnackBarOpen()
    }
  }

  const handleBackClick = () => {
    setCurrentStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep))
  }

  const OnChangeInputNumber = (e) => {
    const newValue = e.target.value.replace(/[^0-9]/g, '')
    const formattedValue = newValue.startsWith('55') ? newValue : '55' + newValue.substring(2)
    setTelefoneAcompanhante(formattedValue)
    setErrors((prevErrors) => ({ ...prevErrors, telefoneAcompanhante: !formattedValue }))
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  }

  const handleSnackBarOpen = () => {
    setSnackbarOpen(true)
  }

  useEffect(() => {
    setErrors({
      nomeAcompanhante: !nomeAcompanhante,
      telefoneAcompanhante: !telefoneAcompanhante,
      emailAcompanhante: !emailAcompanhante,
    })
  }, [nomeAcompanhante, telefoneAcompanhante, emailAcompanhante])

  return (
    <>
      <h1 className="font-bold text-blue-500 text-center text-2xl">
        Informaçoes do Acompanhante
      </h1>
      <TextField
        variant="standard"
        label="Nome Acompanhante"
        InputProps={{
          sx: { borderBottom: '1px solid blue' },
        }}
        onChange={(e) => setNomeAcompanhante(e.target.value)}
        value={nomeAcompanhante}
        type="text"
        error={errors.nomeAcompanhante}
        helperText={errors.nomeAcompanhante && 'Campo obrigatório'}
        required
      />

      <TextField
        label="Telefone Acompanhante"
        variant="standard"
        InputProps={{
          sx: { borderBottom: '1px solid blue' },
        }}
        type="tel"
        value={telefoneAcompanhante}
        inputMode="numeric"
        pattern="^55\d*$"
        onChange={OnChangeInputNumber}
        error={errors.telefoneAcompanhante}
        helperText={
          errors.telefoneAcompanhante && 'Por favor, insira um telefone válido no formato: 55XXXXXXXXX'
        }
        required
      />

      <TextField
        variant="standard"
        label="Email Acompanhante"
        InputProps={{
          sx: { borderBottom: '1px solid blue' },
        }}
        onChange={(e) => setEmailAcompanhante(e.target.value)}
        value={emailAcompanhante}
        type="email"
        error={errors.emailAcompanhante}
        helperText={errors.emailAcompanhante && 'Por favor, insira um email válido'}
        required
      />

      <div className="w-full flex justify-between items-center">
        <ArrowBackIosIcon color="primary" className="cursor-pointer" onClick={handleBackClick} />
        <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className="animate-spin-slow" />
        <ArrowForwardIosIcon color="primary" className="cursor-pointer" onClick={handleNextClick} />
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  )
}
