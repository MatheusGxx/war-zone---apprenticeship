'use client'
import { useState } from 'react'
import { TextField, Autocomplete, Snackbar , Alert } from "@mui/material"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import Image from 'next/image'
import Logo from '../public/logo.png'

export const RegisterOneDoctor = (
  {
    setDataNascimento,
    dataNascimento,
    setCurrentStep,
  }
  ) => {

    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const [snackbarMessage, setSnackbarMessage] = useState("")
      
    const regex = /^(\d{0,2})\/?(\d{0,2})\/?(\d{0,4})$/

    const handleData = (e) => {
      const value = e.target.value.replace(/[^0-9]/g, '');
      const formattedValue = value.replace(regex, '$1/$2/$3')
      setDataNascimento(formattedValue);
    }

    const Verification = () => {
      let camposVazios = [];

      if (dataNascimento === '') {
        camposVazios.push('Data de Nascimento');
      }

      if (camposVazios.length > 0) {
        const camposFaltantes = camposVazios.join(', ');
        setSnackbarMessage(`Ops Doutor, você não preencheu o(s) campo(s): ${camposFaltantes}.`);
        handleSnackBarOpen();
      } else {
        handleNextClick()
      }
    }
    
    const handleNextClick = () => {
      setCurrentStep((prevStep) => (prevStep < 5 ? prevStep + 1 : prevStep));
    };
    const handleBackClick = () => {
      setCurrentStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
    }

    const handleSnackbarClose = () => {
      setSnackbarOpen(false)
    };
  
    const handleSnackBarOpen = () =>{
      setSnackbarOpen(true)
    }
  
  
  return(
    <>
    <h1 className="text-blue-500 text-center text-lg font-semibold"> Informaçoes Pessoais do Médico </h1>

      <TextField
      variant="standard"
      label="Data de Nascimento"
      InputProps={{
        sx: { borderBottom: "1px solid blue" }, // Define a cor da linha inferior
      }}
      type="text"
      required
      onChange={(e) => handleData(e)}
      value={dataNascimento}/>

      <div className="w-full flex justify-between items-center">
        <div className='flex gap-3 cursor-pointer' onClick={handleBackClick}>
        <ArrowBackIosIcon color="primary"/>
        <h1 className='font-bold text-blue-500'> Voltar </h1>
        </div>
      <Image src={Logo} width={50} height={50} alt="Logo Interconsulta" className="animate-spin-slow"/>

        <div className='flex gap-3 cursor-pointer' onClick={Verification}>
        <h1 className='font-bold text-blue-500'> Avançar </h1>
        <ArrowForwardIosIcon color="primary"/> 
        </div>  
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