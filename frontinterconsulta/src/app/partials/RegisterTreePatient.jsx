'use client'
import React, { useEffect, useState } from 'react'
import { TextField, Snackbar, Alert } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
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
    const newValue = e.target.value.replace(/[^0-9]/g, '');

    const formattedValue = newValue.startsWith('55') ? newValue : '55' + newValue.substring(2);

    setTelefoneAcompanhante(formattedValue);
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

     <TextField
       label="Telefone Acompanhante"
       variant="standard"
       InputProps={{
        sx: { borderBottom: "1px solid blue" }
      }}
       type="tel"
       value={telefoneAcompanhante}
       inputMode="numeric"
       pattern="^55\d*$"
       onChange={OnChangeInputNumber} 
       required
     />

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