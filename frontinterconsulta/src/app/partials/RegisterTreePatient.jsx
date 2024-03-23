'use client'
import React, { useEffect, useState } from 'react'
import { TextField, Snackbar, Alert } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Logo from '../public/logo.png'
import Image from 'next/image'
import { FormatPhoneNumber } from '../utils/FormatPhoneNumber'

export const RegisterTreePatient = ({
    setNomeAcompanhante,
    nomeAcompanhante,
    setTelefoneAcompanhante,
    telefoneAcompanhante,
    setEmailAcompanhante,
    emailAcompanhante,
    setCurrentStep,
    NomePaciente,
    dddPais
}) => {

  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState("")

  const Verification = () => {
    let camposVazios = [];
  
    if (nomeAcompanhante === '') {
      camposVazios.push('Nome Acompanhante');
    }
    if (telefoneAcompanhante === '') {
      camposVazios.push('Telefone Acompanhante');
    }
    if (emailAcompanhante === '') {
      camposVazios.push('Email Acompanhante');
    }

    if (camposVazios.length > 0) {
      const camposFaltantes = camposVazios.join(', ');
      setSnackbarMessage(`Ops ${NomePaciente}, você não preencheu o(s) campo(s): ${camposFaltantes}.`);
      handleSnackBarOpen();
    } else {
      handleNextClick();
    }
  }
  
  const handleNextClick = () => {
    setCurrentStep((prevStep) => (prevStep < 5 ? prevStep + 1 : prevStep));
  }

  const handleBackClick = () => {
    setCurrentStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  }
 
  const OnChangeInputNumber = (e) => {

    const formattedNumber = FormatPhoneNumber(e.target.value);
    setTelefoneAcompanhante(formattedNumber)
  }

  const handleSnackbarClose = () => {
    setSnackbarOpen(false)
  };

  const handleSnackBarOpen = () =>{
    setSnackbarOpen(true)
  }

  

  return(
    <>

    <h1 className='font-bold text-blue-500 text-center text-2xl'> Informaçoes do Acompanhante </h1>
     <TextField
        variant="standard"
        label="Nome Acompanhante"
        InputProps={{
          sx: { borderBottom: "1px solid blue" }
        }}
        onChange={(e) => setNomeAcompanhante(e.target.value)}
        value={nomeAcompanhante}
        type="text"
        required
      />
        <div className='flex gap-4 justify-center items-center'>
        <TextField
            label="DDD Pais"
            variant="standard"
            className='w-1/6'
            InputProps={{
              inputProps: {
                  style: {
                      textAlign: "center", // Centraliza o texto horizontalmente
                  },
              },
              sx: { borderBottom: "1px solid blue" },
              readOnly: true
          }}
            type="tel"
            value={dddPais}
            inputMode="numeric" // Especifica o modo de entrada numérica
          />

          <TextField
            label="Telefone do Acompanhante - Ex: 11984252343"
            variant="standard"
            sx={{ width: '300px' }}
            InputProps={{
              sx: { borderBottom: "1px solid blue" }
            }}
            className="w-full sm:w-7/12"
            type="tel"
            value={telefoneAcompanhante}
            inputMode="numeric" // Especifica o modo de entrada numérica
            onChange={OnChangeInputNumber}
            required
          />
        </div>

    <TextField
        variant="standard"
        label="Email Acompanhante"
        InputProps={{
          sx: { borderBottom: "1px solid blue" }
        }}
        onChange={(e) => setEmailAcompanhante(e.target.value)}
        value={emailAcompanhante}
        type="text"
        required
      />

    <div className="w-full flex justify-between items-center">
      <ArrowBackIosIcon color="primary" className="cursor-pointer" onClick={handleBackClick}/>
      <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className="animate-spin-slow"/>
      <ArrowForwardIosIcon color="primary" className="cursor-pointer" onClick={Verification}/> 
    </div>

    <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Tempo em milissegundos que o Snackbar será exibido
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="error">
          {snackbarMessage}
        </Alert>
    </Snackbar>

    </>
  )
}